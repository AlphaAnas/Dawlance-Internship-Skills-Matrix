"use client"

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"
import type { ManufacturingEmployee } from "@/lib/types"

interface GenderDiversityOverviewProps {
  data: ManufacturingEmployee[]
}

export default function GenderDiversityOverview({ data }: GenderDiversityOverviewProps) {
  const departments = [...new Set(data.map((employee) => employee.department))]

  // Overall gender distribution
  const overallGender = [
    {
      name: "Male",
      value: data.filter((e) => e.gender === "Male").length,
      color: "#007AFF",
    },
    {
      name: "Female",
      value: data.filter((e) => e.gender === "Female").length,
      color: "#FF2D55",
    },
  ]

  // Department-wise gender breakdown
  const departmentGenderData = departments.slice(0, 4).map((department) => {
    const employees = data.filter((e) => e.department === department)
    const maleCount = employees.filter((e) => e.gender === "Male").length
    const femaleCount = employees.filter((e) => e.gender === "Female").length

    return {
      department,
      data: [
        { name: "Male", value: maleCount, color: "#007AFF" },
        { name: "Female", value: femaleCount, color: "#FF2D55" },
      ],
    }
  })

  return (
    <div className="space-y-6">
      {/* Overall Distribution */}
      <div className="h-[200px]">
        <h4 className="text-sm font-medium mb-2">Overall Gender Distribution</h4>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={overallGender}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              labelStyle={{ fontSize: "11px" }}
            >
              {overallGender.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} employees`, "Count"]} contentStyle={{ fontSize: "12px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Department Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        {departmentGenderData.map(({ department, data: deptData }) => (
          <div key={department} className="h-[120px]">
            <h5 className="text-xs font-medium mb-1 text-center">{department}</h5>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptData}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}`, "Employees"]} contentStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  )
}
