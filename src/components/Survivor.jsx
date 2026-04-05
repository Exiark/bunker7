import { useState, useEffect, useRef } from 'react'

const SPRITE_BASE = '/sprites/survivors/worker1/'

function getSprite(survivor, rooms) {
  if (!survivor.room) return { src: SPRITE_BASE + 'idle-east.gif', flip: false }
  if (survivor.room.startsWith('explore_')) return { src: SPRITE_BASE + 'walk-east.gif', flip: false }
  return { src: SPRITE_BASE + 'work.gif', flip: false }
}

export default function Survivor({ survivor, rooms, selected, onClick }) {
  const hpPct = Math.round(survivor.hp / survivor.maxHp * 100)
  const hpColor = hpPct > 60 ? '#00ff41' : hpPct > 30 ? '#ffb700' : '#ff3333'
  const roomName = survivor.room
    ? (survivor.room.startsWith('explore_') ? '⚔ EN MISSION' : (rooms.find(r => r.id === survivor.room)?.name || '?'))
    : 'INACTIF'

  const sprite = getSprite(survivor, rooms)

  return (
    <div className={`survivor-card ${selected ? 'active' : ''}`} onClick={onClick}>
      <div className="sc-header">
        <img
          src={sprite.src}
          alt={survivor.name}
          style={{
            width: 32, height: 32,
            imageRendering: 'pixelated',
            transform: sprite.flip ? 'scaleX(-1)' : 'none',
          }}
        />
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