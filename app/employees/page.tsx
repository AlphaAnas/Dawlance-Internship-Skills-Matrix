"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, User, Award } from "lucide-react"
import Layout from "../components/Layout"
import Table from "../components/Table"
import TextField from "../components/TextField"
import Chip from "../components/Chip"
import { mockEmployees } from "../data/mockData"
import type { Employee } from "../types"
import EmployeeInspectionModal from "../components/EmployeeInspectionModal"

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchEmployeeId, setSearchEmployeeId] = useState("")
  const [searchedEmployee, setSearchedEmployee] = useState<Employee | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [selectedEmployeeForInspection, setSelectedEmployeeForInspection] = useState<Employee | null>(null)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const employeesWithTotalSkills = mockEmployees.map((emp) => ({
        ...emp,
        totalSkills: Object.keys(emp.skills).length,
      }))
      setEmployees(employeesWithTotalSkills)
      setIsLoading(false)
    }, 500)
  }, [])

  const handleEmployeeSearch = () => {
    if (!searchEmployeeId.trim()) {
      setSearchedEmployee(null)
      return
    }

    setIsSearching(true)

    // Simulate API call
    setTimeout(() => {
      const employee = mockEmployees.find(
        (emp) => emp.id === searchEmployeeId.trim() || emp.name.toLowerCase().includes(searchEmployeeId.toLowerCase()),
      )
      setSearchedEmployee(employee || null)
      setIsSearching(false)
    }, 300)
  }

  const getSkillColor = (level: string) => {
    switch (level) {
      case "Advanced":
        return "bg-green-600 text-white dark:bg-green-500"
      case "High":
        return "bg-yellow-600 text-white dark:bg-yellow-500"
      case "Medium":
        return "bg-orange-600 text-white dark:bg-orange-500"
      case "Low":
        return "bg-yellow-700 text-white dark:bg-yellow-600"
      default:
        return "bg-gray-500 text-white dark:bg-gray-400"
    }
  }

  const columns = [
    { key: "id", label: "Employee ID" },
    { key: "name", label: "Name" },
    { key: "totalSkills", label: "Total Skills" },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Employees</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Complete list of employees and their skill counts
          </p>
        </motion.div>

        {/* Employee ID Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Search Employee by ID or Name
          </h2>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <TextField
                placeholder="Enter Employee ID or Name (e.g., '1' or 'John')"
                value={searchEmployeeId}
                onChange={(e) => setSearchEmployeeId(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleEmployeeSearch()}
                icon={<Search className="h-5 w-5" />}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEmployeeSearch}
              disabled={isSearching}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
            >
              {isSearching ? "Searching..." : "Search"}
            </motion.button>
          </div>

          {/* Search Results */}
          {searchEmployeeId && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              {searchedEmployee ? (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 border border-blue-200 dark:border-gray-600">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {searchedEmployee.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Employee ID: {searchedEmployee.id}</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedEmployeeForInspection(searchedEmployee)}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                        >
                          <Award className="h-4 w-4" />
                          Inspect Skills
                        </motion.button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Machine Skills ({Object.keys(searchedEmployee.skills).length} total):
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(searchedEmployee.skills).map(([skill, level]) => (
                            <Chip key={skill} label={`${skill}: ${level}`} className={getSkillColor(level)} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-700 dark:text-red-400 text-sm">
                    No employee found with ID or name "{searchEmployeeId}". Please check the ID and try again.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* All Employees Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Table
            columns={columns}
            data={employees}
            isLoading={isLoading}
            emptyMessage="No employees found"
            onInspect={(employee) => setSelectedEmployeeForInspection(employee)}
          />
        </motion.div>
      </div>

      
      {/* Employee Inspection Modal */}
      <EmployeeInspectionModal
        employee={selectedEmployeeForInspection}
        isOpen={!!selectedEmployeeForInspection}
        onClose={() => setSelectedEmployeeForInspection(null)}
      />
    </Layout>
  )
}
