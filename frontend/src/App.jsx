import { useState } from 'react'
import QuizCard from './components/QuizCard'
import QuizForm from './components/QuizForm'
import QuizReview from './components/QuizReview'
import LoadingState from './components/LoadingState'
import { generateQuiz } from './services/api'
import './index.css'

const STATES = {
  CONFIG: 'CONFIG',
  LOADING: 'LOADING',
  ACTIVE_QUIZ: 'ACTIVE_QUIZ',
  REVIEW: 'REVIEW',
  ERROR: 'ERROR',
}

function App() {
  const [status, setStatus] = useState(STATES.CONFIG)
  const [quiz, setQuiz] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [lastConfig, setLastConfig] = useState(null)
  const [error, setError] = useState('')

  async function startQuiz(config) {
    setLastConfig(config)
    setError('')
    setStatus(STATES.LOADING)
    try {
      const response = await generateQuiz(config)
      setQuiz(response)
      setCurrentIndex(0)
      setAnswers([])
      setStatus(STATES.ACTIVE_QUIZ)
    } catch (requestError) {
      setError(requestError.message || 'We could not generate that quiz.')
      setStatus(STATES.ERROR)
    }
  }

  function recordAnswer(value, isCorrect) {
    setAnswers((current) => [...current, { value, isCorrect }])
    if (currentIndex === quiz.questions.length - 1) {
      setStatus(STATES.REVIEW)
      return
    }
    setCurrentIndex((current) => current + 1)
  }

  function restart() {
    setStatus(STATES.CONFIG)
    setQuiz(null)
    setCurrentIndex(0)
    setAnswers([])
    setError('')
  }

  const isWorkspace = status !== STATES.CONFIG && status !== STATES.ERROR

  return (
    <main className="min-h-screen overflow-hidden bg-paper text-ink">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 lg:px-10">
        <button className="flex items-center gap-3" type="button" onClick={restart} aria-label="Return to quiz setup">
          <span className="brand-mark">Q</span>
          <span className="font-display text-xl font-semibold tracking-tight">quirk</span>
        </button>
        <div className="hidden items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted sm:flex">
          <span className="h-2 w-2 rounded-full bg-terracotta" />
          Learn something new
        </div>
      </header>

      <div className={`mx-auto grid w-full max-w-6xl gap-12 px-6 pb-16 pt-8 lg:px-10 ${isWorkspace ? 'lg:grid-cols-[0.8fr_1.2fr]' : 'lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-20'}`}>
        <section className={isWorkspace ? 'lg:sticky lg:top-10 lg:self-start' : ''}>
          {status === STATES.CONFIG && (
            <div className="space-y-8">
              <div className="space-y-5">
                <span className="eyebrow">Your curious sidekick</span>
                <h1 className="max-w-xl font-display text-5xl leading-[0.95] tracking-tight text-ink sm:text-7xl">Turn a topic into a <span className="text-terracotta">mind-opening</span> quiz.</h1>
                <p className="max-w-lg text-lg leading-relaxed text-ink-muted">Point us at a Wikipedia page or name a subject. We&apos;ll turn the rabbit hole into a quick, memorable challenge.</p>
              </div>
              <div className="hidden items-center gap-4 sm:flex">
                <div className="flex -space-x-2">
                  {['A', 'J', 'M'].map((letter, index) => <span className={`avatar avatar-${index}`} key={letter}>{letter}</span>)}
                </div>
                <p className="text-sm text-ink-muted">Made for curious people<br />who ask one more question.</p>
              </div>
            </div>
          )}
          {(status === STATES.ACTIVE_QUIZ || status === STATES.REVIEW) && (
            <div className="space-y-5">
              <span className="eyebrow">Now exploring</span>
              <h1 className="max-w-md font-display text-5xl leading-[0.95] tracking-tight text-ink">{quiz.topic}</h1>
              <p className="max-w-sm text-base leading-relaxed text-ink-muted">A few good questions can turn a passing interest into something that sticks.</p>
            </div>
          )}
          {status === STATES.LOADING && <div className="space-y-5"><span className="eyebrow">One moment</span><h1 className="max-w-md font-display text-5xl leading-[0.95] tracking-tight text-ink">Making room for a new <span className="text-terracotta">aha.</span></h1></div>}
          {status === STATES.ERROR && <div className="space-y-5"><span className="eyebrow text-red-700">Something went sideways</span><h1 className="max-w-md font-display text-5xl leading-[0.95] tracking-tight text-ink">Let&apos;s give it another go.</h1></div>}
        </section>

        <section className={status === STATES.CONFIG || status === STATES.ERROR ? 'panel' : ''}>
          {status === STATES.CONFIG && <QuizForm onSubmit={startQuiz} isLoading={false} />}
          {status === STATES.LOADING && <LoadingState />}
          {status === STATES.ACTIVE_QUIZ && <QuizCard question={quiz.questions[currentIndex]} currentIndex={currentIndex} total={quiz.questions.length} onComplete={recordAnswer} />}
          {status === STATES.REVIEW && <QuizReview quiz={quiz} answers={answers} onRestart={restart} />}
          {status === STATES.ERROR && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800" role="alert">
                <p className="font-semibold">We couldn&apos;t build that quiz.</p>
                <p className="mt-2 text-sm leading-relaxed">{error}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="button-primary" type="button" onClick={() => startQuiz(lastConfig)}>Retry <span aria-hidden="true">↻</span></button>
                <button className="button-secondary" type="button" onClick={restart}>Change topic</button>
              </div>
            </div>
          )}
        </section>
      </div>
      <footer className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pb-7 text-xs text-ink-muted lg:px-10"><span>QUIRK / 01</span><span>Small questions. Big shifts.</span></footer>
    </main>
  )
}

export default App
