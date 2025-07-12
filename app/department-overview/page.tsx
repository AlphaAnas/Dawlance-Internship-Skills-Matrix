// "use client"

// import { useState, useEffect } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import {
//   Building2,
//   Users,
//   TrendingUp,
//   History,
//   ChevronDown,
//   ChevronRight,
//   Trophy,
//   FileSpreadsheet,
//   Star,
//   Award,
//   Target,
// } from "lucide-react"
// import Layout from "../components/Layout"
// import Select from "../components/Select"
// import Chip from "../components/Chip"
// import Button from "../components/Button"
// import EmployeeHistoryModal from "../components/EmployeeHistoryModal"
// import EmployeeSearchPanel from "../components/EmployeeSearchPanel"
// import { enhancedDepartments, enhancedEmployees, enhancedMachines } from "../data/enhancedMockData"
// import { mockEmployeeHistory } from "../data/mockData"
// import type { Employee, EmployeeHistory, Machine } from "../types"
// import EmployeeInspectionModal from "../components/EmployeeInspectionModal"
// import MachineTagBadge from "../components/MachineTagBadge"
// import MultiSelect from "../components/MultiSelect"
// import { exportToExcel } from "../utils/exportUtils" // Import the exportToExcel function

// export default function DepartmentOverviewPage() {
//   const [selectedDepartment, setSelectedDepartment] = useState<string>("")
//   const [selectedDepartmentName, setSelectedDepartmentName] = useState<string>("")
//   const [departmentEmployees, setDepartmentEmployees] = useState<Employee[]>([])
//   const [topEmployees, setTopEmployees] = useState<Employee[]>([])
//   const [expandedEmployees, setExpandedEmployees] = useState<Set<string>>(new Set())
//   const [expandedTopEmployees, setExpandedTopEmployees] = useState<Set<string>>(new Set())
//   const [isLoading, setIsLoading] = useState(false)
//   const [selectedEmployeeHistory, setSelectedEmployeeHistory] = useState<EmployeeHistory | null>(null)
//   const [selectedSearchEmployee, setSelectedSearchEmployee] = useState<Employee | null>(null)
//   const [viewMode, setViewMode] = useState<"overview" | "top10">("overview")
//   const [sortBy, setSortBy] = useState<"score" | "skills" | "name">("score")
//   const [isExporting, setIsExporting] = useState(false)
//   const [selectedEmployeeForInspection, setSelectedEmployeeForInspection] = useState<Employee | null>(null)
//   const [selectedMachines, setSelectedMachines] = useState<string[]>([])
//   const [availableMachines, setAvailableMachines] = useState<Machine[]>([])
//   const [genderFilter, setGenderFilter] = useState<string>("")
//   const [filteredByMachineEmployees, setFilteredByMachineEmployees] = useState<Employee[]>([])

//   const calculateScore = (skills: Record<string, string>) => {
//     const scoreMap = { Low: 1, Medium: 2, High: 3, Advanced: 4 }
//     return Object.values(skills).reduce((total, level) => {
//       return total + (scoreMap[level as keyof typeof scoreMap] || 0)
//     }, 0)
//   }

//   const getRelevantMachines = (skills: Record<string, string>) => {
//     return Object.entries(skills)
//       .map(([machine, level]) => `${machine}: ${level}`)
//       .join(", ")
//   }

//   useEffect(() => {
//     if (selectedDepartment) {
//       setIsLoading(true)
//       const department = enhancedDepartments.find((dept) => dept.id === selectedDepartment)
//       setSelectedDepartmentName(department?.name || "")

//       // Simulate API call
//       setTimeout(() => {
//         const employees = enhancedEmployees
//           .filter((emp) => emp.departmentId === selectedDepartment)
//           .map((emp) => ({
//             ...emp,
//             totalSkills: Object.keys(emp.skills).length,
//             averageSkillLevel: calculateAverageSkillLevel(emp.skills),
//             score: calculateScore(emp.skills),
//             relevantMachines: getRelevantMachines(emp.skills),
//           }))

//         const sortedEmployees = [...employees].sort((a, b) => b.totalSkills - a.totalSkills)
//         const topTenEmployees = [...employees].sort((a, b) => b.score - a.score).slice(0, 10)

