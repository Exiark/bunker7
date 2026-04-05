import { useState, useEffect } from 'react'

const SPRITE_BASE = '/sprites/survivors/worker1/'

function getSpriteInRoom(survivor, roomId) {
  if (!survivor || survivor.room !== roomId) return null
  if (survivor.room.startsWith('explore_')) return null
  const isWorking = survivor.room === roomId
  return {
    src: isWorking ? SPRITE_BASE + 'work.gif' : SPRITE_BASE + 'idle-east.gif',
    flip: false
  }
}

export default function Room({ room, survivors, selected, onClick }) {
  const workerCount = room.workers.filter(w => survivors.find(s => s.id === w)).length
  const eff = room.maxWorkers === 0 ? 100 : Math.round(workerCount / room.maxWorkers * 100)
  const assignedSurvivors = survivors.filter(s => s.room === room.id)

  return (
    <div className={`room ${selected ? 'selected' : ''}`} onClick={onClick}>
      <div className="room-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="room-icon">{room.icon}</span>
          <span className="room-name">{room.name}</span>
        </div>
        <span className="room-lvl">Lv{room.level}</span>
      </div>

      <div className="room-sprites" style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 4,
        flex: 1,
        padding: '8px 0',
        minHeight: 48
      }}>
        {assignedSurvivors.map((sv, i) => (
          <img
            key={sv.id}
            src={SPRITE_BASE + 'work.gif'}
            alt={sv.name}
            title={sv.name}
            style={{
              width: 32,
              height: 48,
              imageRendering: 'pixelated',
              position: 'relative',
              bottom: 0,
            }}
          />
        ))}
      </div>

      {room.maxWorkers > 0 && (
        <div className="room-eff">
          EFF: {eff}%
          <div className="eff-bar">
            <div className="eff-fill" style={{ width: eff + '%' }} />
          </div>
        </div>
      )}
    </div>
  )
}