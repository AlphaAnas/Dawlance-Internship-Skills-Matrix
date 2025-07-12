"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SkillCategory } from "../types/index";
import Layout from "../components/Layout";
import TextField from "../components/TextField";
import EnhancedSkillIndicator from "../components/EnhancedSkillIndicator";
import MachineTagBadge from "../components/MachineTagBadge";
import { enhancedEmployees, enhancedSkills } from "../data/enhancedMockData";
import type { Employee, Skill } from "../types";
import { Search } from "lucide-react";

// Map department IDs to user-friendly names
const departmentMap: Record<string, string> = {
  "dept-01": "Production",
  "dept-02": "Quality Control",
  "dept-03": "Maintenance",
  "dept-04": "Packaging",
  "dept-05": "Logistics",
  // Add more mappings as needed
};

export default function SkillsMappingPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [departments, setDepartments] = useState<string[]>(
    Object.keys(departmentMap)
  );
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEmployees(enhancedEmployees);
      // fetch the skills for the employees
      setDepartments(Object.keys(departmentMap));
      setSkills(enhancedSkills);
      setFilteredEmployees([]);
      setIsLoading(false);
    }, 500);
  }, []);

  // Extract unique department IDs from all employees
  const departmentOptions = Array.from(
    new Set(enhancedEmployees.map((emp) => emp.departmentId))
  );

  useEffect(() => {
    const filtered = employees.filter(
      (emp) =>
        emp.departmentId === selectedDepartment &&
        (emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          Object.keys(emp.skills).some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          ))
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, selectedDepartment, employees]);

  const getSkillLevel = (employee: Employee, machineName: string): string => {
    return employee.skills[machineName] || "None";
  };

  // const getMachineById = (machineName: string): Skill | undefined => {
  //   return machines.find((m) => m.name === machineName)
  // }

  const allMachineNames = Array.from(
    new Set(filteredEmployees.flatMap((emp) => Object.keys(emp.skills)))
  ).slice(0, 8);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Employee Skills Mapping
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Visual matrix of employee skill proficiency levels with machine
            indicators
          </p>
        </motion.div>

        {/* Department Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.5 }}
          className="max-w-sm"
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Select Department
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm p-2"
          >
            <option value="" disabled>
              Select a department
            </option>
            {departmentOptions.map((deptId) => (
              <option key={deptId} value={deptId}>
                {departmentMap[deptId] || deptId}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Search Field */}
        {selectedDepartment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="max-w-md"
          >
            <TextField
              label="Search employees or skills"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              icon={<Search className="h-5 w-5" />}
            />
          </motion.div>
        )}

        {/* Skills Matrix Table */}
        {selectedDepartment && filteredEmployees.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="bg-slate-700 text-white px-4 py-3 text-left text-sm font-medium sticky left-0 z-10">
                      <div className="flex items-center gap-2">
                        <span>Employee</span>
                        <div className="flex gap-1">
                          <span className="text-xs bg-blue-600 px-1 rounded">
                            ♂
                          </span>
                          <span className="text-xs bg-pink-600 px-1 rounded">
                            ♀
                          </span>
                        </div>
                      </div>
                    </th>
                    {skills
                      .filter(
                        (skill) => skill.departmentId === selectedDepartment
                      ) // show only relevant skills
                      .map((col) => (
                        <th
                          key={col.id}
                          className="bg-slate-700 text-white px-4 py-3 text-center text-sm font-medium min-w-[140px]"
                        >
                          <div className="space-y-2">
                            <div className="font-medium">{col.name}</div>
                            <MachineTagBadge
                              femaleEligible={col.femaleEligible}
                              size="sm"
                              isCritical={col.isCritical}
                           
                            />
                          </div>
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredEmployees.map((employee, index) => (
                    <motion.tr
                      key={employee.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className={`${
                        index % 2 === 0
                          ? "bg-white dark:bg-gray-800"
                          : "bg-gray-50 dark:bg-gray-750"
                      } hover:bg-gray-100 dark:hover:bg-gray-700`}
                    >
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white sticky left-0 bg-inherit z-10 border-r border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                              employee.gender === "MALE"
                                ? "bg-pink-500"
                                : "bg-blue-500"
                            }`}
                          >
                            {employee.gender === "FEMALE" ? "♀" : "♂"}
                          </div>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {employee.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      {allMachineNames.map((machineName) => (
                        <td key={machineName} className="px-4 py-4 text-center">
                          <div className="flex justify-center">
                            <EnhancedSkillIndicator
                              level={getSkillLevel(employee, machineName)}
                              size={48}
                            />
                          </div>
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Legend Section (Unchanged) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Skills Matrix Legend
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skill Levels */}
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                Skill Levels
              </h4>
              <div className="space-y-3">
                {[
                  { level: "Highly Skilled", desc: "Expert level (100%)" },
                  { level: "Skilled", desc: "High proficiency (75%)" },
                  { level: "Semi Skilled", desc: "Moderate proficiency (50%)" },
                  { level: "Low Skilled", desc: "Basic proficiency (25%)" },
                  { level: "None", desc: "No experience (0%)" },
                ].map((item) => (
                  <div key={item.level} className="flex items-center gap-3">
                    <EnhancedSkillIndicator
                      level={item.level}
                      size={32}
                      showTooltip={false}
                    />
                    <div>
                      <div className="font-medium text-sm text-gray-900 dark:text-white">
                        {item.level}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Indicators */}
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                Indicators
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MachineTagBadge isCritical={true} size="sm" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Critical production station
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MachineTagBadge femaleEligible={true} size="sm" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Suitable for female workers
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      ♂
                    </span>
                    <span className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      ♀
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Employee gender indicators
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