//         setDepartmentEmployees(sortedEmployees)
//         setTopEmployees(topTenEmployees)
//         setIsLoading(false)
//       }, 500)
//     } else {
//       setDepartmentEmployees([])
//       setTopEmployees([])
//       setExpandedEmployees(new Set())
//       setExpandedTopEmployees(new Set())
//     }
//   }, [selectedDepartment])

//   // Load machines when department changes
//   useEffect(() => {
//     if (selectedDepartment) {
//       const machines = enhancedMachines.filter((machine) => machine.departmentId === selectedDepartment)
//       setAvailableMachines(machines)
//       setSelectedMachines([])
//     } else {
//       setAvailableMachines([])
//       setSelectedMachines([])
//     }
//   }, [selectedDepartment])

//   // Filter employees by selected machines and gender
//   useEffect(() => {
//     if (selectedMachines.length > 0) {
//       const machineNames = availableMachines.filter((m) => selectedMachines.includes(m.id)).map((m) => m.name)

//       const filtered = departmentEmployees.filter((emp) => {
//         // Check if employee has skills for selected machines
//         const hasRequiredSkills = machineNames.some((machineName) => {
//           const skillLevel = emp.skills[machineName]
//           return skillLevel && skillLevel !== "None"
//         })

//         // Apply gender filter
//         const matchesGender = !genderFilter || emp.gender === genderFilter

//         return hasRequiredSkills && matchesGender
//       })

//       setFilteredByMachineEmployees(filtered)
//     } else {
//       setFilteredByMachineEmployees([])
//     }
//   }, [selectedMachines, availableMachines, departmentEmployees, genderFilter])

//   const calculateAverageSkillLevel = (skills: Record<string, string>) => {
//     const scoreMap = { Low: 1, Medium: 2, High: 3, Advanced: 4 }
//     const scores = Object.values(skills).map((level) => scoreMap[level as keyof typeof scoreMap] || 0)
//     const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
//     return Math.round(average * 10) / 10
//   }

//   const getSkillColor = (level: string) => {
//     switch (level) {
//       case "Advanced":
//         return "bg-green-600 text-white dark:bg-green-500"
//       case "High":
//         return "bg-yellow-600 text-white dark:bg-yellow-500"
//       case "Medium":
//         return "bg-orange-600 text-white dark:bg-orange-500"
//       case "Low":
//         return "bg-yellow-700 text-white dark:bg-yellow-600"
//       default:
//         return "bg-gray-500 text-white dark:bg-gray-400"
//     }
//   }

//   const toggleEmployeeExpansion = (employeeId: string, isTopEmployee = false) => {
//     const targetSet = isTopEmployee ? expandedTopEmployees : expandedEmployees
//     const setFunction = isTopEmployee ? setExpandedTopEmployees : setExpandedEmployees

//     const newExpanded = new Set(targetSet)
//     if (newExpanded.has(employeeId)) {
//       newExpanded.delete(employeeId)
//     } else {
//       newExpanded.add(employeeId)
//     }
//     setFunction(newExpanded)
//   }

//   const handleViewHistory = (employee: Employee) => {
//     const history = mockEmployeeHistory.find((h) => h.employeeId === employee.id)
//     if (history) {
//       setSelectedEmployeeHistory(history)
//     }
//   }

//   const handleExportTopEmployees = async () => {
//     if (topEmployees.length === 0) return

//     setIsExporting(true)
//     try {
//       const exportData = topEmployees.map((emp, index) => ({
//         Rank: index + 1,
//         "Employee ID": emp.id,
//         "Employee Name": emp.name,
//         "Total Score": emp.score,
//         "Total Skills": emp.totalSkills,
//         "Average Skill Level": emp.averageSkillLevel,
//         "Relevant Machines": emp.relevantMachines,
//         Department: selectedDepartmentName,
//       }))

//       await exportToExcel(
//         exportData,
//         `Top_10_Employees_${selectedDepartmentName}_${new Date().toISOString().split("T")[0]}`,
//       )
//     } catch (error) {
//       console.error("Export failed:", error)
//     } finally {
//       setIsExporting(false)
//     }
//   }

//   const sortTopEmployees = (employees: Employee[]) => {
//     switch (sortBy) {
//       case "name":
//         return [...employees].sort((a, b) => a.name.localeCompare(b.name))
//       case "skills":
//         return [...employees].sort((a, b) => b.totalSkills - a.totalSkills)
//       case "score":
//       default:
//         return [...employees].sort((a, b) => b.score - a.score)
//     }
//   }

