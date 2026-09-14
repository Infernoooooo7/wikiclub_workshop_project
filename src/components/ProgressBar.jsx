export default function ProgressBar({ current, total }) {
  const percentage = total ? Math.round((current / total) * 100) : 0

  return (
    <div className="space-y-3" aria-label={`Question ${current} of ${total}`}>
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
        <span>Question {String(current).padStart(2, '0')}</span>
        <span>{String(total).padStart(2, '0')} total</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-sand-dark" role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">
        <div className="h-full rounded-full bg-terracotta transition-[width] duration-500 ease-out" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
