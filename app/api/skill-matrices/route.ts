import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Employee, Skill, EmployeeSkill, Department, SkillMatrix } from '@/lib/models';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get('departmentId');
    const generateMatrix = searchParams.get('generateMatrix'); // New parameter to distinguish between fetching matrices vs generating matrix data
    const matrixId = searchParams.get('matrixId'); // For fetching a specific matrix
    
    // If a specific matrixId is requested
    if (matrixId) {
      const matrix = await SkillMatrix.findById(matrixId)
        .populate('departmentId', 'name');
      
      if (!matrix || matrix.is_deleted) {
        return NextResponse.json({
          success: false,
          message: 'Skill matrix not found'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: {
          _id: matrix._id,
          name: matrix.name,
          description: matrix.description,
          departmentId: matrix.departmentId._id,
          department: matrix.departmentId.name,
          matrixData: matrix.matrixData,
          version: matrix.version,
          isActive: matrix.isActive,
          createdAt: matrix.createdAt,
          updatedAt: matrix.updatedAt,
          employeeCount: matrix.matrixData?.employees?.length || 0,
          skillCount: matrix.matrixData?.skills?.length || 0
        }
      });
    }
    
    // If generateMatrix is true, return employee data for matrix generation
    if (generateMatrix === 'true') {
      // Build the match filter for employees
      const matchFilter: any = { is_deleted: false };
      if (departmentId && departmentId !== 'all') {
        matchFilter.departmentId = departmentId;
      }
      
      // Get employees with their skills and skill levels
      const employeesWithSkills = await Employee.aggregate([
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
          $lookup: {
            from: 'employee_skills',
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
            skillsWithLevels: {
              $map: {
                input: '$employeeSkills',
                as: 'empSkill',
                in: {
                  $mergeObjects: [
                    {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$skills',
                            cond: { $eq: ['$$this._id', '$$empSkill.skillId'] }
                          }
                        },
                        0
                      ]
                    },
                    { level: '$$empSkill.level' }
                  ]
                }
              }
            }
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            employeeId: 1,
            title: 1,
            department: '$department.name',
            departmentId: 1,
            skills: '$skillsWithLevels',
            skillCount: { $size: '$skillsWithLevels' }
          }
        },
        {
          $sort: { name: 1 }
        }
      ]);

      // Get all skills for the matrix headers
      const allSkills = await Skill.find(
        departmentId && departmentId !== 'all' 
          ? { departmentId, is_deleted: false }
          : { is_deleted: false }
      ).populate('departmentId', 'name').sort({ name: 1 });

      // Create matrix data structure
      const matrix = employeesWithSkills.map(employee => {
        const skillLevels: { [skillId: string]: number } = {};
        
        employee.skills.forEach((skill: any) => {
          skillLevels[skill._id.toString()] = skill.level || 0;
        });
        console.log("Skill Levels for Employee:", employee.name, skillLevels);

        return {
          employee: {
            id: employee._id,
            name: employee.name,
            employeeId: employee.employeeId,
            title: employee.title,
            department: employee.department,
            skillCount: employee.skillCount
          },
          skillLevels
        };
      });

      return NextResponse.json({
        success: true,
        data: {
          matrix,
          skills: allSkills.map(skill => ({
            id: skill._id,
            name: skill.name,
            category: skill.category,
            isCritical: skill.isCritical,
            isMachineRelated: skill.isMachineRelated,
            department: skill.departmentId?.name
          })),
          employeeCount: employeesWithSkills.length,
          skillCount: allSkills.length
        }
      });
    }

    // Default behavior: Return actual SkillMatrix records from database
    const query: any = { is_deleted: false };
    if (departmentId && departmentId !== 'all') {
      query.departmentId = departmentId;
    }

    const skillMatrices = await SkillMatrix.find(query)
      .populate('departmentId', 'name')
      .sort({ createdAt: -1 });

    const formattedMatrices = skillMatrices.map(matrix => ({
      _id: matrix._id,
      name: matrix.name,
      description: matrix.description,
      departmentId: matrix.departmentId._id,
      department: matrix.departmentId.name,
      matrixData: matrix.matrixData,
      version: matrix.version,
      isActive: matrix.isActive,
      createdAt: matrix.createdAt,
      updatedAt: matrix.updatedAt,
      // Extract counts from matrixData if available
      employeeCount: matrix.matrixData?.employees?.length || 0,
      skillCount: matrix.matrixData?.skills?.length || 0
    }));

    return NextResponse.json({
      success: true,
      data: formattedMatrices
    });

  } catch (error) {
    console.error('Error fetching skills matrix:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch skills matrix',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const {
      departmentId,
      name,
      description,
      matrixData,
      version = '1.0',
      isActive = true
    } = body;

    // Validate required fields
    if (!departmentId || !name || !matrixData) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: departmentId, name, and matrixData are required'
      }, { status: 400 });
    }

    // Create new skill matrix
    const newMatrix = new SkillMatrix({
      departmentId,
      name,
      description,
      matrixData,
      version,
      isActive
    });

    const savedMatrix = await newMatrix.save();
    await savedMatrix.populate('departmentId', 'name');

    return NextResponse.json({
      success: true,
      data: {
        _id: savedMatrix._id,
        name: savedMatrix.name,
        description: savedMatrix.description,
        departmentId: savedMatrix.departmentId._id,
        department: savedMatrix.departmentId.name,
        matrixData: savedMatrix.matrixData,
        version: savedMatrix.version,
        isActive: savedMatrix.isActive,
        createdAt: savedMatrix.createdAt,
        updatedAt: savedMatrix.updatedAt
      },
      message: 'Skill matrix created successfully'
    });

  } catch (error) {
    console.error('Error creating skill matrix:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to create skill matrix',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Matrix ID is required'
      }, { status: 400 });
    }

    const updatedMatrix = await SkillMatrix.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).populate('departmentId', 'name');

    if (!updatedMatrix) {
      return NextResponse.json({
        success: false,
        message: 'Skill matrix not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        _id: updatedMatrix._id,
        name: updatedMatrix.name,
        description: updatedMatrix.description,
        departmentId: updatedMatrix.departmentId._id,
        department: updatedMatrix.departmentId.name,
        matrixData: updatedMatrix.matrixData,
        version: updatedMatrix.version,
        isActive: updatedMatrix.isActive,
        createdAt: updatedMatrix.createdAt,
        updatedAt: updatedMatrix.updatedAt
      },
      message: 'Skill matrix updated successfully'
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

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Matrix ID is required'
      }, { status: 400 });
    }

    const deletedMatrix = await SkillMatrix.findByIdAndUpdate(
      id,
      { is_deleted: true, updatedAt: new Date() },
      { new: true }
    );

    if (!deletedMatrix) {
      return NextResponse.json({
        success: false,
        message: 'Skill matrix not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Skill matrix deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting skill matrix:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to delete skill matrix',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