//   const departmentOptions = enhancedDepartments.map((dept) => ({
//     value: dept.id,
//     label: dept.name,
//   }))

//   const sortOptions = [
//     { value: "score", label: "Total Score" },
//     { value: "skills", label: "Skill Count" },
//     { value: "name", label: "Name (A-Z)" },
//   ]

//   const sortedTopEmployees = sortTopEmployees(topEmployees)

//   return (
//     <Layout>
//       <div className="space-y-6">
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Department Overview</h1>
//           <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
//             Complete view of department employees, top performers, and skill analysis
//           </p>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1, duration: 0.5 }}
//           className="max-w-md"
//         >
//           <Select
//             label="Select Department"
//             value={selectedDepartment}
//             onChange={setSelectedDepartment}
//             options={departmentOptions}
//             placeholder="Choose a department..."
//           />
//         </motion.div>

//         {selectedDepartment && (
//           <>
//             {/* Department Stats */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.15, duration: 0.5 }}
//               className="grid grid-cols-1 md:grid-cols-4 gap-4"
//             >
//               <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
//                 <div className="flex items-center gap-3">
//                   <Building2 className="h-8 w-8" />
//                   <div>
//                     <h3 className="text-lg font-semibold">{selectedDepartmentName}</h3>
//                     <p className="text-blue-100">Department</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
//                 <div className="flex items-center gap-3">
//                   <Users className="h-8 w-8" />
//                   <div>
//                     <h3 className="text-2xl font-bold">{departmentEmployees.length}</h3>
//                     <p className="text-green-100">Total Employees</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
//                 <div className="flex items-center gap-3">
//                   <TrendingUp className="h-8 w-8" />
//                   <div>
//                     <h3 className="text-2xl font-bold">
//                       {departmentEmployees.reduce((sum, emp) => sum + emp.totalSkills, 0)}
//                     </h3>
//                     <p className="text-purple-100">Total Skills</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white">
//                 <div className="flex items-center gap-3">
//                   <Trophy className="h-8 w-8" />
//                   <div>
//                     <h3 className="text-2xl font-bold">
//                       {topEmployees.length > 0 ? Math.max(...topEmployees.map((emp) => emp.score)) : 0}
//                     </h3>
//                     <p className="text-orange-100">Highest Score</p>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Machine and Gender Filters */}
//             {selectedDepartment && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.25, duration: 0.5 }}
//                 className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
//               >
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Machine & Worker Filters</h3>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <MultiSelect
//                     label="Select Machines"
//                     options={availableMachines.map((m) => ({ value: m.id, label: m.name }))}
//                     value={selectedMachines}
//                     onChange={setSelectedMachines}
//                     placeholder="Choose machines to filter workers..."
//                   />

//                   <Select
//                     label="Filter by Gender"
//                     value={genderFilter}
//                     onChange={setGenderFilter}
//                     options={[
//                       { value: "", label: "All Genders" },
//                       { value: "male", label: "Male Workers" },
//                       { value: "female", label: "Female Workers" },
//                     ]}
//                     placeholder="Select gender filter..."
//                   />
//                 </div>

//                 {/* Selected Machines Display */}
//                 {selectedMachines.length > 0 && (
//                   <div className="mt-4">
//                     <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Selected Machines ({selectedMachines.length}):
//                     </h4>
//                     <div className="space-y-2">
//                       {selectedMachines.map((machineId) => {
//                         const machine = availableMachines.find((m) => m.id === machineId)
//                         return machine ? (
//                           <div
//                             key={machineId}
//                             className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
//                           >
//                             <span className="font-medium text-gray-900 dark:text-white">{machine.name}</span>
//                             <MachineTagBadge
//                               isCritical={machine.isCritical}
//                               femaleEligible={machine.femaleEligible}
//                               size="sm"
//                             />
//                           </div>
//                         ) : null
//                       })}
//                     </div>

//                     <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                       <p className="text-sm text-blue-700 dark:text-blue-300">
//                         <strong>{filteredByMachineEmployees.length}</strong> workers found with skills for selected
//                         machines
//                         {genderFilter && ` (${genderFilter} only)`}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </motion.div>
//             )}

