"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Target, TrendingUp, Users, Award, Filter, RotateCcw } from "lucide-react"
import type { ManufacturingEmployee } from "@/lib/types"

interface EnhancedSkillComparisonMatrixProps {
  data: ManufacturingEmployee[]
}

export default function EnhancedSkillComparisonMatrix({ data }: EnhancedSkillComparisonMatrixProps) {
  const [selectedSkill, setSelectedSkill] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"percentage" | "count">("percentage")
  const [sortBy, setSortBy] = useState<"department" | "coverage">("coverage")

  // Extract all unique skills
  const allSkills = [...new Set(data.flatMap((employee) => employee.skills))]

  // Group employees by department
  const departments = [...new Set(data.map((employee) => employee.department))]

  // Create matrix data
  const matrix = departments.map((department) => {
    const departmentEmployees = data.filter((e) => e.department === department)
    const totalEmployees = departmentEmployees.length

    const skillsMap = allSkills.reduce(
      (acc, skill) => {
        const employeesWithSkill = departmentEmployees.filter((e) => e.skills.includes(skill))
        const percentage = totalEmployees > 0 ? (employeesWithSkill.length / totalEmployees) * 100 : 0

        acc[skill] = {
          count: employeesWithSkill.length,
          percentage,
          employees: employeesWithSkill,
        }

        return acc
      },
      {} as Record<string, { count: number; percentage: number; employees: ManufacturingEmployee[] }>,
    )

    // Calculate overall skill coverage for this department
    const skillCoverage =
      allSkills.reduce((sum, skill) => sum + (skillsMap[skill]?.percentage || 0), 0) / allSkills.length

    return {
      department,
      skills: skillsMap,
      totalEmployees,
      skillCoverage,
    }
  })

  // Sort matrix based on selected criteria
  const sortedMatrix = [...matrix].sort((a, b) => {
    if (sortBy === "coverage") {
      return b.skillCoverage - a.skillCoverage
    }
    return a.department.localeCompare(b.department)
  })

  // Filter skills based on selection
  const filteredSkills = selectedSkill === "all" ? allSkills : [selectedSkill]

  // Enhanced color intensity function with better gradients
  const getColorIntensity = (percentage: number) => {
    if (percentage === 0) return "bg-gray-50 text-gray-400 border border-gray-200"
    if (percentage < 25) return "bg-gradient-to-br from-red-100 to-red-200 text-red-800 border border-red-200"
    if (percentage < 50)
      return "bg-gradient-to-br from-orange-100 to-orange-200 text-orange-800 border border-orange-200"
    if (percentage < 75) return "bg-gradient-to-br from-blue-100 to-blue-300 text-blue-800 border border-blue-300"
    return "bg-gradient-to-br from-purple-400 to-purple-600 text-white font-semibold border border-purple-600 shadow-md"
  }

  // Get skill level color for employee avatars
  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case "Expert":
        return "bg-purple-600 text-white"
      case "High":
        return "bg-blue-500 text-white"
      case "Medium":
        return "bg-yellow-400 text-black"
      case "Low":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-400"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
  }

  const resetFilters = () => {
    setSelectedSkill("all")
    setViewMode("percentage")
    setSortBy("coverage")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-purple-600" />
              Enhanced Skills Matrix
            </CardTitle>
            <CardDescription>
              Interactive skill density analysis with employee details and performance insights
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">View:</span>
            </div>

            <Select value={selectedSkill} onValueChange={setSelectedSkill}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                {allSkills.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={viewMode} onValueChange={(value: "percentage" | "count") => setViewMode(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="count">Count</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: "department" | "coverage") => setSortBy(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="coverage">By Coverage</SelectItem>
                <SelectItem value="department">By Department</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={resetFilters}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium">Coverage Levels:</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-100 rounded border"></div>
            <span className="text-xs">0%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-200 rounded border"></div>
            <span className="text-xs">1-25%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-orange-200 rounded border"></div>
            <span className="text-xs">26-50%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-blue-300 rounded border"></div>
            <span className="text-xs">51-75%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-purple-500 rounded border"></div>
            <span className="text-xs">76-100%</span>
          </div>
        </div>

        {/* Enhanced Matrix Table */}
        <div className="overflow-x-auto">
          <TooltipProvider>
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <th className="text-left p-4 font-semibold border-b-2 border-gray-200 min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Department
                      {sortBy === "coverage" && <TrendingUp className="h-3 w-3 text-purple-600" />}
                    </div>
                  </th>
                  {filteredSkills.map((skill) => (
                    <th key={skill} className="p-4 font-semibold text-center border-b-2 border-gray-200 min-w-[140px]">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm">{skill}</span>
                        <Badge variant="outline" className="text-xs">
                          {data.filter((e) => e.skills.includes(skill)).length} total
                        </Badge>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedMatrix.map((row, rowIndex) => (
                  <tr key={row.department} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-25"}>
                    <td className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-r border-gray-200">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">{row.department}</span>
                          <Badge className="bg-blue-100 text-blue-800">{row.totalEmployees} emp</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-3 w-3 text-purple-600" />
                          <span className="text-xs text-gray-600">{Math.round(row.skillCoverage)}% avg coverage</span>
                        </div>
                      </div>
                    </td>
                    {filteredSkills.map((skill) => {
                      const skillData = row.skills[skill]
                      const displayValue =
                        viewMode === "percentage"
                          ? `${Math.round(skillData?.percentage || 0)}%`
                          : `${skillData?.count || 0}`

                      return (
                        <td key={skill} className="p-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={`h-20 w-full rounded-lg ${getColorIntensity(skillData?.percentage || 0)} 
                                  flex flex-col items-center justify-center text-sm font-medium cursor-pointer
                                  hover:scale-105 transition-all duration-200 hover:shadow-lg relative overflow-hidden`}
                              >
                                <div className="text-lg font-bold">{displayValue}</div>
                                {skillData && skillData.count > 0 && (
                                  <div className="text-xs opacity-80">
                                    {skillData.count} {skillData.count === 1 ? "person" : "people"}
                                  </div>
                                )}
                                {skillData?.percentage >= 75 && (
                                  <div className="absolute top-1 right-1">
                                    <Award className="h-3 w-3 text-yellow-300" />
                                  </div>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-sm p-4">
                              <div className="space-y-3">
                                <div className="border-b pb-2">
                                  <p className="font-semibold text-base">
                                    {skill} in {row.department}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    <strong>{skillData?.count || 0}</strong> employees (
                                    {Math.round(skillData?.percentage || 0)}% of department)
                                  </p>
                                </div>

                                {skillData?.employees && skillData.employees.length > 0 && (
                                  <div className="space-y-2">
                                    <p className="text-xs font-medium text-gray-600">Team Members:</p>
                                    <div className="grid grid-cols-2 gap-2">
                                      {skillData.employees.slice(0, 6).map((emp) => (
                                        <div key={emp.id} className="flex items-center gap-2">
                                          <Avatar className="h-6 w-6">
                                            <AvatarFallback className={`${getSkillLevelColor(emp.skillLevel)} text-xs`}>
                                              {getInitials(emp.name)}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div className="min-w-0">
                                            <p className="text-xs font-medium truncate">{emp.name}</p>
                                            <p className="text-xs text-muted-foreground">{emp.skillLevel}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    {skillData.employees.length > 6 && (
                                      <p className="text-xs text-muted-foreground text-center">
                                        +{skillData.employees.length - 6} more employees
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </TooltipProvider>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Highest Coverage</p>
                  <p className="text-lg font-bold text-blue-600">
                    {sortedMatrix[0]?.department} ({Math.round(sortedMatrix[0]?.skillCoverage || 0)}%)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Most Skilled</p>
                  <p className="text-lg font-bold text-purple-600">
                    {allSkills.reduce((max, skill) => {
                      const totalWithSkill = data.filter((e) => e.skills.includes(skill)).length
                      const maxWithSkill = data.filter((e) => e.skills.includes(max)).length
                      return totalWithSkill > maxWithSkill ? skill : max
                    }, allSkills[0])}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Avg Coverage</p>
                  <p className="text-lg font-bold text-green-600">
                    {Math.round(matrix.reduce((sum, dept) => sum + dept.skillCoverage, 0) / matrix.length)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
