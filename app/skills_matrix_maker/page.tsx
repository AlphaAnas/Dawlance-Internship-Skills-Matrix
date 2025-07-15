"use client"


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, 
  Plus, 
  X, 
  Edit3, 
  Eye, 
  Save, 
  CheckCircle, 
  Building, 
  Cog, 
  Filter,
  ArrowRight,
  User,
  FileText,
  Search,
  Trash2,
  Edit,
  Menu,
  Clock,
  Database
} from 'lucide-react';

// Mock data
const departments = [
  { id: 'plastic-extrusion', name: 'Plastic Extrusion', area: 'Production' },
  { id: 'assembly', name: 'Assembly', area: 'Production' },
  { id: 'quality', name: 'Quality Control', area: 'QC' },
  { id: 'maintenance', name: 'Maintenance', area: 'Support' }
];

const allEmployees = [
  { id: 'T1208382', name: 'Muhammad Owais', department: 'plastic-extrusion', area: 'Production' },
  { id: 'T1207850', name: 'Sarwar Khan', department: 'plastic-extrusion', area: 'Production' },
  { id: 'T1208438', name: 'Muhammad Asdullah', department: 'plastic-extrusion', area: 'Production' },
  { id: 'T1208060', name: 'Munavar Ali', department: 'plastic-extrusion', area: 'Production' },
  { id: 'T1207956', name: 'Muhammad Mannan', department: 'plastic-extrusion', area: 'Production' },
  { id: 'T1208349', name: 'Waqas Ali', department: 'plastic-extrusion', area: 'Production' },
  { id: 'T1208217', name: 'Muhammad Shaheen', department: 'plastic-extrusion', area: 'Production' },
  { id: 'T1207934', name: 'Muhammad Kashif', department: 'plastic-extrusion', area: 'Production' },
  { id: 'T1208144', name: 'Muhammad Sohaib', department: 'plastic-extrusion', area: 'Production' },
  { id: 'T1207856', name: 'Arfa Rehman', department: 'plastic-extrusion', area: 'Production' },
  { id: 'T1208262', name: 'Maqsood Ali', department: 'plastic-extrusion', area: 'Production' },
  { id: 'T1208101', name: 'Ali Asghar Solangi', department: 'plastic-extrusion', area: 'Production' },
  { id: 'T1209001', name: 'Ahmed Hassan', department: 'assembly', area: 'Production' },
  { id: 'T1209002', name: 'Fatima Ali', department: 'assembly', area: 'Production' },
  { id: 'T1209003', name: 'Hassan Khan', department: 'assembly', area: 'Production' },
  { id: 'T1209004', name: 'Ayesha Malik', department: 'assembly', area: 'Production' },
  { id: 'T1210001', name: 'Imran Sheikh', department: 'quality', area: 'QC' },
  { id: 'T1210002', name: 'Saba Ahmed', department: 'quality', area: 'QC' },
  { id: 'T1210003', name: 'Tariq Mahmood', department: 'quality', area: 'QC' },
  { id: 'T1211001', name: 'Rashid Hussain', department: 'maintenance', area: 'Support' },
  { id: 'T1211002', name: 'Zain Abbas', department: 'maintenance', area: 'Support' },
];

const predefinedSkills = {
  'plastic-extrusion': [
    'Material Mixing + Material Loading',
    'Machine SOP / Operation',
    'Quality of Sheet Extrusion',
    'Packing',
    'Quality of Gasket Extrusion',
    'Quality of Trim Extrusion',
    '5S',
    'Rework',
    'Fire & Safety Training'
  ],
  'assembly': [
    'Component Assembly',
    'Welding Operations',
    'Quality Inspection',
    'Torque Specifications',
    'Blueprint Reading',
    'Hand Tools Operation',
    'Power Tools Operation',
    'Safety Protocols',
    'Packaging & Shipping',
    'Inventory Management'
  ],
  'quality': [
    'Visual Inspection',
    'Dimensional Checking',
    'CMM Operation',
    'Gauge Calibration',
    'Statistical Process Control',
    'Non-Destructive Testing',
    'Documentation & Reporting',
    'Root Cause Analysis',
    'Customer Complaint Handling',
    'ISO Standards Knowledge'
  ],
  'maintenance': [
    'Preventive Maintenance',
    'Electrical Systems',
    'Mechanical Systems',
    'Hydraulic Systems',
    'Pneumatic Systems',
    'PLC Programming',
    'Troubleshooting',
    'Welding & Fabrication',
    'Lubrication Systems',
    'Safety Lockout/Tagout'
  ]
};