//             {/* View Mode Toggle */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2, duration: 0.5 }}
//               className="flex flex-wrap gap-4 items-center justify-between"
//             >
//               <div className="flex gap-2">
//                 <Button
//                   onClick={() => setViewMode("overview")}
//                   variant={viewMode === "overview" ? "primary" : "outline"}
//                   size="sm"
//                   className="flex items-center gap-2"
//                 >
//                   <Users className="h-4 w-4" />
//                   All Employees
//                 </Button>
//                 <Button
//                   onClick={() => setViewMode("top10")}
//                   variant={viewMode === "top10" ? "primary" : "outline"}
//                   size="sm"
//                   className="flex items-center gap-2"
//                 >
//                   <Trophy className="h-4 w-4" />
//                   Top 10 Performers
//                 </Button>
//               </div>

//               {viewMode === "top10" && (
//                 <div className="flex gap-2 items-center">
//                   <Select
//                     value={sortBy}
//                     onChange={(value) => setSortBy(value as "score" | "skills" | "name")}
//                     options={sortOptions}
//                     placeholder="Sort by..."
//                   />
//                   <Button
//                     onClick={handleExportTopEmployees}
//                     disabled={isExporting}
//                     variant="secondary"
//                     size="sm"
//                     className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white border-0"
//                   >
//                     {isExporting ? (
//                       <motion.div
//                         animate={{ rotate: 360 }}
//                         transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
//                         className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
//                       />
//                     ) : (
//                       <FileSpreadsheet className="h-4 w-4" />
//                     )}
//                     Export
//                   </Button>
//                 </div>
//               )}
//             </motion.div>

//             {/* Employee Search Panel */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.25, duration: 0.5 }}
//             >
//               <EmployeeSearchPanel
//                 employees={departmentEmployees}
//                 onEmployeeSelect={setSelectedSearchEmployee}
//                 selectedEmployee={selectedSearchEmployee}
//               />
//             </motion.div>

//             {/* Content based on view mode */}
//             <AnimatePresence mode="wait">
//               {viewMode === "overview" ? (
//                 <motion.div
//                   key="overview"
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: 20 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   {/* All Employees List */}
//                   <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
//                     <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
//                       <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Department Employees</h3>
//                       <p className="text-sm text-gray-600 dark:text-gray-400">
//                         Click to expand and view detailed skills, or view full history
//                       </p>
//                     </div>

//                     {isLoading ? (
//                       <div className="p-8 text-center">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                         <p className="mt-2 text-gray-600 dark:text-gray-400">Loading employees...</p>
//                       </div>
//                     ) : (
//                       <div className="divide-y divide-gray-200 dark:divide-gray-700">
//                         {departmentEmployees.map((employee, index) => {
//                           const isExpanded = expandedEmployees.has(employee.id)
//                           return (
//                             <motion.div
//                               key={employee.id}
//                               initial={{ opacity: 0, y: 20 }}
//                               animate={{ opacity: 1, y: 0 }}
//                               transition={{ delay: index * 0.05 }}
//                               className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
//                                 selectedSearchEmployee?.id === employee.id
//                                   ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
//                                   : ""
//                               }`}
//                             >
//                               {/* Employee Header */}
//                               <div className="px-6 py-4">
//                                 <div className="flex items-center justify-between">
//                                   <div className="flex items-center gap-4">
//                                     <button
//                                       onClick={() => toggleEmployeeExpansion(employee.id)}
//                                       className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
//                                     >
//                                       {isExpanded ? (
//                                         <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
//                                       ) : (
//                                         <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
//                                       )}
//                                     </button>

//                                     <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
//                                       <span className="text-white font-semibold text-sm">
//                                         {employee.name
//                                           .split(" ")
//                                           .map((n) => n[0])
//                                           .join("")}
//                                       </span>
//                                     </div>

//                                     <div>
//                                       <h4 className="font-semibold text-gray-900 dark:text-white">
//                                         {employee.name}
//                                         <div
//                                           className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white ml-2 ${
//                                             employee.gender === "female" ? "bg-pink-500" : "bg-blue-500"
//                                           }`}
//                                         >
//                                           {employee.gender === "female" ? "♀" : "♂"}
//                                         </div>
//                                       </h4>
//                                       <p className="text-sm text-gray-600 dark:text-gray-400">ID: {employee.id}</p>
//                                     </div>
//                                   </div>

