export const LADDER_X = 48

export function initSurvivorPosition(survivorId, floorIndex = 0) {
  return {
    id: survivorId,
    floor: floorIndex,
    x: Math.random() * 60 + 10,
    direction: 'east',
    state: 'idle',
    stateTimer: Math.floor(Math.random() * 80 + 40),
    onLadder: false,
    ladderY: 0,
    onLadderFloor: null,
    climbDirection: null,
    path: [],
    assignedRoom: null,
  }
}

function buildPath(pos, targetFloor, targetX) {
  const steps = []
  if (pos.floor !== targetFloor) {
    steps.push({ type: 'walk-to-ladder', targetX: LADDER_X })
    const dir = targetFloor > pos.floor ? 'down' : 'up'
    const floorDiff = Math.abs(targetFloor - pos.floor)
    for (let i = 0; i < floorDiff; i++) {
      const fromFloor = pos.floor + (dir === 'down' ? i : -i)
      const toFloor   = pos.floor + (dir === 'down' ? i + 1 : -(i + 1))
      steps.push({ type: 'climb', direction: dir, fromFloor, toFloor })
    }
  }
  steps.push({ type: 'walk-to-target', targetX })
  return steps
}

export function assignSurvivorToRoom(positions, survivorId, roomFloor, roomX, roomId) {
  return positions.map(pos => {
    if (pos.id !== survivorId) return pos
    const path = buildPath(pos, roomFloor, roomX)
    return {
      ...pos,
      path,
      state: 'walking',
      onLadder: false,
      assignedRoom: { floor: roomFloor, x: roomX, roomId },
    }
  })
}

export function unassignSurvivor(positions, survivorId) {
  return positions.map(pos => {
    if (pos.id !== survivorId) return pos
    return {
      ...pos,
      path: [],
      assignedRoom: null,
      state: 'idle',
      stateTimer: 60,
      onLadder: false,
      ladderY: 0,
    }
  })
}

export function getRoomPosition(room) {
  const colPositions = { 0: 20, 1: 70 }
  return { floor: room.floor, x: colPositions[room.col] ?? 20 }
}

export function tickAnimations(positions, survivors, arrivals = []) {
  return positions.map(pos => {
    const survivor = survivors.find(s => s.id === pos.id)
    if (!survivor) return pos
    if (pos.path && pos.path.length > 0) return tickPath(pos, arrivals)
    if (pos.state === 'work') return pos
    return tickIdle(pos)
  })
}

function tickPath(pos, arrivals) {
  const step = pos.path[0]
  const remaining = pos.path.slice(1)

  if (step.type === 'walk-to-ladder' || step.type === 'walk-to-target') {
    const targetX = step.targetX
    const diff = targetX - pos.x
    const speed = 0.6
    const direction = diff > 0 ? 'east' : 'west'

    if (Math.abs(diff) <= speed + 0.5) {
      if (remaining.length === 0) {
        if (arrivals && pos.assignedRoom?.roomId) {
          arrivals.push({ survivorId: pos.id, roomId: pos.assignedRoom.roomId })
        }
        return {
          ...pos,
          x: targetX,
          direction,
          path: [],
          state: 'work',
          onLadder: false,
        }
      }
      return {
        ...pos,
        x: targetX,
        direction,
        path: remaining,
        state: 'walking',
        onLadder: false,
      }
    }

    return {
      ...pos,
      x: pos.x + (diff > 0 ? speed : -speed),
      direction,
      state: 'walking',
      onLadder: false,
    }
  }

  if (step.type === 'climb') {
    const atLadder = Math.abs(pos.x - LADDER_X) < 1.5
    if (!atLadder) {
      const diff = LADDER_X - pos.x
      return {
        ...pos,
        x: pos.x + (diff > 0 ? 0.6 : -0.6),
        direction: diff > 0 ? 'east' : 'west',
        state: 'walking',
        onLadder: false,
      }
    }

    const ladderY = (pos.ladderY || 0) + 1
    const totalFrames = 30

    if (ladderY >= totalFrames) {
      return {
        ...pos,
        floor: step.toFloor,
        x: LADDER_X,
        ladderY: 0,
        onLadder: false,
        onLadderFloor: null,
        climbDirection: null,
        path: remaining,
        state: remaining.length === 0 ? 'work' : 'walking',
      }
    }

    return {
      ...pos,
      x: LADDER_X,
      ladderY,
      onLadder: true,
      onLadderFloor: step.fromFloor,
      climbDirection: step.direction,
      state: 'climb',
    }
  }

  return { ...pos, path: remaining }
}

function tickIdle(pos) {
  if (pos.path && pos.path.length > 0) return tickPath(pos, [])

  let { x, direction, state, stateTimer } = pos
  stateTimer--

  if (stateTimer <= 0) {
    const roll = Math.random()
    if (roll < 0.45) {
      state = 'walking'
      direction = Math.random() > 0.5 ? 'east' : 'west'
      stateTimer = Math.floor(Math.random() * 80 + 40)
    } else if (roll < 0.7) {
      state = 'idle'
      stateTimer = Math.floor(Math.random() * 120 + 60)
    } else {
      const targetFloor = Math.floor(Math.random() * 4)
      const targetX = Math.random() * 60 + 10
      const path = buildPath(pos, targetFloor, targetX)
      return { ...pos, path, state: 'walking', stateTimer: 30 }
    }
  }

  if (state === 'walking') {
    x += direction === 'east' ? 0.4 : -0.4
    if (x >= 88) { x = 88; direction = 'west'; stateTimer = 30 }
    if (x <= 6)  { x = 6;  direction = 'east'; stateTimer = 30 }
  }

  return { ...pos, x, direction, state, stateTimer }
}

export function getSpriteForState(state, direction) {
  const base = '/sprites/survivors/worker1/'
  switch (state) {
    case 'walking': return base + (direction === 'west' ? 'walk-west.gif' : 'walk-east.gif')
    case 'climb':   return base + 'climb.gif'
    case 'work':    return base + 'work.gif'
    default:        return base + (direction === 'west' ? 'idle-west.gif' : 'idle-east.gif')
  }
}