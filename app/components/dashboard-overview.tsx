"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  Treemap,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, Users, Award, Factory, Target, BookOpen } from "lucide-react"
import type { ManufacturingEmployee } from "@/lib/types"

interface DashboardOverviewProps {
  data: ManufacturingEmployee[]
}

export default function DashboardOverview({ data }: DashboardOverviewProps) {
  // Overall skill distribution
  const skillDistribution = [
    { name: "Expert", value: data.filter((e) => e.skillLevel === "Expert").length, color: "#AF52DE" },
    { name: "High", value: data.filter((e) => e.skillLevel === "High").length, color: "#007AFF" },
    { name: "Medium", value: data.filter((e) => e.skillLevel === "Medium").length, color: "#FFCC00" },
    { name: "Low", value: data.filter((e) => e.skillLevel === "Low").length, color: "#FF3B30" },
  ]

  // Department workforce size
  const departments = [...new Set(data.map((employee) => employee.department))]
  const departmentSizes = departments.map((dept, index) => {
    const employees = data.filter((e) => e.department === dept)
    const colors = ["#FF3B30", "#FF9500", "#FFCC00", "#34C759", "#007AFF", "#5856D6", "#AF52DE"]
    return {
      name: dept,
      size: employees.length,
      color: colors[index % colors.length],
    }
  })

  // Gender distribution by skill level
  const genderSkillData = [
    {
      skillLevel: "Expert",
      Male: data.filter((e) => e.skillLevel === "Expert" && e.gender === "Male").length,
      Female: data.filter((e) => e.skillLevel === "Expert" && e.gender === "Female").length,
    },
    {
      skillLevel: "High",
      Male: data.filter((e) => e.skillLevel === "High" && e.gender === "Male").length,
      Female: data.filter((e) => e.skillLevel === "High" && e.gender === "Female").length,
    },
    {
      skillLevel: "Medium",
      Male: data.filter((e) => e.skillLevel === "Medium" && e.gender === "Male").length,
      Female: data.filter((e) => e.skillLevel === "Medium" && e.gender === "Female").length,
    },
    {
      skillLevel: "Low",
      Male: data.filter((e) => e.skillLevel === "Low" && e.gender === "Male").length,
      Female: data.filter((e) => e.skillLevel === "Low" && e.gender === "Female").length,
    },
  ]

  // Experience vs Skill scatter data
  const experienceSkillData = data.map((employee) => {
    const skillLevelMap = { Expert: 4, High: 3, Medium: 2, Low: 1 }
    return {
      experience: employee.yearsExperience,
      skillLevel: skillLevelMap[employee.skillLevel as keyof typeof skillLevelMap],
      name: employee.name,
      department: employee.department,
      gender: employee.gender,
      color: employee.gender === "Female" ? "#FF2D55" : "#007AFF",
    }
  })

  // Department performance scores
  const departmentPerformance = departments.map((department) => {
    const employees = data.filter((e) => e.department === department)
    const expertCount = employees.filter((e) => e.skillLevel === "Expert").length
    const highCount = employees.filter((e) => e.skillLevel === "High").length
    const mediumCount = employees.filter((e) => e.skillLevel === "Medium").length
    const lowCount = employees.filter((e) => e.skillLevel === "Low").length

    const performanceScore =
      employees.length > 0
        ? ((expertCount * 4 + highCount * 3 + mediumCount * 2 + lowCount * 1) / employees.length) * 25
        : 0

    const avgExperience =
      employees.length > 0 ? employees.reduce((sum, emp) => sum + emp.yearsExperience, 0) / employees.length : 0

    return {
      name: department.replace(" ", "\n"),
      performance: Math.round(performanceScore),
      experience: Math.round(avgExperience * 10) / 10,
      employees: employees.length,
    }
  })

  // Certification coverage by department
  const certificationData = departments.map((department) => {
    const employees = data.filter((e) => e.department === department)
    const withCerts = employees.filter((e) => e.certifications && e.certifications.length > 0).length
    const coverage = employees.length > 0 ? (withCerts / employees.length) * 100 : 0

    return {
      name: department,
      coverage: Math.round(coverage),
      certified: withCerts,
      total: employees.length,
    }
  })

  // Treemap data for workforce composition
  const treemapData = departments.map((dept, index) => {
    const employees = data.filter((e) => e.department === dept)
    const colors = ["#FF3B30", "#FF9500", "#FFCC00", "#34C759", "#007AFF", "#5856D6", "#AF52DE"]
    return {
      name: dept,
      size: employees.length,
      fill: colors[index % colors.length],
    }
  })

  return (
    <div className="space-y-8">
      {/* Top Row - Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Total Workforce
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{data.length}</div>
            <p className="text-sm text-muted-foreground">Manufacturing employees</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              Expert Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {data.filter((e) => e.skillLevel === "Expert").length}
            </div>
            <p className="text-sm text-muted-foreground">
              {Math.round((data.filter((e) => e.skillLevel === "Expert").length / data.length) * 100)}% of workforce
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-pink-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Users className="h-5 w-5 text-pink-500" />
              Female Workers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-pink-600">{data.filter((e) => e.gender === "Female").length}</div>
            <p className="text-sm text-muted-foreground">
              {Math.round((data.filter((e) => e.gender === "Female").length / data.length) * 100)}% of workforce
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-500" />
              Certified Workers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {data.filter((e) => e.certifications && e.certifications.length > 0).length}
            </div>
            <p className="text-sm text-muted-foreground">
              {Math.round(
                (data.filter((e) => e.certifications && e.certifications.length > 0).length / data.length) * 100,
              )}
              % have certifications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Overview Charts - Gender First */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Gender Distribution by Skill Level - MOVED TO FIRST */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-pink-600" />
              Gender by Skill Level
            </CardTitle>
            <CardDescription>Male vs Female across skill levels</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genderSkillData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skillLevel" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Male" stackId="a" fill="#007AFF" name="Male" />
                <Bar dataKey="Female" stackId="a" fill="#FF2D55" name="Female" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Overall Skill Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Overall Skill Distribution
            </CardTitle>
            <CardDescription>Workforce skill level breakdown</CardDescription>
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
                  labelStyle={{ fontSize: "11px" }}
                >
                  {skillDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} employees`, "Count"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Workforce Size */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Factory className="h-5 w-5 text-blue-600" />
              Department Workforce
            </CardTitle>
            <CardDescription>Employee distribution by department</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentSizes} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={10} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="size" radius={[4, 4, 0, 0]}>
                  {departmentSizes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Second Row of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Experience vs Skill Level Scatter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Experience vs Skill Level
            </CardTitle>
            <CardDescription>Correlation between years of experience and skill level</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="experience" name="Experience" unit=" years" domain={[0, "dataMax + 2"]} />
                <YAxis
                  type="number"
                  dataKey="skillLevel"
                  name="Skill Level"
                  domain={[0.5, 4.5]}
                  tickFormatter={(value) => {
                    const levels = ["", "Low", "Medium", "High", "Expert"]
                    return levels[value] || ""
                  }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    if (name === "skillLevel") {
                      const levels = ["", "Low", "Medium", "High", "Expert"]
                      return [levels[value as number], "Skill Level"]
                    }
                    return [value, name]
                  }}
                  labelFormatter={(value) => `${value} years experience`}
                />
                <Scatter name="Employees" data={experienceSkillData} fill="#8884d8">
                  {experienceSkillData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Third Row - Department Performance and Certification Coverage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              Department Performance Scores
            </CardTitle>
            <CardDescription>Performance based on skill levels and experience</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={departmentPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={10} />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "performance") return [`${value}/100`, "Performance Score"]
                    if (name === "experience") return [`${value} years`, "Avg Experience"]
                    return [value, name]
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="performance"
                  stroke="#AF52DE"
                  fill="url(#performanceGradient)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#AF52DE" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#AF52DE" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Certification Coverage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              Certification Coverage
            </CardTitle>
            <CardDescription>Percentage of certified employees by department</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={certificationData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={10} />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "coverage") return [`${value}%`, "Certification Coverage"]
                    return [value, name]
                  }}
                  labelFormatter={(label) => {
                    const dept = certificationData.find((d) => d.name === label)
                    return dept ? `${label} (${dept.certified}/${dept.total} certified)` : label
                  }}
                />
                <Bar dataKey="coverage" fill="url(#certificationGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="certificationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34C759" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#34C759" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      {/* Workforce Composition Treemap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            Workforce Composition
          </CardTitle>
          <CardDescription>Proportional department sizes</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={treemapData}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#fff"
              strokeWidth={2}
              content={({ root, depth, x, y, width, height, index, payload, colors, name }) => {
                return (
                  <g>
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      style={{
                        fill: payload?.fill || colors,
                        stroke: "#fff",
                        strokeWidth: 2,
                        strokeOpacity: 1,
                      }}
                    />
                    {width > 60 && height > 40 && (
                      <>
                        <text
                          x={x + width / 2}
                          y={y + height / 2 - 8}
                          textAnchor="middle"
                          fill="#fff"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          {name}
                        </text>
                        <text x={x + width / 2} y={y + height / 2 + 8} textAnchor="middle" fill="#fff" fontSize="10">
                          {payload?.size} employees
                        </text>
                      </>
                    )}
                  </g>
                )
              }}
            />
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
