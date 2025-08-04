import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Employee, Department, EmployeeSkill, Skill } from '@/lib/models';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get('departmentId');

    // Get department and machine skill scores
    const skillsData = await getSkillsMatrixData(departmentId);

    return NextResponse.json({
      success: true,
      data: skillsData,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching skills matrix data:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch skills matrix data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function getSkillsMatrixData(departmentId?: string | null) {
  // If departmentId is provided, filter by that department, otherwise get all
  const departmentFilter = departmentId ? { _id: new mongoose.Types.ObjectId(departmentId) } : {};
  const departments = await Department.find({ 
    ...departmentFilter,
    is_deleted: false 
  });

  const matrixData = [];

  for (const department of departments) {
    // Get all skills in this department
    const skills = await Skill.find({ 
      departmentId: department._id, 
      is_deleted: false 
    });

    // Get all employees in this department
    const employees = await Employee.find({ 
      departmentId: department._id, 
      is_deleted: false 
    });

    if (employees.length === 0) continue;

    // Calculate department-level scores
    const departmentScores = await calculateDepartmentSkillScores(department._id);
    
    // Calculate skill-level scores
    const skillScores = [];
    for (const skill of skills) {
      const skillScore = await calculateSkillScores(skill._id, department._id);
      if (skillScore) {
        skillScores.push(skillScore);
      }
    }

    matrixData.push({
      department: {
        id: department._id,
        name: department.name,
        employeeCount: employees.length,
        averageScore: departmentScores.averageScore,
        skillBreakdown: departmentScores.skillBreakdown
      },
      skills: skillScores
    });
  }

  return matrixData;
}

async function calculateDepartmentSkillScores(departmentId: mongoose.Types.ObjectId) {
  const employees = await Employee.find({ 
    departmentId: departmentId, 
    is_deleted: false 
  });

  if (employees.length === 0) {
    return { averageScore: 0, skillBreakdown: {} };
  }

  let totalScore = 0;
  const skillLevelCounts = { Low: 0, Medium: 0, High: 0, Advanced: 0, Expert: 0 };

  for (const employee of employees) {
    // Get all employee skills
    const employeeSkills = await EmployeeSkill.find({ 
      employeeId: employee._id, 
      is_deleted: false 
    });

    if (employeeSkills.length > 0) {
      // Calculate average skill score for this employee
      let employeeScore = 0;
      for (const skill of employeeSkills) {
        const skillPoints = getSkillLevelPoints(skill.level);
        employeeScore += skillPoints;
        skillLevelCounts[skill.level as keyof typeof skillLevelCounts]++;
      }
      employeeScore = employeeScore / employeeSkills.length;
      totalScore += employeeScore;
    }
  }

  const averageScore = employees.length > 0 ? (totalScore / employees.length) * 25 : 0; // Convert to percentage

  return {
    averageScore: Math.round(averageScore),
    skillBreakdown: skillLevelCounts
  };
}

async function calculateSkillScores(skillId: mongoose.Types.ObjectId, departmentId: mongoose.Types.ObjectId) {
  // Get skill details
  const skill = await Skill.findById(skillId);
  if (!skill) return null;

  // Get employees who have this skill
  const employeeSkills = await EmployeeSkill.find({ 
    skillId: skillId, 
    is_deleted: false 
  }).populate('employeeId');

  if (employeeSkills.length === 0) {
    return {
      id: skill._id,
      name: skill.name,
      category: skill.category,
      isCritical: skill.isCritical,
      femaleEligible: skill.femaleEligible,
      operatorCount: 0,
      averageSkillLevel: 0,
      skillDistribution: { Low: 0, Medium: 0, High: 0, Advanced: 0, Expert: 0 }
    };
  }

  let totalScore = 0;
  const skillDistribution = { Low: 0, Medium: 0, High: 0, Advanced: 0, Expert: 0 };

  for (const employeeSkill of employeeSkills) {
    const skillPoints = getSkillLevelPoints(employeeSkill.level);
    totalScore += skillPoints;
    skillDistribution[employeeSkill.level as keyof typeof skillDistribution]++;
  }

  const averageScore = (totalScore / employeeSkills.length) * 25; // Convert to percentage

  return {
    id: skill._id,
    name: skill.name,
    category: skill.category,
    isCritical: skill.isCritical,
    femaleEligible: skill.femaleEligible,
    operatorCount: employeeSkills.length,
    averageSkillLevel: Math.round(averageScore),
    skillDistribution: skillDistribution
  };
}

function getSkillLevelPoints(skillLevel: string): number {
  const skillMap: Record<string, number> = {
    'Low': 1,
    'Medium': 2, 
    'High': 3,
    'Advanced': 4,
    'Expert': 4 // Treat Expert same as Advanced
  };
  return skillMap[skillLevel] || 1;
}
