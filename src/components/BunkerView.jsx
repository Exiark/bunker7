import Room from './Room.jsx'

const FLOORS_COUNT = 4
const RUNGS = 6

export default function BunkerView({ rooms, survivors, selectedRoom, onSelectRoom }) {
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
        </div>
      ))}
    </div>
  )
}