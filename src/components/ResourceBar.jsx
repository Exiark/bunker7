export default function ResourceBar({ resources, maxRes, day }) {
  const items = [
    { key: 'food',   label: 'NOURRITURE', icon: '🍖' },
    { key: 'water',  label: 'EAU',        icon: '💧' },
    { key: 'energy', label: 'ÉNERGIE',    icon: '⚡' },
    { key: 'mats',   label: 'MATÉRIAUX',  icon: '🔩' },
  ]

  return (
    <div className="resource-bar">
      {items.map(({ key, label, icon }) => {
        const val = resources[key]
        const max = maxRes[key]
        const pct = Math.round(val / max * 100)
        const low = pct < 20
        return (
          <div className="res-item" key={key}>
            <span className="res-icon">{icon}</span>
            <div>
              <div className="res-label">{label}</div>
              <div className={`res-value ${low ? 'low' : ''}`}>{Math.floor(val)}</div>
              <div className="res-bar-wrap">
                <div className={`res-bar-fill ${low ? 'low' : ''}`} style={{ width: pct + '%' }} />
              </div>
            </div>
          </div>
        )
      })}
      <div className="day-badge">JOUR {day}</div>
    </div>
  )
}