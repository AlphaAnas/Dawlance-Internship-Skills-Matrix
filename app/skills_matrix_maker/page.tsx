"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Plus, X, Save, Download, Users, Settings, FileSpreadsheet, AlertCircle, CheckCircle, ArrowRight, ArrowLeft, Check } from "lucide-react";

// Types
interface Department {
  id: string;
  name: string;
}

interface Skill {
  id: string;
  name: string;
  departmentId: string;
  femaleEligible: boolean;
  isCritical: boolean;
}

interface Employee {
  id: string;
  name: string;
  cardNumber: string;
  departmentId: string;
  gender: "MALE" | "FEMALE";
  skills: Record<string, string>;
}

interface ExcelData {
  employees: Employee[];
  skills: Skill[];
  departments: Department[];
}

// Skill levels
const SKILL_LEVELS = [
  { value: "None", label: "None (0%)", color: "bg-gray-400" },
  { value: "Low Skilled", label: "Low Skilled (25%)", color: "bg-red-400" },
  { value: "Semi Skilled", label: "Semi Skilled (50%)", color: "bg-yellow-400" },
  { value: "Skilled", label: "Skilled (75%)", color: "bg-blue-400" },
  { value: "Highly Skilled", label: "Highly Skilled (100%)", color: "bg-green-400" }
];

