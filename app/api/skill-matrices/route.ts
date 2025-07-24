import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { SkillMatrix, Department, Employee, Skill, EmployeeSkill } from '@/lib/models';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get('departmentId');
    
    // Build the match filter
    const matchFilter: any = { is_deleted: false, isActive: true };
    if (departmentId && departmentId !== 'all') {
      matchFilter.departmentId = departmentId;
    }
    
    // Get skill matrices with department information
    const matrices = await SkillMatrix.aggregate([
      { $match: matchFilter },
      {
        $lookup: {
          from: 'departments',
          localField: 'departmentId',
          foreignField: '_id',
          as: 'department'
        }
      },
      {
        $addFields: {
          department: { $arrayElemAt: ['$department', 0] }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          matrixData: 1,
          version: 1,
          isActive: 1,
          createdAt: 1,
          updatedAt: 1,
          department: '$department.name',
          departmentId: 1
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: matrices,
      count: matrices.length
    });

  } catch (error) {
    console.error('Error fetching skill matrices:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch skill matrices',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { name, departmentId, description, employees, skills, skillLevels } = body;

    // Validate required fields
    if (!name || !departmentId || !employees || !skills || !skillLevels) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: name, departmentId, employees, skills, skillLevels'
      }, { status: 400 });
    }

    // Verify department exists
    const department = await Department.findById(departmentId);
    if (!department) {
      return NextResponse.json({
        success: false,
        message: 'Department not found'
      }, { status: 404 });
    }

    // Process skills - create new ones if they don't exist
    const processedSkills = [];
    const skillMap = new Map(); // To store skill name -> skill object mapping

    for (const skillName of skills) {
      try {
        // Check if skill already exists
        let existingSkill = await Skill.findOne({ 
          name: skillName.trim(), 
          is_deleted: false 
        });

        if (!existingSkill) {
          // Create new skill
          console.log(`Creating new skill: ${skillName}`);
          const newSkill = new Skill({
            name: skillName.trim(),
            description: `Skill for ${skillName}`,
            category: 'TECHNICAL', // Default category for new skills
            isMachineRelated: true, // Default for manufacturing context
            isCritical: false,
            departmentId: departmentId
          });

          existingSkill = await newSkill.save();
          console.log(`Successfully created skill: ${skillName} with ID: ${existingSkill._id}`);
        }

        processedSkills.push(existingSkill);
        skillMap.set(skillName, existingSkill);
      } catch (skillError) {
        console.error(`Error processing skill ${skillName}:`, skillError);
        // Continue with other skills even if one fails
      }
    }

    // Process employees and their skill levels
    const processedEmployees = [];
    
    for (const employeeData of employees) {
      try {
        // Find or create employee
        let employee = await Employee.findOne({ 
          name: employeeData.name.trim(), 
          is_deleted: false 
        });

        if (!employee) {
          // Create new employee if doesn't exist
          console.log(`Creating new employee: ${employeeData.name}`);
          const newEmployee = new Employee({
            name: employeeData.name.trim(),
            employeeId: employeeData.id || `EMP-${Date.now()}`, // Generate ID if not provided
            departmentId: departmentId,
            gender: employeeData.gender || 'Male', // Default
            title: employeeData.title || 'Operator', // Default
            email: employeeData.email || '',
            yearsExperience: employeeData.experience ? parseInt(employeeData.experience) : 0
          });

          employee = await newEmployee.save();
          console.log(`Successfully created employee: ${employeeData.name} with ID: ${employee._id}`);
        }

        processedEmployees.push(employee);

        // Update employee skills based on skillLevels
        for (const skillName of skills) {
          const skill = skillMap.get(skillName);
          if (!skill) continue;

          const levelKey = `${employeeData.name}-${skillName}`;
          const skillLevel = skillLevels[levelKey];

          if (skillLevel && skillLevel !== 'Beginner') { // Only create records for non-beginner levels
            try {
              // Check if employee skill record already exists
              const existingEmployeeSkill = await EmployeeSkill.findOne({
                employeeId: employee._id,
                skillId: skill._id,
                is_deleted: false
              });

              if (existingEmployeeSkill) {
                // Update existing record
                existingEmployeeSkill.level = skillLevel;
                existingEmployeeSkill.lastAssessedDate = new Date();
                await existingEmployeeSkill.save();
                console.log(`Updated skill level for ${employeeData.name} - ${skillName}: ${skillLevel}`);
              } else {
                // Create new employee skill record
                const newEmployeeSkill = new EmployeeSkill({
                  employeeId: employee._id,
                  skillId: skill._id,
                  level: skillLevel,
                  acquiredDate: new Date(),
                  lastAssessedDate: new Date()
                });

                await newEmployeeSkill.save();
                console.log(`Created new skill record for ${employeeData.name} - ${skillName}: ${skillLevel}`);
              }
            } catch (employeeSkillError) {
              console.error(`Error updating employee skill for ${employeeData.name} - ${skillName}:`, employeeSkillError);
              // Continue with other skills
            }
          }
        }
      } catch (employeeError) {
        console.error(`Error processing employee ${employeeData.name}:`, employeeError);
        // Continue with other employees
      }
    }

    // Prepare matrix data structure
    const matrixData = {
      employees: processedEmployees.map(emp => ({
        _id: emp._id,
        name: emp.name,
        employeeId: emp.employeeId,
        departmentId: emp.departmentId,
        title: emp.title,
        gender: emp.gender
      })),
      skills: processedSkills.map(skill => skill.name),
      skillLevels,
      employeeCount: processedEmployees.length,
      skillCount: processedSkills.length,
      createdAt: new Date().toISOString()
    };

    // Create new skill matrix
    const newMatrix = new SkillMatrix({
      name,
      departmentId,
      description: description || '',
      matrixData,
      version: '1.0',
      isActive: true
    });

    const savedMatrix = await newMatrix.save();

    // Populate department information for response
    await savedMatrix.populate('departmentId', 'name');

    console.log(`Successfully saved skills matrix: ${name}`);
    console.log(`Created ${processedSkills.length} skills and processed ${processedEmployees.length} employees`);

    return NextResponse.json({
      success: true,
      message: 'Skill matrix saved successfully',
      data: {
        id: savedMatrix._id,
        name: savedMatrix.name,
        department: savedMatrix.departmentId.name,
        employeeCount: matrixData.employeeCount,
        skillCount: matrixData.skillCount,
        createdAt: savedMatrix.createdAt,
        skillsCreated: processedSkills.length,
        employeesProcessed: processedEmployees.length
      }
    });

  } catch (error) {
    console.error('Error saving skill matrix:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to save skill matrix',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { id, name, description, employees, skills, skillLevels } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Matrix ID is required for update'
      }, { status: 400 });
    }

    // Find the matrix
    const matrix = await SkillMatrix.findById(id);
    if (!matrix) {
      return NextResponse.json({
        success: false,
        message: 'Skill matrix not found'
      }, { status: 404 });
    }

    // Update matrix data
    const updatedMatrixData = {
      employees,
      skills,
      skillLevels,
      employeeCount: employees.length,
      skillCount: skills.length,
      updatedAt: new Date().toISOString()
    };

    matrix.name = name || matrix.name;
    matrix.description = description || matrix.description;
    matrix.matrixData = updatedMatrixData;

    const savedMatrix = await matrix.save();

    return NextResponse.json({
      success: true,
      message: 'Skill matrix updated successfully',
      data: savedMatrix
    });

  } catch (error) {
    console.error('Error updating skill matrix:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to update skill matrix',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
