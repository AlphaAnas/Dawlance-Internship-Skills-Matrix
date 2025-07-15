import type { Department, Employee, Machine, EmployeeHistory } from "../types"

export const mockDepartments: Department[] = [
  { id: "1", name: "Manufacturing" },
  { id: "2", name: "Quality Control" },
  { id: "3", name: "Maintenance" },
  { id: "4", name: "Assembly" },
  { id: "5", name: "Packaging" },
]

export const mockMachines: Machine[] = [
  // Manufacturing Department
  { id: "M001", name: "CNC Machine", departmentId: "1", category: "Machining" },
  { id: "M002", name: "Welding Robot", departmentId: "1", category: "Welding" },
  { id: "M003", name: "Assembly Line", departmentId: "1", category: "Assembly" },
  { id: "M004", name: "Milling Machine", departmentId: "1", category: "Machining" },
  { id: "M005", name: "Lathe Operation", departmentId: "1", category: "Machining" },

  // Quality Control Department
  { id: "M006", name: "Quality Scanner", departmentId: "2", category: "Testing" },
  { id: "M007", name: "Testing Equipment", departmentId: "2", category: "Testing" },
  { id: "M008", name: "Calibration Tools", departmentId: "2", category: "Calibration" },
  { id: "M009", name: "Measurement Tools", departmentId: "2", category: "Measurement" },
  { id: "M010", name: "Statistical Analysis", departmentId: "2", category: "Analysis" },

  // Maintenance Department
  { id: "M011", name: "Hydraulic Press", departmentId: "3", category: "Hydraulics" },
  { id: "M012", name: "Electrical Systems", departmentId: "3", category: "Electrical" },
  { id: "M013", name: "Pneumatic Tools", departmentId: "3", category: "Pneumatics" },
  { id: "M014", name: "PLC Programming", departmentId: "3", category: "Programming" },
  { id: "M015", name: "Motor Control", departmentId: "3", category: "Electrical" },

  // Assembly Department
  { id: "M016", name: "Robotic Arms", departmentId: "4", category: "Robotics" },
  { id: "M017", name: "Conveyor Systems", departmentId: "4", category: "Material Handling" },
  { id: "M018", name: "Quality Control", departmentId: "4", category: "Quality" },

  // Packaging Department
  { id: "M019", name: "Packaging Machine", departmentId: "5", category: "Packaging" },
  { id: "M020", name: "Labeling System", departmentId: "5", category: "Labeling" },
  { id: "M021", name: "Shrink Wrap", departmentId: "5", category: "Packaging" },
  { id: "M022", name: "Inventory System", departmentId: "5", category: "Inventory" },
]

export const mockEmployees: Employee[] = [
  {
    displayId: "EMP001",
    name: "Ahmed Raza",
    gender:"MALE",
    departmentId: "1",
    skills: {
      "CNC Machine": "High",
      "Welding Robot": "Medium",
      "Assembly Line": "Advanced",
    },
  },
  {
    displayId: "EMP002",
    name: "Fatima Noor",
    gender:"FEMALE",
    departmentId: "1",
    skills: {
      "CNC Machine": "Advanced",
      "Quality Scanner": "High",
      "Packaging Machine": "Medium",
    },
  },
  {
    displayId: "EMP003",
    name: "Bilal Khan",
    gender:"MALE",
    departmentId: "2",
    skills: {
      "Quality Scanner": "Advanced",
      "Testing Equipment": "High",
      "Calibration Tools": "Medium",
    },
  },
  {
    displayId: "EMP004",
    name: "Ayesha Siddiqui",
    gender:"FEMALE",
    departmentId: "2",
    skills: {
      "Testing Equipment": "Advanced",
      "Quality Scanner": "High",
      "Documentation System": "High",
    },
  },
  {
    displayId: "EMP005",
    name: "Usman Javed",
    gender:"MALE",
    departmentId: "3",
    skills: {
      "Hydraulic Press": "Advanced",
      "Electrical Systems": "High",
      "Pneumatic Tools": "Medium",
    },
  },
  {
    displayId: "EMP006",
    name: "Zainab Ali",
    gender:"FEMALE",
    departmentId: "3",
    skills: {
      "Electrical Systems": "Advanced",
      "PLC Programming": "High",
      "Motor Control": "High",
    },
  },
  {
    displayId: "EMP007",
    name: "Hassan Tariq",
    gender:"MALE",
    departmentId: "4",
    skills: {
      "Assembly Line": "Advanced",
      "Robotic Arms": "High",
      "Conveyor Systems": "Medium",
    },
  },
  {
    displayId: "EMP008",
    name: "Maria Naseem",
    gender:"FEMALE",
    departmentId: "4",
    skills: {
      "Robotic Arms": "Advanced",
      "Assembly Line": "High",
      "Quality Control": "Medium",
    },
  },
  {
    displayId: "EMP009",
    name: "Ali Haider",
    gender:"MALE",
    departmentId: "5",
    skills: {
      "Packaging Machine": "Advanced",
      "Labeling System": "High",
      "Shrink Wrap": "Medium",
    },
  },
  {
    displayId: "EMP010",
    name: "Hira Zafar",
    gender:"FEMALE",
    departmentId: "5",
    skills: {
      "Labeling System": "Advanced",
      "Packaging Machine": "High",
      "Inventory System": "High",
    },
  },
  {
    displayId: "EMP011",
    name: "Tariq Mehmood",
    gender:"MALE",
    departmentId: "1",
    skills: {
      "CNC Machine": "Medium",
      "Milling Machine": "High",
      "Lathe Operation": "Advanced",
    },
  },
  {
    displayId: "EMP012",
    name: "Sana Iqbal",
    gender:"FEMALE",
    departmentId: "2",
    skills: {
      "Quality Scanner": "Medium",
      "Measurement Tools": "High",
      "Statistical Analysis": "Advanced",
    },
  },
];

