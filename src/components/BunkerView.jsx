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
  .filter(pos => !pos.onLadder && pos.floor === fi)
  .map(pos => {
    const survivor = survivors.find(s => s.id === pos.id)
    if (!survivor) return null

    // Ne pas afficher si le personnage est en chemin vers une salle
    // ET que son état final sera 'work' — évite le doublon
    const isInTransit = pos.path && pos.path.length > 0
    const isAssigned = !!survivor.room && !survivor.room.startsWith('explore_')

    // Si assigné et pas encore arrivé → afficher uniquement le sprite en mouvement
    // Si assigné et arrivé (state=work) → afficher work
    // Si non assigné → afficher idle/walk normalement
    if (isAssigned && !isInTransit && pos.state !== 'work') return null

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
        </div>
      ))}
    </div>
  )
}