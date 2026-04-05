const KEY = 'bunker7_save'

export function saveGame(state) {
  try {
    const data = {
      day: state.day,
      tick: state.tick,
      resources: state.resources,
      rooms: state.rooms.map(r => ({ id: r.id, level: r.level, workers: r.workers })),
      survivors: state.survivors,
      logs: state.logs.slice(0, 20),
    }
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch (e) {}
}

export function loadGame(initialState) {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return initialState
    const data = JSON.parse(raw)
    const rooms = initialState.rooms.map(r => {
      const saved = data.rooms?.find(x => x.id === r.id)
      return saved ? { ...r, level: saved.level, workers: saved.workers } : r
    })
    return { ...initialState, ...data, rooms }
  } catch (e) {
    return initialState
  }
}

export function resetGame() {
  localStorage.removeItem(KEY)
}