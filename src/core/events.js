export const EVENTS = [
  {
    id: 'radiation',
    title: 'ALERTE RADIATIONS',
    desc: 'Un nuage radioactif approche du bunker. Les détecteurs sonnent l\'alarme.',
    choices: [
      { text: 'Confiner tout le monde (−20 food)', effect: s => { s.resources.food = Math.max(0, s.resources.food - 20); addLog(s, 'Confinement activé. Radiations évitées.', 'good') } },
      { text: 'Ignorer (risque −30 HP sur un survivant)', effect: s => { const sv = rnd(s.survivors); if(sv){ sv.hp = Math.max(1, sv.hp - 30); addLog(s, sv.name+' irradié ! −30 HP', 'bad') } } },
    ]
  },
  {
    id: 'mutant',
    title: 'MUTANT À LA PORTE',
    desc: 'Une créature mutante rôde à l\'entrée. Il faut agir vite.',
    choices: [
      { text: 'Envoyer le plus fort (risque blessure)', effect: s => { const sv = s.survivors.reduce((a,b) => a.strength > b.strength ? a : b); if(Math.random() < 0.5){ addLog(s, sv.name+' repousse le mutant ! +10 mats', 'good'); s.resources.mats += 10 } else { sv.hp = Math.max(1, sv.hp - 20); addLog(s, sv.name+' blessé par le mutant !', 'bad') } } },
      { text: 'Barricader (−15 mats)', effect: s => { s.resources.mats = Math.max(0, s.resources.mats - 15); addLog(s, 'Barricade renforcée. Mutant repoussé.', 'event') } },
    ]
  },
  {
    id: 'trader',
    title: 'COMMERÇANT ERRANT',
    desc: 'Un commerçant frappe à la porte avec des provisions. Il veut des matériaux.',
    choices: [
      { text: 'Échanger (−30 mats → +50 food, +30 water)', effect: s => { if(s.resources.mats >= 30){ s.resources.mats -= 30; s.resources.food = Math.min(s.maxRes.food, s.resources.food + 50); s.resources.water = Math.min(s.maxRes.water, s.resources.water + 30); addLog(s, 'Échange réussi !', 'good') } else addLog(s, 'Pas assez de matériaux.', 'bad') } },
      { text: 'Refuser', effect: s => addLog(s, 'Le commerçant repart.', 'event') },
    ]
  },
  {
    id: 'newcomer',
    title: 'NOUVEAU SURVIVANT',
    desc: 'Quelqu\'un frappe frénétiquement. Ouvrir la porte ?',
    choices: [
      { text: 'Accueillir (nouvelle bouche à nourrir)', effect: s => {
        const names = ['VEGA','KIRA','BLAZE','NOVA','REX','LUNA']
        const icons = ['🧔','👱','🧕','👦','👧','🧓']
        const n = names[Math.floor(Math.random()*names.length)]
        const i = icons[Math.floor(Math.random()*icons.length)]
        s.survivors.push({ id:'s'+Date.now(), name:n, icon:i, hp:Math.floor(Math.random()*40+50), maxHp:100, strength:Math.floor(Math.random()*6+4), intelligence:Math.floor(Math.random()*6+4), agility:Math.floor(Math.random()*6+4), room:null, mood:70 })
        addLog(s, n+' rejoint le bunker !', 'good')
      }},
      { text: 'Refuser (trop risqué)', effect: s => addLog(s, 'La porte reste fermée.', 'event') },
    ]
  },
]

function rnd(arr) { return arr[Math.floor(Math.random()*arr.length)] }
function addLog(s, msg, type) { s.logs = [{ msg, type, t: s.tick }, ...s.logs.slice(0, 49)] }

export function shouldTriggerEvent(state) {
  return state.eventCooldown === 0 && state.tick > 100 && Math.random() < 0.003
}

export function applyEventChoice(state, event, choiceIndex) {
  const s = JSON.parse(JSON.stringify(state))
  const ev = EVENTS.find(e => e.id === event.id)
  if (ev) ev.choices[choiceIndex].effect(s)
  s.pendingEvent = null
  s.eventCooldown = 300
  return s
}