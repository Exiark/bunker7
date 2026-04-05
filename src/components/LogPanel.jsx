export default function LogPanel({ logs }) {
  return (
    <div className="log-panel">
      {logs.slice(0, 30).map((l, i) => (
        <div className={`log-entry ${l.type || ''}`} key={i}>
          {l.msg}
        </div>
      ))}
    </div>
  )
}