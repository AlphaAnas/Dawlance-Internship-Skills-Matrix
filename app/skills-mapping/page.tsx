"use client"

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Search, Save, Users, Award, CheckCircle, Building2, Edit3, Eye, Plus, Table2, ChevronDown, Filter } from 'lucide-react'
import PieChartSkillIndicator from '../components/PieChartSkillIndicator'
import SkillsMatrixCard from '../components/SkillsMatrixCard'
import FilterPanel from '../components/FilterPanel'
import { skillsMatrices, departments, getAllMatrices, getMatrixById, type SkillsMatrix } from '../data/skillMatrices'
import { useRouter } from "next/navigation"

const skillLevelColors = {
  None: "bg-gray-100 text-gray-600 border-gray-200",
  "Low Skilled": "bg-red-100 text-red-700 border-red-200",
  "Semi Skilled": "bg-yellow-100 text-yellow-700 border-yellow-200",
  Skilled: "bg-blue-100 text-blue-700 border-blue-200",
  "Highly Skilled": "bg-green-100 text-green-700 border-green-200",
}

// Enhanced UI Components with Orange/Blue Theme
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl ${className}`}>
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

const Button = ({ children, onClick, className = "", variant = "primary", size = "md", ...props }: any) => {
  const baseClasses = "font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 transform hover:scale-105 active:scale-95"
  const variants = {
    primary: "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl",
    destructive: "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl",
    outline: "border-2 border-orange-300 hover:border-orange-400 bg-white hover:bg-orange-50 text-orange-700 shadow-lg hover:shadow-xl"
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

const Input = ({ value, onChange, placeholder, className = "", ...props }: any) => (
  <input
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all duration-200 ${className}`}
    {...props}
  />
)

const Select = ({ value, onValueChange, children, placeholder }: any) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-lg text-left border-2 border-gray-200 rounded-xl bg-white hover:border-orange-300 focus:border-orange-500 focus:outline-none transition-all duration-200 flex items-center justify-between"
      >
        <span>{value || placeholder}</span>
        <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto animate-in fade-in-0 zoom-in-95">
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
    className="px-6 py-4 text-lg hover:bg-orange-50 cursor-pointer transition-colors duration-200"
  >
    {children}
  </div>
)

const Badge = ({ children, className = "", variant = "default" }: any) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800",
    secondary: "bg-blue-100 text-blue-800",
    orange: "bg-orange-100 text-orange-800"
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
  <tr className={`transition-colors duration-200 ${className}`}>{children}</tr>
)

const TableHead = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <th className={`text-left font-bold ${className}`}>{children}</th>
)

const TableCell = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <td className={className}>{children}</td>
)

