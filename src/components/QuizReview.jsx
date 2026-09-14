export default function QuizReview({ quiz, answers, onRestart }) {
  const correctCount = answers.filter((answer) => answer.isCorrect).length
  const percentage = Math.round((correctCount / quiz.questions.length) * 100)

  return (
    <section className="space-y-8">
      <div className="score-panel">
        <div>
          <span className="eyebrow text-white/70">Quiz complete</span>
          <h2 className="mt-3 font-display text-4xl leading-none text-white sm:text-5xl">{percentage}%</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75">You got {correctCount} of {quiz.questions.length} questions right on {quiz.topic}.</p>
        </div>
        <div className="score-mark" aria-hidden="true">{correctCount}/{quiz.questions.length}</div>
      </div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Your breakdown</span>
          <h2 className="mt-2 font-display text-3xl text-ink">A closer look</h2>
        </div>
        <button className="button-secondary" type="button" onClick={onRestart}>Start over</button>
      </div>
      <div className="space-y-3">
        {quiz.questions.map((question, index) => {
          const answer = answers[index]
          return (
            <article className="rounded-2xl border border-sand-dark bg-white p-5" key={question.id}>
              <div className="flex gap-4">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${answer.isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{answer.isCorrect ? '✓' : '×'}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold leading-relaxed text-ink">{question.question}</p>
                  <p className="mt-3 text-sm text-ink-muted">Your answer: <span className={answer.isCorrect ? 'font-semibold text-emerald-700' : 'font-semibold text-red-700'}>{answer.value}</span></p>
                  {!answer.isCorrect && <p className="mt-1 text-sm text-ink-muted">Correct answer: <span className="font-semibold text-ink">{question.correct_answer}</span></p>}
                  <p className="mt-3 border-t border-sand-dark pt-3 text-sm leading-relaxed text-ink-muted">{question.explanation}</p>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
