"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useTheme } from "./ThemeProvider"

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label?: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  error?: string
}

export default function Select({ label, value, onChange, options, placeholder, error }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { isDark } = useTheme()

  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className="w-full">
      {label && (
        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-3 py-2 text-left border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}
            ${error ? "border-red-500" : ""}
          `}
        >
          <span className={selectedOption ? "" : "text-gray-400"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          />
        </button>

        {isOpen && (
          <div
            className={`absolute z-10 w-full mt-1 border rounded-md shadow-lg ${
              isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
            }`}
          >
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                    value === option.value
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                      : isDark
                        ? "text-gray-200"
                        : "text-gray-900"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
