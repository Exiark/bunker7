export function startExploration(state, zoneId, survivorId) {
  const s = JSON.parse(JSON.stringify(state))
  const zone = s.exploration.zones.find(z => z.id === zoneId)
  const survivor = s.survivors.find(sv => sv.id === survivorId)
  if (!zone || !survivor || zone.active) return state
  if (survivor.room && survivor.room.startsWith('explore_')) return state

  // Retirer des autres salles
  s.rooms.forEach(r => { r.workers = r.workers.filter(w => w !== survivorId) })
  zone.active = true
  zone.progress = 0
  zone.survivor = survivorId
  survivor.room = 'explore_' + zoneId
  s.logs = [{ msg: `➜ ${survivor.name} part en mission : ${zone.name}`, type: 'good', t: s.tick }, ...s.logs]
  return s
}

export function tickExploration(state) {
  const s = JSON.parse(JSON.stringify(state))
  s.exploration.zones.forEach(zone => {
    if (!zone.active) return
    zone.progress += 100 / (zone.duration * 10)
    if (zone.progress >= 100) {
      zone.progress = 100
      zone.active = false
      const survivor = s.survivors.find(sv => sv.id === zone.survivor)
      const riskMap = { 'FAIBLE': 0.05, 'MOYEN': 0.15, 'ÉLEVÉ': 0.3 }
      const rewards = {}

      Object.entries(zone.rewards).forEach(([res, [min, max]]) => {
        const bonus = survivor ? (survivor.agility + survivor.intelligence) * 0.5 : 10
        const amt = Math.floor(Math.random() * (max - min) + min + bonus)
        rewards[res] = amt
        s.resources[res] = Math.min(s.maxRes[res], s.resources[res] + amt)
      })

      if (survivor) {
        if (Math.random() < riskMap[zone.risk]) {
          const dmg = Math.floor(Math.random() * 30 + 10)
          survivor.hp = Math.max(1, survivor.hp - dmg)
          s.logs = [{ msg: `💥 ${survivor.name} blessé (−${dmg} HP) lors de ${zone.name}`, type: 'bad', t: s.tick }, ...s.logs]
        } else {
          const rewardStr = Object.entries(rewards).map(([r,v]) => `+${v} ${r}`).join(', ')
          s.logs = [{ msg: `✓ ${survivor.name} revient : ${rewardStr}`, type: 'good', t: s.tick }, ...s.logs]
        }
        survivor.room = null
      }
      zone.survivor = null
    }
  })
  return s
}