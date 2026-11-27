export function RingMechanism() {
  return (
    <div className="rings" aria-hidden>
      {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} className="ring">
          <span className="ring__metal" />
        </span>
      ))}
    </div>
  )
}
