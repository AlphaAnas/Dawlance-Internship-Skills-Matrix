
export interface Department {
  _id?: string
  id?: string
  name: string
  description?: string
  employeeCount?: number
  managerCount?: number
  avgSkillLevel?: number
  manager?: string
}

export interface Employee {
  _id?: string
  employeeId?: string
  name: string
  displayId?: string
  departmentId?: string  // Changed from number to string (ObjectId)
  gender: "MALE" | "FEMALE" | "Male" | "Female"
  skills?: Record<string, string>
  totalSkills?: number
  averageSkillLevel?: number
  department?: string  // Department name
  title?: string
  yearsExperience?: number
  skillLevel?: string
  skillCount?: number
}



export enum SkillCategory {
  MACHINE = "MACHINE",
  LABOUR = "LABOUR",
}
export interface Skill {

  name: string
  departmentId: string
  category: string // will tell if it is labor work or machine work
  isCritical?: boolean
  femaleEligible?: boolean
}

// export interface Skill {
//   id: string
//   name: string
//   category: string // will tell if it is labor work or machine work
// }

export interface EmployeeHistory {
  employeeId: string
  employeeName: string
  currentDepartment: string
  currentStartDate: string
  currentSkills: Record<string, string>
  departmentHistory: {
    departmentName: string
    startDate: string
    endDate?: string
    duration: string
  }[]
  skillHistory: {
    machineName: string
    currentLevel: string
    acquiredDate: string
    lastUpdated?: string
    levelProgression?: {
      level: string
      date: string
    }[]
  }[]
}
