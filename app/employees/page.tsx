"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, User, Award, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Table from "../components/Table";
import { mockEmployees, mockDepartments } from "../data/mockData";
import type { Department, Employee } from "../types";
import EmployeeInspectionModal from "../components/EmployeeInspectionModal";
import { set } from "react-hook-form";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedEmployeeForInspection, setSelectedEmployeeForInspection] =
    useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    displayId: "",
    gender: "MALE",
    departmentId: "",
  });

  // State for department metrics
  const [departmentMetrics, setDepartmentMetrics] = useState<
    {
      departmentId: number;
      departmentName: string;
      employeeCount: number;
      topPerformer: Employee | null;
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [empRes, deptRes] = await Promise.all([
          fetch("/api/all/employees"),
          fetch("/api/all/departments"),
        ]);

        const empData = await empRes.json();
        const deptData = await deptRes.json();

        if (deptData.success) {
          // console.log("Departments:", deptData.data);
          setDepartments(deptData.data);

          // Now map employees with department names using the fetched departments
          const employees = empData.data.map((emp: any) => ({
            ...emp,
            skill_profile: JSON.parse(emp.skill_profile),
            totalSkills: Object.keys(
              JSON.parse(emp.skill_profile)?.skills || {}
            ).length,
            departmentName: getDepartmentNameFromList(
              emp.current_department_id,
              deptData.data
            ),
          }));

          setEmployees(employees);

          // Calculate department metrics after both employees and departments are set
          const metrics = calculateDepartmentMetricsFromData(
            employees,
            deptData.data
          );
          console.log(metrics);
          setDepartmentMetrics(metrics);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get department name by ID from a list
  const getDepartmentNameFromList = (
    departmentId: number,
    departmentsList: Department[]
  ) => {
    const department = departmentsList.find((dept) => dept.id === departmentId);
    return department ? department.name : "Unknown Department";
  };

  // Enhanced search filter logic using useMemo for performance optimization
  const filteredEmployees = useMemo(() => {
    if (!searchEmployeeId.trim()) {
      return employees;
    }

    const searchTerm = searchEmployeeId.toLowerCase().trim();

    return employees.filter((employee) => {
      // Safe field extraction with fallbacks
      const name = employee.name?.toLowerCase() || "";
      const displayId = employee.display_id?.toLowerCase() || "";
      const departmentName =
        (employee as any).departmentName?.toLowerCase() || "";

      // Basic field matching
      if (
        name.includes(searchTerm) ||
        displayId.includes(searchTerm) ||
        departmentName.includes(searchTerm)
      ) {
        return true;
      }

      // Advanced skill-based matching
      const skillProfile = employee.skill_profile;
      if (skillProfile && skillProfile.skills) {
        const skills = skillProfile.skills;

        // Check skill names
        const skillNames = Object.keys(skills).map((skill) =>
          skill.toLowerCase()
        );
        if (skillNames.some((skillName) => skillName.includes(searchTerm))) {
          return true;
        }

        // Check skill levels
        const skillLevels = Object.values(skills).map((level) =>
          level.toLowerCase()
        );
        if (skillLevels.some((level) => level.includes(searchTerm))) {
          return true;
        }

        // Check combined skill+level combinations (e.g., "cnc skilled")
        const skillCombinations = Object.entries(skills).map(
          ([skill, level]) => `${skill.toLowerCase()} ${level.toLowerCase()}`
        );
        if (skillCombinations.some((combo) => combo.includes(searchTerm))) {
          return true;
        }
      }

      return false;
    });
  }, [employees, searchEmployeeId, departments]);

  // Get the first matching employee for single employee display
  const searchedEmployee = useMemo(() => {
    if (!searchEmployeeId.trim()) {
      return null;
    }
    return filteredEmployees.length > 0 ? filteredEmployees[0] : null;
  }, [filteredEmployees, searchEmployeeId]);

  // Helper function to calculate department metrics from data
  const calculateDepartmentMetricsFromData = (
    employeesList: Employee[],
    departmentsList: Department[]
  ) => {
    console.log("Departments:", departmentsList);
    console.log("Employees:", employeesList);

    return departmentsList.map((dept) => {
      const deptEmployees = employeesList.filter(
        (emp) => emp.current_department_id === dept.id
      );
      // console.log("Department Employees:", deptEmployees);
      const topPerformer = deptEmployees.reduce(
        (top, emp) =>
          !top || (emp.totalSkills || 0) > (top.totalSkills || 0) ? emp : top,
        null as Employee | null
      );
      // console.log("Top Performer:", topPerformer);
      return {
        departmentId: dept.id,
        departmentName: dept.name,
        employeeCount: deptEmployees.length,
        topPerformer,
      };
    });
  };

  // Helper function to get department name for display
  const getDepartmentName = (departmentId: number) => {
    const department = departments.find((dept) => dept.id === departmentId);
    return department ? department.name : "Unknown Department";
  };

  const getSkillColor = (level: string) => {
    switch (level) {
      case "Advanced":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800";
      case "High":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800";
      case "Low":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const columns = [
    { key: "display_id", label: "Employee ID" },
    { key: "name", label: "Name" },
    { key: "departmentName", label: "Department" },
    { key: "totalSkills", label: "Total Skills" },
  ];

  // ========================ADD A NEW EMPLOYEE=============================
  const handleNewEmployee = async (data: any) => {
    const newEmployee = {
      name: data.name?.trim() || "",
      displayId: data.displayId?.trim() || "",
      gender: data.gender || "MALE",
      current_department_id: parseInt(data.departmentId, 10) || 0,
    };

    // console.log("Sending newEmployee:", newEmployee)

    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee),
      });

      if (!response.ok) {
        throw new Error(`Failed to add employee. Status ${response.status}`);
      }

      const resText = await response.text();
      let savedEmployee;
      try {
        savedEmployee = JSON.parse(resText);
        // console.log("Employee added:", savedEmployee)
      } catch (jsonErr) {
        console.error("Response not valid JSON:", resText);
        return;
      }
      const updatedEmployee: Employee = {
        ...savedEmployee,
        skill_profile: savedEmployee.skill_profile || { skills: {} }, // Default to empty skills if not provided
        totalSkills: Object.keys(savedEmployee.skill_profile?.skills || {})
          .length,
        departmentName: getDepartmentName(savedEmployee.current_department_id),
      } as any;
      setEmployees((prev) => [...prev, updatedEmployee]);

      // Update department metrics
      setDepartmentMetrics((prev) =>
        prev.map((metric) => {
          if (metric.departmentId === savedEmployee.current_department_id) {
            const updatedCount = metric.employeeCount + 1;
            const deptEmployees = [
              ...employees.filter(
                (emp) =>
                  emp.current_department_id ===
                  savedEmployee.current_department_id
              ),
              updatedEmployee,
            ];
            const topPerformer = deptEmployees.reduce(
              (top, emp) =>
                !top || (emp.totalSkills || 0) > (top.totalSkills || 0)
                  ? emp
                  : top,
              null as Employee | null
            );
            return {
              ...metric,
              employeeCount: updatedCount,
              topPerformer,
            };
          }
          return metric;
        })
      );
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Department Metrics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                Department Metrics
              </CardTitle>
              <CardDescription className="text-base">
                Overview of employee counts and top performers by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Department Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {departmentMetrics.map((metric) => (
                  <Card
                    key={metric.departmentId}
                    className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-950/50 dark:to-blue-950/50"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        {metric.departmentName}
                      </CardTitle>
                      <CardDescription>
                        Employee Count: {metric.employeeCount}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {metric.topPerformer ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                            <span className="font-semibold">Top Performer</span>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                              <User className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {metric.topPerformer.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                ID: {metric.topPerformer.display_id} • Skills:{" "}
                                {metric.topPerformer.totalSkills}
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setSelectedEmployeeForInspection(
                                    metric.topPerformer
                                  )
                                }
                                className="mt-2"
                              >
                                Inspect Skills
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No employees in this department
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        ></motion.div>

        {/* Employee Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                Employee Search
              </CardTitle>
              <CardDescription className="text-base">
                Search for employees by their ID or name to view detailed
                information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="search-input" className="text-sm font-medium">
                    Employee ID or Name
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search-input"
                      placeholder="Enter Employee ID or Name (e.g., '1' or 'John')"
                      value={searchEmployeeId}
                      onChange={(e) => setSearchEmployeeId(e.target.value)}
                      className="pl-10 h-12 text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Search Results */}
              {searchEmployeeId && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pt-4"
                >
                  <Separator className="mb-6" />
                  {searchedEmployee ? (
                    <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/50 dark:to-purple-950/50">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-6">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                              <User className="h-8 w-8 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                  {searchedEmployee.name}
                                </h3>
                                <p className="text-muted-foreground font-medium">
                                  Employee ID: {searchedEmployee.display_id} •
                                  Department:{" "}
                                  {getDepartmentName(
                                    searchedEmployee.current_department_id
                                  )}
                                </p>
                              </div>
                              <Button
                                onClick={() =>
                                  setSelectedEmployeeForInspection(
                                    searchedEmployee
                                  )
                                }
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                              >
                                <Award className="h-4 w-4 mr-2" />
                                Inspect Skills
                              </Button>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-blue-600" />
                                <span className="font-semibold text-gray-700 dark:text-gray-300">
                                  Machine Skills (
                                  {
                                    Object.keys(
                                      searchedEmployee.skill_profile?.skills ||
                                        {}
                                    ).length
                                  }{" "}
                                  total)
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(
                                  searchedEmployee.skill_profile?.skills || {}
                                ).map(([skill, level]) => (
                                  <Badge
                                    key={skill}
                                    variant="outline"
                                    className={`${getSkillColor(
                                      level as string
                                    )} font-medium px-3 py-1`}
                                  >
                                    {skill}: {level as string}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border-2 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/50">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                            <X className="h-5 w-5 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-red-800 dark:text-red-300">
                              No Employee Found
                            </h4>
                            <p className="text-red-600 dark:text-red-400">
                              No employee found with ID or name "
                              {searchEmployeeId}". Please check and try again.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* All Employees Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">All Employees</CardTitle>
              <CardDescription>
                Complete list of employees and their skill counts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table
                columns={columns}
                data={filteredEmployees}
                isLoading={isLoading}
                emptyMessage="No employees found"
                onInspect={(employee) =>
                  setSelectedEmployeeForInspection(employee)
                }
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Employee Inspection Modal */}
      <EmployeeInspectionModal
        employee={selectedEmployeeForInspection}
        isOpen={!!selectedEmployeeForInspection} // !! at the start to ensure boolean
        onClose={() => setSelectedEmployeeForInspection(null)}
      />

      {/* Add New Employee Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Add New Employee
            </DialogTitle>
            <DialogDescription>
              Enter the employee details to add them to the system.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNewEmployee(formData);
              setIsModalOpen(false);
              setFormData({
                name: "",
                displayId: "",
                gender: "MALE",
                departmentId: "",
              });
            }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter full name"
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayId" className="text-sm font-medium">
                  Card Number (Display ID) *
                </Label>
                <Input
                  id="displayId"
                  type="text"
                  value={formData.displayId}
                  onChange={(e) =>
                    setFormData({ ...formData, displayId: e.target.value })
                  }
                  placeholder="Enter card number"
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium">
                  Gender
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      gender: value as "MALE" | "FEMALE",
                    })
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="departmentId" className="text-sm font-medium">
                  Department *
                </Label>
                <Select
                  value={formData.departmentId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, departmentId: value })
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setFormData({
                    name: "",
                    displayId: "",
                    gender: "MALE",
                    departmentId: "",
                  });
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !formData.name.trim() ||
                  !formData.displayId.trim() ||
                  !formData.departmentId
                }
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Employee
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsModalOpen(true)}
          size="lg"
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl border-0"
          title="Add New Employee"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  );
}
