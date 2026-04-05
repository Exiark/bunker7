export default function EventPopup({ event, onChoice }) {
  if (!event) return null
  return (
    <div className="event-overlay">
      <div className="event-box">
        <div className="ev-title">{event.title}</div>
        <div className="ev-desc">{event.desc}</div>
        {event.choices.map((c, i) => (
          <button className="ev-choice" key={i} onClick={() => onChoice(i)}>
            ▶ {c.text}
          </button>
        ))}
      </div>
    </div>
  )
}