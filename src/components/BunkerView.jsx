import Room from './Room.jsx'
import { getSpriteForState } from '../core/animation.js'

const FLOORS_COUNT = 4
const RUNGS = 6

export default function BunkerView({ rooms, survivors, positions, selectedRoom, onSelectRoom }) {
  const floors = []
  for (let f = 0; f < FLOORS_COUNT; f++) {
    floors.push(rooms.filter(r => r.floor === f).sort((a, b) => a.col - b.col))
  }

  return (
    <div className="bunker-wrap">
      <div className="bunker-title">◈ BUNKER-7 ◈</div>

      <div className="surface">
        <span>~ SURFACE — ZONE IRRADIÉE ~</span>
        <div className="hatch">🚪</div>
      </div>

      {floors.map((floorRooms, fi) => (
        <div className="floor" key={fi}>
          <div className="ladder">
            {Array.from({ length: RUNGS }).map((_, i) => (
              <div className="ladder-rung" key={i} />
            ))}
          </div>

          {floorRooms.map(room => (
            <Room
              key={room.id}
              room={room}
              survivors={survivors}
              selected={selectedRoom === room.id}
              onClick={() => onSelectRoom(room.id)}
            />
          ))}

          {positions
            .filter(pos => !pos.onLadder && pos.floor === fi)
            .map(pos => {
              const survivor = survivors.find(s => s.id === pos.id)
              if (!survivor) return null
              const src = getSpriteForState(pos.state, pos.direction)
              return (
                <img
                  key={'sprite-' + pos.id}
                  src={src}
                  alt={survivor.name}
                  title={survivor.name}
                  style={{
                    position: 'absolute',
                    bottom: 4,
                    left: pos.x + '%',
                    width: 32,
                    height: 48,
                    imageRendering: 'pixelated',
                    zIndex: 5,
                    pointerEvents: 'none',
                  }}
                />
              )
            })}

          {positions
            .filter(pos => pos.onLadder && pos.onLadderFloor === fi)
            .map(pos => {
              const survivor = survivors.find(s => s.id === pos.id)
              if (!survivor) return null
              const progress = (pos.ladderY || 0) / 30
              const bottom = pos.climbDirection === 'up'
                ? 4 + progress * 80
                : 80 - progress * 80
              return (
                <img
                  key={'ladder-' + pos.id}
                  src={getSpriteForState('climb', 'east')}
                  alt={survivor.name}
                  style={{
                    position: 'absolute',
                    bottom: Math.max(4, bottom),
                    left: '47%',
                    width: 32,
                    height: 48,
                    imageRendering: 'pixelated',
                    zIndex: 15,
                    pointerEvents: 'none',
                  }}
                />
              )
            })}
        </div>
      ))}
    </div>
  )
}