"use client"

import type React from "react"

interface AccessibilityWrapperProps {
  children: React.ReactNode
  ariaLabel?: string
  role?: string
  tabIndex?: number
}

export default function AccessibilityWrapper({
  children,
  ariaLabel,
  role = "region",
  tabIndex = 0,
}: AccessibilityWrapperProps) {
  return (
    <div
      role={role}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
      className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
    >
      {children}
    </div>
  )
}
