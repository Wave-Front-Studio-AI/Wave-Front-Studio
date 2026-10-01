// The 3D funnel on the home page: four faceted glass tiers (get found, win
// the visit, get the enquiry, answer it first). Dollar bills flutter in at the
// top, fall through every tier and settle in a pile under the spout; none
// leave the funnel. The bill is a simple cartoon, nothing like real currency.
//
// Scrolling drives a camera move, one shot per step: a high wide shot, a
// swing round and down, a low side angle, then down by the spout looking at
// the pile. The funnel itself never turns. The tier for the current step comes
// forward (solid colour, a glow, a thicker rim, a little larger) while the
// others fall back to pale outlines.
//
// Loaded on demand by FunnelStory.jsx, so three.js never touches the first
// screen. Frames run only while the section is on screen.
import {
  CanvasTexture,
  CircleGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  EdgesGeometry,
  Group,
  HemisphereLight,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  SRGBColorSpace,
  Scene,
  TorusGeometry,
  WebGLRenderer,
} from 'three'

// Tiers top to bottom, in the brand blues; the last is the accent teal.
const TIERS = [
  { rTop: 3.1, rBot: 2.45, h: 1.25, color: '#4284cb' },
  { rTop: 2.3, rBot: 1.75, h: 1.15, color: '#2f6aa8' },
  { rTop: 1.62, rBot: 1.12, h: 1.05, color: '#143a5c' },
  { rTop: 1.02, rBot: 0.58, h: 0.95, color: '#2bb3c8' },
]
const GAP = 0.55
const SIDES = 12 // facets, so the glass catches the light as the camera moves
let y = 3.1
for (const tier of TIERS) {
  tier.yTop = y
  tier.yBot = y - tier.h
  y = tier.yBot - GAP
}

const FADED = new Color('#b9c8d6')
const lerp = (a, b, t) => a + (b - a) * t
const ease = (t) => t * t * (3 - 2 * t)

// The bills: how many, and the timing of one trip through the funnel.
const BILLS = 170
const CYCLE = 8
const POUR = 0.8
const PER_TIER = 1.1
const IN_GAP = 0.2
const DROP = 0.8
const PILE_Y = TIERS[3].yBot - 1.15

// One camera shot per step: where the camera sits and what it looks at.
// Scrolling glides between them; nothing moves on its own except a slight drift.
const SHOTS = [
  { pos: [0.6, 7.2, 12.2], look: [0, 1.9, 0] },
  { pos: [7.4, 3.4, 8.6], look: [0, 0.5, 0] },
  { pos: [-6.6, 0.9, 7.8], look: [0, -1, 0] },
  { pos: [2.2, -2.9, 6.4], look: [0, -3.4, 0] },
]

function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

