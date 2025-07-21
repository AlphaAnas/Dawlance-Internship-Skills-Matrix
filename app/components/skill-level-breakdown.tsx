"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import type { ManufacturingEmployee } from "@/lib/types"

interface SkillLevelBreakdownProps {
  data: ManufacturingEmployee[]
}

export default function SkillLevelBreakdown({ data }: SkillLevelBreakdownProps) {
  const departments = [...new Set(data.map((employee) => employee.department))]

  const skillBreakdownData = departments.map((department) => {
    const employees = data.filter((e) => e.department === department)
    const maleEmployees = employees.filter((e) => e.gender === "Male")
    const femaleEmployees = employees.filter((e) => e.gender === "Female")

    return {
      name: department.replace(" ", "\n"),
      "Male Expert": maleEmployees.filter((e) => e.skillLevel === "Expert").length,
      "Female Expert": femaleEmployees.filter((e) => e.skillLevel === "Expert").length,
      "Male High": maleEmployees.filter((e) => e.skillLevel === "High").length,
      "Female High": femaleEmployees.filter((e) => e.skillLevel === "High").length,
      "Male Medium": maleEmployees.filter((e) => e.skillLevel === "Medium").length,
      "Female Medium": femaleEmployees.filter((e) => e.skillLevel === "Medium").length,
      "Male Low": maleEmployees.filter((e) => e.skillLevel === "Low").length,
      "Female Low": femaleEmployees.filter((e) => e.skillLevel === "Low").length,
    }
  })

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={skillBreakdownData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={11} />
          <YAxis fontSize={11} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "11px" }} />

          {/* Expert Level */}
          <Bar dataKey="Male Expert" stackId="expert" fill="#AF52DE" name="Male Expert" />
          <Bar dataKey="Female Expert" stackId="expert" fill="#E980FC" name="Female Expert" />

          {/* High Level */}
          <Bar dataKey="Male High" stackId="high" fill="#007AFF" name="Male High" />
          <Bar dataKey="Female High" stackId="high" fill="#64D2FF" name="Female High" />

          {/* Medium Level */}
          <Bar dataKey="Male Medium" stackId="medium" fill="#FFCC00" name="Male Medium" />
          <Bar dataKey="Female Medium" stackId="medium" fill="#FFE066" name="Female Medium" />

          {/* Low Level */}
          <Bar dataKey="Male Low" stackId="low" fill="#FF3B30" name="Male Low" />
          <Bar dataKey="Female Low" stackId="low" fill="#FF6B6B" name="Female Low" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
