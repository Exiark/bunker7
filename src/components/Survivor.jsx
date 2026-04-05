export default function Survivor({ survivor, rooms, selected, onClick }) {
  const hpPct = Math.round(survivor.hp / survivor.maxHp * 100)
  const hpColor = hpPct > 60 ? 'var(--green)' : hpPct > 30 ? 'var(--amber)' : 'var(--red)'
  const roomName = survivor.room
    ? (survivor.room.startsWith('explore_') ? '⚔ EN MISSION' : (rooms.find(r => r.id === survivor.room)?.name || '?'))
    : 'INACTIF'

  return (
    <div className={`survivor-card ${selected ? 'active' : ''}`} onClick={onClick}>
      <div className="sc-header">
        <span className="sc-icon">{survivor.icon}</span>
        <div>
          <div className="sc-name">{survivor.name}</div>
          <div className="sc-room">📍 {roomName}</div>
        </div>
      </div>
      <div className="sc-stats">
        <span>FRC:<span>{survivor.strength}</span></span>
        <span>INT:<span>{survivor.intelligence}</span></span>
        <span>AGI:<span>{survivor.agility}</span></span>
      </div>
      <div className="hp-bar">
        <div className="hp-fill" style={{ width: hpPct + '%', background: hpColor }} />
      </div>
      <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 2 }}>HP {survivor.hp}/{survivor.maxHp}</div>
    </div>
  )
}