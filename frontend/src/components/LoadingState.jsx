export default function LoadingState() {
  return (
    <section className="space-y-8" aria-live="polite" aria-busy="true">
      <div className="flex items-center justify-between">
        <span className="eyebrow">Generating your quiz</span>
        <span className="h-2 w-24 animate-pulse rounded-full bg-sand-dark" />
      </div>
      <div className="quiz-card space-y-6">
        <div className="h-3 w-28 animate-pulse rounded-full bg-sand-dark" />
        <div className="space-y-3"><div className="h-8 w-4/5 animate-pulse rounded-lg bg-sand-dark" /><div className="h-8 w-2/5 animate-pulse rounded-lg bg-sand-dark" /></div>
        <div className="space-y-3">{[1, 2, 3, 4].map((item) => <div className="h-16 animate-pulse rounded-2xl bg-sand" key={item} />)}</div>
      </div>
      <p className="text-center text-sm text-ink-muted">Reading the topic, finding the signal, writing the questions...</p>
    </section>
  )
}
