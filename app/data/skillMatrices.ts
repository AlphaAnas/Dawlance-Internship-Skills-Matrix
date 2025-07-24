// Enhanced Skills Matrices Data with Multiple Departments
export interface Employee {
  name: string;
  displayId: string;
  skills: Record<string, string>;
  avatar?: string;
  joinDate?: string;
}

export interface SkillsMatrix {
  id: string;
  name: string;
  description: string;
  departmentId: string;
  department: string;
  skills: string[];
  employees: Employee[];
  createdAt: string;
  createdBy: string;
  lastModified: string;
  color: string;
}

export const departments = [
  { id: "1", name: "Sheet Metal Fabrication", color: "from-orange-500 to-red-500" },
  { id: "2", name: "Welding & Assembly", color: "from-blue-500 to-indigo-500" },
  { id: "3", name: "Quality Control", color: "from-purple-500 to-pink-500" },
  { id: "4", name: "Machine Operations", color: "from-green-500 to-emerald-500" },
  { id: "5", name: "Maintenance", color: "from-yellow-500 to-orange-500" },
  { id: "6", name: "Production Planning", color: "from-teal-500 to-cyan-500" },
  { id: "7", name: "Safety & Compliance", color: "from-rose-500 to-pink-500" }
];

export const skillsMatrices: SkillsMatrix[] = [
  {
    id: "fab-001",
    name: "Sheet Metal Cutting & Forming",
    description: "Core competencies for sheet metal cutting, bending, and forming operations using various machinery and hand tools.",
    departmentId: "1",
    department: "Sheet Metal Fabrication",
    skills: ["Plasma Cutting", "Laser Cutting", "Press Brake Operation", "Shearing", "Roll Forming"],
    employees: [
      {
        name: "Mike Rodriguez",
        displayId: "FAB001",
        skills: {
          "Plasma Cutting": "Highly Skilled",
          "Laser Cutting": "Skilled",
          "Press Brake Operation": "Highly Skilled",
          "Shearing": "Skilled",
          "Roll Forming": "Semi Skilled"
        },
        joinDate: "2019-03-15"
      },
      {
        name: "Carlos Martinez",
        displayId: "FAB002",
        skills: {
          "Plasma Cutting": "Skilled",
          "Laser Cutting": "Highly Skilled",
          "Press Brake Operation": "Skilled",
          "Shearing": "Highly Skilled",
          "Roll Forming": "Skilled"
        },
        joinDate: "2020-11-08"
      },
      {
        name: "Tony Williams",
        displayId: "FAB003",
        skills: {
          "Plasma Cutting": "Semi Skilled",
          "Laser Cutting": "Skilled",
          "Press Brake Operation": "Low Skilled",
          "Shearing": "Semi Skilled",
          "Roll Forming": "Highly Skilled"
        },
        joinDate: "2023-01-20"
      },
      {
        name: "James Thompson",
        displayId: "FAB004",
        skills: {
          "Plasma Cutting": "Highly Skilled",
          "Laser Cutting": "Skilled",
          "Press Brake Operation": "Skilled",
          "Shearing": "Skilled",
          "Roll Forming": "Skilled"
        },
        joinDate: "2018-07-12"
      }
    ],
    createdAt: "2024-01-10",
    createdBy: "Production Manager",
    lastModified: "2024-01-15",
    color: "from-orange-500 to-red-500"
  },
  {
    id: "fab-002",
    name: "Advanced Fabrication Techniques",
    description: "Specialized skills for complex sheet metal fabrication including precision work and custom tooling.",
    departmentId: "1",
    department: "Sheet Metal Fabrication",
    skills: ["CNC Programming", "Tool & Die Making", "Precision Measuring", "Blueprint Reading", "Custom Jig Setup"],
    employees: [
      {
        name: "Mike Rodriguez",
        displayId: "FAB001",
        skills: {
          "CNC Programming": "Skilled",
          "Tool & Die Making": "Highly Skilled",
          "Precision Measuring": "Skilled",
          "Blueprint Reading": "Highly Skilled",
          "Custom Jig Setup": "Skilled"
        },
        joinDate: "2019-03-15"
      },
      {
        name: "James Thompson",
        displayId: "FAB004",
        skills: {
          "CNC Programming": "Highly Skilled",
          "Tool & Die Making": "Skilled",
          "Precision Measuring": "Highly Skilled",
          "Blueprint Reading": "Skilled",
          "Custom Jig Setup": "Skilled"
        },
        joinDate: "2018-07-12"
      }
    ],
    createdAt: "2024-01-12",
    createdBy: "Senior Fabricator",
    lastModified: "2024-01-18",
    color: "from-orange-500 to-red-500"
  },
  {
    id: "weld-001",
    name: "Welding Operations",
    description: "Essential welding skills for joining sheet metal components using various welding processes.",
    departmentId: "2",
    department: "Welding & Assembly",
    skills: ["MIG Welding", "TIG Welding", "Spot Welding", "Arc Welding", "Weld Inspection"],
    employees: [
      {
        name: "Roberto Silva",
        displayId: "WLD001",
        skills: {
          "MIG Welding": "Highly Skilled",
          "TIG Welding": "Skilled",
          "Spot Welding": "Skilled",
          "Arc Welding": "Highly Skilled",
          "Weld Inspection": "Skilled"
        },
        joinDate: "2017-04-22"
      },
      {
        name: "David Chen",
        displayId: "WLD002",
        skills: {
          "MIG Welding": "Skilled",
          "TIG Welding": "Highly Skilled",
          "Spot Welding": "Highly Skilled",
          "Arc Welding": "Skilled",
          "Weld Inspection": "Semi Skilled"
        },
        joinDate: "2020-08-14"
      },
      {
        name: "Steve Johnson",
        displayId: "WLD003",
        skills: {
          "MIG Welding": "Semi Skilled",
          "TIG Welding": "Skilled",
          "Spot Welding": "Skilled",
          "Arc Welding": "Skilled",
          "Weld Inspection": "Low Skilled"
        },
        joinDate: "2022-12-05"
      }
    ],
    createdAt: "2024-01-08",
    createdBy: "Welding Supervisor",
    lastModified: "2024-01-14",
    color: "from-blue-500 to-indigo-500"
  },
  {
    id: "weld-002",
    name: "Assembly & Finishing",
    description: "Skills for assembling welded components and applying finishing processes to completed parts.",
    departmentId: "2",
    department: "Welding & Assembly",
    skills: ["Component Assembly", "Riveting", "Hardware Installation", "Surface Finishing", "Final Inspection"],
    employees: [
      {
        name: "Roberto Silva",
        displayId: "WLD001",
        skills: {
          "Component Assembly": "Highly Skilled",
          "Riveting": "Skilled",
          "Hardware Installation": "Skilled",
          "Surface Finishing": "Highly Skilled",
          "Final Inspection": "Semi Skilled"
        },
        joinDate: "2017-04-22"
      },
      {
        name: "Maria Gonzalez",
        displayId: "ASM001",
        skills: {
          "Component Assembly": "Skilled",
          "Riveting": "Highly Skilled",
          "Hardware Installation": "Highly Skilled",
          "Surface Finishing": "Skilled",
          "Final Inspection": "Skilled"
        },
        joinDate: "2019-09-18"
      }
    ],
    createdAt: "2024-01-09",
    createdBy: "Assembly Lead",
    lastModified: "2024-01-16",
    color: "from-blue-500 to-indigo-500"
  },
  {
    id: "qc-001",
    name: "Quality Inspection",
    description: "Quality control processes for ensuring sheet metal products meet specifications and standards.",
    departmentId: "3",
    department: "Quality Control",
    skills: ["Dimensional Inspection", "Visual Inspection", "Material Testing", "Documentation", "Non-Destructive Testing"],
    employees: [
      {
        name: "Jennifer Park",
        displayId: "QC001",
        skills: {
          "Dimensional Inspection": "Highly Skilled",
          "Visual Inspection": "Skilled",
          "Material Testing": "Highly Skilled",
          "Documentation": "Skilled",
          "Non-Destructive Testing": "Semi Skilled"
        },
        joinDate: "2020-02-10"
      },
      {
        name: "Robert Kim",
        displayId: "QC002",
        skills: {
          "Dimensional Inspection": "Skilled",
          "Visual Inspection": "Highly Skilled",
          "Material Testing": "Skilled",
          "Documentation": "Skilled",
          "Non-Destructive Testing": "Highly Skilled"
        },
        joinDate: "2018-11-25"
      }
    ],
    createdAt: "2024-01-05",
    createdBy: "QC Manager",
    lastModified: "2024-01-12",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "mach-001",
    name: "CNC Machine Operations",
    description: "Operating and programming CNC machines for precision sheet metal cutting and forming.",
    departmentId: "4",
    department: "Machine Operations",
    skills: ["CNC Setup", "G-Code Programming", "Tool Changes", "Machine Maintenance", "Quality Monitoring"],
    employees: [
      {
        name: "Frank Anderson",
        displayId: "MCH001",
        skills: {
          "CNC Setup": "Skilled",
          "G-Code Programming": "Highly Skilled",
          "Tool Changes": "Skilled",
          "Machine Maintenance": "Skilled",
          "Quality Monitoring": "Highly Skilled"
        },
        joinDate: "2016-05-30"
      },
      {
        name: "Lisa Wong",
        displayId: "MCH002",
        skills: {
          "CNC Programming": "Highly Skilled",
          "Machine Setup": "Skilled",
          "Tool Changes": "Highly Skilled",
          "Quality Monitoring": "Skilled",
          "Troubleshooting": "Skilled"
        },
        joinDate: "2019-02-11"
      }
    ],
    createdAt: "2024-01-04",
    createdBy: "Machine Shop Supervisor",
    lastModified: "2024-01-11",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "maint-001",
    name: "Equipment Maintenance",
    description: "Preventive and corrective maintenance of factory equipment and machinery.",
    departmentId: "5",
    department: "Maintenance",
    skills: ["Hydraulic Systems", "Electrical Troubleshooting", "Mechanical Repair", "Preventive Maintenance", "Safety Lockout"],
    employees: [
      {
        name: "Frank Miller",
        displayId: "MNT001",
        skills: {
          "Hydraulic Systems": "Skilled",
          "Electrical Troubleshooting": "Highly Skilled",
          "Mechanical Repair": "Skilled",
          "Preventive Maintenance": "Skilled",
          "Safety Lockout": "Highly Skilled"
        },
        joinDate: "2015-10-07"
      },
      {
        name: "Tom Wilson",
        displayId: "MNT002",
        skills: {
          "Hydraulic Systems": "Highly Skilled",
          "Electrical Troubleshooting": "Skilled",
          "Mechanical Repair": "Skilled",
          "Preventive Maintenance": "Highly Skilled",
          "Safety Lockout": "Skilled"
        },
        joinDate: "2018-03-19"
      }
    ],
    createdAt: "2024-01-02",
    createdBy: "Maintenance Supervisor",
    lastModified: "2024-01-09",
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: "prod-001",
    name: "Production Planning",
    description: "Production scheduling, inventory management, and workflow optimization.",
    departmentId: "6",
    department: "Production Planning",
    skills: ["Production Scheduling", "Inventory Management", "Workflow Planning", "ERP Systems", "Cost Analysis"],
    employees: [
      {
        name: "Sarah Mitchell",
        displayId: "PRD001",
        skills: {
          "Production Scheduling": "Skilled",
          "Inventory Management": "Highly Skilled",
          "Workflow Planning": "Skilled",
          "ERP Systems": "Skilled",
          "Cost Analysis": "Highly Skilled"
        },
        joinDate: "2017-08-14"
      },
      {
        name: "Alex Turner",
        displayId: "PRD002",
        skills: {
          "Production Scheduling": "Highly Skilled",
          "Inventory Management": "Skilled",
          "Workflow Planning": "Highly Skilled",
          "ERP Systems": "Skilled",
          "Cost Analysis": "Skilled"
        },
        joinDate: "2020-05-28"
      }
    ],
    createdAt: "2024-01-01",
    createdBy: "Production Manager",
    lastModified: "2024-01-08",
    color: "from-teal-500 to-cyan-500"
  },
  {
    id: "safe-001",
    name: "Safety & Compliance",
    description: "Workplace safety protocols and regulatory compliance for manufacturing operations.",
    departmentId: "7",
    department: "Safety & Compliance",
    skills: ["OSHA Compliance", "Hazard Assessment", "Safety Training", "Incident Investigation", "PPE Management"],
    employees: [
      {
        name: "Maria Santos",
        displayId: "SAF001",
        skills: {
          "OSHA Compliance": "Skilled",
          "Hazard Assessment": "Highly Skilled",
          "Safety Training": "Skilled",
          "Incident Investigation": "Skilled",
          "PPE Management": "Highly Skilled"
        },
        joinDate: "2016-12-05"
      },
      {
        name: "John Parker",
        displayId: "SAF002",
        skills: {
          "OSHA Compliance": "Highly Skilled",
          "Hazard Assessment": "Skilled",
          "Safety Training": "Highly Skilled",
          "Incident Investigation": "Skilled",
          "PPE Management": "Skilled"
        },
        joinDate: "2019-09-17"
      }
    ],
    createdAt: "2024-01-03",
    createdBy: "Safety Manager",
    lastModified: "2024-01-10",
    color: "from-rose-500 to-pink-500"
  }
];

export const getMatricesByDepartment = (departmentId: string): SkillsMatrix[] => {
  return skillsMatrices.filter(matrix => matrix.departmentId === departmentId);
};

export const getAllMatrices = (): SkillsMatrix[] => {
  return skillsMatrices;
};

export const getMatrixById = (id: string): SkillsMatrix | undefined => {
  return skillsMatrices.find(matrix => matrix.id === id);
};