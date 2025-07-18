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

export default function Table({
  columns,
  data,
  isLoading,
  emptyMessage = "No data available",
  onInspect,
}: TableProps) {
  const { isDark } = useTheme()

  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden`}>
        <div className="animate-pulse">
          <div
            className={`px-6 py-4 border-b ${
              isDark ? "border-gray-700 bg-gray-700" : "border-gray-200 bg-gray-50"
            }`}
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
      {/* S.No. column */}
      <th
        className={`px-6 py-3 text-left text-base font-medium uppercase tracking-wider ${
          isDark ? "text-gray-300" : "text-gray-500"
        }`}
      >
        S.No.
      </th>

      {/* Existing dynamic columns */}
      {columns.map((column) => (
        <th
          key={column.key}
          className={`px-6 py-3 text-left text-base font-medium uppercase tracking-wider ${
            isDark ? "text-gray-300" : "text-gray-500"
          }`}
        >
          {column.label}
        </th>
      ))}

      {/* Actions column (if any) */}
      {onInspect && (
        <th
          className={`px-6 py-3 text-left text-base font-medium uppercase tracking-wider ${
            isDark ? "text-gray-300" : "text-gray-500"
          }`}
        >
          Actions
        </th>
      )}
    </tr>
  </thead>

  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
    {data.map((row, index) => (
      <tr key={row.id || index}>
        {/* S.No. value */}
        <td
          className={`px-6 py-4 whitespace-nowrap text-base font-medium ${
            isDark ? "text-gray-200" : "text-gray-900"
          }`}
        >
          {index + 1}
        </td>

        {/* Dynamic values */}
        {columns.map((column) => (
          <td
            key={column.key}
            className={`px-6 py-4 whitespace-nowrap text-base ${
              isDark ? "text-gray-200" : "text-gray-900"
            }`}
          >
            {row[column.key]}
          </td>
        ))}

        {/* Action button (if any) */}
        {onInspect && (
          <td
            className={`px-6 py-4 whitespace-nowrap text-base ${
              isDark ? "text-gray-200" : "text-gray-900"
            }`}
          >
            <button
              onClick={() => onInspect(row)}
              className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-semibold transition-all duration-200 text-base shadow-sm"
            >
              
              <Award className="h-4 w-4" />
              Inspect
            </button>
          </td>
        )}
      </tr>
    ))}
  </tbody>
</table>

      </div>
    </div>
  )
}