export default function SkillsMatrixCreator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'departments' | 'skills' | 'employees' | 'upload'>('departments');
  const [departments, setDepartments] = useState<Department[]>([
    { id: '1', name: 'PLASTIC EXTRUSION' },
    { id: '2', name: 'SHEET EXTRUSION' },
    { id: '3', name: 'GASKET EXTRUSION' },
    { id: '4', name: 'ASSEMBLY LINE' },
    { id: '5', name: 'QUALITY CONTROL' }
  ]);
  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', name: 'Material mixing + material loading', departmentId: '1', femaleEligible: true, isCritical: true },
    { id: '2', name: 'Machine SOP Operation', departmentId: '1', femaleEligible: false, isCritical: true },
    { id: '3', name: 'Quality of Extrusion', departmentId: '1', femaleEligible: true, isCritical: false },
    { id: '4', name: 'Packing', departmentId: '1', femaleEligible: true, isCritical: false },
    { id: '5', name: '5S Implementation', departmentId: '1', femaleEligible: true, isCritical: false },
    { id: '6', name: 'Rework Operations', departmentId: '1', femaleEligible: true, isCritical: false },
    { id: '7', name: 'Sheet Cutting', departmentId: '2', femaleEligible: false, isCritical: true },
    { id: '8', name: 'Sheet Quality Check', departmentId: '2', femaleEligible: true, isCritical: true },
    { id: '9', name: 'Gasket Molding', departmentId: '3', femaleEligible: false, isCritical: true },
    { id: '10', name: 'Gasket Testing', departmentId: '3', femaleEligible: true, isCritical: false }
  ]);
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'MUHAMMAD OVAIS',
      cardNumber: 'T12083982',
      departmentId: '1',
      gender: 'MALE',
      skills: {
        'Material mixing + material loading': 'Highly Skilled',
        'Machine SOP Operation': 'Skilled',
        'Quality of Extrusion': 'Skilled',
        'Packing': 'Skilled'
      }
    },
    {
      id: '2',
      name: 'SARVAB KHAN',
      cardNumber: 'T12077850',
      departmentId: '1',
      gender: 'MALE',
      skills: {
        'Material mixing + material loading': 'Skilled',
        'Machine SOP Operation': 'Semi Skilled',
        'Quality of Extrusion': 'Semi Skilled',
        'Packing': 'Skilled'
      }
    },
    {
      id: '3',
      name: 'FATIMA AHMED',
      cardNumber: 'T12088934',
      departmentId: '2',
      gender: 'FEMALE',
      skills: {
        'Sheet Quality Check': 'Highly Skilled',
        'Packing': 'Skilled'
      }
    }
  ]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');

  // Form states
  const [newDepartment, setNewDepartment] = useState({ name: '' });
  const [newSkill, setNewSkill] = useState({ 
    name: '', 
    departmentId: '', 
    femaleEligible: false, 
    isCritical: false 
  });
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    cardNumber: '',
    departmentId: '',
    gender: 'MALE' as 'MALE' | 'FEMALE'
  });

  // Excel file processing
  const processExcelFile = (file: File) => {
    setUploadStatus('processing');
    setUploadMessage('Processing Excel file...');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // Simulate Excel processing - in real app, you'd use a library like xlsx
        setTimeout(() => {
          // Mock processed data based on the Excel format shown
          const mockData: ExcelData = {
            departments: [
              { id: '1', name: 'PLASTIC EXTRUSION' },
              { id: '2', name: 'SHEET EXTRUSION' },
              { id: '3', name: 'GASKET EXTRUSION' }
            ],
            skills: [
              { id: '1', name: 'Material mixing + material loading', departmentId: '1', femaleEligible: true, isCritical: true },
              { id: '2', name: 'Machine SOP Operation', departmentId: '1', femaleEligible: false, isCritical: true },
              { id: '3', name: 'Quality of Extrusion', departmentId: '1', femaleEligible: true, isCritical: false },
              { id: '4', name: 'Packing', departmentId: '1', femaleEligible: true, isCritical: false },
              { id: '5', name: '5S', departmentId: '1', femaleEligible: true, isCritical: false },
              { id: '6', name: 'Rework', departmentId: '1', femaleEligible: true, isCritical: false }
            ],
            employees: [
              {
                id: '1',
                name: 'MUHAMMAD OVAIS',
                cardNumber: 'T12083982',
                departmentId: '1',
                gender: 'MALE',
                skills: {
                  'Material mixing + material loading': 'Highly Skilled',
                  'Machine SOP Operation': 'Skilled',
                  'Quality of Extrusion': 'Skilled',
                  'Packing': 'Skilled'
                }
              },
              {
                id: '2',
                name: 'SARVAB KHAN',
                cardNumber: 'T12077850',
                departmentId: '1',
                gender: 'MALE',
                skills: {
                  'Material mixing + material loading': 'Skilled',
                  'Machine SOP Operation': 'Semi Skilled',
                  'Quality of Extrusion': 'Semi Skilled',
                  'Packing': 'Skilled'
                }
              }
            ]
          };

          setDepartments(mockData.departments);
          setSkills(mockData.skills);
          setEmployees(mockData.employees);
          setUploadStatus('success');
          setUploadMessage('Excel file processed successfully! Data has been imported.');
        }, 2000);
      } catch (error) {
        setUploadStatus('error');
        setUploadMessage('Error processing Excel file. Please check the format and try again.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // CRUD operations
  const addDepartment = () => {
    if (newDepartment.name.trim()) {
      const department: Department = {
        id: Date.now().toString(),
        name: newDepartment.name.trim()
      };
      setDepartments([...departments, department]);
      setNewDepartment({ name: '' });
    }
  };

  const deleteDepartment = (id: string) => {
    setDepartments(departments.filter(dept => dept.id !== id));
    setSkills(skills.filter(skill => skill.departmentId !== id));
    setEmployees(employees.filter(emp => emp.departmentId !== id));
  };

  const addSkill = () => {
    if (newSkill.name.trim() && newSkill.departmentId) {
      const skill: Skill = {
        id: Date.now().toString(),
        name: newSkill.name.trim(),
        departmentId: newSkill.departmentId,
        femaleEligible: newSkill.femaleEligible,
        isCritical: newSkill.isCritical
      };
      setSkills([...skills, skill]);
      setNewSkill({ name: '', departmentId: '', femaleEligible: false, isCritical: false });
    }
  };

  const deleteSkill = (id: string) => {
    const skillToDelete = skills.find(s => s.id === id);
    if (skillToDelete) {
      setSkills(skills.filter(skill => skill.id !== id));
      // Remove skill from all employees
      setEmployees(employees.map(emp => ({
        ...emp,
        skills: Object.fromEntries(
          Object.entries(emp.skills).filter(([skillName]) => skillName !== skillToDelete.name)
        )
      })));
    }
  };

  const addEmployee = () => {
    if (newEmployee.name.trim() && newEmployee.cardNumber.trim() && newEmployee.departmentId) {
      const employee: Employee = {
        id: Date.now().toString(),
        name: newEmployee.name.trim(),
        cardNumber: newEmployee.cardNumber.trim(),
        departmentId: newEmployee.departmentId,
        gender: newEmployee.gender,
        skills: {}
      };
      setEmployees([...employees, employee]);
      setNewEmployee({ name: '', cardNumber: '', departmentId: '', gender: 'MALE' });
    }
  };

  const deleteEmployee = (id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const updateEmployeeSkill = (employeeId: string, skillName: string, level: string) => {
    setEmployees(employees.map(emp => 
      emp.id === employeeId 
        ? { ...emp, skills: { ...emp.skills, [skillName]: level } }
        : emp
    ));
  };

  const exportData = () => {
    const data = {
      departments,
      skills,
      employees,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skills-matrix-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const TabButton = ({ id, icon: Icon, label, isActive, onClick }: {
    id: string;
    icon: any;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );

  const steps = [
    { id: 1, title: 'Create Departments', description: 'Set up your organizational departments', icon: Settings },
    { id: 2, title: 'Define Skills', description: 'Add skills required for each department', icon: CheckCircle },
    { id: 3, title: 'Add Employees', description: 'Register employees and assign skills', icon: Users },
    { id: 4, title: 'Import/Export', description: 'Upload Excel data or export your matrix', icon: FileSpreadsheet }
  ];

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setActiveTab(['departments', 'skills', 'employees', 'upload'][currentStep] as any);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setActiveTab(['departments', 'skills', 'employees', 'upload'][currentStep - 2] as any);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    setActiveTab(['departments', 'skills', 'employees', 'upload'][step - 1] as any);
  };

  return (
    // <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Skills Matrix Creator
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage your factory's employee skills matrix with our step-by-step guide
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div 
                    className={`flex items-center cursor-pointer ${index < steps.length - 1 ? 'flex-1' : ''}`}
                    onClick={() => goToStep(step.id)}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold transition-colors ${
                          currentStep === step.id
                            ? 'bg-blue-600'
                            : currentStep > step.id
                            ? 'bg-green-600'
                            : 'bg-gray-400'
                        }`}
                      >
                        {currentStep > step.id ? (
                          <Check className="h-6 w-6" />
                        ) : (
                          <step.icon className="h-6 w-6" />
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <h3 className={`text-sm font-medium ${
                          currentStep === step.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                        }`}>
                          {step.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-24">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            {/* Step Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Step {currentStep}: {steps[currentStep - 1].title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {steps[currentStep - 1].description}
              </p>
            </div>
            {/* Departments Tab */}
            {activeTab === 'departments' && (
              <div className="space-y-6">
                {/* Form Section */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Add New Department
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Department Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter department name (e.g., PLASTIC EXTRUSION)"
                        value={newDepartment.name}
                        onChange={(e) => setNewDepartment({ name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={addDepartment}
                      disabled={!newDepartment.name.trim()}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                      Add Department
                    </button>
                  </div>
                </div>

                {/* Departments List */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Current Departments ({departments.length})
                    </h3>
                    <button
                      onClick={exportData}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Export Data
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {departments.map((dept) => (
                      <div key={dept.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                        <div>
                          <span className="text-gray-900 dark:text-white font-medium">{dept.name}</span>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {skills.filter(s => s.departmentId === dept.id).length} skills • {employees.filter(e => e.departmentId === dept.id).length} employees
                          </p>
                        </div>
                        <button
                          onClick={() => deleteDepartment(dept.id)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                          title="Delete department"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {departments.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No departments added yet. Start by adding your first department above.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                {/* Form Section */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Add New Skill
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Skill Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter skill name"
                        value={newSkill.name}
                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Department
                      </label>
                      <select
                        value={newSkill.departmentId}
                        onChange={(e) => setNewSkill({ ...newSkill, departmentId: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Skill Properties
                      </label>
                      <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <input
                            type="checkbox"
                            checked={newSkill.femaleEligible}
                            onChange={(e) => setNewSkill({ ...newSkill, femaleEligible: e.target.checked })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          Female Eligible
                        </label>
                        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <input
                            type="checkbox"
                            checked={newSkill.isCritical}
                            onChange={(e) => setNewSkill({ ...newSkill, isCritical: e.target.checked })}
                            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                          Critical Skill
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={addSkill}
                      disabled={!newSkill.name.trim() || !newSkill.departmentId}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                      Add Skill
                    </button>
                  </div>
                </div>

                {/* Skills List */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Current Skills ({skills.length})
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {skills.map((skill) => {
                      const department = departments.find(d => d.id === skill.departmentId);
                      return (
                        <div key={skill.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-gray-900 dark:text-white font-medium mb-1">{skill.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Department: {department?.name || 'Unknown'}
                              </p>
                              <div className="flex gap-2">
                                {skill.femaleEligible && (
                                  <span className="px-2 py-1 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 rounded-full text-xs">
                                    Female Eligible
                                  </span>
                                )}
                                {skill.isCritical && (
                                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs">
                                    Critical
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => deleteSkill(skill.id)}
                              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                              title="Delete skill"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {skills.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No skills added yet. Start by adding skills for your departments above.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Employees Tab */}
            {activeTab === 'employees' && (
              <div className="space-y-6">
                {/* Form Section */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Add New Employee
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Employee Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter full name"
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., T12083982"
                        value={newEmployee.cardNumber}
                        onChange={(e) => setNewEmployee({ ...newEmployee, cardNumber: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Department
                      </label>
                      <select
                        value={newEmployee.departmentId}
                        onChange={(e) => setNewEmployee({ ...newEmployee, departmentId: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Gender
                      </label>
                      <select
                        value={newEmployee.gender}
                        onChange={(e) => setNewEmployee({ ...newEmployee, gender: e.target.value as 'MALE' | 'FEMALE' })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={addEmployee}
                      disabled={!newEmployee.name.trim() || !newEmployee.cardNumber.trim() || !newEmployee.departmentId}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                      Add Employee
                    </button>
                  </div>
                </div>

                {/* Employees List with Skills */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Current Employees ({employees.length})
                  </h3>
                  <div className="space-y-4">
                    {employees.map((employee) => {
                      const department = departments.find(d => d.id === employee.departmentId);
                      const relevantSkills = skills.filter(s => s.departmentId === employee.departmentId);
                      
                      return (
                        <div key={employee.id} className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                                employee.gender === 'MALE' ? 'bg-blue-500' : 'bg-pink-500'
                              }`}>
                                {employee.gender === 'MALE' ? '♂' : '♀'}
                              </div>
                              <div>
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white">{employee.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {employee.cardNumber} • {department?.name}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => deleteEmployee(employee.id)}
                              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                              title="Delete employee"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Skills Assignment */}
                          {relevantSkills.length > 0 ? (
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Skills Assessment ({relevantSkills.length} skills available)
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {relevantSkills.map((skill) => (
                                  <div key={skill.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {skill.name}
                                      </span>
                                      {skill.isCritical && (
                                        <span className="px-1 py-0.5 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded text-xs">
                                          Critical
                                        </span>
                                      )}
                                    </div>
                                    <select
                                      value={employee.skills[skill.name] || 'None'}
                                      onChange={(e) => updateEmployeeSkill(employee.id, skill.name, e.target.value)}
                                      className="w-full text-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    >
                                      {SKILL_LEVELS.map((level) => (
                                        <option key={level.value} value={level.value}>
                                          {level.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                              <p className="text-sm">No skills available for this department.</p>
                              <p className="text-xs">Add skills to the {department?.name} department first.</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {employees.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No employees added yet. Start by adding your first employee above.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Excel Upload Tab */}
            {activeTab === 'upload' && (
              <div className="space-y-6">
                {/* Upload Section */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Import Skills Matrix from Excel
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Upload an Excel file containing employee skills data. The file should follow the format described below.
                  </p>

                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Upload Excel File
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Drag and drop your Excel file here, or click to browse
                    </p>
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          processExcelFile(file);
                        }
                      }}
                      className="hidden"
                      id="excel-upload"
                    />
                    <label
                      htmlFor="excel-upload"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      Choose File
                    </label>
                  </div>

                  {/* Upload Status */}
                  {uploadStatus !== 'idle' && (
                    <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
                      uploadStatus === 'success' ? 'bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700' :
                      uploadStatus === 'error' ? 'bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700' :
                      'bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700'
                    }`}>
                      {uploadStatus === 'processing' && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      )}
                      {uploadStatus === 'success' && <CheckCircle className="h-4 w-4" />}
                      {uploadStatus === 'error' && <AlertCircle className="h-4 w-4" />}
                      <span>{uploadMessage}</span>
                    </div>
                  )}
                </div>

                {/* File Format Guide */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Expected Excel Format:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Required Columns:</h5>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• <strong>Employee Name:</strong> Full name of the employee</li>
                        <li>• <strong>Card Number:</strong> Unique employee identifier</li>
                        <li>• <strong>Department:</strong> Department name</li>
                        <li>• <strong>Gender:</strong> MALE or FEMALE</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Skill Columns:</h5>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• Each skill should have its own column</li>
                        <li>• Use skill names as column headers</li>
                        <li>• Values: None, Low Skilled, Semi Skilled, Skilled, Highly Skilled</li>
                        <li>• Empty cells default to "None"</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Export Options */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Export Your Data:</h4>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={exportData}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Export as JSON
                    </button>
                    <button
                      onClick={() => {
                        // This would trigger Excel export in a real implementation
                        alert('Excel export functionality would be implemented here');
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      Export as Excel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous Step
              </button>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Step {currentStep} of {steps.length}
              </div>

              <button
                onClick={nextStep}
                disabled={currentStep === 4}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          {/* Data Summary */}
          {(departments.length > 0 || skills.length > 0 || employees.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Current Data Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {departments.length}
                  </div>
                  <div className="text-sm text-blue-800 dark:text-blue-300">Departments</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {skills.length}
                  </div>
                  <div className="text-sm text-green-800 dark:text-green-300">Skills</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {employees.length}
                  </div>
                  <div className="text-sm text-purple-800 dark:text-purple-300">Employees</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

  );
}