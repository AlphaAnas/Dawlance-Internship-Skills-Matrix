import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Employee, Department, EmployeeSkill, Skill, Machine } from '@/lib/models';
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
    // Get all machines in this department
    const machines = await Machine.find({ 
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
    
    // Calculate machine-level scores
    const machineScores = [];
    for (const machine of machines) {
      const machineScore = await calculateMachineSkillScores(machine._id, department._id);
      if (machineScore) {
        machineScores.push(machineScore);
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
      machines: machineScores
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
        const skillPoints = getSkillLevelPoints(skill.skillLevel);
        employeeScore += skillPoints;
        skillLevelCounts[skill.skillLevel as keyof typeof skillLevelCounts]++;
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

async function calculateMachineSkillScores(machineId: mongoose.Types.ObjectId, departmentId: mongoose.Types.ObjectId) {
  // Get machine details
  const machine = await Machine.findById(machineId);
  if (!machine) return null;

  // Get employees who can operate this machine
  const employeeSkills = await EmployeeSkill.find({ 
    machineId: machineId, 
    is_deleted: false 
  }).populate('employeeId');

  if (employeeSkills.length === 0) {
    return {
      id: machine._id,
      name: machine.name,
      type: machine.machineType || 'Unknown',
      operatorCount: 0,
      averageSkillLevel: 0,
      skillDistribution: { Low: 0, Medium: 0, High: 0, Advanced: 0, Expert: 0 }
    };
  }

  let totalScore = 0;
  const skillDistribution = { Low: 0, Medium: 0, High: 0, Advanced: 0, Expert: 0 };

  for (const employeeSkill of employeeSkills) {
    const skillPoints = getSkillLevelPoints(employeeSkill.skillLevel);
    totalScore += skillPoints;
    skillDistribution[employeeSkill.skillLevel as keyof typeof skillDistribution]++;
  }

  const averageScore = (totalScore / employeeSkills.length) * 25; // Convert to percentage

  return {
    id: machine._id,
    name: machine.name,
    type: machine.machineType || 'Unknown',
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
