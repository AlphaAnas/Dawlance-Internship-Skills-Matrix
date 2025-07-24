
//  _id: '6880bb40afba9b31a8256005',
//       name: 'Maria Santos',
//       employeeId: 'EMP-001',
//       gender: 'Female',
//       title: 'Senior Metal Worker',
//       yearsExperience: 8,
//       skillCount: 0,
//       skillLevel: 'Low',
//       department: 'Sheet Metal',
//       skills: [],
//       skill_profile: {},
//       totalSkills: 0,
//       departmentName: 'Unknown Department'
//     };



import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Employee, Department, EmployeeSkill, Skill } from '@/lib/models';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('id');

    // If specific employee ID is requested, fetch that employee
    if (employeeId) {
      const employee = await Employee.aggregate([
        { 
          $match: { 
            _id: new mongoose.Types.ObjectId(employeeId),
            is_deleted: false 
          } 
        },
        {
          $lookup: {
            from: 'departments',
            localField: 'departmentId',
            foreignField: '_id',
            as: 'department'
          }
        },
        {
          $lookup: {
            from: 'employeeskills',
            localField: '_id',
            foreignField: 'employeeId',
            as: 'employeeSkills',
            pipeline: [
              { $match: { is_deleted: false } }
            ]
          }
        },
        {
          $lookup: {
            from: 'skills',
            localField: 'employeeSkills.skillId',
            foreignField: '_id',
            as: 'skills'
          }
        },
        {
          $addFields: {
            department: { $arrayElemAt: ['$department', 0] },
            skillCount: { $size: '$employeeSkills' }
          }
        },
        {
          $project: {
            _id: 1,
            employeeId: 1,
            name: 1,
            gender: 1,
            title: 1,
            yearsExperience: 1,
            departmentId: 1,
            department: '$department.name',
            skillLevel: 1,
            skillCount: 1,
            employeeSkills: 1,
            skills: 1
          }
        }
      ]);

      if (employee.length === 0) {
        return NextResponse.json({
          success: false,
          message: 'Employee not found'
        }, { status: 404 });
      }

      // Map skills to { [skillName]: level } format
      const skillsMap = (employee: any) => {
        if (!employee.employeeSkills || !employee.skills) return {};
        
        const map: Record<string, string> = {};
        
        employee.employeeSkills.forEach((es: any) => {
          const skill = employee.skills.find((sk: any) => sk._id.toString() === es.skillId.toString());
          if (skill && skill.name && es.level) {
            map[skill.name] = es.level;
          }
        });
        return map;
      };

      const employeeWithSkills = {
        ...employee[0],
        skills: skillsMap(employee[0]),
        totalSkills: Object.keys(skillsMap(employee[0])).length
      };

      return NextResponse.json({
        success: true,
        data: [employeeWithSkills]
      });
    }
    
    // Get employees with their department information
    const employees = await Employee.aggregate([
      { $match: { is_deleted: false } },
      {
        $lookup: {
          from: 'departments',
          localField: 'departmentId',
          foreignField: '_id',
          as: 'department'
        }
      },
      {
        $lookup: {
          from: 'employeeskills',
          localField: '_id',
          foreignField: 'employeeId',
          as: 'employeeSkills'
        }
      },
      {
        $lookup: {
          from: 'skills',
          localField: 'employeeSkills.skillId',
          foreignField: '_id',
          as: 'skills'
        }
      },
      {
        $addFields: {
          department: { $arrayElemAt: ['$department', 0] },
          skillCount: { $size: '$employeeSkills' }
          // Remove hardcoded skillLevel - will calculate it below
        }
      },
      {
        $project: {
          _id: 1,
          employeeId: 1,
          name: 1,
          gender: 1,
          title: 1,
          yearsExperience: 1,
          departmentId: 1,  // Add departmentId to the projection
          department: '$department.name',
          skillLevel: 1,
          skillCount: 1,
          employeeSkills: 1,
          skills: 1
        }
      }
    ]);

    // Map skills to { [skillName]: level } for each employee and calculate overall skill level
    const skillsMap = (employee: any) => {
      if (!employee.employeeSkills || !employee.skills) return {};
      const map: Record<string, string> = {};
      
      employee.employeeSkills.forEach((es: any) => {
        const skill = employee.skills.find((sk: any) => sk._id.toString() === es.skillId.toString());
        if (skill && skill.name && es.level) {
          // Level is already stored as text in the database
          map[skill.name] = es.level;
        }
      });
      return map;
    };

    // Calculate overall skill level for each employee
    const calculateSkillLevel = (skills: Record<string, string>) => {
      if (Object.keys(skills).length === 0) return 'Low';
      
      const skillValues = Object.values(skills);
      const skillScores = skillValues.map(level => {
        switch (level.toLowerCase()) {
          case 'expert': return 4;
          case 'advanced': return 3;
          case 'high': return 3; // Treat High as Advanced
          case 'medium': return 2;
          case 'low': return 1;
          default: return 1;
        }
      });
      
      const avgScore = skillScores.reduce((sum, score) => sum + score, 0) / skillScores.length;
      
      // Map average score back to skill level, treating Expert/Advanced as "Advanced"
      if (avgScore >= 3.5) return 'Advanced'; // Expert level
      if (avgScore >= 2.5) return 'Advanced'; // Advanced/High level  
      if (avgScore >= 1.5) return 'Medium';
      return 'Low';
    };

    const employeesWithSkills = employees.map((emp) => {
      const skillsObj = skillsMap(emp);
      const overallSkillLevel = calculateSkillLevel(skillsObj);
      
      return {
        ...emp,
        skills: skillsObj,
        skillLevel: overallSkillLevel
      };
    });

    return NextResponse.json({
      success: true,
      data: employeesWithSkills,
      count: employeesWithSkills.length
    });

  } catch (error) {
    console.error('Error fetching employees:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch employees',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    let { name, displayId, gender, current_department_id, departmentId, skills } = body;

    // Normalize gender
    if (gender === 'MALE' || gender === 'Male') gender = 'Male';
    if (gender === 'FEMALE' || gender === 'Female') gender = 'Female';

    // Use departmentId if provided, otherwise fallback to current_department_id
    let deptId = departmentId || current_department_id;
    if (!name || !displayId || !gender || !deptId) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields',
      }, { status: 400 });
    }

    // Convert deptId to ObjectId if needed
    try {
      if (typeof deptId === 'string' && !mongoose.Types.ObjectId.isValid(deptId)) {
        // Try to parse as number, fallback to error
        throw new Error('Invalid departmentId');
      }
      if (typeof deptId === 'number') {
        deptId = deptId.toString();
      }
      deptId = new mongoose.Types.ObjectId(deptId);
    } catch (err) {
      return NextResponse.json({
        success: false,
        message: 'Invalid departmentId',
      }, { status: 400 });
    }

    // Create new employee with required fields
    const newEmployee = await Employee.create({
      name,
      employeeId: displayId, // Use displayId as employeeId
      displayId, // Keep displayId for compatibility
      gender,
      departmentId: deptId,
      title: 'Worker', // Default title
      is_deleted: false,
    });

    // Handle skills creation/association
    let skillsObj: Record<string, string> = {};
    if (Array.isArray(skills) && skills.length > 0) {
      for (const skill of skills) {
        if (!skill.name || !skill.level) continue;
        // Find or create the skill
        let skillDoc = await Skill.findOne({ name: skill.name, is_deleted: false });
        if (!skillDoc) {
          skillDoc = await Skill.create({ name: skill.name, category: 'TECHNICAL' }); // Default category
        }
        // Create EmployeeSkill
        await EmployeeSkill.create({
          employeeId: newEmployee._id,
          skillId: skillDoc._id,
          level: skill.level,
        });
        skillsObj[skill.name] = skill.level;
      }
    }

    // Return the created employee (add skills object for UI compatibility)
    return NextResponse.json({
      ...newEmployee.toObject(),
      skills: skillsObj,
      totalSkills: Object.keys(skillsObj).length,
      departmentName: '', // UI can fill this in after fetch
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create employee',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
