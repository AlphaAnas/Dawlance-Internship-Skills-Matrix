
export interface Department {
	id :number
  name : string
  created_at: string
  updated_at: string
}

export type SkillLevel = 
  | "None"
  | "Low Skilled"
  | "Semi Skilled"
  | "Skilled"
  | "Highly Skilled";


export interface SkillProfile {
  skills: Record<string, SkillLevel>; // e.g. "CNC Machine": "Highly Skilled"
}


export interface Employee {
  id: number;
  name: string;
  display_id: string;
  gender: "MALE" | "FEMALE";
  current_department_id: number;
  skill_profile: SkillProfile; // parsed from JSON
  created_at: string;
  updated_at: string;

  // frontend-calculated:
  totalSkills?: number;
  averageSkillLevel?: number;
}



export interface Skill {
  id: number;
  name: string;
  isMachine: boolean; // true if it's a machine-related skill
  created_at: string;
  updated_at: string;

  // joined from Machine table or business logic:
  departmentId?: number;
  isCritical?: boolean;
  femaleEligible?: boolean;
}




export enum SkillCategory {
  MACHINE = "MACHINE",
  LABOUR = "LABOUR",
}



export interface EmployeeHistory {
  employeeId: number;
  employeeName: string;
  currentDepartment: string;
  currentStartDate: string;
  currentSkills: Record<string, SkillLevel>;

  departmentHistory: {
    departmentName: string;
    startDate: string;
    endDate?: string;
    duration: string;
  }[];

  skillHistory: {
    machineName: string;
    currentLevel: SkillLevel;
    acquiredDate: string;
    lastUpdated?: string;
    levelProgression?: {
      level: SkillLevel;
      date: string;
    }[];
  }[];
}