//                                   <div className="flex items-center gap-4">
//                                     <div className="text-right">
//                                       <p className="text-sm font-medium text-gray-900 dark:text-white">
//                                         {employee.totalSkills} Skills
//                                       </p>
//                                       <p className="text-xs text-gray-600 dark:text-gray-400">
//                                         Score: {employee.score}
//                                       </p>
//                                     </div>

//                                     <button
//                                       onClick={() => setSelectedEmployeeForInspection(employee)}
//                                       className="p-2 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
//                                       title="Inspect skills"
//                                     >
//                                       <Award className="h-5 w-5" />
//                                     </button>

//                                     <button
//                                       onClick={() => handleViewHistory(employee)}
//                                       className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
//                                       title="View full history"
//                                     >
//                                       <History className="h-5 w-5" />
//                                     </button>
//                                   </div>
//                                 </div>
//                               </div>

//                               {/* Expanded Skills */}
//                               {isExpanded && (
//                                 <motion.div
//                                   initial={{ opacity: 0, height: 0 }}
//                                   animate={{ opacity: 1, height: "auto" }}
//                                   exit={{ opacity: 0, height: 0 }}
//                                   transition={{ duration: 0.3 }}
//                                   className="px-6 pb-4 border-t border-gray-100 dark:border-gray-700"
//                                 >
//                                   <div className="pt-4">
//                                     <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
//                                       Current Machine Skills:
//                                     </h5>
//                                     <div className="flex flex-wrap gap-2">
//                                       {Object.entries(employee.skills).map(([skill, level]) => (
//                                         <Chip
//                                           key={skill}
//                                           label={`${skill}: ${level}`}
//                                           className={getSkillColor(level)}
//                                         />
//                                       ))}
//                                     </div>
//                                   </div>
//                                 </motion.div>
//                               )}
//                             </motion.div>
//                           )
//                         })}
//                       </div>
//                     )}
//                   </div>
//                 </motion.div>
//               ) : (
//                 <motion.div
//                   key="top10"
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   {/* Top 10 Employees */}
//                   <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
//                     <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
//                           <Trophy className="h-5 w-5 text-white" />
//                         </div>
//                         <div>
//                           <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//                             Top 10 Performers - {selectedDepartmentName}
//                           </h3>
//                           <p className="text-sm text-gray-600 dark:text-gray-400">
//                             Ranked by total skill score • Click to expand for detailed breakdown
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {isLoading ? (
//                       <div className="p-8 text-center">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                         <p className="mt-2 text-gray-600 dark:text-gray-400">Loading top performers...</p>
//                       </div>
//                     ) : (
//                       <div className="divide-y divide-gray-200 dark:divide-gray-700">
//                         {sortedTopEmployees.map((employee, index) => {
//                           const isExpanded = expandedTopEmployees.has(employee.id)
//                           const originalRank = topEmployees.findIndex((emp) => emp.id === employee.id) + 1
//                           return (
//                             <motion.div
//                               key={employee.id}
//                               initial={{ opacity: 0, y: 20 }}
//                               animate={{ opacity: 1, y: 0 }}
//                               transition={{ delay: index * 0.05 }}
//                               className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
//                             >
//                               {/* Employee Header */}
//                               <div className="px-6 py-4">
//                                 <div className="flex items-center justify-between">
//                                   <div className="flex items-center gap-4">
//                                     <div className="flex items-center gap-3">
//                                       <div
//                                         className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
//                                           originalRank <= 3
//                                             ? originalRank === 1
//                                               ? "bg-yellow-500 text-white"
//                                               : originalRank === 2
//                                                 ? "bg-gray-400 text-white"
//                                                 : "bg-orange-600 text-white"
//                                             : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
//                                         }`}
//                                       >
//                                         {originalRank <= 3
//                                           ? originalRank === 1
//                                             ? "🥇"
//                                             : originalRank === 2
//                                               ? "🥈"
//                                               : "🥉"
//                                           : originalRank}
//                                       </div>

//                                       <button
//                                         onClick={() => toggleEmployeeExpansion(employee.id, true)}
//                                         className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
//                                       >
//                                         {isExpanded ? (
//                                           <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
//                                         ) : (
//                                           <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
//                                         )}
//                                       </button>
//                                     </div>

//                                     <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
//                                       <span className="text-white font-semibold text-sm">
//                                         {employee.name
//                                           .split(" ")
//                                           .map((n) => n[0])
//                                           .join("")}
//                                       </span>
//                                     </div>

//                                     <div>
//                                       <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
//                                         {employee.name}
//                                         <div
//                                           className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white ml-2 ${
//                                             employee.gender === "female" ? "bg-pink-500" : "bg-blue-500"
//                                           }`}
//                                         >
//                                           {employee.gender === "female" ? "♀" : "♂"}
//                                         </div>
//                                         {originalRank <= 3 && <Star className="h-4 w-4 text-yellow-500" />}
//                                       </h4>
//                                       <p className="text-sm text-gray-600 dark:text-gray-400">ID: {employee.id}</p>
//                                     </div>
//                                   </div>

//                                   <div className="flex items-center gap-4">
//                                     <div className="text-right">
//                                       <div className="flex items-center gap-2">
//                                         <Award className="h-4 w-4 text-purple-600" />
//                                         <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
//                                           {employee.score}
//                                         </span>
//                                       </div>
//                                       <p className="text-xs text-gray-600 dark:text-gray-400">
//                                         {employee.totalSkills} skills • Avg: {employee.averageSkillLevel}
//                                       </p>
//                                     </div>

//                                     <button
//                                       onClick={() => setSelectedEmployeeForInspection(employee)}
//                                       className="p-2 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
//                                       title="Inspect skills"
//                                     >
//                                       <Award className="h-5 w-5" />
//                                     </button>

//                                     <button
//                                       onClick={() => handleViewHistory(employee)}
//                                       className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
//                                       title="View full history"
//                                     >
//                                       <History className="h-5 w-5" />
//                                     </button>
//                                   </div>
//                                 </div>
//                               </div>

//                               {/* Expanded Skills */}
//                               {isExpanded && (
//                                 <motion.div
//                                   initial={{ opacity: 0, height: 0 }}
//                                   animate={{ opacity: 1, height: "auto" }}
//                                   exit={{ opacity: 0, height: 0 }}
//                                   transition={{ duration: 0.3 }}
//                                   className="px-6 pb-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30"
//                                 >
//                                   <div className="pt-4">
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                       <div>
//                                         <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
//                                           <Target className="h-4 w-4" />
//                                           Machine Skills:
//                                         </h5>
//                                         <div className="flex flex-wrap gap-2">
//                                           {Object.entries(employee.skills).map(([skill, level]) => (
//                                             <Chip
//                                               key={skill}
//                                               label={`${skill}: ${level}`}
//                                               className={getSkillColor(level)}
//                                             />
//                                           ))}
//                                         </div>
//                                       </div>
//                                       <div className="space-y-2">
//                                         <div className="flex justify-between text-sm">
//                                           <span className="text-gray-600 dark:text-gray-400">Total Score:</span>
//                                           <span className="font-semibold text-purple-600 dark:text-purple-400">
//                                             {employee.score}
//                                           </span>
//                                         </div>
//                                         <div className="flex justify-between text-sm">
//                                           <span className="text-gray-600 dark:text-gray-400">Skill Count:</span>
//                                           <span className="font-semibold">{employee.totalSkills}</span>
//                                         </div>
//                                         <div className="flex justify-between text-sm">
//                                           <span className="text-gray-600 dark:text-gray-400">Average Level:</span>
//                                           <span className="font-semibold">{employee.averageSkillLevel}</span>
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </motion.div>
//                               )}
//                             </motion.div>
//                           )
//                         })}
//                       </div>
//                     )}
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </>
//         )}

//         {/* Employee History Modal */}
//         <EmployeeHistoryModal
//           employee={selectedEmployeeHistory}
//           isOpen={!!selectedEmployeeHistory}
//           onClose={() => setSelectedEmployeeHistory(null)}
//         />

//         {/* Employee Inspection Modal */}
//         <EmployeeInspectionModal
//           employee={selectedEmployeeForInspection}
//           isOpen={!!selectedEmployeeForInspection}
//           onClose={() => setSelectedEmployeeForInspection(null)}
//         />
//       </div>
//     </Layout>
//   )
// }