export default function EnhancedSkillsMapping() {
  const router = useRouter();
  const [selectedMatrix, setSelectedMatrix] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const [showMatricesOnly, setShowMatricesOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Load data with animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  // Filter matrices based on all criteria
  const filteredMatrices = useMemo(() => {
    let matrices = getAllMatrices()
    
    // Department filter
    if (selectedDepartment) {
      matrices = matrices.filter(matrix => matrix.departmentId === selectedDepartment)
    }
    
    // Search filter
    if (searchTerm) {
      matrices = matrices.filter(matrix => 
        matrix.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        matrix.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        matrix.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    
    return matrices
  }, [selectedDepartment, searchTerm])

  // Get current matrix data
  const currentMatrix = useMemo(() => {
    return getMatrixById(selectedMatrix)
  }, [selectedMatrix])

  // Filter employees within selected matrix
  const filteredEmployees = useMemo(() => {
    if (!currentMatrix) return []
    
    return currentMatrix.employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
        Object.keys(emp.skills).some((skill) => skill.toLowerCase().includes(employeeSearchTerm.toLowerCase()))
    )
  }, [employeeSearchTerm, currentMatrix])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSelectedDepartment("")
    setSearchTerm("")
    setShowMatricesOnly(false)
  }, [])

  // Skill level management
  const getSkillLevel = useCallback((employee: any, skillName: string): string => {
    return employee.skills?.[skillName] || "None"
  }, [])

  const handleSkillChange = useCallback((employeeName: string, skillName: string, level: string) => {
    if (!currentMatrix) return
    
    // In a real app, this would update the backend
    console.log(`Updated ${employeeName}'s ${skillName} to ${level}`)
  }, [currentMatrix])

  // Save and edit handlers
  const handleSave = useCallback(() => {
    setSaved(true)
    setIsEditMode(false)
    const timer = setTimeout(() => setSaved(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const toggleEditMode = useCallback(() => {
    setIsEditMode(!isEditMode)
    if (saved) setSaved(false)
  }, [isEditMode, saved])

  // Navigation
  const navigateToMatrixMaker = useCallback(() => {
    router.push('/skills_matrix_maker')
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-orange-200 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-20 h-20 border-t-4 border-orange-500 rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-xl font-semibold text-gray-700">Loading Skills Matrix...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-none mx-auto space-y-10">
        {/* Enhanced Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
              <Table2 className="h-8 w-8 text-white" />
            </div>
          </div>
        
          
          {/* Action Buttons */}
          <div className="flex justify-center gap-6 pt-6">
            <Button
              onClick={navigateToMatrixMaker}
              size="lg"
              className="h-16 px-10 text-xl"
            >
              <Plus className="h-6 w-6 mr-3" />
              Create New Matrix
            </Button>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              size="lg"
              variant="outline"
              className="h-16 px-10 text-xl"
            >
              <Filter className="h-6 w-6 mr-3" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="animate-in fade-in-0 slide-in-from-top-4 duration-300">
            <FilterPanel
              selectedDepartment={selectedDepartment}
              onDepartmentChange={setSelectedDepartment}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onClearFilters={clearFilters}
              showMatricesOnly={showMatricesOnly}
              onToggleMatricesOnly={() => setShowMatricesOnly(!showMatricesOnly)}
            />
          </div>
        )}

        {/* Skills Matrices Grid */}
        {filteredMatrices.length > 0 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Available Skills Matrices</h2>
              <p className="text-xl text-gray-600">
                {filteredMatrices.length} matrices found
                {selectedDepartment && ` in ${departments.find(d => d.id === selectedDepartment)?.name}`}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMatrices.map((matrix) => (
                <SkillsMatrixCard
                  key={matrix.id}
                  matrix={matrix}
                  onClick={() => setSelectedMatrix(matrix.id)}
                  isSelected={selectedMatrix === matrix.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Employee Search for Selected Matrix */}
        {selectedMatrix && currentMatrix && (
          <Card className="border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-4 text-2xl">
                <Search className="h-8 w-8 text-blue-600" />
                Employee Search
              </CardTitle>
              <CardDescription className="text-xl">Search within {currentMatrix.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                <Input
                  value={employeeSearchTerm}
                  onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                  placeholder="Search employees or skills..."
                  className="pl-14 text-xl"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skills Legend */}
        {selectedMatrix && currentMatrix && (
          <Card className="border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-4 text-2xl">
                <Award className="h-8 w-8 text-purple-600" />
                Skill Level Legend
              </CardTitle>
              <CardDescription className="text-xl">Understanding the skill level indicators</CardDescription>
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
              <div className={`mt-6 pt-6 border-t-2 transition-all duration-300 ${
                isEditMode 
                  ? "border-orange-200 bg-orange-50/50" 
                  : "border-gray-200"
              }`}>
                <div className="flex items-start gap-4">
                  {isEditMode ? (
                    <>
                      <Edit3 className="h-7 w-7 text-orange-600 mt-1" />
                      <div>
                        <p className="text-lg font-semibold text-orange-800">Edit Mode Active</p>
                        <p className="text-lg text-orange-600 mt-2">
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
                          Skills are displayed as pie chart indicators. Click "Edit Mode" to make changes.
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
                    variant={isEditMode ? "destructive" : "outline"}
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
                      variant="secondary"
                      className="h-16 px-10 text-xl"
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
                      <TableRow className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600">
                        <TableHead className="text-white font-bold text-xl py-6 px-8 sticky left-0 z-20 bg-gradient-to-r from-orange-500 to-blue-500 min-w-[280px]">
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
                          } hover:bg-orange-50 transition-colors duration-200`}
                        >
                          <TableCell className="font-semibold text-lg py-8 px-8 sticky left-0 z-10 bg-inherit border-r-2 border-gray-200">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-blue-500 rounded-xl flex items-center justify-center">
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

        {/* Empty States */}
        {filteredMatrices.length === 0 && (
          <Card className="border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="text-center py-20">
              <Table2 className="h-20 w-20 text-gray-400 mx-auto mb-8" />
              <h3 className="text-3xl font-bold text-gray-600 mb-4">No Skills Matrices Found</h3>
              <p className="text-xl text-gray-500 mb-8">
                {selectedDepartment || searchTerm 
                  ? "Try adjusting your filters or search terms"
                  : "No skills matrices have been created yet"
                }
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={navigateToMatrixMaker}
                  size="lg"
                  className="h-16 px-10 text-xl"
                >
                  <Plus className="h-6 w-6 mr-3" />
                  Create New Matrix
                </Button>
                {(selectedDepartment || searchTerm) && (
                  <Button
                    onClick={clearFilters}
                    size="lg"
                    variant="outline"
                    className="h-16 px-10 text-xl"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

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
      </div>
    </div>
  )
}