const skillLevelColors = {
  'Beginner': { bg: '#ef4444', text: '#ffffff' },
  'Intermediate': { bg: '#f59e0b', text: '#ffffff' },
  'Advanced': { bg: '#10b981', text: '#ffffff' },
  'Expert': { bg: '#3b82f6', text: '#ffffff' }
};

const PieChartSkillIndicator = ({ level, size = 80 }) => {
  const colors = skillLevelColors[level] || { bg: '#e5e7eb', text: '#6b7280' };
  const percentage = {
    'Beginner': 25,
    'Intermediate': 50,
    'Advanced': 75,
    'Expert': 100
  }[level] || 0;

  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className="rounded-full flex items-center justify-center font-bold text-sm"
        style={{ 
          width: size, 
          height: size, 
          backgroundColor: colors.bg,
          color: colors.text,
          background: `conic-gradient(${colors.bg} 0deg, ${colors.bg} ${percentage * 3.6}deg, #e5e7eb ${percentage * 3.6}deg, #e5e7eb 360deg)`
        }}
      >
        {percentage}%
      </div>
      <span className="text-xs text-gray-600">{level}</span>
    </div>
  );
};

const SaveSuccessPopup = ({ isVisible, onClose, matrixName }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Matrix Saved Successfully!</h3>
          <p className="text-gray-600 mb-6">
            "{matrixName}" has been saved and is now available in your matrices library.
          </p>
          <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

const SkillsMatrixManager = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [matrixName, setMatrixName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [skillLevels, setSkillLevels] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showFinalTable, setShowFinalTable] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [savedMatrices, setSavedMatrices] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMatrix, setSelectedMatrix] = useState(null);

  const steps = [
    { id: 1, title: 'Matrix Setup', desc: 'Name your matrix and select department' },
    { id: 2, title: 'Select Employees', desc: 'Choose employees for the matrix (rows)' },
    { id: 3, title: 'Add Skills', desc: 'Define skills/machines (columns)' },
    { id: 4, title: 'Preview & Save', desc: 'Review and save your matrix' }
  ];

  const filteredEmployees = allEmployees.filter(emp => 
    emp.department === selectedDepartment &&
    emp.name.toLowerCase().includes(employeeFilter.toLowerCase())
  );

  const availableEmployees = filteredEmployees.filter(emp => 
    !selectedEmployees.find(selected => selected.id === emp.id)
  );

  const departmentSkills = predefinedSkills[selectedDepartment] || [];
  const filteredSkills = departmentSkills.filter(skill => 
    skill.toLowerCase().includes(skillFilter.toLowerCase()) &&
    !skills.includes(skill)
  );

  const addEmployee = (employee) => {
    setSelectedEmployees([...selectedEmployees, employee]);
  };

  const removeEmployee = (employeeId) => {
    setSelectedEmployees(selectedEmployees.filter(emp => emp.id !== employeeId));
  };

  const addNewEmployeeRow = () => {
    const newId = `T${Date.now()}`;
    const newEmployee = {
      id: newId,
      name: 'New Employee',
      department: selectedDepartment,
      area: departments.find(d => d.id === selectedDepartment)?.area || 'Production'
    };
    setSelectedEmployees([...selectedEmployees, newEmployee]);
    setEditingEmployee(newId);
  };

  const deleteEmployeeRow = (employeeId) => {
    setSelectedEmployees(selectedEmployees.filter(emp => emp.id !== employeeId));
  };

  const updateEmployeeName = (employeeId, newName) => {
    setSelectedEmployees(selectedEmployees.map(emp => 
      emp.id === employeeId ? { ...emp, name: newName } : emp
    ));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const addPredefinedSkill = (skill) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  const addNewSkillColumn = () => {
    const newSkill = 'New Skill';
    setSkills([...skills, newSkill]);
    setEditingSkill(skills.length);
  };

  const deleteSkillColumn = (skillIndex) => {
    const skillToRemove = skills[skillIndex];
    setSkills(skills.filter((_, index) => index !== skillIndex));
    const updatedSkillLevels = { ...skillLevels };
    selectedEmployees.forEach(emp => {
      delete updatedSkillLevels[`${emp.name}-${skillToRemove}`];
    });
    setSkillLevels(updatedSkillLevels);
  };

  const updateSkillName = (skillIndex, newName) => {
    const oldSkill = skills[skillIndex];
    const updatedSkills = [...skills];
    updatedSkills[skillIndex] = newName;
    setSkills(updatedSkills);
    
    const updatedSkillLevels = { ...skillLevels };
    selectedEmployees.forEach(emp => {
      const oldKey = `${emp.name}-${oldSkill}`;
      const newKey = `${emp.name}-${newName}`;
      if (updatedSkillLevels[oldKey]) {
        updatedSkillLevels[newKey] = updatedSkillLevels[oldKey];
        delete updatedSkillLevels[oldKey];
      }
    });
    setSkillLevels(updatedSkillLevels);
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSkillChange = (employeeName, skill, level) => {
    setSkillLevels(prev => ({
      ...prev,
      [`${employeeName}-${skill}`]: level
    }));
  };

  const getSkillLevel = (employee, skill) => {
    return skillLevels[`${employee.name}-${skill}`] || 'Beginner';
  };

  const handleSave = () => {
    const matrixData = {
      id: Date.now(),
      name: matrixName,
      department: selectedDepartment,
      employees: selectedEmployees,
      skills: skills,
      skillLevels: skillLevels,
      createdAt: new Date().toISOString(),
      employeeCount: selectedEmployees.length,
      skillCount: skills.length
    };
    
    setSavedMatrices(prev => [matrixData, ...prev]);
    setSaved(true);
    setShowSuccessPopup(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const loadMatrix = (matrix) => {
    setMatrixName(matrix.name);
    setSelectedDepartment(matrix.department);
    setSelectedEmployees(matrix.employees);
    setSkills(matrix.skills);
    setSkillLevels(matrix.skillLevels);
    setSelectedMatrix(matrix);
    setShowFinalTable(true);
    setSidebarOpen(false);
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1: return matrixName.trim() && selectedDepartment;
      case 2: return selectedEmployees.length > 0;
      case 3: return skills.length > 0;
      case 4: return true;
      default: return false;
    }
  };

  const resetMatrix = () => {
    setCurrentStep(1);
    setMatrixName('');
    setSelectedDepartment('');
    setSelectedEmployees([]);
    setSkills([]);
    setSkillLevels({});
    setShowFinalTable(false);
    setIsEditMode(false);
    setEditingEmployee(null);
    setEditingSkill(null);
    setSelectedMatrix(null);
  };

  if (showFinalTable) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white shadow-lg overflow-hidden`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Database className="h-5 w-5" />
                Saved Matrices
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {savedMatrices.map((matrix) => (
                <div
                  key={matrix.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedMatrix?.id === matrix.id ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => loadMatrix(matrix)}
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{matrix.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {departments.find(d => d.id === matrix.department)?.name}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{matrix.employeeCount} employees</span>
                    <span>{matrix.skillCount} skills</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {new Date(matrix.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {savedMatrices.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No saved matrices yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  variant="outline"
                  size="sm"
                >
                  <Menu className="h-4 w-4 mr-2" />
                  Matrices ({savedMatrices.length})
                </Button>
                <Button 
                  onClick={resetMatrix}
                  variant="outline"
                >
                  ← Back to Matrix Builder
                </Button>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Skills Matrix</h1>
              <p className="text-xl text-gray-600">View and manage employee skill levels</p>
            </div>

            <Card className="border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <CardTitle className="text-3xl">{matrixName}</CardTitle>
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
                      {selectedEmployees.length} employees • {skills.length} skills
                    </CardDescription>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => setIsEditMode(!isEditMode)}
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
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Employee (Rows)
                              </div>
                              {isEditMode && (
                                <Button
                                  onClick={addNewEmployeeRow}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableHead>
                          {skills.map((skill, index) => (
                            <TableHead
                              key={`skill-${index}`}
                              className="text-white font-bold text-xl py-6 px-8 text-center min-w-[220px] whitespace-nowrap"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Cog className="h-5 w-5" />
                                  {editingSkill === index && isEditMode ? (
                                    <Input
                                      value={skill}
                                      onChange={(e) => updateSkillName(index, e.target.value)}
                                      onBlur={() => setEditingSkill(null)}
                                      onKeyPress={(e) => e.key === 'Enter' && setEditingSkill(null)}
                                      className="w-32 h-8 text-sm bg-white text-black"
                                      autoFocus
                                    />
                                  ) : (
                                    <span
                                      onClick={() => isEditMode && setEditingSkill(index)}
                                      className={isEditMode ? "cursor-pointer hover:bg-slate-700 px-2 py-1 rounded" : ""}
                                    >
                                      {skill}
                                    </span>
                                  )}
                                </div>
                                {isEditMode && (
                                  <div className="flex gap-1">
                                    {index === skills.length - 1 && (
                                      <Button
                                        onClick={addNewSkillColumn}
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                    )}
                                    <Button
                                      onClick={() => deleteSkillColumn(index)}
                                      size="sm"
                                      variant="destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedEmployees.map((emp, idx) => (
                          <TableRow
                            key={`emp-${idx}`}
                            className={`${
                              idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                            } hover:bg-blue-50 transition-colors`}
                          >
                            <TableCell className="font-semibold text-lg py-8 px-8 sticky left-0 z-10 bg-inherit border-r-2 border-gray-200">
                              <div className="flex items-center justify-between">
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
                                    {editingEmployee === emp.id && isEditMode ? (
                                      <Input
                                        value={emp.name}
                                        onChange={(e) => updateEmployeeName(emp.id, e.target.value)}
                                        onBlur={() => setEditingEmployee(null)}
                                        onKeyPress={(e) => e.key === 'Enter' && setEditingEmployee(null)}
                                        className="w-48 h-8 text-sm mb-1"
                                        autoFocus
                                      />
                                    ) : (
                                      <div
                                        onClick={() => isEditMode && setEditingEmployee(emp.id)}
                                        className={`font-bold text-xl text-gray-900 ${
                                          isEditMode ? "cursor-pointer hover:bg-gray-200 px-2 py-1 rounded" : ""
                                        }`}
                                      >
                                        {emp.name}
                                      </div>
                                    )}
                                    <div className="text-lg text-gray-500">ID: {emp.id}</div>
                                  </div>
                                </div>
                                {isEditMode && (
                                  <Button
                                    onClick={() => deleteEmployeeRow(emp.id)}
                                    size="sm"
                                    variant="destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                            {skills.map((skill, skillIdx) => (
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
                                    >
                                      <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Select level" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Object.entries(skillLevelColors).map(([level]) => (
                                          <SelectItem key={level} value={level}>
                                            <div className="flex items-center gap-3">
                                              <PieChartSkillIndicator level={level} size={24} />
                                              {level}
                                            </div>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
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
          </div>
        </div>

        <SaveSuccessPopup 
          isVisible={showSuccessPopup} 
          onClose={() => setShowSuccessPopup(false)}
          matrixName={matrixName}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Skills Matrix Builder</h1>
          <p className="text-xl text-gray-600">Create and manage employee skill matrices</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                  ${currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}
                `}>
                  {step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-24 h-1 mx-4
                    ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-gray-600">{steps[currentStep - 1].desc}</p>
          </div>
        </div>

        <Card className="border-0 bg-white/90 backdrop-blur-sm mb-8">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Matrix Name
                  </label>
                  <Input
                    value={matrixName}
                    onChange={(e) => setMatrixName(e.target.value)}
                    placeholder="Enter matrix name (e.g., Plastic Extrusion Skills)"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            {dept.name} ({dept.area})
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Table Rows: Employees
                  </h3>
                  <p className="text-blue-800">
                    Each employee you select will become a row in your skills matrix table.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-semibold">Available Employees</h3>
                      <Badge variant="secondary">{availableEmployees.length}</Badge>
                    </div>
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          value={employeeFilter}
                          onChange={(e) => setEmployeeFilter(e.target.value)}
                          placeholder="Search employees..."
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {availableEmployees.map((emp) => (
                        <div
                          key={emp.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-xs">
                                {emp.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{emp.name}</div>
                              <div className="text-sm text-gray-500">{emp.id}</div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => addEmployee(emp)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-semibold">Selected Employees</h3>
                      <Badge variant="default">{selectedEmployees.length}</Badge>
                    </div>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {selectedEmployees.map((emp) => (
                        <div
                          key={emp.id}
                          className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-xs">
                                {emp.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{emp.name}</div>
                              <div className="text-sm text-gray-500">{emp.id}</div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeEmployee(emp.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {selectedEmployees.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No employees selected yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <Cog className="h-5 w-5" />
                    Table Columns: Skills/Machines
                  </h3>
                  <p className="text-green-800">
                    Each skill you add will become a column in your skills matrix table.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-semibold">Available Skills</h3>
                      <Badge variant="secondary">{filteredSkills.length}</Badge>
                    </div>
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          value={skillFilter}
                          onChange={(e) => setSkillFilter(e.target.value)}
                          placeholder="Search skills..."
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {filteredSkills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Cog className="h-5 w-5 text-gray-600" />
                            <span className="font-medium text-sm">{skill}</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => addPredefinedSkill(skill)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {filteredSkills.length === 0 && (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          {skillFilter ? 'No skills match your search' : 'No more skills available'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Add Custom Skill</h3>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Enter custom skill name"
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                        />
                        <Button onClick={addSkill} className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Custom Skill
                        </Button>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Tip:</strong> Use the predefined skills from the left panel or create your own custom skills.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-semibold">Selected Skills</h3>
                      <Badge variant="default">{skills.length}</Badge>
                    </div>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Cog className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-sm">{skill}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeSkill(skill)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {skills.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No skills selected yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Matrix Summary
                  </h3>
                  <p className="text-purple-800">
                    Review your matrix configuration before creating the final table.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Matrix Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium">Name:</span>
                          <p className="text-gray-600">{matrixName}</p>
                        </div>
                        <div>
                          <span className="font-medium">Department:</span>
                          <p className="text-gray-600">
                            {departments.find(d => d.id === selectedDepartment)?.name}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Employees (Rows)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="font-medium">{selectedEmployees.length} employees selected</p>
                        <div className="max-h-32 overflow-y-auto">
                          {selectedEmployees.map((emp, idx) => (
                            <p key={idx} className="text-sm text-gray-600">
                              • {emp.name}
                            </p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Cog className="h-5 w-5" />
                        Skills (Columns)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="font-medium">{skills.length} skills added</p>
                        <div className="max-h-32 overflow-y-auto">
                          {skills.map((skill, idx) => (
                            <p key={idx} className="text-sm text-gray-600">
                              • {skill}
                            </p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center">
                  <Button
                    onClick={() => setShowFinalTable(true)}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
                  >
                    <FileText className="h-6 w-6 mr-2" />
                    Create Skills Matrix Table
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            variant="outline"
            size="lg"
            className="px-8 py-4"
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
            disabled={currentStep === 4 || !canProceedToNext()}
            size="lg"
            className="px-8 py-4"
          >
            Next
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SkillsMatrixManager;