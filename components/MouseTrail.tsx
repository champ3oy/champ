'use client'

import React, { useEffect, useRef } from 'react'

const MouseTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to viewport
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Trail points
    const points: Array<{ x: number; y: number; time: number }> = []
    const maxPoints = 15

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()

      // Add new point
      points.push({
        x: e.clientX,
        y: e.clientY,
        time: now
      })

      // Remove old points
      while (points.length > maxPoints) {
        points.shift()
      }
    }

    // Animation loop
    const animate = () => {
      // Clear with fade effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const now = Date.now()

      // Draw trail
      for (let i = 1; i < points.length; i++) {
        const point = points[i]
        const prevPoint = points[i - 1]

        // Calculate age and opacity
        const age = now - point.time
        const opacity = Math.max(0, 1 - age / 1200)

        if (opacity > 0) {
          ctx.strokeStyle = `rgba(0, 0, 0, ${opacity * 0.8})`
          ctx.lineWidth = Math.max(1, 3 * opacity)
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'

          ctx.beginPath()
          ctx.moveTo(prevPoint.x, prevPoint.y)
          ctx.lineTo(point.x, point.y)
          ctx.stroke()
        }
      }

      // Remove very old points
      while (points.length > 0 && now - points[0].time > 1500) {
        points.shift()
      }

      requestAnimationFrame(animate)
    }

    // Add event listener
    document.addEventListener('mousemove', handleMouseMove)

    // Start animation
    animate()

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        mixBlendMode: 'multiply',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh'
      }}
    />
  )
}

export default MouseTrail 