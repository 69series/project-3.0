import { useEffect, useRef, useState } from 'react'
import PageShell from '../components/PageShell'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { createNoise3D, createNoise4D } from 'simplex-noise'

export default function Void() {
  return (
    <PageShell>
      {() => <VoidContent />}
    </PageShell>
  )
}

function VoidContent() {
  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [info, setInfo] = useState('Sphere (Click to morph)')
  const [colorScheme, setColorScheme] = useState('fire')
  const stateRef = useRef({})

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const CONFIG = {
      particleCount: 15000, shapeSize: 14, swarmDistanceFactor: 1.5,
      swirlFactor: 4.0, noiseFrequency: 0.1, noiseTimeScale: 0.04,
      noiseMaxStrength: 2.8, colorScheme: 'fire', morphDuration: 4000,
      particleSizeRange: [0.08, 0.25], starCount: 18000,
      bloomStrength: 0.6, bloomRadius: 0.3, bloomThreshold: 0.15,
      idleFlowStrength: 0.25, idleFlowSpeed: 0.08, idleRotationSpeed: 0.02,
      morphSizeFactor: 0.5, morphBrightnessFactor: 0.6
    }

    const COLOR_SCHEMES = {
      fire:    { startHue: 0,   endHue: 45,  saturation: 0.95, lightness: 0.6 },
      neon:    { startHue: 300, endHue: 180, saturation: 1.0,  lightness: 0.65 },
      nature:  { startHue: 90,  endHue: 160, saturation: 0.85, lightness: 0.55 },
      rainbow: { startHue: 0,   endHue: 360, saturation: 0.9,  lightness: 0.6 }
    }

    const tempVec = new THREE.Vector3()
    const sourceVec = new THREE.Vector3()
    const targetVec = new THREE.Vector3()
    const swarmVec = new THREE.Vector3()
    const noiseOffset = new THREE.Vector3()
    const flowVec = new THREE.Vector3()
    const bezPos = new THREE.Vector3()
    const swirlAxis = new THREE.Vector3()
    const currentVec = new THREE.Vector3()

    const noise3D = createNoise3D(() => Math.random())
    const noise4D = createNoise4D(() => Math.random())

    // ── Shape generators ──
    function generateSphere(count, size) {
      const points = new Float32Array(count * 3)
      const phi = Math.PI * (Math.sqrt(5) - 1)
      for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2
        const radius = Math.sqrt(1 - y * y)
        const theta = phi * i
        points[i*3] = Math.cos(theta) * radius * size
        points[i*3+1] = y * size
        points[i*3+2] = Math.sin(theta) * radius * size
      }
      return points
    }

    function generateCube(count, size) {
      const points = new Float32Array(count * 3)
      const h = size / 2
      for (let i = 0; i < count; i++) {
        const face = Math.floor(Math.random() * 6)
        const u = Math.random() * size - h, v = Math.random() * size - h
        switch(face) {
          case 0: points.set([h,u,v],i*3); break; case 1: points.set([-h,u,v],i*3); break
          case 2: points.set([u,h,v],i*3); break; case 3: points.set([u,-h,v],i*3); break
          case 4: points.set([u,v,h],i*3); break; case 5: points.set([u,v,-h],i*3); break
        }
      }
      return points
    }

    function generateTorus(count, size) {
      const points = new Float32Array(count * 3)
      const R = size * 0.7, r = size * 0.3
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2, phi = Math.random() * Math.PI * 2
        points[i*3]   = (R + r * Math.cos(phi)) * Math.cos(theta)
        points[i*3+1] = r * Math.sin(phi)
        points[i*3+2] = (R + r * Math.cos(phi)) * Math.sin(theta)
      }
      return points
    }

    function generateGalaxy(count, size) {
      const points = new Float32Array(count * 3)
      const arms = 4, armWidth = 0.6, bulgeFactor = 0.3
      for (let i = 0; i < count; i++) {
        const t = Math.pow(Math.random(), 1.5), radius = t * size
        const armIndex = Math.floor(Math.random() * arms)
        const armOffset = (armIndex / arms) * Math.PI * 2
        const rotationAmount = radius / size * 6, angle = armOffset + rotationAmount
        const spread = (Math.random() - 0.5) * armWidth * (1 - radius / size)
        const theta = angle + spread
        points[i*3]   = radius * Math.cos(theta)
        points[i*3+1] = (Math.random() - 0.5) * size * 0.1 * (1 - radius / size * bulgeFactor)
        points[i*3+2] = radius * Math.sin(theta)
      }
      return points
    }

    function generateWave(count, size) {
      const points = new Float32Array(count * 3)
      const waveScale = size * 0.4, frequency = 3
      for (let i = 0; i < count; i++) {
        const u = Math.random() * 2 - 1, v = Math.random() * 2 - 1
        const x = u * size, z = v * size
        const dist = Math.sqrt(u*u + v*v), angle = Math.atan2(v, u)
        points[i*3]   = x
        points[i*3+1] = Math.sin(dist * Math.PI * frequency) * Math.cos(angle * 2) * waveScale * (1 - dist)
        points[i*3+2] = z
      }
      return points
    }

    function generatePyramid(count, size) {
      const points = new Float32Array(count * 3)
      const halfBase = size / 2, height = size * 1.2
      const apex = new THREE.Vector3(0, height/2, 0)
      const bv = [
        new THREE.Vector3(-halfBase, -height/2, -halfBase),
        new THREE.Vector3( halfBase, -height/2, -halfBase),
        new THREE.Vector3( halfBase, -height/2,  halfBase),
        new THREE.Vector3(-halfBase, -height/2,  halfBase),
      ]
      const baseArea = size * size
      const sideFaceHeight = Math.sqrt(Math.pow(height,2) + Math.pow(halfBase,2))
      const sideFaceArea = 0.5 * size * sideFaceHeight
      const totalArea = baseArea + 4 * sideFaceArea
      const baseWeight = baseArea / totalArea
      const sideWeight = sideFaceArea / totalArea
      for (let i = 0; i < count; i++) {
        const r = Math.random(); let p = new THREE.Vector3(); let u, v
        if (r < baseWeight) {
          u = Math.random(); v = Math.random()
          p.lerpVectors(bv[0], bv[1], u)
          const p2 = new THREE.Vector3().lerpVectors(bv[3], bv[2], u)
          p.lerp(p2, v)
        } else {
          const fi = Math.floor((r - baseWeight) / sideWeight)
          const v1 = bv[fi]; const v2 = bv[(fi+1)%4]
          u = Math.random(); v = Math.random()
          if (u + v > 1) { u = 1-u; v = 1-v }
          p.addVectors(v1, tempVec.subVectors(v2, v1).multiplyScalar(u))
          p.add(tempVec.subVectors(apex, v1).multiplyScalar(v))
        }
        points.set([p.x, p.y, p.z], i*3)
      }
      return points
    }

    const SHAPES = [
      { name: 'Sphere',  generator: generateSphere  },
      { name: 'Cube',    generator: generateCube    },
      { name: 'Pyramid', generator: generatePyramid },
      { name: 'Torus',   generator: generateTorus   },
      { name: 'Galaxy',  generator: generateGalaxy  },
      { name: 'Wave',    generator: generateWave    },
    ]

    let currentShapeIndex = 0
    const morphState = { progress: 0.0 }
    let isMorphing = false
    let morphTimeline = null
    let isInitialized = false
    let particlesGeometry, particlesMaterial, particleSystem
    let currentPositions, sourcePositions, targetPositions, swarmPositions
    let particleSizes, particleOpacities, particleEffectStrengths

    // ── Scene setup ──
    const clock = new THREE.Clock()
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x000308, 0.03)

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 8, 28)
    camera.lookAt(scene.position)

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true; controls.dampingFactor = 0.05
    controls.minDistance = 5; controls.maxDistance = 80
    controls.autoRotate = true; controls.autoRotateSpeed = 0.3

    scene.add(new THREE.AmbientLight(0x404060))
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5)
    dirLight1.position.set(15, 20, 10); scene.add(dirLight1)
    const dirLight2 = new THREE.DirectionalLight(0x88aaff, 0.9)
    dirLight2.position.set(-15, -10, -15); scene.add(dirLight2)

    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      CONFIG.bloomStrength, CONFIG.bloomRadius, CONFIG.bloomThreshold
    )
    composer.addPass(bloomPass)

    function createStarTexture() {
      const size = 64; const c = document.createElement('canvas')
      c.width = size; c.height = size; const ctx = c.getContext('2d')
      const g = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2)
      g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.2, 'rgba(255,255,255,0.8)')
      g.addColorStop(0.5, 'rgba(255,255,255,0.3)'); g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size)
      return new THREE.CanvasTexture(c)
    }

    function createStarfield() {
      const starVertices = [], starSizes = [], starColors = []
      const starGeometry = new THREE.BufferGeometry()
      for (let i = 0; i < CONFIG.starCount; i++) {
        tempVec.set(THREE.MathUtils.randFloatSpread(400), THREE.MathUtils.randFloatSpread(400), THREE.MathUtils.randFloatSpread(400))
        if (tempVec.length() < 100) tempVec.setLength(100 + Math.random() * 300)
        starVertices.push(tempVec.x, tempVec.y, tempVec.z)
        starSizes.push(Math.random() * 0.15 + 0.05)
        const color = new THREE.Color()
        if (Math.random() < 0.1) { color.setHSL(Math.random(), 0.7, 0.65) }
        else { color.setHSL(0.6, Math.random() * 0.1, 0.8 + Math.random() * 0.2) }
        starColors.push(color.r, color.g, color.b)
      }
      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3))
      starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3))
      starGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1))
      const starMaterial = new THREE.ShaderMaterial({
        uniforms: { pointTexture: { value: createStarTexture() } },
        vertexShader: `attribute float size; varying vec3 vColor; void main() { vColor = color; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_PointSize = size * (400.0 / -mvPosition.z); gl_Position = projectionMatrix * mvPosition; }`,
        fragmentShader: `uniform sampler2D pointTexture; varying vec3 vColor; void main() { float alpha = texture2D(pointTexture, gl_PointCoord).a; if (alpha < 0.1) discard; gl_FragColor = vec4(vColor, alpha * 0.9); }`,
        blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, vertexColors: true
      })
      scene.add(new THREE.Points(starGeometry, starMaterial))
    }

    function updateColorArray(colors, positionsArray) {
      const colorScheme = COLOR_SCHEMES[CONFIG.colorScheme]
      const center = new THREE.Vector3(0, 0, 0)
      const maxRadius = CONFIG.shapeSize * 1.1
      for (let i = 0; i < CONFIG.particleCount; i++) {
        const i3 = i * 3
        tempVec.fromArray(positionsArray, i3)
        const dist = tempVec.distanceTo(center)
        let hue
        if (CONFIG.colorScheme === 'rainbow') {
          const normX = (tempVec.x / maxRadius + 1) / 2
          const normY = (tempVec.y / maxRadius + 1) / 2
          const normZ = (tempVec.z / maxRadius + 1) / 2
          hue = (normX * 120 + normY * 120 + normZ * 120) % 360
        } else {
          hue = THREE.MathUtils.mapLinear(dist, 0, maxRadius, colorScheme.startHue, colorScheme.endHue)
        }
        const noiseValue = (noise3D(tempVec.x * 0.2, tempVec.y * 0.2, tempVec.z * 0.2) + 1) * 0.5
        const saturation = THREE.MathUtils.clamp(colorScheme.saturation * (0.9 + noiseValue * 0.2), 0, 1)
        const lightness = THREE.MathUtils.clamp(colorScheme.lightness * (0.85 + noiseValue * 0.3), 0.1, 0.9)
        const color = new THREE.Color().setHSL(hue / 360, saturation, lightness)
        color.toArray(colors, i3)
      }
    }

    function updateColors() {
      const colors = particlesGeometry.attributes.color.array
      updateColorArray(colors, particlesGeometry.attributes.position.array)
      particlesGeometry.attributes.color.needsUpdate = true
    }

    function setupParticleSystem() {
      targetPositions = SHAPES.map(s => s.generator(CONFIG.particleCount, CONFIG.shapeSize))
      particlesGeometry = new THREE.BufferGeometry()
      currentPositions = new Float32Array(targetPositions[0])
      sourcePositions = new Float32Array(targetPositions[0])
      swarmPositions = new Float32Array(CONFIG.particleCount * 3)
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3))
      particleSizes = new Float32Array(CONFIG.particleCount)
      particleOpacities = new Float32Array(CONFIG.particleCount)
      particleEffectStrengths = new Float32Array(CONFIG.particleCount)
      for (let i = 0; i < CONFIG.particleCount; i++) {
        particleSizes[i] = THREE.MathUtils.randFloat(CONFIG.particleSizeRange[0], CONFIG.particleSizeRange[1])
        particleOpacities[i] = 1.0
        particleEffectStrengths[i] = 0.0
      }
      particlesGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1))
      particlesGeometry.setAttribute('opacity', new THREE.BufferAttribute(particleOpacities, 1))
      particlesGeometry.setAttribute('aEffectStrength', new THREE.BufferAttribute(particleEffectStrengths, 1))
      const colors = new Float32Array(CONFIG.particleCount * 3)
      updateColorArray(colors, currentPositions)
      particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      particlesMaterial = new THREE.ShaderMaterial({
        uniforms: { pointTexture: { value: createStarTexture() } },
        vertexShader: `
          attribute float size; attribute float opacity; attribute float aEffectStrength;
          varying vec3 vColor; varying float vOpacity; varying float vEffectStrength;
          void main() {
            vColor = color; vOpacity = opacity; vEffectStrength = aEffectStrength;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            float sizeScale = 1.0 - vEffectStrength * 0.50;
            gl_PointSize = size * sizeScale * (400.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }`,
        fragmentShader: `
          uniform sampler2D pointTexture;
          varying vec3 vColor; varying float vOpacity; varying float vEffectStrength;
          void main() {
            float alpha = texture2D(pointTexture, gl_PointCoord).a;
            if (alpha < 0.05) discard;
            vec3 finalColor = vColor * (1.0 + vEffectStrength * 0.60);
            gl_FragColor = vec4(finalColor, alpha * vOpacity);
          }`,
        blending: THREE.AdditiveBlending, depthTest: true, depthWrite: false,
        transparent: true, vertexColors: true
      })
      particleSystem = new THREE.Points(particlesGeometry, particlesMaterial)
      scene.add(particleSystem)
    }

    function triggerMorph() {
      if (isMorphing) return
      isMorphing = true; controls.autoRotate = false
      setInfo('Morphing...')
      sourcePositions.set(currentPositions)
      const nextShapeIndex = (currentShapeIndex + 1) % SHAPES.length
      const nextTargetPositions = targetPositions[nextShapeIndex]
      const centerOffsetAmount = CONFIG.shapeSize * CONFIG.swarmDistanceFactor
      for (let i = 0; i < CONFIG.particleCount; i++) {
        const i3 = i * 3
        sourceVec.fromArray(sourcePositions, i3); targetVec.fromArray(nextTargetPositions, i3)
        swarmVec.lerpVectors(sourceVec, targetVec, 0.5)
        const offsetDir = tempVec.set(
          noise3D(i * 0.05, 10, 10), noise3D(20, i * 0.05, 20), noise3D(30, 30, i * 0.05)
        ).normalize()
        const distFactor = sourceVec.distanceTo(targetVec) * 0.1 + centerOffsetAmount
        swarmVec.addScaledVector(offsetDir, distFactor * (0.5 + Math.random() * 0.8))
        swarmPositions[i3] = swarmVec.x; swarmPositions[i3+1] = swarmVec.y; swarmPositions[i3+2] = swarmVec.z
      }
      currentShapeIndex = nextShapeIndex
      morphState.progress = 0
if (morphTimeline) cancelAnimationFrame(morphTimeline)
const startTime = performance.now()
const duration = CONFIG.morphDuration

function tweenMorph() {
  const elapsed = performance.now() - startTime
  const t = Math.min(elapsed / duration, 1)
  morphState.progress = t < 0.5 ? 2*t*t : -1+(4-2*t)*t
  if (t < 1) {
    morphTimeline = requestAnimationFrame(tweenMorph)
  } else {
    morphState.progress = 1
    setInfo(`${SHAPES[currentShapeIndex].name} (Click to morph)`)
    currentPositions.set(targetPositions[currentShapeIndex])
    particlesGeometry.attributes.position.needsUpdate = true
    particleEffectStrengths.fill(0.0)
    particlesGeometry.attributes.aEffectStrength.needsUpdate = true
    sourcePositions.set(targetPositions[currentShapeIndex])
    updateColors()
    isMorphing = false
    controls.autoRotate = true
  }
}
morphTimeline = requestAnimationFrame(tweenMorph)
    
    }

    function updateMorphAnimation(positions, effectStrengths, elapsedTime, deltaTime) {
      const t = morphState.progress
      const targets = targetPositions[currentShapeIndex]
      const effectStrength = Math.sin(t * Math.PI)
      const currentSwirl = effectStrength * CONFIG.swirlFactor * deltaTime * 50
      const currentNoise = effectStrength * CONFIG.noiseMaxStrength
      for (let i = 0; i < CONFIG.particleCount; i++) {
        const i3 = i * 3
        sourceVec.fromArray(sourcePositions, i3)
        swarmVec.fromArray(swarmPositions, i3)
        targetVec.fromArray(targets, i3)
        const t_inv = 1.0 - t, t_inv_sq = t_inv * t_inv, t_sq = t * t
        bezPos.copy(sourceVec).multiplyScalar(t_inv_sq)
        bezPos.addScaledVector(swarmVec, 2.0 * t_inv * t)
        bezPos.addScaledVector(targetVec, t_sq)
        if (currentSwirl > 0.01) {
          tempVec.subVectors(bezPos, sourceVec)
          swirlAxis.set(noise3D(i*0.02, elapsedTime*0.1, 0), noise3D(0, i*0.02, elapsedTime*0.1+5), noise3D(elapsedTime*0.1+10, 0, i*0.02)).normalize()
          tempVec.applyAxisAngle(swirlAxis, currentSwirl * (0.5 + Math.random() * 0.5))
          bezPos.copy(sourceVec).add(tempVec)
        }
        if (currentNoise > 0.01) {
          const noiseTime = elapsedTime * CONFIG.noiseTimeScale
          noiseOffset.set(
            noise4D(bezPos.x*CONFIG.noiseFrequency, bezPos.y*CONFIG.noiseFrequency, bezPos.z*CONFIG.noiseFrequency, noiseTime),
            noise4D(bezPos.x*CONFIG.noiseFrequency+100, bezPos.y*CONFIG.noiseFrequency+100, bezPos.z*CONFIG.noiseFrequency+100, noiseTime),
            noise4D(bezPos.x*CONFIG.noiseFrequency+200, bezPos.y*CONFIG.noiseFrequency+200, bezPos.z*CONFIG.noiseFrequency+200, noiseTime)
          )
          bezPos.addScaledVector(noiseOffset, currentNoise)
        }
        positions[i3] = bezPos.x; positions[i3+1] = bezPos.y; positions[i3+2] = bezPos.z
        effectStrengths[i] = effectStrength
      }
      particlesGeometry.attributes.aEffectStrength.needsUpdate = true
    }

    function updateIdleAnimation(positions, effectStrengths, elapsedTime) {
      const breathScale = 1.0 + Math.sin(elapsedTime * 0.5) * 0.015
      const timeScaled = elapsedTime * CONFIG.idleFlowSpeed
      const freq = 0.1
      let needsReset = false
      for (let i = 0; i < CONFIG.particleCount; i++) {
        const i3 = i * 3
        sourceVec.fromArray(sourcePositions, i3)
        tempVec.copy(sourceVec).multiplyScalar(breathScale)
        flowVec.set(
          noise4D(tempVec.x*freq, tempVec.y*freq, tempVec.z*freq, timeScaled),
          noise4D(tempVec.x*freq+10, tempVec.y*freq+10, tempVec.z*freq+10, timeScaled),
          noise4D(tempVec.x*freq+20, tempVec.y*freq+20, tempVec.z*freq+20, timeScaled)
        )
        tempVec.addScaledVector(flowVec, CONFIG.idleFlowStrength)
        currentVec.fromArray(positions, i3)
        currentVec.lerp(tempVec, 0.05)
        positions[i3] = currentVec.x; positions[i3+1] = currentVec.y; positions[i3+2] = currentVec.z
        if (effectStrengths[i] !== 0.0) { effectStrengths[i] = 0.0; needsReset = true }
      }
      if (needsReset) particlesGeometry.attributes.aEffectStrength.needsUpdate = true
    }

    // ── Init ──
    let prog = 0
    function updateProgress(inc) {
      prog += inc
      setProgress(Math.min(100, prog))
      if (prog >= 100) {
        setTimeout(() => setLoading(false), 800)
      }
    }

    updateProgress(10)
    createStarfield(); updateProgress(15)
    setupParticleSystem(); updateProgress(50)
    updateProgress(25)
    isInitialized = true

    // ── Store triggerMorph in ref for button access ──
    stateRef.current.triggerMorph = triggerMorph
    stateRef.current.updateColors = updateColors
    stateRef.current.CONFIG = CONFIG

    // ── Animate ──
    let animFrameId
    function animate() {
      animFrameId = requestAnimationFrame(animate)
      if (!isInitialized) return
      const elapsedTime = clock.getElapsedTime()
      const deltaTime = clock.getDelta()
      controls.update()
      const positions = particlesGeometry.attributes.position.array
      const effectStrengths = particlesGeometry.attributes.aEffectStrength.array
      if (isMorphing) { updateMorphAnimation(positions, effectStrengths, elapsedTime, deltaTime) }
      else { updateIdleAnimation(positions, effectStrengths, elapsedTime) }
      particlesGeometry.attributes.position.needsUpdate = true
      composer.render(deltaTime)
    }
    animate()

    // ── Events ──
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      composer.setSize(window.innerWidth, window.innerHeight)
    }
    const handleClick = (e) => {
      if (e.target.closest('#void-controls')) return
      triggerMorph()
    }
    window.addEventListener('resize', handleResize)
    canvas.addEventListener('click', handleClick)

    return () => {
      cancelAnimationFrame(animFrameId)
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('click', handleClick)
      renderer.dispose()
    }
  }, [])

  const handleColorChange = (scheme) => {
    setColorScheme(scheme)
    if (stateRef.current.CONFIG) {
      stateRef.current.CONFIG.colorScheme = scheme
      stateRef.current.updateColors?.()
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 999 }}>
      {/* Loading */}
      {loading && (
        <div style={{
          position: 'absolute', inset: 0, background: '#000',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, transition: 'opacity 0.6s'
        }}>
          <span style={{ color: 'white', fontFamily: 'Courier New', fontSize: 20, letterSpacing: 2, marginBottom: 16 }}>
            Initializing Particles...
          </span>
          <div style={{ width: 280, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #00a2ff, #00ffea)', transition: 'width 0.3s ease', borderRadius: 3 }} />
          </div>
        </div>
      )}

      {/* Info */}
      <div style={{ position: 'absolute', top: 15, width: '100%', textAlign: 'center', zIndex: 100, pointerEvents: 'none' }}>
        <div style={{
          display: 'inline-block', color: 'white', fontFamily: 'Courier New', fontSize: 14,
          padding: '10px 18px', background: 'rgba(25,30,50,0.35)', borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
          textShadow: '0 0 5px rgba(0,128,255,0.8)'
        }}>
          Shape: {info}
        </div>
      </div>

      {/* Controls */}
      <div id="void-controls" style={{
        position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, textAlign: 'center', background: 'rgba(25,30,50,0.4)',
        padding: '15px 25px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(12px)'
      }}>
        <button
          onClick={() => stateRef.current.triggerMorph?.()}
          style={{
            background: 'rgba(0,80,180,0.7)', color: 'white', border: '1px solid rgba(0,180,255,0.6)',
            borderRadius: 6, padding: '8px 15px', margin: '0 8px', cursor: 'pointer',
            fontFamily: 'Courier New', fontSize: 14
          }}
        >
          Change Shape
        </button>
        <div style={{ marginTop: 15, display: 'flex', justifyContent: 'center', gap: 12 }}>
          {[
            { scheme: 'fire',    bg: 'linear-gradient(to bottom right, #ff4500, #ffcc00)' },
            { scheme: 'neon',    bg: 'linear-gradient(to bottom right, #ff00ff, #00ffff)' },
            { scheme: 'nature',  bg: 'linear-gradient(to bottom right, #00ff00, #66ffcc)' },
            { scheme: 'rainbow', bg: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)' },
          ].map(({ scheme, bg }) => (
            <div
              key={scheme}
              onClick={() => handleColorChange(scheme)}
              style={{
                width: 24, height: 24, borderRadius: '50%', cursor: 'pointer',
                background: bg, transition: 'all 0.2s',
                border: colorScheme === scheme ? '2px solid white' : '2px solid rgba(255,255,255,0.2)',
                transform: colorScheme === scheme ? 'scale(1.18)' : 'scale(1)',
                boxShadow: colorScheme === scheme ? '0 0 10px rgba(255,255,255,0.7)' : 'none'
              }}
            />
          ))}
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}