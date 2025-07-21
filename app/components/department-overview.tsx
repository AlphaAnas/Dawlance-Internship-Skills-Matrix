"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip } from "recharts"
import type { Employee } from "@/lib/types"

interface DepartmentOverviewProps {
  data: Employee[]
}

export default function DepartmentOverview({ data }: DepartmentOverviewProps) {
  // Group employees by department
  const departments = [...new Set(data.map((employee) => employee.department))]

  const departmentData = departments.map((department) => {
    const employees = data.filter((e) => e.department === department)
    const expertCount = employees.filter((e) => e.skillLevel === "Expert").length
    const highCount = employees.filter((e) => e.skillLevel === "High").length
    const mediumCount = employees.filter((e) => e.skillLevel === "Medium").length
    const lowCount = employees.filter((e) => e.skillLevel === "Low").length

    return {
      name: department,
      total: employees.length,
      expert: expertCount,
      high: highCount,
      medium: mediumCount,
      low: lowCount,
      expertPercentage: Math.round((expertCount / employees.length) * 100),
      highPercentage: Math.round((highCount / employees.length) * 100),
      mediumPercentage: Math.round((mediumCount / employees.length) * 100),
      lowPercentage: Math.round((lowCount / employees.length) * 100),
    }
  })

  // Overall skill distribution
  const skillDistribution = [
    { name: "Expert", value: data.filter((e) => e.skillLevel === "Expert").length, color: "#AF52DE" },
    { name: "High", value: data.filter((e) => e.skillLevel === "High").length, color: "#007AFF" },
    { name: "Medium", value: data.filter((e) => e.skillLevel === "Medium").length, color: "#FFCC00" },
    { name: "Low", value: data.filter((e) => e.skillLevel === "Low").length, color: "#FF3B30" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Skill Distribution</CardTitle>
          <CardDescription>Overall skill level distribution across all departments</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={skillDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {skillDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
              <RechartsTooltip formatter={(value, name) => [`${value} employees`, `${name} Level`]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Department Skill Saturation</CardTitle>
          <CardDescription>Percentage of employees above medium skill level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentData.map((dept) => (
              <div key={dept.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{dept.name}</span>
                  <span className="font-medium">{dept.expertPercentage + dept.highPercentage}% Advanced</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                    style={{ width: `${dept.expertPercentage + dept.highPercentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {departmentData.map((dept) => (
        <Card key={dept.name}>
          <CardHeader>
            <CardTitle>{dept.name}</CardTitle>
            <CardDescription>{dept.total} employees</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Expert", value: dept.expert, color: "#AF52DE" },
                    { name: "High", value: dept.high, color: "#007AFF" },
                    { name: "Medium", value: dept.medium, color: "#FFCC00" },
                    { name: "Low", value: dept.low, color: "#FF3B30" },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {skillDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <RechartsTooltip
                  formatter={(value, name) => [
                    `${value} employees (${Math.round((value / dept.total) * 100)}%)`,
                    `${name} Level`,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
