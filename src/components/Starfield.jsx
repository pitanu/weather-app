import { useEffect, useRef } from 'react'

const LAYERS = [
  { count: 100, radius: [0.3, 0.8], speed: 0.4 },
  { count: 60, radius: [0.6, 1.2], speed: 0.7 },
  { count: 40, radius: [1.0, 1.8], speed: 1.0 },
]

function createStars(width, height) {
  return LAYERS.flatMap((layer) => Array.from({ length: layer.count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: layer.radius[0] + Math.random() * (layer.radius[1] - layer.radius[0]),
    alpha: Math.random(),
    dx: (Math.random() - 0.5) * 0.05 * layer.speed,
    dy: (Math.random() - 0.5) * 0.05 * layer.speed,
    dAlpha: (Math.random() - 0.5) * 0.02,
  })))
}

function createMeteor(width, height) {
  const fromLeft = Math.random() < 0.5
  const speed = 6 + Math.random() * 5
  const angle = (Math.PI / 180) * (18 + Math.random() * 14)
  return {
    x: fromLeft ? Math.random() * width * 0.5 : width * 0.5 + Math.random() * width * 0.5,
    y: Math.random() * height * 0.35,
    vx: Math.cos(angle) * speed * (fromLeft ? 1 : -1),
    vy: Math.sin(angle) * speed,
    life: 0,
    maxLife: 60 + Math.random() * 40,
  }
}

export default function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return undefined
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let animationFrameId

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      width = window.innerWidth; height = window.innerHeight
      canvas.width = width * dpr; canvas.height = height * dpr
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resizeCanvas()
    const stars = createStars(width, height)
    const meteors = []
    let nextMeteorAt = performance.now() + 2500 + Math.random() * 6500
    const drawStar = (star) => { ctx.beginPath(); ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI); ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`; ctx.fill() }
    const drawMeteor = (meteor) => {
      const fade = Math.sin(Math.min(meteor.life / meteor.maxLife, 1) * Math.PI)
      const tailX = meteor.x - meteor.vx * 12; const tailY = meteor.y - meteor.vy * 12
      const gradient = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY)
      gradient.addColorStop(0, `rgba(255, 255, 255, ${0.9 * fade})`); gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.strokeStyle = gradient; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(meteor.x, meteor.y); ctx.lineTo(tailX, tailY); ctx.stroke()
    }
    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height)
      for (const star of stars) {
        star.x += star.dx; star.y += star.dy; star.alpha += star.dAlpha
        if (star.x < 0 || star.x > width) star.dx *= -1
        if (star.y < 0 || star.y > height) star.dy *= -1
        if (star.alpha < 0.1 || star.alpha > 1) star.dAlpha *= -1
        drawStar(star)
      }
      const now = performance.now()
      if (now >= nextMeteorAt && meteors.length < 2) { meteors.push(createMeteor(width, height)); nextMeteorAt = now + 2500 + Math.random() * 6500 }
      for (let i = meteors.length - 1; i >= 0; i -= 1) {
        const meteor = meteors[i]; meteor.x += meteor.vx; meteor.y += meteor.vy; meteor.life += 1; drawMeteor(meteor)
        if (meteor.life > meteor.maxLife || meteor.y > height + 40) meteors.splice(i, 1)
      }
    }
    const animate = () => { drawFrame(); animationFrameId = requestAnimationFrame(animate) }
    if (reducedMotion) stars.forEach(drawStar); else animate()
    const handleResize = () => {
      const previousWidth = width; const previousHeight = height; resizeCanvas()
      stars.forEach((star) => { if (previousWidth) star.x = (star.x / previousWidth) * width; if (previousHeight) star.y = (star.y / previousHeight) * height })
      meteors.length = 0
      if (reducedMotion) { ctx.clearRect(0, 0, width, height); stars.forEach(drawStar) }
    }
    window.addEventListener('resize', handleResize)
    return () => { window.removeEventListener('resize', handleResize); cancelAnimationFrame(animationFrameId) }
  }, [])

  return <canvas ref={canvasRef} className="starfield-canvas" aria-hidden="true" />
}
