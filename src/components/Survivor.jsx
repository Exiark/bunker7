const SPRITE_BASE = '/sprites/survivors/worker1/'

export default function Survivor({ survivor, rooms, positions, selected, onClick }) {
  const pos = positions?.find(p => p.id === survivor.id)
  const hpPct = Math.round(survivor.hp / survivor.maxHp * 100)
  const hpColor = hpPct > 60 ? 'var(--green)' : hpPct > 30 ? 'var(--amber)' : 'var(--red)'

  const getRoomName = () => {
    if (!survivor.room) return 'INACTIF'
    if (survivor.room.startsWith('explore_')) return '⚔ EN MISSION'
    return rooms.find(r => r.id === survivor.room)?.name || '?'
  }

  const getSpriteSrc = () => {
    if (!pos) return SPRITE_BASE + 'idle-east.gif'
    switch (pos.state) {
      case 'work':    return SPRITE_BASE + 'work.gif'
      case 'walking': return SPRITE_BASE + (pos.direction === 'west' ? 'walk-west.gif' : 'walk-east.gif')
      case 'climb':   return SPRITE_BASE + 'climb.gif'
      default:        return SPRITE_BASE + (pos.direction === 'west' ? 'idle-west.gif' : 'idle-east.gif')
    }
  }

  const statusLabel = () => {
    if (!pos) return getRoomName()
    if (pos.path?.length > 0) return '⟳ EN ROUTE'
    return getRoomName()
  }

  return (
    <div className={`survivor-card ${selected ? 'active' : ''}`} onClick={onClick}>
      <div className="sc-header">
        <img
          src={getSpriteSrc()}
          alt={survivor.name}
          style={{ width: 32, height: 48, imageRendering: 'pixelated', flexShrink: 0 }}
        />
        <div>
          <div className="sc-name">{survivor.name}</div>
          <div className="sc-room">📍 {statusLabel()}</div>
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