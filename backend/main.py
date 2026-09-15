"""FastAPI service for grounded quiz generation."""

from __future__ import annotations

import os
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
from dotenv import load_dotenv
from pydantic import BaseModel, Field, field_validator

from data_search import search_wikipedia_dataset
from kaggle_loader import ensure_wikipedia_dataset

load_dotenv()


class QuizRequest(BaseModel):
    topic: str = Field(min_length=1, max_length=200)
    num_questions: int = Field(ge=1, le=15)
    difficulty: str = Field(min_length=1, max_length=40)
    question_type: str = Field(min_length=1, max_length=40)

    @field_validator("topic", "difficulty", "question_type")
    @classmethod
    def strip_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Value must not be blank")
        return value


class Question(BaseModel):
    id: int
    question: str
    options: List[str]
    correct_answer: str
    explanation: Optional[str] = None


class QuizResponse(BaseModel):
    topic: str
    difficulty: str
    questions: List[Question]


app = FastAPI(title="WikiClub Quiz API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _get_client() -> genai.Client:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="GEMINI_API_KEY is not configured")
    return genai.Client(api_key=api_key)


@app.post("/api/generate-quiz", response_model=QuizResponse)
def generate_quiz(request: QuizRequest) -> QuizResponse:
    dataset_path = os.getenv("WIKIPEDIA_DATASET_PATH", "wikipedia_data.csv")
    try:
        ensure_wikipedia_dataset(dataset_path)
    except (FileNotFoundError, RuntimeError) as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    context = search_wikipedia_dataset(request.topic, dataset_path)
    if not context:
        raise HTTPException(status_code=404, detail="No Wikipedia content found for this topic")

    system_prompt = """You generate quizzes grounded exclusively in the supplied Wikipedia dataset context.
Do not use outside knowledge, infer unsupported facts, or mention the context.
Return exactly the requested number of questions.
For question_type=mcq, every question must have exactly four distinct options and correct_answer must be one of them.
For question_type=boolean, every question must have options exactly ["True", "False"] and correct_answer must be exactly "True" or "False".
Keep explanations brief and grounded in the context. Return only JSON matching the response schema."""
    prompt = (
        f"Requirements: topic={request.topic}; number={request.num_questions}; "
        f"difficulty={request.difficulty}; question_type={request.question_type}\n\n"
        f"Dataset context:\n{context}"
    )

    try:
        response = _get_client().models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                response_mime_type="application/json",
                response_schema=QuizResponse,
            ),
        )
        quiz = QuizResponse.model_validate_json(response.text)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Quiz generation failed") from exc

    if len(quiz.questions) != request.num_questions:
        raise HTTPException(status_code=502, detail="AI returned an incorrect question count")
    for question in quiz.questions:
        if request.question_type == "boolean":
            if question.options != ["True", "False"]:
                raise HTTPException(status_code=502, detail="AI returned invalid True/False options")
        elif len(question.options) != 4 or len(set(question.options)) != 4:
            raise HTTPException(status_code=502, detail="AI returned invalid MCQ options")
        if question.correct_answer not in question.options:
            raise HTTPException(status_code=502, detail="AI returned an invalid correct answer")
    return quiz