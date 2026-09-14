import { useState } from 'react'
import ProgressBar from './ProgressBar'

export default function QuizCard({ question, currentIndex, total, onComplete }) {
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const isAnswered = Boolean(selectedAnswer)
  const isCorrect = selectedAnswer === question.correct_answer

  function chooseAnswer(answer) {
    if (!isAnswered) setSelectedAnswer(answer)
  }

  function advance() {
    onComplete(selectedAnswer, isCorrect)
    setSelectedAnswer('')
  }

  return (
    <section className="space-y-8">
      <ProgressBar current={currentIndex + 1} total={total} />
      <div className="quiz-card">
        <div className="flex items-start justify-between gap-4">
          <span className="eyebrow">Knowledge check</span>
          <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">{currentIndex + 1} / {total}</span>
        </div>
        <h2 className="mt-6 max-w-3xl font-display text-3xl leading-tight text-ink sm:text-4xl">{question.question}</h2>
        <div className="mt-8 grid gap-3">
          {question.options.map((option, index) => {
            const optionIsCorrect = option === question.correct_answer
            const optionIsSelected = option === selectedAnswer
            const stateClass = !isAnswered ? 'border-sand-dark bg-white hover:border-terracotta hover:bg-[#fffaf5]' : optionIsCorrect ? 'border-emerald-300 bg-emerald-50' : optionIsSelected ? 'border-red-300 bg-red-50' : 'border-sand-dark bg-sand/40 opacity-65'
            return (
              <button className={`flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition ${stateClass}`} key={option} type="button" onClick={() => chooseAnswer(option)} disabled={isAnswered}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand text-sm font-bold text-ink-muted">{String.fromCharCode(65 + index)}</span>
                <span className="flex-1 font-medium text-ink">{option}</span>
                {isAnswered && optionIsCorrect && <span className="text-sm font-bold text-emerald-700">Correct</span>}
                {isAnswered && optionIsSelected && !optionIsCorrect && <span className="text-sm font-bold text-red-700">Not quite</span>}
              </button>
            )
          })}
        </div>
        {isAnswered && (
          <div className={`mt-6 rounded-2xl px-5 py-4 ${isCorrect ? 'bg-emerald-50 text-emerald-900' : 'bg-red-50 text-red-900'}`}>
            <p className="font-semibold">{isCorrect ? 'Nice work.' : `The answer is ${question.correct_answer}.`}</p>
            <p className="mt-1 text-sm leading-relaxed opacity-85">{question.explanation}</p>
          </div>
        )}
      </div>
      <button className="button-primary ml-auto" type="button" onClick={advance} disabled={!isAnswered}>
        {currentIndex === total - 1 ? 'See my score' : 'Next question'} <span aria-hidden="true">→</span>
      </button>
    </section>
  )
}
