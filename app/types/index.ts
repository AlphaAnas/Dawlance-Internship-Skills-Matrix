
export interface Department {
  id: string
  name: string
}

export interface Employee {
  name: string
  displayId: string
  departmentId: string
  gender?: "MALE" | "FEMALE"
  skills: Record<string, string>
  totalSkills?: number
  averageSkillLevel?: number
}



export enum SkillCategory {
  MACHINE = "MACHINE",
  LABOUR = "LABOUR",
}
export interface Skill {
  id: string
  name: string
  departmentId: string
  category: SkillCategory // will tell if it is labor work or machine work
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
