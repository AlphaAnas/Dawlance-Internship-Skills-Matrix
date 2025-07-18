"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function Component() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  
useEffect(() => {
  const timer = setInterval(() => {
    setProgress((prev) => {
      if (prev >= 100) {
        clearInterval(timer)
        setTimeout(() => setIsLoading(false), 1000) // ~10s after reaching 100%
        return 100
      }
      return prev + 4 // 100 / 4 = 25 steps
    })
  }, 120) // 25 steps * 120ms = 3000ms

  return () => clearInterval(timer)
}, [])


  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }} // Adjusted to 0.7s for smooth exit
        >
          {/* Background animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-orange-400 rounded-full opacity-30"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                transition={{
                  duration: Math.random() * 4 + 2, // Adjusted to 4+2 for ~5s cycle
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>

          <div className="relative flex flex-col items-center space-y-8">
            {/* Main Skills Matrix Sphere */}
            <motion.div
              className="relative"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 1.5, ease: "easeOut" }} // Adjusted to 1.5s
            >
              {/* Outer ring */}
              <motion.div
                className="w-48 h-48 rounded-full border-2 border-orange-400 border-dashed"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} // Reduced to 4s
              />

              {/* Inner sphere */}
              <motion.div
                className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 shadow-2xl flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }} // Adjusted delay and duration
              >
                {/* Dawlance logo on sphere */}
                <motion.div
                  className="relative w-24 h-12"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.6, type: "spring" }} // Adjusted delay and duration
                >
                  <Image
                    src="/dawlance-d.svg"
                    alt="Dawlance Logo"
              
                    fill
                    className="object-contain filter brightness-0 invert"
                  />
                </motion.div>

                {/* Glowing effect */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-white opacity-20"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }} // Adjusted to 1.5s
                />
              </motion.div>

              {/* Orbiting elements */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-orange-400 rounded-full"
                  style={{
                    top: "50%",
                    left: "50%",
                    transformOrigin: `${60 + i * 20}px 0px`,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2 + i * 0.5, // Adjusted to 2+i*0.5 (2–3.5s)
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                    delay: i * 0.3, // Adjusted delay
                  }}
                />
              ))}
            </motion.div>

            {/* Animated text */}
            <motion.div
              className="text-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }} // Adjusted delay and duration
            >
              <motion.h1
                className="text-4xl font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }} // Adjusted delay and duration
              >
                <motion.span
                  className="inline-block"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }} // Adjusted delay and duration
                >
                  Dawlance
                </motion.span>
                <motion.span
                  className="text-red-400 ml-2"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.5 }} // Adjusted delay and duration
                >
                  - Skills Matrix Portal
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-blue-200 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.5 }} // Adjusted delay and duration
              >
                Skills Matrix Portal
              </motion.p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              className="w-64 h-2 bg-slate-700 rounded-full overflow-hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2, duration: 0.4 }} // Adjusted delay and duration
            >
              <motion.div
                className="h-full bg-gradient-to-r from-orange-400 to-blue-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }} // Adjusted duration
              />
            </motion.div>

            {/* Progress percentage */}
            <motion.div
              className="text-white text-sm font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.4 }} // Adjusted delay and duration
            >
              {progress}%
            </motion.div>

            {/* Loading dots */}
            <motion.div
              className="flex space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.4, duration: 0.4 }} // Adjusted delay and duration
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-orange-400 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{
                    duration: 0.8, // Adjusted duration
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.15, // Adjusted delay
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}