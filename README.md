# Quirk Frontend

The frontend for WikiClub's AI quiz generator. It turns a Wikipedia topic or URL into a short interactive quiz, then shows instant feedback and a question-by-question review.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`.

The production checks are:

```bash
npm run build
npm run lint
```

## Backend handoff

The API service lives in [src/services/api.js](src/services/api.js). It uses native `fetch` and reads:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_USE_MOCK=true
```

When `VITE_USE_MOCK=true` or the variable is omitted, the UI uses deterministic local quiz data so frontend work and CI can run without the backend. Set it to `false` to call the backend.

### Request

The frontend sends `POST {VITE_API_BASE_URL}/api/quizzes` with JSON:

```json
{
  "topic": "history of the printing press",
  "question_type": "mcq",
  "difficulty": "medium",
  "num_questions": 5
}
```

`question_type` is either `mcq` or `boolean`. `difficulty` is `easy`, `medium`, or `hard`. `num_questions` is an integer from 3 through 10.

### Response

The endpoint should return HTTP 2xx and JSON shaped like:

```json
{
  "quiz_id": "quiz-123",
  "topic": "history of the printing press",
  "questions": [
    {
      "id": 1,
      "question": "Which invention made printed books easier to produce at scale?",
      "options": ["The printing press", "The telescope", "The compass", "The steam engine"],
      "correct_answer": "The printing press",
      "explanation": "The printing press enabled repeatable production of many copies from movable type."
    }
  ]
}
```

Every question needs `id`, `question`, `options`, `correct_answer`, and `explanation`. For boolean quizzes, return `options: ["True", "False"]` and use one of those exact strings for `correct_answer`.

## Frontend flow

`src/App.jsx` owns the state machine:

1. `CONFIG`: validates and submits the topic and quiz settings.
2. `LOADING`: shows a skeleton while the API request is running.
3. `ACTIVE_QUIZ`: displays one question at a time and records answers.
4. `REVIEW`: calculates the percentage and renders the full breakdown.
5. `ERROR`: shows the API error with retry and change-topic actions.

The UI is split into [QuizForm.jsx](src/components/QuizForm.jsx), [QuizCard.jsx](src/components/QuizCard.jsx), [QuizReview.jsx](src/components/QuizReview.jsx), and [ProgressBar.jsx](src/components/ProgressBar.jsx). Shared request and response models are documented in [src/types/quiz.js](src/types/quiz.js).

## Project layout

```text
src/
  components/       Reusable quiz UI states
  services/         API client and mock fixture
  types/            Shared QuizConfig, Question, QuizResponse models
  App.jsx           State orchestration
  index.css         Tailwind theme and component styles
```

The frontend intentionally has no backend-specific SDK dependency. The backend can evolve behind the documented JSON contract while the UI remains independently testable in mock mode.
