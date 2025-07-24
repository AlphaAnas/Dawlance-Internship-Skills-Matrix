"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Target, TrendingUp, Users, Award, Filter, RotateCcw, Factory, Cog, RefreshCw, AlertTriangle } from "lucide-react"
import { useSkillsMatrixScores } from "@/hooks/useSkillsMatrixScores"

interface ManufacturingEmployee {
  id: string
  name: string
  gender: string
  department: string
  title: string
  skillLevel: string
  skills: string[] | Record<string, string>
  yearsExperience: number
  certifications?: string[]
}

interface EnhancedSkillComparisonMatrixProps {
  data: ManufacturingEmployee[]
}

export default function EnhancedSkillComparisonMatrix({ data }: EnhancedSkillComparisonMatrixProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"departments" | "machines">("departments")
  
  // Get department and machine scores from API
  const { data: skillsData, loading, error, refetch } = useSkillsMatrixScores(
    selectedDepartment === "all" ? undefined : selectedDepartment
  );

  // Get unique departments from employee data for filter
  const departments = [...new Set(data.map((employee) => employee.department))]

  // Helper function to normalize skill levels (treat Expert as Advanced)
  const normalizeSkillLevel = (skillLevel: string | undefined) => {
    if (!skillLevel) return '';
    if (skillLevel === 'Expert' || skillLevel === 'Advanced') return 'Advanced';
    return skillLevel;
  };

  // Calculate department data from employee data directly (as fallback/alternative)
  const calculateDepartmentDataFromEmployees = () => {
    const filteredData = selectedDepartment === "all" 
      ? data 
      : data.filter(emp => emp.department === selectedDepartment);

    const departmentGroups = departments.map(dept => {
      const deptEmployees = filteredData.filter(emp => emp.department === dept);
      
      if (deptEmployees.length === 0) return null;

      // Calculate skill breakdown from employee skillLevel
      const skillBreakdown = {
        Low: deptEmployees.filter(emp => emp.skillLevel === 'Low').length,
        Medium: deptEmployees.filter(emp => emp.skillLevel === 'Medium').length,
        High: deptEmployees.filter(emp => emp.skillLevel === 'High').length,
        Advanced: deptEmployees.filter(emp => normalizeSkillLevel(emp.skillLevel) === 'Advanced').length,
        Expert: 0 // Since we normalize Expert to Advanced
      };

      // Calculate average score
      const skillLevelMap = { Low: 1, Medium: 2, High: 3, Advanced: 4, Expert: 4 };
      const totalScore = deptEmployees.reduce((sum, emp) => {
        return sum + (skillLevelMap[emp.skillLevel as keyof typeof skillLevelMap] || 1);
      }, 0);
      const averageScore = Math.round((totalScore / deptEmployees.length) * 25);

      return {
        department: {
          id: dept,
          name: dept,
          employeeCount: deptEmployees.length,
          averageScore: averageScore,
          skillBreakdown: skillBreakdown
        },
        machines: [] // We don't have machine data from employee records
      };
    }).filter(item => item !== null);

    return departmentGroups;
  };

  // Use employee-based calculation as fallback when API data is empty or has issues
  const displayData = (skillsData && skillsData.length > 0) ? skillsData : calculateDepartmentDataFromEmployees();

  // Get score color based on percentage
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-gradient-to-br from-green-500 to-green-600 text-white font-semibold"
    if (score >= 80) return "bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold"
    if (score >= 70) return "bg-gradient-to-br from-yellow-400 to-yellow-500 text-black font-semibold"
    if (score >= 60) return "bg-gradient-to-br from-orange-400 to-orange-500 text-white font-semibold"
    return "bg-gradient-to-br from-red-400 to-red-500 text-white font-semibold"
  }

  // Get skill level distribution color
  const getSkillDistributionColor = (level: string) => {
    switch (level) {
      case "Expert":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Advanced":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "High":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const resetFilters = () => {
    setSelectedDepartment("all")
    setViewMode("departments")
  }

  // Shared filter controls component
  const FilterControls = () => (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Department:</span>
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select department" />
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
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">View:</span>
        <Select value={viewMode} onValueChange={(value) => setViewMode(value as "departments" | "machines")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="departments">Departments</SelectItem>
            <SelectItem value="machines">Machines</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={resetFilters} variant="outline" size="sm" className="gap-2">
        <RotateCcw className="h-4 w-4" />
        Reset
      </Button>
    </div>
  )

  if (loading) {
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
                Department and machine skill performance analysis
              </CardDescription>
            </div>
            <FilterControls />
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
            <span className="text-gray-600">Loading skills matrix data...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
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
                Department and machine skill performance analysis
              </CardDescription>
            </div>
            <FilterControls />
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <AlertTriangle className="h-12 w-12 text-red-400" />
            <div className="text-center">
              <p className="text-red-600 font-medium">Error loading skills matrix</p>
              <p className="text-gray-500 text-sm">{error}</p>
              <div className="flex gap-2 mt-2">
                <Button onClick={refetch} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
                <Button onClick={resetFilters} variant="secondary">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
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
              Department and machine skill performance analysis with detailed breakdowns
              {(!skillsData || skillsData.length === 0) && (
                <span className="block text-yellow-600 text-xs mt-1">
                  ⚠️ Using employee data - machine data requires EmployeeSkill records
                </span>
              )}
            </CardDescription>
          </div>
          <FilterControls />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Department View */}
        {viewMode === "departments" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayData.map((item) => (
                <Card key={item.department.id} className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Factory className="h-5 w-5 text-blue-600" />
                        {item.department.name}
                      </CardTitle>
                      <Badge className={getScoreColor(item.department.averageScore)}>
                        {item.department.averageScore}%
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {item.department.employeeCount} employees
                      </span>
                      <span className="flex items-center gap-1">
                        <Cog className="h-4 w-4" />
                        {item.machines.length} machines
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-2">Skill Level Breakdown:</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {Object.entries(item.department.skillBreakdown || {})
                            .filter(([level, count]) => level && level !== 'undefined' && count > 0)
                            .map(([level, count]) => (
                            <div key={level} className="flex justify-between items-center">
                              <Badge 
                                variant="outline" 
                                className={`${getSkillDistributionColor(level)} text-xs`}
                              >
                                {level}
                              </Badge>
                              <span className="font-medium">{count}</span>
                            </div>
                          ))}
                          {Object.entries(item.department.skillBreakdown || {})
                            .filter(([level, count]) => level && level !== 'undefined' && count > 0).length === 0 && (
                            <p className="text-xs text-gray-500 italic col-span-2">No skill data available</p>
                          )}
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setViewMode("machines")}
                          className="w-full"
                          disabled={item.machines.length === 0}
                        >
                          {item.machines.length === 0 ? "No Machines Data" : "View Machines"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Machines View */}
        {viewMode === "machines" && (
          <div className="space-y-6">
            {displayData.filter(item => item.machines.length > 0).length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Machine Data Available</h3>
                <p className="text-gray-500">Machine-specific data requires the EmployeeSkill records to be populated.</p>
                <Button 
                  onClick={() => setViewMode("departments")} 
                  variant="outline" 
                  className="mt-4"
                >
                  View Departments Instead
                </Button>
              </div>
            ) : (
              displayData.filter(item => item.machines.length > 0).map((item) => (
                <div key={item.department.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Factory className="h-5 w-5 text-blue-600" />
                      {item.department.name} Machines
                    </h3>
                    <Badge className={getScoreColor(item.department.averageScore)}>
                      Dept Avg: {item.department.averageScore}%
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {item.machines.map((machine) => (
                      <Card key={machine.id} className="border hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-base">
                              <Cog className="h-4 w-4 text-gray-600" />
                              {machine.name}
                            </CardTitle>
                            <Badge className={getScoreColor(machine.averageSkillLevel)}>
                              {machine.averageSkillLevel}%
                            </Badge>
                          </div>
                          <CardDescription>
                            <span className="flex items-center gap-2">
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {machine.type}
                              </span>
                              <span className="text-xs">
                                {machine.operatorCount} operators
                              </span>
                            </span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p className="text-xs font-medium">Skill Distribution:</p>
                            <div className="space-y-1">
                              {Object.entries(machine.skillDistribution || {})
                                .filter(([level, count]) => level && level !== 'undefined' && count > 0)
                                .map(([level, count]) => (
                                <div key={level} className="flex justify-between items-center text-xs">
                                  <Badge 
                                    variant="outline" 
                                    className={`${getSkillDistributionColor(level)} text-xs`}
                                  >
                                    {level}
                                  </Badge>
                                  <span className="font-medium">{count}</span>
                                </div>
                              ))}
                              {Object.entries(machine.skillDistribution || {})
                                .filter(([level, count]) => level && level !== 'undefined' && count > 0).length === 0 && (
                                <p className="text-xs text-gray-500 italic">No skill data available</p>
                              )}
                            </div>
                            {machine.operatorCount === 0 && (
                              <p className="text-xs text-gray-500 italic">No operators assigned</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs font-medium text-gray-700">Highest Department Score</p>
                  <p className="text-base font-bold text-blue-600">
                    {displayData.length > 0 && 
                      Math.max(...displayData.map(item => item.department.averageScore))}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs font-medium text-gray-700">Total Machines</p>
                  <p className="text-base font-bold text-green-600">
                    {displayData.reduce((total, item) => total + item.machines.length, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-xs font-medium text-gray-700">Total Employees</p>
                  <p className="text-base font-bold text-purple-600">
                    {displayData.reduce((total, item) => total + item.department.employeeCount, 0)}
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

// Helper functions for styling
function getScoreColor(score: number): string {
  if (score >= 80) return "bg-green-100 text-green-800 border-green-200"
  if (score >= 60) return "bg-blue-100 text-blue-800 border-blue-200"
  if (score >= 40) return "bg-orange-100 text-orange-800 border-orange-200"
  return "bg-red-100 text-red-800 border-red-200"
}

function getSkillDistributionColor(level: string): string {
  switch (level.toLowerCase()) {
    case "low":
      return "bg-red-50 text-red-700 border-red-200"
    case "medium":
      return "bg-yellow-50 text-yellow-700 border-yellow-200"
    case "high":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "advanced":
    case "expert":
      return "bg-green-50 text-green-700 border-green-200"
    default:
      return "bg-gray-50 text-gray-700 border-gray-200"
  }
}