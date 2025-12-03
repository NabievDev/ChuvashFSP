import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import logoImage from '@assets/лого_1764723945323.png'

export default function LoadingScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onComplete?.()
      }, 300)
    }, 1000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-dark-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative flex flex-col items-center">
            <motion.div
              className="relative"
              initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
              animate={{ 
                scale: [0.5, 1.1, 1],
                opacity: 1,
                rotate: 0
              }}
              transition={{ 
                duration: 0.6,
                times: [0, 0.7, 1],
                ease: "easeOut"
              }}
            >
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(249,115,22,0.4) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 0.8,
                  repeat: 1,
                  ease: "easeInOut"
                }}
              />
              
              <motion.img
                src={logoImage}
                alt="ФСП Чувашии"
                className="w-24 h-24 md:w-32 md:h-32 object-contain relative z-10"
                animate={{
                  filter: [
                    'drop-shadow(0 0 10px rgba(249,115,22,0.5))',
                    'drop-shadow(0 0 30px rgba(249,115,22,0.8))',
                    'drop-shadow(0 0 10px rgba(249,115,22,0.5))',
                  ]
                }}
                transition={{
                  duration: 0.5,
                  repeat: 1,
                }}
              />

              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-yellow"
                  style={{
                    top: '50%',
                    left: '50%',
                  }}
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 0,
                    scale: 0 
                  }}
                  animate={{
                    x: Math.cos((i * 60 * Math.PI) / 180) * 80,
                    y: Math.sin((i * 60 * Math.PI) / 180) * 80,
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2 + i * 0.05,
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>

            <motion.div
              className="mt-8 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <motion.div
                className="flex items-center gap-2"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {['Ф', 'С', 'П'].map((letter, i) => (
                  <motion.span
                    key={i}
                    className="text-2xl md:text-3xl font-bold text-primary-500"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    {letter}
                  </motion.span>
                ))}
                <motion.span
                  className="text-lg md:text-xl text-dark-400 ml-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  Чувашия
                </motion.span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
