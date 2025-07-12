"use client"

import { useTheme } from "./ThemeProvider"

export default function LoadingScreen() {
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
        <h2 className={`mt-4 text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
          Loading Employee Skills Portal...
        </h2>
        <p className={`mt-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Please wait while we prepare your dashboard
        </p>
      </div>
    </div>
  )
}