// A cartoon dollar bill drawn on a canvas: green note, darker border, a "$"
// in an oval and in each corner. Deliberately unlike any real banknote.
function billTexture() {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 112
  const g = c.getContext('2d')
  g.fillStyle = '#86b97a'
  g.fillRect(0, 0, 256, 112)
  g.strokeStyle = '#3f6e3c'
  g.lineWidth = 6
  g.strokeRect(6, 6, 244, 100)
  g.lineWidth = 2
  g.strokeRect(14, 14, 228, 84)
  g.fillStyle = '#a9d39b'
  g.beginPath()
  g.ellipse(128, 56, 34, 34, 0, 0, Math.PI * 2)
  g.fill()
  g.stroke()
  g.fillStyle = '#2f5a2c'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.font = 'bold 46px Georgia, serif'
  g.fillText('$', 128, 58)
  g.font = 'bold 20px Georgia, serif'
  for (const [x, yy] of [[32, 30], [224, 30], [32, 84], [224, 84]]) g.fillText('$', x, yy)
  const texture = new CanvasTexture(c)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

export function createFunnelScene(canvas) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
  renderer.setClearColor(0x000000, 0)

  const scene = new Scene()
  const camera = new PerspectiveCamera(34, 1, 0.1, 100)
  scene.add(new HemisphereLight(0xffffff, 0xb8cbe0, 1.5))
  const sun = new DirectionalLight(0xffffff, 1.6)
  sun.position.set(5, 9, 4)
  scene.add(sun)

  const funnel = new Group()
  scene.add(funnel)

  // Each tier: a faceted glass cone, its facet edges, and a rim at the top.
  // Everything for a tier sits in one group so it can scale as a unit.
  const tiers = TIERS.map((tier) => {
    const tint = new Color(tier.color)
    const group = new Group()
    group.position.y = (tier.yTop + tier.yBot) / 2
    funnel.add(group)

    const shape = new CylinderGeometry(tier.rTop, tier.rBot, tier.h, SIDES, 1, true)
    const glass = new MeshStandardMaterial({
      color: tint.clone(), transparent: true, opacity: 0.12, roughness: 0.3, metalness: 0.05,
      side: DoubleSide, depthWrite: false, flatShading: true, emissive: tint.clone(), emissiveIntensity: 0,
    })
    group.add(new Mesh(shape, glass))

    const edgeMaterial = new LineBasicMaterial({ color: FADED.clone(), transparent: true, opacity: 0.9 })
    group.add(new LineSegments(new EdgesGeometry(shape), edgeMaterial))

    const rimMaterial = new MeshStandardMaterial({ color: FADED.clone(), roughness: 0.4, emissive: tint.clone(), emissiveIntensity: 0 })
    const rim = new Mesh(new TorusGeometry(tier.rTop, 0.05, 10, 96), rimMaterial)
    rim.rotation.x = Math.PI / 2
    rim.position.y = tier.h / 2
    group.add(rim)

    return { group, glass, edgeMaterial, rimMaterial, rim, tint, on: 0 }
  })

  // A soft shadow where the kept bills pile up.
  const shadow = new Mesh(new CircleGeometry(1.3, 48), new MeshBasicMaterial({ color: '#0d1b2a', transparent: true, opacity: 0.08, depthWrite: false }))
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = PILE_Y - 0.02
  scene.add(shadow)

  const bills = new InstancedMesh(
    new PlaneGeometry(0.46, 0.2),
    new MeshStandardMaterial({ map: billTexture(), side: DoubleSide, roughness: 0.75 }),
    BILLS,
  )
  bills.frustumCulled = false
  scene.add(bills)

  const random = seeded(20261001)
  const data = Array.from({ length: BILLS }, () => {
    const restAngle = random() * Math.PI * 2
    const restRadius = Math.sqrt(random()) * 0.95
    return {
      offset: random() * CYCLE,
      angle: random() * Math.PI * 2,
      spin: (random() - 0.5) * 2.4,
      depth: 0.25 + random() * 0.55,
      phase: random() * Math.PI * 2,
      flutter: 2 + random() * 2,
      rest: [Math.cos(restAngle) * restRadius, PILE_Y + random() * 0.08, Math.sin(restAngle) * restRadius],
      restTurn: random() * Math.PI,
    }
  })
  const dummy = new Object3D()

  // Where a bill is inside tier k at fraction s of the way down.
  const inside = (b, k, s) => {
    const tier = TIERS[k]
    const r = lerp(tier.rTop, tier.rBot, s) * b.depth
    const a = b.angle + b.spin * (k + s)
    return [Math.cos(a) * r, lerp(tier.yTop, tier.yBot, s), Math.sin(a) * r]
  }

  function placeBill(b, age) {
    const tierStart = (k) => POUR + k * (PER_TIER + IN_GAP)
    let pos = null
    let scale = 1
    let settled = false

    if (age < POUR) {
      const [x, , z] = inside(b, 0, 0)
      pos = [x * 0.5, lerp(TIERS[0].yTop + 2.4, TIERS[0].yTop, ease(age / POUR)), z * 0.5]
    } else {
      for (let k = 0; k < TIERS.length && !pos; k++) {
        const start = tierStart(k)
        const end = start + PER_TIER
        if (age < end) {
          pos = inside(b, k, ease((age - start) / PER_TIER))
        } else if (k < TIERS.length - 1 && age < end + IN_GAP) {
          // Straight down through the gap into the next tier.
          const at = inside(b, k, 1)
          const next = inside(b, k + 1, 0)
          const s = (age - end) / IN_GAP
          pos = [lerp(at[0], next[0], s), lerp(at[1], next[1], s), lerp(at[2], next[2], s)]
        }
      }
      if (!pos) {
        // Out of the spout: float down and settle on the pile.
        const t = age - tierStart(TIERS.length - 1) - PER_TIER
        const from = inside(b, TIERS.length - 1, 1)
        if (t < DROP) {
          const s = ease(t / DROP)
          pos = [lerp(from[0], b.rest[0], s), lerp(from[1], b.rest[1], s), lerp(from[2], b.rest[2], s)]
        } else {
          pos = b.rest
          settled = true
          const left = CYCLE - age
          if (left < 0.6) scale = Math.max(0, left / 0.6)
        }
      }
    }

    dummy.position.set(pos[0], pos[1], pos[2])
    if (settled) {
      dummy.rotation.set(-Math.PI / 2, 0, b.restTurn)
    } else {
      // Bills flutter as they fall: a rocking tilt and a slow turn.
      const f = b.flutter
      dummy.rotation.set(Math.sin(age * f + b.phase) * 0.9, age * 1.3 + b.phase, Math.cos(age * f * 0.8 + b.phase) * 0.6)
    }
    dummy.scale.setScalar(scale)
    dummy.updateMatrix()
  }

  function updateBills() {
    for (let i = 0; i < BILLS; i++) {
      const b = data[i]
      placeBill(b, (clock + b.offset) % CYCLE)
      bills.setMatrixAt(i, dummy.matrix)
    }
    bills.instanceMatrix.needsUpdate = true
  }

  function resize() {
    const box = canvas.getBoundingClientRect()
    const width = Math.max(1, Math.round(box.width))
    const height = Math.max(1, Math.round(box.height))
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  let target = 0
  let eased = 0
  let focus = 0
  function setProgress(value) {
    target = Math.min(1, Math.max(0, value))
    focus = Math.min(TIERS.length - 1, Math.floor(target * TIERS.length))
  }

  // Bring a tier forward by t (0 = faded outline, 1 = in focus).
  function style(tier, t) {
    tier.glass.opacity = lerp(0.1, 0.82, t)
    tier.glass.emissiveIntensity = lerp(0, 0.28, t)
    tier.edgeMaterial.color.copy(FADED).lerp(tier.tint, Math.min(1, t * 1.4))
    tier.edgeMaterial.opacity = lerp(0.55, 1, t)
    tier.rimMaterial.color.copy(FADED).lerp(tier.tint, t)
    tier.rimMaterial.emissiveIntensity = lerp(0, 0.6, t)
    tier.rim.scale.z = lerp(1, 2.4, t) // a thicker tube when in focus
    tier.group.scale.setScalar(lerp(1, 1.12, t))
  }

  let running = false
  let frame = 0
  let last = 0
  let clock = 0
  function draw() {
    eased += (target - eased) * 0.06
    // Glide between the shots as the visitor scrolls, plus a slight drift so
    // the frame never sits dead still. Each shot lands at the middle of its
    // step's stretch of scroll, where that step's copy is fully in view.
    const t = Math.min(SHOTS.length - 1, Math.max(0, eased * TIERS.length - 0.5))
    const i = Math.min(SHOTS.length - 2, Math.floor(t))
    const f = ease(t - i)
    const from = SHOTS[i]
    const to = SHOTS[i + 1]
    camera.position.set(
      lerp(from.pos[0], to.pos[0], f) + Math.sin(clock * 0.5) * 0.15,
      lerp(from.pos[1], to.pos[1], f) + Math.sin(clock * 0.37) * 0.1,
      lerp(from.pos[2], to.pos[2], f),
    )
    camera.lookAt(lerp(from.look[0], to.look[0], f), lerp(from.look[1], to.look[1], f), lerp(from.look[2], to.look[2], f))

    tiers.forEach((tier, k) => {
      tier.on += ((k === focus ? 1 : 0) - tier.on) * 0.12
      style(tier, tier.on)
    })
    updateBills()
    renderer.render(scene, camera)
  }

  function loop(now) {
    if (!running) return
    frame = requestAnimationFrame(loop)
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0)
    last = now
    clock += dt
    draw()
  }

  function setActive(on) {
    if (on === running) return
    running = on
    last = 0
    if (on) frame = requestAnimationFrame(loop)
    else cancelAnimationFrame(frame)
  }

  function dispose() {
    setActive(false)
    scene.traverse((node) => {
      node.geometry?.dispose()
      node.material?.map?.dispose()
      node.material?.dispose()
    })
    bills.dispose()
    renderer.dispose()
    // Hand the GL context back now rather than whenever the canvas is
    // collected; browsers cap how many a page may hold at once.
    renderer.forceContextLoss()
  }

  resize()
  setProgress(0)
  tiers[0].on = 1
  draw()

  return { resize, setProgress, setActive, dispose }
}
