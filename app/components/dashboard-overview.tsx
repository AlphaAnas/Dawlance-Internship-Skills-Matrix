"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
  ReferenceArea,
} from "recharts"
import { TrendingUp, Users, Award, Factory, Target, BookOpen, AlertTriangle, CheckCircle, Clock, RefreshCw } from "lucide-react"
import type { Employee } from "@/app/types"
import FullscreenChart from "./FullscreenChart"
import { useDepartmentPerformance } from "@/hooks/useDepartmentPerformance"

interface DepartmentOverviewProps {
  data: Employee[]
}

export default function DepartmentOverview({ data }: DepartmentOverviewProps) {
  // Fetch real department performance data
  const { performanceData, loading: perfLoading, error: perfError, calculateAndRefetch } = useDepartmentPerformance();

  // Calculate performance if data exists but performance data is empty
  useEffect(() => {
    if (data.length > 0 && performanceData.length === 0 && !perfLoading) {
      calculateAndRefetch()
    }
  }, [data, performanceData, perfLoading, calculateAndRefetch])

  // Get current month for chart description
  const currentDate = new Date();
  const currentMonthName = currentDate.toLocaleDateString('en-US', { month: 'short' });
  const currentYear = currentDate.getFullYear();
  const chartDescription = `${currentYear} department performance scores (Jan-${currentMonthName})`;

  // Helper function to normalize skill levels (treat Expert as Advanced)
  const normalizeSkillLevel = (skillLevel: string | undefined) => {
    if (!skillLevel) return '';
    if (skillLevel === 'Expert' || skillLevel === 'Advanced') return 'Advanced';
    return skillLevel;
  };

  // Handle empty data state
  if (data.length === 0) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Users className="h-6 w-6" />
                Total Employees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">0</div>
              <p className="text-blue-100 text-sm">No employees match filters</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Clock className="h-6 w-6" />
                Avg Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">0</div>
              <p className="text-amber-100 text-sm">years average</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Award className="h-6 w-6" />
                Advanced Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">0</div>
              <p className="text-emerald-100 text-sm">0% of workforce</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-500 to-pink-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Users className="h-6 w-6" />
                Gender Diversity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">0%</div>
              <p className="text-pink-100 text-sm">0 women workers</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center py-12">
          <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Found</h3>
          <p className="text-gray-500">No employees match the current filter criteria. Try adjusting your filters.</p>
        </div>
      </div>
    );
  }

  // Calculate meaningful metrics with safe guards for empty data
  const totalEmployees = data.length
  const AdvancedEmployees = data.filter((e) => normalizeSkillLevel(e.skillLevel) === "Advanced").length
  const femaleEmployees = data.filter((e) => e.gender === "Female").length

  const avgExperience = data.length > 0 ? data.reduce((sum, e) => sum + (e.yearsExperience || 0), 0) / data.length : 0

  // Enhanced skill distribution with better colors and safe percentage calculation
  const skillDistribution = [
    {
      name: "Advanced",
      value: data.filter((e) => normalizeSkillLevel(e.skillLevel) === "Advanced").length,
      color: "#10B981",
      percentage: totalEmployees > 0 ? Math.round((data.filter((e) => normalizeSkillLevel(e.skillLevel) === "Advanced").length / totalEmployees) * 100) : 0
    },
    {
      name: "High",
      value: data.filter((e) => e.skillLevel === "High").length,
      color: "#3B82F6",
      percentage: totalEmployees > 0 ? Math.round((data.filter((e) => e.skillLevel === "High").length / totalEmployees) * 100) : 0
    },
    {
      name: "Medium",
      value: data.filter((e) => e.skillLevel === "Medium").length,
      color: "#F59E0B",
      percentage: totalEmployees > 0 ? Math.round((data.filter((e) => e.skillLevel === "Medium").length / totalEmployees) * 100) : 0
    },
    {
      name: "Low",
      value: data.filter((e) => e.skillLevel === "Low").length,
      color: "#EF4444",
      percentage: totalEmployees > 0 ? Math.round((data.filter((e) => e.skillLevel === "Low").length / totalEmployees) * 100) : 0
    },
  ]

  // Department workforce with efficiency metrics
  const departments = [...new Set(data.map((employee) => employee.department))]
  const departmentSizes = departments.map((dept, index) => {
    const employees = data.filter((e) => e.department === dept)
    const avgSkillLevel = employees.reduce((sum, e) => {
      const skillMap = { Advanced: 4, Expert: 4, High: 3, Medium: 2, Low: 1 }
      return sum + skillMap[e.skillLevel as keyof typeof skillMap]
    }, 0) / employees.length

    const colors = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899", "#F97316"]
    return {
      name: dept,
      size: employees.length,
      avgSkill: Math.round(avgSkillLevel * 25), // Convert to percentage
      color: colors[index % colors.length],
    }
  })

  // Gender distribution with more insights - updated labels
  const genderSkillData = [
    {
      skillLevel: "Advanced",
      Men: data.filter((e) => normalizeSkillLevel(e.skillLevel) === "Advanced" && e.gender === "Male").length,
      Women: data.filter((e) => normalizeSkillLevel(e.skillLevel) === "Advanced" && e.gender === "Female").length,
    },
    {
      skillLevel: "High",
      Men: data.filter((e) => e.skillLevel === "High" && e.gender === "Male").length,
      Women: data.filter((e) => e.skillLevel === "High" && e.gender === "Female").length,
    },
    {
      skillLevel: "Medium",
      Men: data.filter((e) => e.skillLevel === "Medium" && e.gender === "Male").length,
      Women: data.filter((e) => e.skillLevel === "Medium" && e.gender === "Female").length,
    },
    {
      skillLevel: "Low",
      Men: data.filter((e) => e.skillLevel === "Low" && e.gender === "Male").length,
      Women: data.filter((e) => e.skillLevel === "Low" && e.gender === "Female").length,
    },
  ]

  // Enhanced experience vs skill with gender-based colors
  const experienceSkillData = data.map((employee) => {
    const skillLevelMap = { Advanced: 4, Expert: 4, High: 3, Medium: 2, Low: 1 }

    return {
      experience: employee.yearsExperience,
      skillLevel: skillLevelMap[employee.skillLevel as keyof typeof skillLevelMap],
      name: employee.name,
      department: employee.department,
      gender: employee.gender,
      color: employee.gender === "Female" ? "#EC4899" : "#3B82F6", // Pink for women, blue for men
    }
  })

  // Years of experience distribution analysis
  const experienceRanges = [
    { range: "0-2 years", min: 0, max: 2, color: "#EF4444" },
    { range: "3-5 years", min: 3, max: 5, color: "#F59E0B" },
    { range: "6-10 years", min: 6, max: 10, color: "#10B981" },
    { range: "11-15 years", min: 11, max: 15, color: "#3B82F6" },
    { range: "16+ years", min: 16, max: 100, color: "#8B5CF6" }
  ]

  const experienceDistribution = experienceRanges.map(range => {
    const count = data.filter(emp => (emp.yearsExperience || 0) >= range.min && (emp.yearsExperience || 0) <= range.max).length
    return {
      range: range.range,
      count: count,
      percentage: totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0,
      color: range.color
    }
  })

  // Workforce composition treemap with better colors
  const treemapData = departments.map((dept, index) => {
    const employees = data.filter((e) => e.department === dept)
    const colors = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899", "#F97316", "#14B8A6", "#F472B6", "#A855F7"]
    return {
      name: dept,
      size: employees.length,
      fill: colors[index % colors.length],
    }
  })

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Enhanced Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Users className="h-6 w-6" />
              Total Workforce
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{totalEmployees}</div>
            <p className="text-blue-100 text-sm">Avg. {avgExperience.toFixed(1)} years experience</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Award className="h-6 w-6" />
              Advanced Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{AdvancedEmployees}</div>
            <p className="text-emerald-100 text-sm">
              {totalEmployees > 0 ? Math.round((AdvancedEmployees / totalEmployees) * 100) : 0}% of workforce
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-500 to-pink-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Users className="h-6 w-6" />
              Gender Diversity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{totalEmployees > 0 ? Math.round((femaleEmployees / totalEmployees) * 100) : 0}%</div>
            <p className="text-pink-100 text-sm">{femaleEmployees} women workers</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Skill Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Target className="h-5 w-5 text-purple-600" />
                Skill Level Distribution
              </CardTitle>
              <CardDescription>Current workforce capability breakdown</CardDescription>
            </div>
            <FullscreenChart 
              title="Skill Level Distribution" 
              description="Current workforce capability breakdown"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={skillDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {skillDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} employees (${props.payload.percentage}%)`,
                      "Count"
                    ]}
                    contentStyle={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </FullscreenChart>
          </CardHeader>
          <CardContent className="h-[320px] pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={skillDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {skillDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value} employees (${props.payload.percentage}%)`,
                    "Count"
                  ]}
                  contentStyle={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Enhanced Gender Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Users className="h-5 w-5 text-pink-600" />
                Gender by Skill Level
              </CardTitle>
              <CardDescription>Diversity across skill levels</CardDescription>
            </div>
            <FullscreenChart 
              title="Gender by Skill Level" 
              description="Diversity across skill levels"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={genderSkillData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="skillLevel" fontSize={12} />
                  <YAxis fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Men" stackId="a" fill="#3B82F6" name="Men" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="Women" stackId="a" fill="#EC4899" name="Women" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </FullscreenChart>
          </CardHeader>
          <CardContent className="h-[320px] pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genderSkillData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="skillLevel" fontSize={12} />
                <YAxis fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="Men" stackId="a" fill="#3B82F6" name="Men" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Women" stackId="a" fill="#EC4899" name="Women" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>



      </div>

      {/* Second Row - Experience and Performance */}
      <div className="grid grid-cols-1 gap-6">
        {/* Department Efficiency */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Factory className="h-5 w-5 text-blue-600" />
                Department Overview
              </CardTitle>
              <CardDescription>Size and average skill level</CardDescription>
            </div>
            <FullscreenChart 
              title="Department Overview" 
              description="Size and average skill level"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentSizes} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={10} />
                  <YAxis yAxisId="left" fontSize={11} />
                  <YAxis yAxisId="right" orientation="right" fontSize={11} />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'size' ? `${value} employees` : `${value}% avg skill`,
                      name === 'size' ? 'Workforce' : 'Skill Level'
                    ]}
                    contentStyle={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar yAxisId="left" dataKey="size" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" dataKey="avgSkill" stroke="#F59E0B" strokeWidth={3} />
                </BarChart>
              </ResponsiveContainer>
            </FullscreenChart>
          </CardHeader>
          <CardContent className="h-[450px] pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentSizes} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={10} />
                <YAxis yAxisId="left" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" fontSize={11} />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'size' ? `${value} employees` : `${value}% avg skill`,
                    name === 'size' ? 'Workforce' : 'Skill Level'
                  ]}
                  contentStyle={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar yAxisId="left" dataKey="size" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" dataKey="avgSkill" stroke="#F59E0B" strokeWidth={3} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Enhanced Department Performance */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Award className="h-5 w-5 text-orange-600" />
                Department Performance Trends
              </CardTitle>
              <CardDescription>{chartDescription}</CardDescription>
            </div>
            <FullscreenChart 
              title="Department Performance Trends" 
              description={chartDescription}
            >
              <ResponsiveContainer width="100%" height="100%">
                {perfLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : perfError ? (
                  <div className="flex items-center justify-center h-full text-red-500">
                    <AlertTriangle className="h-6 w-6 mr-2" />
                    Error loading performance data
                  </div>
                ) : (
                  <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" fontSize={11} />
                    <YAxis domain={[0, 100]} fontSize={11} />
                    <Tooltip
                      formatter={(value, name) => [
                        `${value}%`,
                        `${name} Performance`
                      ]}
                      labelFormatter={(label) => `Month: ${label}`}
                      contentStyle={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    {performanceData.length > 0 && Object.keys(performanceData[0]).filter(key => key !== 'month').map((dept, index) => {
                      const colors = ['#EF4444', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899'];
                      return (
                        <Line 
                          key={dept}
                          type="monotone" 
                          dataKey={dept} 
                          stroke={colors[index % colors.length]} 
                          strokeWidth={3} 
                          name={dept} 
                        />
                      );
                    })}
                  </LineChart>
                )}
              </ResponsiveContainer>
            </FullscreenChart>
          </CardHeader>
          <CardContent className="h-[480px] pt-6">
            <ResponsiveContainer width="100%" height="100%">
              {perfLoading ? (
                <div className="flex items-center justify-center h-full">
                  <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : perfError ? (
                <div className="flex items-center justify-center h-full text-red-500">
                  <AlertTriangle className="h-6 w-6 mr-2" />
                  Error loading performance data
                </div>
              ) : (
                <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" fontSize={11} />
                  <YAxis domain={[0, 100]} fontSize={11} />
                  <Tooltip
                    formatter={(value, name) => [
                      `${value}%`,
                      `${name} Performance`
                    ]}
                    labelFormatter={(label) => `Month: ${label}`}
                    contentStyle={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  {performanceData.length > 0 && Object.keys(performanceData[0]).filter(key => key !== 'month').map((dept, index) => {
                    const colors = ['#EF4444', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899'];
                    return (
                      <Line 
                        key={dept}
                        type="monotone" 
                        dataKey={dept} 
                        stroke={colors[index % colors.length]} 
                        strokeWidth={3} 
                        name={dept} 
                      />
                    );
                  })}
                </LineChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Third Row - Experience Analysis and Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Years of Experience Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Clock className="h-5 w-5 text-emerald-600" />
                Years of Experience Distribution
              </CardTitle>
              <CardDescription>Workforce experience level breakdown</CardDescription>
            </div>
            <FullscreenChart 
              title="Years of Experience Distribution" 
              description="Workforce experience level breakdown"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={experienceDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="range" angle={-45} textAnchor="end" height={80} fontSize={10} />
                  <YAxis tickFormatter={(value) => `${value}`} fontSize={11} />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "count") return [`${value} employees`, "Count"]
                      return [value, name]
                    }}
                    labelFormatter={(label) => {
                      const range = experienceDistribution.find((d) => d.range === label)
                      return range ? `${label} (${range.percentage}% of workforce)` : label
                    }}
                    contentStyle={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Employees">
                    {experienceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </FullscreenChart>
          </CardHeader>
          <CardContent className="h-[350px] pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={experienceDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="range" angle={-45} textAnchor="end" height={80} fontSize={10} />
                <YAxis tickFormatter={(value) => `${value}`} fontSize={11} />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "count") return [`${value} employees`, "Count"]
                    return [value, name]
                  }}
                  labelFormatter={(label) => {
                    const range = experienceDistribution.find((d) => d.range === label)
                    return range ? `${label} (${range.percentage}% of workforce)` : label
                  }}
                  contentStyle={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Employees">
                  {experienceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* add here */}
        {/* Enhanced Experience vs Skill with Bands and Gender Colors */}
        <Card className="border-0 shadow-lg bg-transparent">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Experience vs Skill Correlation
              </CardTitle>
              <CardDescription>Employee experience and skill level by gender</CardDescription>
            </div>
            <FullscreenChart 
              title="Experience vs Skill Correlation" 
              description="Employee experience and skill level by gender"
            >
              <div className="h-full">
                {/* Skill Band Labels */}
                <div className="grid grid-cols-4 text-center text-sm text-gray-500 pb-2">
                  <div className="bg-red-100 py-1 rounded">Low</div>
                  <div className="bg-yellow-100 py-1 rounded">Medium</div>
                  <div className="bg-blue-100 py-1 rounded">High</div>
                  <div className="bg-green-100 py-1 rounded">Advanced</div>
                </div>
                <div className="relative h-[calc(100%-3rem)] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        type="number"
                        dataKey="experience"
                        name="Experience"
                        unit=" years"
                        domain={[0, "dataMax + 2"]}
                      />
                      <YAxis
                        type="number"
                        dataKey="skillLevel"
                        name="Skill Level"
                        domain={[0.5, 4.5]}
                        tickFormatter={(value) => {
                          const levels = ["", "Low", "Medium", "High", "Advanced"]
                          return levels[Math.round(value)] || ""
                        }}
                      />
                      
                      {/* Skill Level Bands - Darker colors for better visibility in fullscreen */}
                      <ReferenceArea y1={0.5} y2={1.5} fill="#FCA5A5" fillOpacity={0.6} ifOverflow="extendDomain" />
                      <ReferenceArea y1={1.5} y2={2.5} fill="#FCD34D" fillOpacity={0.6} ifOverflow="extendDomain" />
                      <ReferenceArea y1={2.5} y2={3.5} fill="#93C5FD" fillOpacity={0.6} ifOverflow="extendDomain" />
                      <ReferenceArea y1={3.5} y2={4.5} fill="#6EE7B7" fillOpacity={0.6} ifOverflow="extendDomain" />
                      
                      <Tooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        formatter={(value, name, props) => {
                          if (name === "skillLevel") {
                            const levels = ["", "Low", "Medium", "High", "Advanced"]
                            const numValue = Number(value)
                            return [levels[numValue] || value, "Skill Level"]
                          }
                          return [value, name]
                        }}
                        labelFormatter={() => ""}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length > 0) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                <p className="font-semibold">{data.name}</p>
                                <p className="text-sm text-gray-600">{data.department}</p>
                                <p className="text-sm">Experience: {data.experience} years</p>
                                <p className="text-sm">
                                  Skill Level: {["", "Low", "Medium", "High", "Advanced"][data.skillLevel]}
                                </p>
                                <p className="text-sm">Gender: {data.gender}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      
                      <Legend
                        content={() => (
                          <div className="flex justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                              <span className="text-sm text-gray-600">Men</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                              <span className="text-sm text-gray-600">Women</span>
                            </div>
                          </div>
                        )}
                      />
                      
                      <Scatter name="Employees" data={experienceSkillData} fill="#8884d8">
                        {experienceSkillData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </FullscreenChart>
          </CardHeader>

  <CardContent className="h-[460px] pt-4 bg-white">
    {/* Skill Band Labels */}
    <div className="grid grid-cols-4 text-center text-sm text-gray-500 pb-2">
      <div className="bg-red-100 py-1 rounded">Low</div>
      <div className="bg-yellow-100 py-1 rounded">Medium</div>
      <div className="bg-blue-100 py-1 rounded">High</div>
      <div className="bg-green-100 py-1 rounded">Advanced </div>
    </div>
    <div className="relative h-full w-full">
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

        <XAxis
          type="number"
          dataKey="experience"
          name="Experience"
          unit=" years"
          domain={[0, "dataMax + 2"]}
        />
        <YAxis
          type="number"
          dataKey="skillLevel"
          name="Skill Level"
          domain={[0.5, 4.5]}
          tickFormatter={(value) => {
            const levels = ["", "Low", "Medium", "High", "Advanced"]
            return levels[Math.round(value)] || ""
          }}
        />

        {/* Skill Level Bands - place after axis so they're not covered */}
      {/* Darker Skill Level Bands rendered first for background visibility */}
      <ReferenceArea y1={0.5} y2={1.5} fill="#FCA5A5" fillOpacity={0.6} ifOverflow="extendDomain" /> {/* Red-400 */}
      <ReferenceArea y1={1.5} y2={2.5} fill="#FCD34D" fillOpacity={0.6} ifOverflow="extendDomain" /> {/* Yellow-400 */}
      <ReferenceArea y1={2.5} y2={3.5} fill="#93C5FD" fillOpacity={0.6} ifOverflow="extendDomain" /> {/* Blue-400 */}
      <ReferenceArea y1={3.5} y2={4.5} fill="#6EE7B7" fillOpacity={0.6} ifOverflow="extendDomain" /> {/* Green-400 */}


        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          formatter={(value, name) => {
            if (name === "skillLevel") {
              const levels = ["", "Low", "Medium", "High", "Advanced"]
              return [levels[value as number], "Skill Level"]
            }
            return [value, name]
          }}
          labelFormatter={(value, payload) => {
            if (payload && payload.length > 0) {
              const data = payload[0].payload
              return `${data.name} - ${value} years experience (${data.gender === 'Female' ? 'Woman' : 'Man'})`
            }
            return `${value} years experience`
          }}
          contentStyle={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
          }}
        />

        <Legend
          content={() => (
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600">Men</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                <span className="text-sm text-gray-600">Women</span>
              </div>
            </div>
          )}
        />

        <Scatter name="Employees" data={experienceSkillData} fill="#8884d8">
          {experienceSkillData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
    </div>
  </CardContent>
</Card>

      </div>
    </div>
  )
}