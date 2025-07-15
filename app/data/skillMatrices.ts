export interface SkillsMatrix {
  id: string
  name: string
  departmentId: string
  description: string
  createdAt: string
  skills: string[]
  employees: Array<{
    name: string
    displayId: string
    skills: Record<string, string>
  }>
}

export const skillsMatrices: SkillsMatrix[] = [
  {
    id: "matrix-1",
    name: "Production Line A Skills",
    departmentId: "1",
    description: "Core skills for production line A operations",
    createdAt: "2024-01-15",
    skills: ["Machine Operation", "Quality Control", "Safety Protocols"],
    employees: [
      {
        name: "John Smith",
        displayId: "EMP001",
        skills: {
          "Machine Operation": "Highly Skilled",
          "Quality Control": "Skilled",
          "Safety Protocols": "Highly Skilled"
        }
      },
      {
        name: "Sarah Johnson",
        displayId: "EMP002",
        skills: {
          "Machine Operation": "Skilled",
          "Quality Control": "Highly Skilled",
          "Safety Protocols": "Skilled"
        }
      }
    ]
  },
  {
    id: "matrix-2",
    name: "Production Line B Skills",
    departmentId: "1",
    description: "Specialized skills for production line B",
    createdAt: "2024-01-20",
    skills: ["Advanced Machinery", "Process Optimization", "Team Leadership"],
    employees: [
      {
        name: "Mike Wilson",
        displayId: "EMP004",
        skills: {
          "Advanced Machinery": "Skilled",
          "Process Optimization": "Semi Skilled",
          "Team Leadership": "Highly Skilled"
        }
      },
      {
        name: "Lisa Brown",
        displayId: "EMP005",
        skills: {
          "Advanced Machinery": "Highly Skilled",
          "Process Optimization": "Skilled",
          "Team Leadership": "Skilled"
        }
      }
    ]
  },
  {
    id: "matrix-3",
    name: "Quality Assurance Matrix",
    departmentId: "2",
    description: "Quality control and testing competencies",
    createdAt: "2024-01-10",
    skills: ["Testing Equipment", "Documentation", "Analysis", "Compliance"],
    employees: [
      {
        name: "Mike Chen",
        displayId: "EMP003",
        skills: {
          "Testing Equipment": "Highly Skilled",
          "Documentation": "Skilled",
          "Analysis": "Semi Skilled",
          "Compliance": "Skilled"
        }
      },
      {
        name: "Anna Davis",
        displayId: "EMP006",
        skills: {
          "Testing Equipment": "Skilled",
          "Documentation": "Highly Skilled",
          "Analysis": "Skilled",
          "Compliance": "Highly Skilled"
        }
      }
    ]
  },
  {
    id: "matrix-4",
    name: "Advanced QC Procedures",
    departmentId: "2",
    description: "Advanced quality control methodologies",
    createdAt: "2024-01-25",
    skills: ["Statistical Analysis", "Root Cause Analysis", "Process Validation"],
    employees: [
      {
        name: "Robert Taylor",
        displayId: "EMP007",
        skills: {
          "Statistical Analysis": "Highly Skilled",
          "Root Cause Analysis": "Skilled",
          "Process Validation": "Semi Skilled"
        }
      }
    ]
  }
]