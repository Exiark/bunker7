export function computeTick(state) {
  const s = JSON.parse(JSON.stringify(state))
  const R = s.resources

  s.rooms.forEach(room => {
    const workerCount = room.workers.filter(w => s.survivors.find(sv => sv.id === w)).length
    const eff = room.maxWorkers === 0 ? 1 : workerCount / room.maxWorkers
    if (eff === 0 && room.maxWorkers > 0) return

    const lvlBonus = 1 + (room.level - 1) * 0.3
    const workerBonus = calcWorkerBonus(room, s.survivors)

    Object.entries(room.production).forEach(([res, amt]) => {
      R[res] = Math.min(s.maxRes[res], R[res] + amt * eff * workerBonus * lvlBonus / 10)
    })

    Object.entries(room.consumption || {}).forEach(([res, amt]) => {
      R[res] = Math.max(0, R[res] - amt * Math.max(0.1, eff) / 10)
    })

    if (room.special === 'rest') {
      s.survivors.filter(sv => sv.room === room.id).forEach(sv => {
        sv.hp = Math.min(sv.maxHp, sv.hp + 0.05)
        sv.mood = Math.min(100, sv.mood + 0.02)
      })
    }
  })

  // Consommation passive des survivants
  const count = s.survivors.length
  R.food  = Math.max(0, R.food  - count * 0.012 / 10)
  R.water = Math.max(0, R.water - count * 0.008 / 10)

  // Dégradation si manque
  if (s.tick % 100 === 0) {
    s.survivors.forEach(sv => {
      if (R.food  < 15) sv.hp = Math.max(1, sv.hp - 3)
      if (R.water < 10) sv.hp = Math.max(1, sv.hp - 5)
    })
  }

  // Nouveau jour toutes les 600 ticks
  if (s.tick % 600 === 0 && s.tick > 0) {
    s.day += 1
    s.logs = [{ msg: `▶ Jour ${s.day} commence.`, type: 'event', t: s.tick }, ...s.logs]
  }

  s.tick += 1
  s.eventCooldown = Math.max(0, s.eventCooldown - 1)
  return s
}

function calcWorkerBonus(room, survivors) {
  let bonus = 1
  room.workers.forEach(wid => {
    const sv = survivors.find(s => s.id === wid)
    if (!sv) return
    if (room.id === 'kitchen' || room.id === 'farm') bonus += sv.agility * 0.02
    else if (room.id === 'generator' || room.id === 'workshop') bonus += sv.strength * 0.02
    else if (room.id === 'water' || room.id === 'server') bonus += sv.intelligence * 0.02
  })
  return Math.min(bonus, 2.5)
}