"use client"

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Search, Save, Users, Award, CheckCircle, Building2, Edit3, Eye, Plus, Table2, ChevronDown } from 'lucide-react'
import PieChartSkillIndicator from '../components/PieChartSkillIndicator'
import { skillsMatrices, type SkillsMatrix } from '../data/skillMatrices'
import { useRouter } from "next/navigation"



// Mock data for demonstration
const enhancedEmployees = [
  {
    name: "John Smith",
    displayId: "EMP001",
    departmentId: 1,
    skills: {
      "Machine Operation": "Highly Skilled",
      "Quality Control": "Skilled",
      "Safety Protocols": "Highly Skilled"
    }
  },
  {
    name: "Sarah Johnson",
    displayId: "EMP002", 
    departmentId: 1,
    skills: {
      "Machine Operation": "Skilled",
      "Quality Control": "Highly Skilled",
      "Safety Protocols": "Skilled"
    }
  },
  {
    name: "Mike Chen",
    displayId: "EMP003",
    departmentId: 2,
    skills: {
      "Testing Equipment": "Highly Skilled",
      "Documentation": "Skilled",
      "Analysis": "Semi Skilled"
    }
  }
]

const enhancedSkills = [
  { name: "Machine Operation", departmentId: "1" },
  { name: "Quality Control", departmentId: "1" },
  { name: "Safety Protocols", departmentId: "1" },
  { name: "Testing Equipment", departmentId: "2" },
  { name: "Documentation", departmentId: "2" },
  { name: "Analysis", departmentId: "2" }
]

const departmentMap: Record<string, string> = {
  "1": "Production",
  "2": "Quality Control",
  "3": "Maintenance",
  "4": "Packaging",
  "5": "Logistics",
}

const skillLevelColors = {
  None: "bg-gray-100 text-gray-600 border-gray-200",
  "Low Skilled": "bg-red-100 text-red-700 border-red-200",
  "Semi Skilled": "bg-yellow-100 text-yellow-700 border-yellow-200",
  Skilled: "bg-blue-100 text-blue-700 border-blue-200",
  "Highly Skilled": "bg-green-100 text-green-700 border-green-200",
}

// Card Components
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="p-8 pb-4">{children}</div>
)

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-8 pt-4 ${className}`}>{children}</div>
)

const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-3xl font-bold text-gray-900 ${className}`}>{children}</h3>
)

const CardDescription = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-lg text-gray-600 mt-3 ${className}`}>{children}</p>
)

// Form Components
const Label = ({ children, htmlFor, className = "" }: { children: React.ReactNode; htmlFor?: string; className?: string }) => (
  <label htmlFor={htmlFor} className={`block text-lg font-semibold text-gray-700 mb-3 ${className}`}>
    {children}
  </label>
)

const Input = ({ value, onChange, placeholder, className = "", ...props }: any) => (
  <input
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors ${className}`}
    {...props}
  />
)

const Button = ({ children, onClick, className = "", variant = "primary", size = "md", ...props }: any) => {
  const baseClasses = "font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-3"
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 border-2 border-gray-200",
    destructive: "bg-red-600 hover:bg-red-700 text-white",
    outline: "border-2 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700"
  }
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base", 
    lg: "px-8 py-4 text-lg"
  }
  
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

const Select = ({ value, onValueChange, children, placeholder }: any) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-lg text-left border-2 border-gray-200 rounded-xl bg-white hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors flex items-center justify-between"
      >
        <span>{value || placeholder}</span>
        <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
          {React.Children.map(children, (child) =>
            React.cloneElement(child, {
              onClick: () => {
                onValueChange(child.props.value)
                setIsOpen(false)
              }
            })
          )}
        </div>
      )}
    </div>
  )
}

const SelectItem = ({ value, children, onClick }: any) => (
  <div
    onClick={onClick}
    className="px-6 py-4 text-lg hover:bg-gray-50 cursor-pointer transition-colors"
  >
    {children}
  </div>
)

