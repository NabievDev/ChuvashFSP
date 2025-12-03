import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isClicking, setIsClicking] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [cursorColor, setCursorColor] = useState('rgba(249, 115, 22, 0.8)')

  const getContrastColor = useCallback((element) => {
    if (!element) return 'rgba(249, 115, 22, 0.8)'
    
    const computedStyle = window.getComputedStyle(element)
    const bgColor = computedStyle.backgroundColor
    
    if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
      return 'rgba(249, 115, 22, 0.8)'
    }
    
    const rgb = bgColor.match(/\d+/g)
    if (rgb) {
      const [r, g, b] = rgb.map(Number)
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      
      if (r > 200 && g > 100 && b < 100) {
        return 'rgba(30, 58, 138, 0.9)'
      }
      if (r > 200 && g > 150 && b < 100) {
        return 'rgba(30, 58, 138, 0.9)'
      }
      
      if (luminance < 0.5) {
        return 'rgba(251, 191, 36, 0.9)'
      }
    }
    
    return 'rgba(249, 115, 22, 0.8)'
  }, [])

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) return

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
      
      const element = document.elementFromPoint(e.clientX, e.clientY)
      setCursorColor(getContrastColor(element))
      
      const isInteractive = element?.closest('a, button, [role="button"], input, textarea, select, [tabindex]')
      setIsHovering(!!isInteractive)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)
    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [getContrastColor])

  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  if (isTouchDevice) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed pointer-events-none z-[9999] mix-blend-difference"
          style={{
            left: position.x,
            top: position.y,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: '-50%',
            y: '-50%'
          }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <motion.div
            className="relative flex items-center justify-center"
            animate={{
              scale: isClicking ? 0.7 : isHovering ? 1.5 : 1,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          >
            <motion.div
              className="absolute rounded-full border-2"
              style={{ 
                borderColor: cursorColor,
                width: 32,
                height: 32,
              }}
              animate={{
                scale: isClicking ? [1, 1.3, 1] : 1,
                borderWidth: isHovering ? 3 : 2,
              }}
              transition={{ 
                scale: { duration: 0.15 },
                borderWidth: { duration: 0.2 }
              }}
            />
            <motion.div
              className="absolute rounded-full"
              style={{ 
                backgroundColor: cursorColor,
                width: 6,
                height: 6,
              }}
              animate={{
                scale: isClicking ? 0 : isHovering ? 0 : 1,
                opacity: isHovering ? 0 : 1,
              }}
              transition={{ duration: 0.15 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
