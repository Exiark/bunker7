export default function Room({ room, survivors, selected, onClick }) {
  const workerCount = room.workers.filter(w => survivors.find(s => s.id === w)).length
  const eff = room.maxWorkers === 0 ? 100 : Math.round(workerCount / room.maxWorkers * 100)

  const slots = []
  if (room.maxWorkers > 0) {
    for (let i = 0; i < room.maxWorkers; i++) {
      const sv = survivors.find(s => s.id === room.workers[i])
      slots.push(
        <div className={`worker-slot ${sv ? 'filled' : ''}`} key={i}>
          {sv ? sv.icon : '·'}
        </div>
      )
    }
  }

  return (
    <div className={`room ${selected ? 'selected' : ''}`} onClick={onClick}>
      <div className="room-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="room-icon">{room.icon}</span>
          <span className="room-name">{room.name}</span>
        </div>
        <span className="room-lvl">Lv{room.level}</span>
      </div>
      {slots.length > 0 && <div className="room-workers">{slots}</div>}
      <div className="room-eff">EFF: {eff}%
        <div className="eff-bar">
          <div className="eff-fill" style={{ width: eff + '%' }} />
        </div>
      </div>
    </div>
  )
}