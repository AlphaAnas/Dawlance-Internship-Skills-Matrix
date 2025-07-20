"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Sun, Moon, LogOut, Users, Map, BarChart3 } from "lucide-react"
import { useTheme } from "./ThemeProvider"
import Button from "./Button"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { isDark, toggleTheme } = useTheme()

  const navigation = [
    { name: "Employees", href: "/employees", icon: Users },
    { name: "Skills Mapping", href: "/skills-mapping", icon: Map },
    { name: "Add a New Skills Matrix", href: "/skills_matrix_maker", icon: BarChart3 },
  ]

  const handleLogout = () => {
    router.push("/login")
  }

  const hideNavbar = pathname === "/login"

  // If it's the login page, return children without any wrapper
  if (pathname === "/login") {
    return <>{children}</>
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900"
          : "bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50"
      }`}
    >
      {!hideNavbar && (
        <nav
          className={`${
            isDark
              ? "bg-gray-800/80 border-gray-700/50 backdrop-blur-xl"
              : "bg-white/80 border-gray-200/50 backdrop-blur-xl"
          } border-b sticky top-0 z-40`}
        >
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-20">
              {/* Left: Logo and Title */}
              <Link href="/landing" className="flex items-center cursor-pointer">
                <div className="flex items-center hover:scale-105 transition-transform">
                  <div
                    className={`w-8 h-8 rounded-lg mr-3 flex items-center justify-center overflow-hidden border-2 ${
                      isDark ? "border-blue-500" : "border-blue-600"
                    }`}
                  >
                    <Image src="/dawlance-d.svg" alt="D" width={20} height={20} className="object-contain" />
                  </div>
                  <h1
                    className={`text-2xl font-bold ${
                      isDark
                        ? "bg-gradient-to-r from-blue-400 to-purple-400"
                        : "bg-gradient-to-r from-blue-600 to-purple-600"
                    } bg-clip-text text-transparent`}
                  >
                    Skills Portal
                  </h1>
                </div>
              </Link>

              {/* Center: Navigation */}
              <div className="hidden sm:flex space-x-4 absolute left-1/2 transform -translate-x-1/2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.name} href={item.href} prefetch={true} className="inline-block">
                      <div
                        className={`inline-flex items-center px-4 py-2 rounded-xl text-lg font-semibold transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                            : isDark
                            ? "text-gray-300 hover:text-white hover:bg-gray-700/50"
                            : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-2" />
                        {item.name}
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Right: Theme + Logout */}
              <div className="hidden sm:flex items-center space-x-3">
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-xl transition-all hover:scale-110 hover:rotate-180 ${
                    isDark
                      ? "text-gray-300 hover:text-white hover:bg-gray-700/50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                  }`}
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center bg-transparent"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>

              {/* Mobile: Menu toggle */}
              <div className="sm:hidden flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`p-2 rounded-xl transition-all hover:scale-110 ${
                    isDark
                      ? "text-gray-300 hover:text-white hover:bg-gray-700/50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                  }`}
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="sm:hidden"
              >
                <div
                  className={`pt-2 pb-3 space-y-1 ${
                    isDark ? "bg-gray-800/95 backdrop-blur-xl" : "bg-white/95 backdrop-blur-xl"
                  }`}
                >
                  {navigation.map((item, index) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link key={item.name} href={item.href} prefetch={true} className="block">
                        <div
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`w-full text-left flex items-center px-3 py-3 mx-2 rounded-xl text-lg font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                              : isDark
                              ? "text-gray-300 hover:text-white hover:bg-gray-700/50"
                              : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                          }`}
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          {item.name}
                        </div>
                      </Link>
                    )
                  })}

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-3 mx-2">
                    <div className="flex items-center px-3 space-x-3">
                      <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-xl transition-all hover:scale-110 ${
                          isDark
                            ? "text-gray-300 hover:text-white hover:bg-gray-700/50"
                            : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                        }`}
                      >
                        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                      </button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                        className="flex items-center bg-transparent"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      )}

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </main>
    </div>
  )
}
