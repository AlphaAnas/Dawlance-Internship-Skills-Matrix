"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, User, ArrowRight } from "lucide-react"
import TextField from "../components/TextField"
import Button from "../components/Button"
import { useTheme } from "../components/ThemeProvider"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { isDark } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simple authentication - accept any email/password
    setTimeout(() => {
      setIsLoading(false)
      router.push("/department-overview")
    }, 1000)
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`max-w-md w-full space-y-8 p-8 rounded-2xl shadow-2xl backdrop-blur-sm ${
          isDark ? "bg-gray-800/80 border border-gray-700/50" : "bg-white/80 border border-white/50"
        }`}
      >
        {/* Logo and Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`mx-auto h-16 w-16 rounded-xl flex items-center justify-center ${
              isDark ? "bg-gradient-to-br from-blue-500 to-purple-600" : "bg-gradient-to-br from-blue-600 to-purple-700"
            } shadow-lg`}
          >
            <User className="h-8 w-8 text-white" />
          </motion.div>
          <h2
            className={`mt-6 text-3xl font-bold ${
              isDark ? "bg-gradient-to-r from-blue-400 to-purple-400" : "bg-gradient-to-r from-blue-600 to-purple-600"
            } bg-clip-text text-transparent`}
          >
            Welcome Back
          </h2>
          <p className={`mt-2 text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Sign in to access your skills portal
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <TextField
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="relative"
            >
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                className={`absolute right-3 top-9 ${
                  isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
                } transition-colors`}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </motion.button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full group relative overflow-hidden"
              disabled={isLoading}
            >
              <motion.div
                className="flex items-center justify-center"
                whileHover={{ x: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <span>Sign In</span>
                    <motion.div className="ml-2" whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </>
                )}
              </motion.div>
            </Button>
          </motion.div>
        </motion.form>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="text-center"
        >
          <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Enter any email and password to continue
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
