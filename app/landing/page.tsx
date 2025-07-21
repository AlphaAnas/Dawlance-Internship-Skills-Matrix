"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Filter, BarChart3 } from "lucide-react"
import DashboardOverview from "../components/dashboard-overview"
import SkillLevelBreakdown from "../components/skill-level-breakdown"
import GenderDiversityOverview from "../components/gender-diversity-overview"
import TopEmployeesList from "../components/top-employees-list"
import { manufacturingEmployeeData } from "../data/manufacturing-data"
import EnhancedSkillComparisonMatrix from "../components/enhanced-skill-comparison-matrix"

export default function FridgeManufacturingDashboard() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>("all")
  const [selectedGender, setSelectedGender] = useState<string>("all")

  const departments = [
    "Sheet Metal",
    "Assembly Line",
    "Cooling Systems",
    "Quality Control",
    "Painting",
    "Packaging",
    "Blow Molding",
  ]

  const filteredData = manufacturingEmployeeData.filter((employee) => {
    if (selectedDepartment !== "all" && employee.department !== selectedDepartment) return false
    if (selectedSkillLevel !== "all") {
      if (selectedSkillLevel === "expert" && employee.skillLevel !== "Expert") return false
      if (selectedSkillLevel === "high" && employee.skillLevel !== "High") return false
      if (selectedSkillLevel === "medium" && employee.skillLevel !== "Medium") return false
      if (selectedSkillLevel === "low" && employee.skillLevel !== "Low") return false
    }
    if (selectedGender !== "all" && employee.gender !== selectedGender) return false
    return true
  })

  const clearFilters = () => {
    setSelectedDepartment("all")
    setSelectedSkillLevel("all")
    setSelectedGender("all")
  }

  const totalEmployees = manufacturingEmployeeData.length

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-red-500 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Manufacturing Skills Matrix
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Fridge Manufacturing Company - Comprehensive Skills & Performance Analytics
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSkillLevel} onValueChange={setSelectedSkillLevel}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Skill Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="expert">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-purple-600"></span>
                  Expert
                </div>
              </SelectItem>
              <SelectItem value="high">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                  High
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
                  Medium
                </div>
              </SelectItem>
              <SelectItem value="low">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500"></span>
                  Low
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedGender} onValueChange={setSelectedGender}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      </div>

      {/* Comprehensive Dashboard Overview - TOP SECTION */}
      <Card
        className="border-t-4"
        style={{
          borderImage: "linear-gradient(to right, #FF3B30, #007AFF, #AF52DE) 1",
        }}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-500" />
            Manufacturing Overview Dashboard
          </CardTitle>
          <CardDescription>
            Comprehensive view of workforce skills, performance, and distribution across all departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DashboardOverview data={filteredData} />
        </CardContent>
      </Card>

      {/* Top Employees List */}
      <TopEmployeesList data={filteredData} />

      {/* Detailed Analysis Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Skill Level Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Skill Level Analysis</CardTitle>
            <CardDescription>Employee skill levels by department and gender</CardDescription>
          </CardHeader>
          <CardContent>
            <SkillLevelBreakdown data={filteredData} />
          </CardContent>
        </Card>

        {/* Gender Diversity Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Gender Diversity Deep Dive</CardTitle>
            <CardDescription>Gender distribution across departments and skill levels</CardDescription>
          </CardHeader>
          <CardContent>
            <GenderDiversityOverview data={filteredData} />
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Skill Comparison Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Skills Comparison Matrix</CardTitle>
          <CardDescription>
            Skill density and distribution across departments - hover for detailed insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnhancedSkillComparisonMatrix data={filteredData} />
        </CardContent>
      </Card>

      {/* Active Filters Display */}
      {(selectedDepartment !== "all" || selectedSkillLevel !== "all" || selectedGender !== "all") && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Active Filters:</span>
              {selectedDepartment !== "all" && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Department: {selectedDepartment}
                </Badge>
              )}
              {selectedSkillLevel !== "all" && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Skill: {selectedSkillLevel}
                </Badge>
              )}
              {selectedGender !== "all" && (
                <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                  Gender: {selectedGender}
                </Badge>
              )}
              <span className="text-sm text-muted-foreground ml-2">
                Showing {filteredData.length} of {totalEmployees} employees
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
