import { useState } from 'react'

const initialValues = {
  topic: '',
  num_questions: 5,
  difficulty: 'medium',
  question_type: 'mcq',
}

export default function QuizForm({ onSubmit, isLoading }) {
  const [values, setValues] = useState(initialValues)
  const [error, setError] = useState('')

  function updateValue(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: name === 'num_questions' ? Number(value) : value }))
    if (error) setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    const topic = values.topic.trim()

    if (!topic) {
      setError('Add a Wikipedia topic or URL to get started.')
      return
    }

    if (values.num_questions < 3 || values.num_questions > 10) {
      setError('Choose between 3 and 10 questions.')
      return
    }

    // The form is the CONFIG state boundary; App moves to LOADING after validation.
    onSubmit({ ...values, topic })
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit} noValidate>
      <div className="space-y-3">
        <label className="field-label" htmlFor="topic">What should we explore?</label>
        <div className="relative">
          <input
            className="field-input pr-12"
            id="topic"
            name="topic"
            value={values.topic}
            onChange={updateValue}
            placeholder="e.g. history of the printing press"
            disabled={isLoading}
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xl text-terracotta">↗</span>
        </div>
        <p className="text-sm text-ink-muted">Paste a Wikipedia URL or enter any topic you want to understand better.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-3">
          <label className="field-label" htmlFor="num_questions">Number of questions</label>
          <select className="field-input" id="num_questions" name="num_questions" value={values.num_questions} onChange={updateValue} disabled={isLoading}>
            {[3, 4, 5, 6, 7, 8, 9, 10].map((count) => <option key={count} value={count}>{count} questions</option>)}
          </select>
        </div>
        <div className="space-y-3">
          <label className="field-label" htmlFor="difficulty">Difficulty</label>
          <select className="field-input" id="difficulty" name="difficulty" value={values.difficulty} onChange={updateValue} disabled={isLoading}>
            <option value="easy">Easy · warm-up</option>
            <option value="medium">Medium · balanced</option>
            <option value="hard">Hard · stretch me</option>
          </select>
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="field-label">Question format</legend>
        <div className="grid grid-cols-2 gap-3">
          {[['mcq', 'Multiple choice'], ['boolean', 'True or false']].map(([value, label]) => (
            <label className={`choice-tile ${values.question_type === value ? 'choice-tile-active' : ''}`} key={value}>
              <input className="sr-only" type="radio" name="question_type" value={value} checked={values.question_type === value} onChange={updateValue} disabled={isLoading} />
              <span className="block text-sm font-semibold text-ink">{label}</span>
              <span className="mt-1 block text-xs text-ink-muted">{value === 'mcq' ? 'Compare four answers' : 'Keep it crisp'}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{error}</p>}

      <button className="button-primary w-full" type="submit" disabled={isLoading}>
        {isLoading ? 'Building your quiz...' : 'Generate quiz'}
        {!isLoading && <span aria-hidden="true">→</span>}
      </button>
    </form>
  )
}