export const mockEmployeeHistory: EmployeeHistory[] = [
  {
    employeeId: "EMP001",
    employeeName: "John Doe",
    currentDepartment: "Manufacturing",
    currentStartDate: "2023-01-15",
    currentSkills: {
      "CNC Machine": "High",
      "Welding Robot": "Medium",
      "Assembly Line": "Advanced",
    },
    departmentHistory: [
      {
        departmentName: "Assembly",
        startDate: "2021-03-01",
        endDate: "2023-01-14",
        duration: "1 year 10 months",
      },
      {
        departmentName: "Manufacturing",
        startDate: "2023-01-15",
        duration: "11 months",
      },
    ],
    skillHistory: [
      {
        machineName: "Assembly Line",
        currentLevel: "Advanced",
        acquiredDate: "2021-03-15",
        lastUpdated: "2023-06-01",
        levelProgression: [
          { level: "Low", date: "2021-03-15" },
          { level: "Medium", date: "2021-08-01" },
          { level: "High", date: "2022-02-15" },
          { level: "Advanced", date: "2023-06-01" },
        ],
      },
      {
        machineName: "CNC Machine",
        currentLevel: "High",
        acquiredDate: "2023-02-01",
        lastUpdated: "2023-08-15",
        levelProgression: [
          { level: "Low", date: "2023-02-01" },
          { level: "Medium", date: "2023-05-01" },
          { level: "High", date: "2023-08-15" },
        ],
      },
      {
        machineName: "Welding Robot",
        currentLevel: "Medium",
        acquiredDate: "2023-04-01",
        levelProgression: [
          { level: "Low", date: "2023-04-01" },
          { level: "Medium", date: "2023-09-01" },
        ],
      },
    ],
  },
  {
    employeeId: "EMP002",
    employeeName: "Jane Smith",
    currentDepartment: "Manufacturing",
    currentStartDate: "2022-06-01",
    currentSkills: {
      "CNC Machine": "Advanced",
      "Quality Scanner": "High",
      "Packaging Machine": "Medium",
    },
    departmentHistory: [
      {
        departmentName: "Quality Control",
        startDate: "2020-09-01",
        endDate: "2022-05-31",
        duration: "1 year 9 months",
      },
      {
        departmentName: "Manufacturing",
        startDate: "2022-06-01",
        duration: "1 year 6 months",
      },
    ],
    skillHistory: [
      {
        machineName: "Quality Scanner",
        currentLevel: "High",
        acquiredDate: "2020-09-15",
        lastUpdated: "2022-01-15",
        levelProgression: [
          { level: "Medium", date: "2020-09-15" },
          { level: "High", date: "2022-01-15" },
        ],
      },
      {
        machineName: "CNC Machine",
        currentLevel: "Advanced",
        acquiredDate: "2022-06-15",
        lastUpdated: "2023-03-01",
        levelProgression: [
          { level: "Medium", date: "2022-06-15" },
          { level: "High", date: "2022-10-01" },
          { level: "Advanced", date: "2023-03-01" },
        ],
      },
      {
        machineName: "Packaging Machine",
        currentLevel: "Medium",
        acquiredDate: "2023-01-15",
        levelProgression: [
          { level: "Low", date: "2023-01-15" },
          { level: "Medium", date: "2023-07-01" },
        ],
      },
    ],
  },
  {
    employeeId: "EMP003",
    employeeName: "Mike Johnson",
    currentDepartment: "Quality Control",
    currentStartDate: "2021-01-01",
    currentSkills: {
      "Quality Scanner": "Advanced",
      "Testing Equipment": "High",
      "Calibration Tools": "Medium",
    },
    departmentHistory: [
      {
        departmentName: "Quality Control",
        startDate: "2021-01-01",
        duration: "2 years 11 months",
      },
    ],
    skillHistory: [
      {
        machineName: "Quality Scanner",
        currentLevel: "Advanced",
        acquiredDate: "2021-01-15",
        lastUpdated: "2022-08-01",
        levelProgression: [
          { level: "Low", date: "2021-01-15" },
          { level: "Medium", date: "2021-06-01" },
          { level: "High", date: "2021-12-01" },
          { level: "Advanced", date: "2022-08-01" },
        ],
      },
      {
        machineName: "Testing Equipment",
        currentLevel: "High",
        acquiredDate: "2021-03-01",
        lastUpdated: "2022-11-15",
        levelProgression: [
          { level: "Medium", date: "2021-03-01" },
          { level: "High", date: "2022-11-15" },
        ],
      },
      {
        machineName: "Calibration Tools",
        currentLevel: "Medium",
        acquiredDate: "2022-01-01",
        levelProgression: [
          { level: "Low", date: "2022-01-01" },
          { level: "Medium", date: "2022-09-01" },
        ],
      },
    ],
  },
]
