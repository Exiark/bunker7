import { useState, useEffect, useCallback, useRef } from 'react'
import { INITIAL_STATE } from './core/state.js'
import { computeTick } from './core/production.js'
import { tickExploration, startExploration } from './core/exploration.js'
import { EVENTS, shouldTriggerEvent, applyEventChoice } from './core/events.js'
import { saveGame, loadGame } from './core/save.js'
import {
  initSurvivorPosition, tickAnimations,
  assignSurvivorToRoom, unassignSurvivor, getRoomPosition
} from './core/animation.js'
import ResourceBar from './components/ResourceBar.jsx'
import BunkerView from './components/BunkerView.jsx'
import Survivor from './components/Survivor.jsx'
import EventPopup from './components/EventPopup.jsx'
import LogPanel from './components/LogPanel.jsx'

export default function App() {
  const [state, setState] = useState(() => loadGame(INITIAL_STATE))
  const [positions, setPositions] = useState(() =>
    INITIAL_STATE.survivors.map(s => initSurvivorPosition(s.id, 0))
  )
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedSurvivor, setSelectedSurvivor] = useState(null)
  const [sideTab, setSideTab] = useState('survivors')
  const stateRef = useRef(state)
  stateRef.current = state

  // Boucle jeu — 100ms
  useEffect(() => {
    const id = setInterval(() => {
      setState(prev => {
        let s = computeTick(prev)
        s = tickExploration(s)
        if (shouldTriggerEvent(s) && !s.pendingEvent) {
          const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)]
          s = { ...s, pendingEvent: ev, eventCooldown: 300 }
        }
        return s
      })
    }, 100)
    return () => clearInterval(id)
  }, [])

  // Boucle animation — 50ms séparée
  useEffect(() => {
    const id = setInterval(() => {
      setPositions(prev => {
        const arrivals = []
        const next = tickAnimations(prev, stateRef.current.survivors, arrivals)
        if (arrivals.length > 0) {
          setState(gs => {
            const s = JSON.parse(JSON.stringify(gs))
            arrivals.forEach(({ survivorId, roomId }) => {
              const sv = s.survivors.find(x => x.id === survivorId)
              if (sv) sv.room = roomId
            })
            return s
          })
        }
        return next
      })
    }, 50)
    return () => clearInterval(id)
  }, [])

  // Sauvegarde toutes les 30 secondes
  useEffect(() => {
    const id = setInterval(() => saveGame(stateRef.current), 30000)
    return () => clearInterval(id)
  }, [])

  const handleEventChoice = useCallback((choiceIndex) => {
    setState(prev => applyEventChoice(prev, prev.pendingEvent, choiceIndex))
  }, [])

  const toggleAssign = useCallback((roomId, survivorId) => {
    setState(prev => {
      const s = JSON.parse(JSON.stringify(prev))
      const room = s.rooms.find(r => r.id === roomId)
      const survivor = s.survivors.find(sv => sv.id === survivorId)
      if (!room || !survivor) return prev
      if (survivor.room?.startsWith('explore_')) return prev

      const idx = room.workers.indexOf(survivorId)
      if (idx >= 0) {
        room.workers.splice(idx, 1)
        survivor.room = null
        s.logs = [{ msg: `${survivor.name} retiré de ${room.name}`, type: '', t: s.tick }, ...s.logs]
        setPositions(prev => unassignSurvivor(prev, survivorId))
      } else {
        if (room.workers.length >= room.maxWorkers) return prev
        s.rooms.forEach(r => { r.workers = r.workers.filter(w => w !== survivorId) })
        // NE PAS mettre survivor.room ici — mis à jour à l'arrivée via arrivals
        s.logs = [{ msg: `${survivor.name} en route vers ${room.name}`, type: 'good', t: s.tick }, ...s.logs]
        room.workers.push(survivorId)
        const roomPos = getRoomPosition(room)
        setPositions(prev => assignSurvivorToRoom(prev, survivorId, roomPos.floor, roomPos.x, roomId))
      }
      return s
    })
  }, [])

  const handleStartExplore = useCallback((zoneId) => {
    if (!selectedSurvivor) return
    setState(prev => startExploration(prev, zoneId, selectedSurvivor))
  }, [selectedSurvivor])

  const selectedRoomData = state.rooms.find(r => r.id === selectedRoom)

  return (
    <div className="app">
      <ResourceBar resources={state.resources} maxRes={state.maxRes} day={state.day} />

      <div className="main-area">
        <BunkerView
          rooms={state.rooms}
          survivors={state.survivors}
          positions={positions}
          selectedRoom={selectedRoom}
          onSelectRoom={id => { setSelectedRoom(id); setSelectedSurvivor(null) }}
        />

        <div className="sidebar">
          <div className="sidebar-title">TERMINAL</div>
          <div className="sidebar-tabs">
            {['survivors', 'explore'].map(tab => (
              <div key={tab} className={`stab ${sideTab === tab ? 'active' : ''}`} onClick={() => setSideTab(tab)}>
                {tab === 'survivors' ? 'ÉQUIPE' : 'EXPLO'}
              </div>
            ))}
          </div>

          <div className="sidebar-content">
            {sideTab === 'survivors' && state.survivors.map(sv => (
              <Survivor
                key={sv.id}
                survivor={sv}
                rooms={state.rooms}
                selected={selectedSurvivor === sv.id}
                onClick={() => { setSelectedSurvivor(sv.id); setSelectedRoom(null) }}
              />
            ))}

            {sideTab === 'explore' && state.exploration.zones.map(zone => (
              <div key={zone.id} style={{ border: '1px solid var(--border)', padding: 8, marginBottom: 6, background: 'var(--panel2)' }}>
                <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 15, color: 'var(--amber)', marginBottom: 4 }}>
                  {zone.icon} {zone.name}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 6 }}>
                  Risque: {zone.risk} · {zone.duration}s
                </div>
                {zone.active ? (
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--green)' }}>⟳ En mission…</div>
                    <div style={{ height: 4, background: 'var(--dim)', marginTop: 4, borderRadius: 2 }}>
                      <div style={{ height: '100%', width: zone.progress + '%', background: 'var(--amber)', borderRadius: 2, transition: 'width .1s' }} />
                    </div>
                  </div>
                ) : (
                  <button
                    style={{ background: 'var(--dim)', border: '1px solid var(--green)', color: 'var(--green)', fontSize: 10, padding: '3px 8px', cursor: 'pointer', fontFamily: 'var(--font-mono)', width: '100%' }}
                    onClick={() => handleStartExplore(zone.id)}
                    disabled={!selectedSurvivor}
                  >
                    {selectedSurvivor ? '▶ PARTIR EN MISSION' : 'Sélectionne un survivant'}
                  </button>
                )}
              </div>
            ))}
          </div>

          {selectedRoomData && selectedRoomData.maxWorkers > 0 && (
            <div className="detail-panel">
              <div className="dp-title">ASSIGNER À {selectedRoomData.name.toUpperCase()}</div>
              {state.survivors.map(sv => {
                const inRoom = selectedRoomData.workers.includes(sv.id)
                const inExplore = sv.room?.startsWith('explore_')
                return (
                  <button
                    key={sv.id}
                    className={`assign-btn ${inRoom ? 'assigned' : ''}`}
                    disabled={inExplore}
                    onClick={() => toggleAssign(selectedRoom, sv.id)}
                  >
                    <span>{sv.icon} {sv.name}</span>
                    <span>{inRoom ? '✕ RETIRER' : '+ ASSIGNER'}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <LogPanel logs={state.logs} />
      <EventPopup event={state.pendingEvent} onChoice={handleEventChoice} />
    </div>
  )
}