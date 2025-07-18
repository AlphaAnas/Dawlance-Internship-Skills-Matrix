"use client"

import { motion } from "framer-motion"
import { useTheme } from "./ThemeProvider"

export default function AnimatedBackground() {
  const { isDark } = useTheme()

  // Floating particles configuration with more variety
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 80 + 15,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    duration: Math.random() * 25 + 8,
    delay: Math.random() * 6,
    colorType: i % 4, // 4 different color types
  }))

  // Geometric shapes configuration with enhanced variety
  const shapes = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 120 + 40,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    duration: Math.random() * 18 + 6,
    delay: Math.random() * 4,
    rotation: Math.random() * 360,
    shapeType: i % 3, // 3 different shape types
    colorType: i % 5, // 5 different color combinations
  }))

  // Enhanced color palettes
  const getParticleColor = (colorType: number) => {
    const colors = isDark ? [
      "bg-gradient-to-br from-orange-400/30 via-red-400/25 to-pink-400/20",
      "bg-gradient-to-br from-blue-400/30 via-cyan-400/25 to-teal-400/20",
      "bg-gradient-to-br from-purple-400/30 via-violet-400/25 to-indigo-400/20",
      "bg-gradient-to-br from-emerald-400/30 via-green-400/25 to-lime-400/20"
    ] : [
      "bg-gradient-to-br from-orange-300/40 via-red-300/35 to-pink-300/30",
      "bg-gradient-to-br from-blue-300/40 via-cyan-300/35 to-teal-300/30",
      "bg-gradient-to-br from-purple-300/40 via-violet-300/35 to-indigo-300/30",
      "bg-gradient-to-br from-emerald-300/40 via-green-300/35 to-lime-300/30"
    ]
    return colors[colorType]
  }

  const getShapeColor = (colorType: number) => {
    const colors = isDark ? [
      "border-orange-400/40 bg-gradient-to-br from-orange-500/15 to-red-500/10",
      "border-blue-400/40 bg-gradient-to-br from-blue-500/15 to-cyan-500/10",
      "border-purple-400/40 bg-gradient-to-br from-purple-500/15 to-violet-500/10",
      "border-emerald-400/40 bg-gradient-to-br from-emerald-500/15 to-green-500/10",
      "border-pink-400/40 bg-gradient-to-br from-pink-500/15 to-rose-500/10"
    ] : [
      "border-orange-400/50 bg-gradient-to-br from-orange-400/20 to-red-400/15",
      "border-blue-400/50 bg-gradient-to-br from-blue-400/20 to-cyan-400/15",
      "border-purple-400/50 bg-gradient-to-br from-purple-400/20 to-violet-400/15",
      "border-emerald-400/50 bg-gradient-to-br from-emerald-400/20 to-green-400/15",
      "border-pink-400/50 bg-gradient-to-br from-pink-400/20 to-rose-400/15"
    ]
    return colors[colorType]
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Enhanced animated gradient overlay */}
      <motion.div
        className={`absolute inset-0 ${
          isDark ? "opacity-40" : "opacity-25"
        }`}
        animate={{
          background: isDark
            ? [
                "linear-gradient(45deg, rgba(249, 115, 22, 0.3), rgba(59, 130, 246, 0.25), rgba(168, 85, 247, 0.2), rgba(34, 197, 94, 0.15))",
                "linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(168, 85, 247, 0.25), rgba(34, 197, 94, 0.2), rgba(249, 115, 22, 0.15))",
                "linear-gradient(225deg, rgba(168, 85, 247, 0.3), rgba(34, 197, 94, 0.25), rgba(249, 115, 22, 0.2), rgba(59, 130, 246, 0.15))",
                "linear-gradient(315deg, rgba(34, 197, 94, 0.3), rgba(249, 115, 22, 0.25), rgba(59, 130, 246, 0.2), rgba(168, 85, 247, 0.15))",
              ]
            : [
                "linear-gradient(45deg, rgba(249, 115, 22, 0.2), rgba(59, 130, 246, 0.18), rgba(168, 85, 247, 0.15), rgba(34, 197, 94, 0.12))",
                "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(168, 85, 247, 0.18), rgba(34, 197, 94, 0.15), rgba(249, 115, 22, 0.12))",
                "linear-gradient(225deg, rgba(168, 85, 247, 0.2), rgba(34, 197, 94, 0.18), rgba(249, 115, 22, 0.15), rgba(59, 130, 246, 0.12))",
                "linear-gradient(315deg, rgba(34, 197, 94, 0.2), rgba(249, 115, 22, 0.18), rgba(59, 130, 246, 0.15), rgba(168, 85, 247, 0.12))",
              ],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Vibrant floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${getParticleColor(particle.colorType)} backdrop-blur-sm shadow-lg`}
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.initialX}%`,
            top: `${particle.initialY}%`,
          }}
          animate={{
            x: [0, 120, -80, 0],
            y: [0, -120, 80, 0],
            scale: [1, 1.4, 0.6, 1],
            opacity: [0.4, 0.8, 0.2, 0.4],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Enhanced geometric shapes */}
      {shapes.map((shape) => {
        const shapeStyle = shape.shapeType === 0 
          ? "50%" 
          : shape.shapeType === 1 
          ? "20px" 
          : "0px"
        
        return (
          <motion.div
            key={shape.id}
            className={`absolute border-2 ${getShapeColor(shape.colorType)} backdrop-blur-sm shadow-xl`}
            style={{
              width: shape.size,
              height: shape.size,
              left: `${shape.initialX}%`,
              top: `${shape.initialY}%`,
              borderRadius: shapeStyle,
            }}
            animate={{
              x: [0, -100, 80, 0],
              y: [0, 80, -60, 0],
              rotate: [shape.rotation, shape.rotation + 270, shape.rotation + 540],
              scale: [1, 1.3, 0.7, 1],
              borderRadius: shape.shapeType === 2 ? ["0px", "50%", "20px", "0px"] : shapeStyle,
            }}
            transition={{
              duration: shape.duration,
              delay: shape.delay,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        )
      })}

      {/* Enhanced wave patterns with more vibrant colors */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: isDark
            ? [
                `radial-gradient(circle at 20% 80%, rgba(249, 115, 22, 0.25) 0%, transparent 60%),
                 radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.25) 0%, transparent 60%),
                 radial-gradient(circle at 40% 40%, rgba(168, 85, 247, 0.2) 0%, transparent 60%),
                 radial-gradient(circle at 60% 80%, rgba(34, 197, 94, 0.15) 0%, transparent 60%)`,
                `radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.25) 0%, transparent 60%),
                 radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.25) 0%, transparent 60%),
                 radial-gradient(circle at 60% 60%, rgba(249, 115, 22, 0.2) 0%, transparent 60%),
                 radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 60%)`,
                `radial-gradient(circle at 60% 60%, rgba(34, 197, 94, 0.25) 0%, transparent 60%),
                 radial-gradient(circle at 40% 40%, rgba(249, 115, 22, 0.25) 0%, transparent 60%),
                 radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.2) 0%, transparent 60%),
                 radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 60%)`,
              ]
            : [
                `radial-gradient(circle at 20% 80%, rgba(249, 115, 22, 0.15) 0%, transparent 60%),
                 radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 60%),
                 radial-gradient(circle at 40% 40%, rgba(168, 85, 247, 0.12) 0%, transparent 60%),
                 radial-gradient(circle at 60% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 60%)`,
                `radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 60%),
                 radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.15) 0%, transparent 60%),
                 radial-gradient(circle at 60% 60%, rgba(249, 115, 22, 0.12) 0%, transparent 60%),
                 radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 60%)`,
                `radial-gradient(circle at 60% 60%, rgba(34, 197, 94, 0.15) 0%, transparent 60%),
                 radial-gradient(circle at 40% 40%, rgba(249, 115, 22, 0.15) 0%, transparent 60%),
                 radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.12) 0%, transparent 60%),
                 radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 60%)`,
              ],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Vibrant grid pattern with color transitions */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundImage: isDark
            ? [
                `linear-gradient(rgba(249, 115, 22, 0.2) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)`,
                `linear-gradient(rgba(168, 85, 247, 0.2) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(34, 197, 94, 0.2) 1px, transparent 1px)`,
                `linear-gradient(rgba(34, 197, 94, 0.2) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(249, 115, 22, 0.2) 1px, transparent 1px)`,
              ]
            : [
                `linear-gradient(rgba(249, 115, 22, 0.12) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(59, 130, 246, 0.12) 1px, transparent 1px)`,
                `linear-gradient(rgba(168, 85, 247, 0.12) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(34, 197, 94, 0.12) 1px, transparent 1px)`,
                `linear-gradient(rgba(34, 197, 94, 0.12) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(249, 115, 22, 0.12) 1px, transparent 1px)`,
              ],
          backgroundPosition: ["0px 0px", "80px 80px", "0px 0px"],
        }}
        style={{
          backgroundSize: "80px 80px",
          opacity: 0.3,
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Additional vibrant accent elements */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: isDark
            ? `conic-gradient(from 0deg at 10% 10%, rgba(249, 115, 22, 0.1), rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1), rgba(34, 197, 94, 0.1), rgba(249, 115, 22, 0.1)),
               conic-gradient(from 180deg at 90% 90%, rgba(168, 85, 247, 0.1), rgba(34, 197, 94, 0.1), rgba(249, 115, 22, 0.1), rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1))`
            : `conic-gradient(from 0deg at 10% 10%, rgba(249, 115, 22, 0.06), rgba(59, 130, 246, 0.06), rgba(168, 85, 247, 0.06), rgba(34, 197, 94, 0.06), rgba(249, 115, 22, 0.06)),
               conic-gradient(from 180deg at 90% 90%, rgba(168, 85, 247, 0.06), rgba(34, 197, 94, 0.06), rgba(249, 115, 22, 0.06), rgba(59, 130, 246, 0.06), rgba(168, 85, 247, 0.06))`,
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Pulsing accent spots */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`accent-${i}`}
          className="absolute rounded-full blur-xl"
          style={{
            width: 200 + Math.random() * 100,
            height: 200 + Math.random() * 100,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: isDark
              ? [
                  "radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%)",
                  "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
                  "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
                  "radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)",
                  "radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)",
                  "radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)",
                ][i]
              : [
                  "radial-gradient(circle, rgba(249, 115, 22, 0.08) 0%, transparent 70%)",
                  "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)",
                  "radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)",
                  "radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, transparent 70%)",
                  "radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)",
                  "radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)",
                ][i],
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.8,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
