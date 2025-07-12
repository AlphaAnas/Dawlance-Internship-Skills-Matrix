export interface Department {
  id: string
  name: string
}

export interface Employee {
  id: string
  name: string
  departmentId: string
  gender?: "male" | "female"
  skills: Record<string, string>
  totalSkills?: number
  averageSkillLevel?: number
}

export interface Machine {
  id: string
  name: string
  departmentId: string
  category: string
  isCritical?: boolean
  femaleEligible?: boolean
}

export interface Skill {
  id: string
  name: string
  category: string
}

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