const Badge = ({ children, className = "", variant = "default" }: any) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800",
    secondary: "bg-gray-100 text-gray-800"
  }
  
  return (
    <span className={`inline-flex items-center px-4 py-2 rounded-full text-base font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

// Table Components  
const Table = ({ children }: { children: React.ReactNode }) => (
  <table className="w-full">{children}</table>
)

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead>{children}</thead>
)

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody>{children}</tbody>
)

const TableRow = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <tr className={className}>{children}</tr>
)

const TableHead = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <th className={`text-left font-bold ${className}`}>{children}</th>
)

const TableCell = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <td className={className}>{children}</td>
)

export default function SkillsMappingPage() {
  const [employees, setEmployees] = useState<any[]>([])
  const router = useRouter();
  const [skills, setSkills] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const [selectedMatrix, setSelectedMatrix] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  // Memoized department options
  const departmentOptions = useMemo(() => {
    return Array.from(new Set(enhancedEmployees.map((emp) => emp.departmentId.toString())))
  }, [])

  // Memoized matrices for selected department
  const departmentMatrices = useMemo(() => {
    if (!selectedDepartment) return []
    return skillsMatrices.filter(matrix => matrix.departmentId === selectedDepartment)
  }, [selectedDepartment])

  // Get current matrix data
  const currentMatrix = useMemo(() => {
    return skillsMatrices.find(matrix => matrix.id === selectedMatrix)
  }, [selectedMatrix])

  // Load data - using setTimeout to simulate API call
  useEffect(() => {
    const timer = setTimeout(() => {
      setEmployees(enhancedEmployees)
      setSkills(enhancedSkills)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  // Reset matrix selection when department changes
  useEffect(() => {
    setSelectedMatrix("")
    setIsEditMode(false)
  }, [selectedDepartment])

  // Memoized filtered employees from current matrix
  const filteredEmployees = useMemo(() => {
    if (!currentMatrix) return []
    
    return currentMatrix.employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Object.keys(emp.skills).some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [searchTerm, currentMatrix])

  // Memoized getSkillLevel function
  const getSkillLevel = useCallback((employee: any, skillName: string): string => {
    return employee.skills?.[skillName] || "None"
  }, [])

  // Optimized skill change handler
  const handleSkillChange = useCallback((employeeName: string, skillName: string, level: string) => {
    if (!currentMatrix) return
    
    // Update the matrix data (in a real app, this would update the backend)
    const updatedMatrix = {
      ...currentMatrix,
      employees: currentMatrix.employees.map((emp) => {
        if (emp.name === employeeName) {
          return {
            ...emp,
            skills: {
              ...emp.skills,
              [skillName]: level,
            },
          }
        }
        return emp
      })
    }
    
    // Update local state (in a real app, you'd update your global state/backend)
    console.log('Updated matrix:', updatedMatrix)
  }, [currentMatrix])

  // Optimized save handler
  const handleSave = useCallback(() => {
    setSaved(true)
    setIsEditMode(false)
    const timer = setTimeout(() => setSaved(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  // Toggle edit mode
  const toggleEditMode = useCallback(() => {
    setIsEditMode(!isEditMode)
    if (saved) setSaved(false)
  }, [isEditMode, saved])

  // Navigate to skills matrix maker
  const navigateToMatrixMaker = useCallback(() => {
    // In a real Next.js app, you'd use router.push('/skills_matrix_maker')
    router.push('/skills_matrix_maker')
    console.log('Navigate to skills matrix maker')
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <Card className="w-80">
          <CardContent className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8">
      <div className="max-w-none mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Employee Skills Mapping
          </h1>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Interactive matrix for managing and updating employee skill levels across departments
          </p>
          
          {/* Action Buttons */}
          <div className="flex justify-center gap-6 pt-6">
            <Button
              onClick={navigateToMatrixMaker}
              size="lg"
              className="h-16 px-10 text-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Plus className="h-6 w-6 mr-3" />
              Create New Matrix
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <Card className="border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-4 text-2xl">
                <Users className="h-8 w-8 text-blue-600" />
                Department Selection
              </CardTitle>
              <CardDescription className="text-xl">Choose a department to view matrices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label htmlFor="department-select">Department</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment} placeholder="Select a department">
                  {departmentOptions.map((deptId) => (
                    <SelectItem key={deptId} value={deptId}>
                      {departmentMap[deptId] || deptId}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </CardContent>
          </Card>

          {selectedDepartment && departmentMatrices.length > 0 && (
            <Card className="border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-4 text-2xl">
                  <Table2 className="h-8 w-8 text-purple-600" />
                  Skills Matrix
                </CardTitle>
                <CardDescription className="text-xl">Select a skills matrix to view</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label htmlFor="matrix-select">Available Matrices</Label>
                  <Select value={selectedMatrix} onValueChange={setSelectedMatrix} placeholder="Select a matrix">
                    {departmentMatrices.map((matrix) => (
                      <SelectItem key={matrix.id} value={matrix.id}>
                        {matrix.name}
                      </SelectItem>
                    ))}
                  </Select>
                  {selectedMatrix && currentMatrix && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-base text-gray-700 font-medium">{currentMatrix.description}</p>
                      <p className="text-sm text-gray-500 mt-2">Created: {currentMatrix.createdAt}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedMatrix && currentMatrix && (
            <Card className="border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-4 text-2xl">
                  <Search className="h-8 w-8 text-green-600" />
                  Search & Filter
                </CardTitle>
                <CardDescription className="text-xl">Find specific employees or skills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label htmlFor="search-input">Search employees or skills</Label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                    <Input
                      id="search-input"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search..."
                      className="pl-14 text-xl"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Skills Legend */}
        {selectedMatrix && currentMatrix && (
          <Card className="border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-4 text-2xl">
                <Award className="h-8 w-8 text-purple-600" />
                Skill Level Legend
              </CardTitle>
              <CardDescription className="text-xl">Understanding the pie chart skill indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                {Object.entries(skillLevelColors).map(([level, colorClass]) => (
                  <div key={level} className="flex items-center gap-4">
                    <PieChartSkillIndicator level={level} size={48} />
                    <Badge className={`${colorClass} px-5 py-3 text-lg font-semibold border-2`}>{level}</Badge>
                  </div>
                ))}
              </div>
              
              {/* Edit Mode Instructions */}
              <div className={`mt-6 pt-6 border-t-2 ${
                isEditMode 
                  ? "border-red-200 bg-red-50/50" 
                  : "border-gray-200"
              }`}>
                <div className="flex items-start gap-4">
                  {isEditMode ? (
                    <>
                      <Edit3 className="h-7 w-7 text-red-600 mt-1" />
                      <div>
                        <p className="text-lg font-semibold text-red-800">Edit Mode Active</p>
                        <p className="text-lg text-red-600 mt-2">
                          You can now modify skill levels using the dropdown menus. Click "Save Changes" when done.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Eye className="h-7 w-7 text-gray-600 mt-1" />
                      <div>
                        <p className="text-lg font-semibold text-gray-800">View Mode</p>
                        <p className="text-lg text-gray-600 mt-2">
                          Skills are displayed as pie chart indicators showing completion percentage. Click "Edit Mode" to make changes.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skills Matrix Table */}
        {selectedMatrix && currentMatrix && filteredEmployees.length > 0 && (
          <Card className="border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <CardTitle className="text-3xl">{currentMatrix.name}</CardTitle>
                    {isEditMode && (
                      <Badge variant="destructive" className="px-4 py-2 text-lg">
                        <Edit3 className="h-5 w-5 mr-2" />
                        Editing
                      </Badge>
                    )}
                    {!isEditMode && (
                      <Badge variant="secondary" className="px-4 py-2 text-lg">
                        <Eye className="h-5 w-5 mr-2" />
                        View Only
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-xl">
                    {filteredEmployees.length} employees • {currentMatrix.skills.length} skills
                  </CardDescription>
                </div>
                <div className="flex gap-4">
                  <Button
                    onClick={toggleEditMode}
                    size="lg"
                    variant={isEditMode ? "destructive" : "secondary"}
                    className="h-16 px-10 text-xl"
                  >
                    {isEditMode ? (
                      <>
                        <Eye className="h-6 w-6 mr-3" />
                        View Mode
                      </>
                    ) : (
                      <>
                        <Edit3 className="h-6 w-6 mr-3" />
                        Edit Mode
                      </>
                    )}
                  </Button>
                  {isEditMode && (
                    <Button
                      onClick={handleSave}
                      size="lg"
                      className="h-16 px-10 text-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {saved ? (
                        <>
                          <CheckCircle className="h-6 w-6 mr-3" />
                          Saved!
                        </>
                      ) : (
                        <>
                          <Save className="h-6 w-6 mr-3" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border-2 border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-800 hover:bg-slate-800">
                        <TableHead className="text-white font-bold text-xl py-6 px-8 sticky left-0 z-20 bg-slate-800 min-w-[280px]">
                          Employee
                        </TableHead>
                        {currentMatrix.skills.map((skill, index) => (
                          <TableHead
                            key={`skill-${index}`}
                            className="text-white font-bold text-xl py-6 px-8 text-center min-w-[220px] whitespace-nowrap"
                          >
                            {skill}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployees.map((emp, idx) => (
                        <TableRow
                          key={`emp-${idx}`}
                          className={`${
                            idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-blue-50 transition-colors`}
                        >
                          <TableCell className="font-semibold text-lg py-8 px-8 sticky left-0 z-10 bg-inherit border-r-2 border-gray-200">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                  {emp.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)}
                                </span>
                              </div>
                              <div>
                                <div className="font-bold text-xl text-gray-900">{emp.name}</div>
                                <div className="text-lg text-gray-500">ID: {emp.displayId}</div>
                              </div>
                            </div>
                          </TableCell>
                          {currentMatrix.skills.map((skill, skillIdx) => (
                            <TableCell key={`skill-${skillIdx}`} className="py-8 px-8 text-center">
                              {!isEditMode || saved ? (
                                <div className="flex justify-center">
                                  <PieChartSkillIndicator level={getSkillLevel(emp, skill)} size={80} />
                                </div>
                              ) : (
                                <div className="flex justify-center">
                                  <Select
                                    value={getSkillLevel(emp, skill)}
                                    onValueChange={(value) => handleSkillChange(emp.name, skill, value)}
                                    placeholder="Select level"
                                  >
                                    {Object.entries(skillLevelColors).map(([level]) => (
                                      <SelectItem key={level} value={level}>
                                        <div className="flex items-center gap-3">
                                          <PieChartSkillIndicator level={level} size={24} />
                                          {level}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </Select>
                                </div>
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State - No Matrix Selected */}
        {selectedDepartment && departmentMatrices.length > 0 && !selectedMatrix && (
          <Card className="border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="text-center py-20">
              <Table2 className="h-20 w-20 text-gray-400 mx-auto mb-8" />
              <h3 className="text-3xl font-bold text-gray-600 mb-4">Select a Skills Matrix</h3>
              <p className="text-xl text-gray-500">
                Choose from {departmentMatrices.length} available matrices for {departmentMap[selectedDepartment]}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Empty State - No Matrices in Department */}
        {selectedDepartment && departmentMatrices.length === 0 && (
          <Card className="border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="text-center py-20">
              <Table2 className="h-20 w-20 text-gray-400 mx-auto mb-8" />
              <h3 className="text-3xl font-bold text-gray-600 mb-4">No Skills Matrices Found</h3>
              <p className="text-xl text-gray-500 mb-8">
                No skills matrices have been created for {departmentMap[selectedDepartment]} yet
              </p>
              <Button
                onClick={navigateToMatrixMaker}
                size="lg"
                className="h-16 px-10 text-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Plus className="h-6 w-6 mr-3" />
                Create First Matrix
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Empty State - No Employees Found */}
        {selectedMatrix && currentMatrix && filteredEmployees.length === 0 && (
          <Card className="border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="text-center py-20">
              <Users className="h-20 w-20 text-gray-400 mx-auto mb-8" />
              <h3 className="text-3xl font-bold text-gray-600 mb-4">No employees found</h3>
              <p className="text-xl text-gray-500">
                Try adjusting your search terms or select a different matrix
              </p>
            </CardContent>
          </Card>
        )}

        {/* No Department Selected */}
        {!selectedDepartment && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="text-center py-20">
                <Building2 className="h-20 w-20 text-gray-400 mx-auto mb-8" />
                <h3 className="text-3xl font-bold text-gray-600 mb-4">Select a Department</h3>
                <p className="text-xl text-gray-500">
                  Choose a department from the dropdown above to view available skills matrices
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-sm">
              <CardContent className="text-center py-20">
                <Table2 className="h-20 w-20 text-green-600 mx-auto mb-8" />
                <h3 className="text-3xl font-bold text-green-700 mb-4">Create Custom Matrix</h3>
                <p className="text-xl text-green-600 mb-8">
                  Need a different structure? Create your own skills matrix with custom columns and rows
                </p>
                <Button
                  onClick={navigateToMatrixMaker}
                  size="lg"
                  className="h-16 px-10 text-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Plus className="h-6 w-6 mr-3" />
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}