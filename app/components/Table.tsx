"use client"

import type React from "react"
import { Award } from "lucide-react"

import { useTheme } from "./ThemeProvider"

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

interface TableProps {
  columns: Column[]
  data: any[]
  isLoading?: boolean
  emptyMessage?: string
  onInspect?: (row: any) => void
}

export default function Table({ columns, data, isLoading, emptyMessage = "No data available", onInspect }: TableProps) {
  const { isDark } = useTheme()

  // console.log("Table rendered with data:", data)

  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden`}>
        <div className="animate-pulse">
          <div
            className={`px-6 py-4 border-b ${isDark ? "border-gray-700 bg-gray-700" : "border-gray-200 bg-gray-50"}`}
          >
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`px-6 py-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
              <div className="flex space-x-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded flex-1"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded flex-1"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={isDark ? "bg-gray-700" : "bg-gray-50"}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {column.label}
                </th>
              ))}
              {onInspect && (
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? "divide-gray-700" : "divide-gray-200"}`}>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onInspect ? 1 : 0)}
                  className={`px-6 py-12 text-center text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className={isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? "text-gray-200" : "text-gray-900"}`}
                    >
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                  {onInspect && (
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                      <button
                        onClick={() => onInspect(row)}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 text-xs"
                      >
                        <Award className="h-3 w-3" />
                        Inspect
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
