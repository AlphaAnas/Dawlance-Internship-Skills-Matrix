import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Employee, Skill, EmployeeSkill, Department, SkillMatrix } from '@/lib/models';
import mongoose from 'mongoose';

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
            femaleEligible: skill.femaleEligible,
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

    // Validate the request
    if (req.method!== 'POST'){
      return NextResponse.json(
        {
          success:false,
          message:'Method not allowed'
        },
        {status:405}  
      )
    }


    await dbConnect();
    
    const body = await req.json();
    const {
      departmentId,
      name,
      description,
      matrixData,
      version,
      isActive = true,
      employeeId,
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
      employeeId,
      description,
      matrixData,
      version:'1.0',
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



// ADD A NEW ENTRY AND SOFT DELETE THE PREVIOUS ENTRY 
// Fixed: Ensure all required fields (especially matrixData) are included when creating new matrix
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { id, ...updateData } = body;

    // Validate input
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        message: 'Valid Matrix ID is required'
      }, { status: 400 });
    }
    if (!updateData.name) {
      return NextResponse.json({
        success: false,
        message: 'Name is required'
      }, { status: 400 });
    }
    if (!updateData.employeeId) {
      return NextResponse.json({
        success: false,
        message: 'EmployeeId is required'
      }, { status: 400 });
    }
    if (updateData.departmentId && !mongoose.Types.ObjectId.isValid(updateData.departmentId)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid departmentId'
      }, { status: 400 });
    }

    const userId = updateData.employeeId;
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'User authentication required. Please log in.'
      }, { status: 401 });
    }

    // First, get the existing matrix to preserve its data
    const existingMatrix = await SkillMatrix.findById(id);
    if (!existingMatrix || existingMatrix.is_deleted) {
      return NextResponse.json({
        success: false,
        message: 'Skill matrix not found'
      }, { status: 404 });
    }

    // Check for duplicate name (excluding current matrix)
    const duplicateMatrix = await SkillMatrix.findOne({
      name: updateData.name,
      is_deleted: false,
      _id: { $ne: id }
    });
    if (duplicateMatrix) {
      return NextResponse.json({
        success: false,
        message: 'A matrix with this name already exists'
      }, { status: 400 });
    }

    // Ensure matrixData is included - use existing if not provided
    if (!updateData.matrixData) {
      updateData.matrixData = existingMatrix.matrixData;
    }

    // Ensure departmentId is included - use existing if not provided
    if (!updateData.departmentId) {
      updateData.departmentId = existingMatrix.departmentId;
    }

    console.log('Creating new matrix with data:', {
      hasMatrixData: !!updateData.matrixData,
      hasDepartmentId: !!updateData.departmentId,
      hasEmployeeId: !!updateData.employeeId,
      name: updateData.name
    });

    // Update previous matrix (soft delete)
    const prevMatrix = await SkillMatrix.findByIdAndUpdate(
      id,
      { is_deleted: true, employeeId: updateData.employeeId, isActive: false },
      { new: true }
    );

    // Create new matrix with all required fields
    const newMatrixData = {
      departmentId: updateData.departmentId,
      name: updateData.name,
      employeeId: updateData.employeeId,
      description: updateData.description || existingMatrix.description || '',
      matrixData: updateData.matrixData,
      version: updateData.version || existingMatrix.version || '1.0',
      isActive: true,
      updatedBy: userId
    };

    // Validate that all required fields are present
    if (!newMatrixData.departmentId || !newMatrixData.name || !newMatrixData.matrixData || !newMatrixData.employeeId) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields for matrix creation',
        missingFields: {
          departmentId: !newMatrixData.departmentId,
          name: !newMatrixData.name,
          matrixData: !newMatrixData.matrixData,
          employeeId: !newMatrixData.employeeId
        }
      }, { status: 400 });
    }

    const updatedMatrix = await SkillMatrix.create(newMatrixData);

    // Populate department
    await updatedMatrix.populate('departmentId', 'name');

    return NextResponse.json({
      success: true,
      data: {
        _id: updatedMatrix._id,
        name: updatedMatrix.name,
        description: updatedMatrix.description,
        departmentId: updatedMatrix.departmentId?._id,
        department: updatedMatrix.departmentId?.name,
        matrixData: updatedMatrix.matrixData,
        version: updatedMatrix.version,
        isActive: updatedMatrix.isActive,
        createdAt: updatedMatrix.createdAt,
        updatedAt: updatedMatrix.updatedAt
      },
      message: 'Skill matrix updated successfully'
    });

  } catch (error: unknown) {
    console.error('Error updating skill matrix:', error);
    
    // Handle validation errors more specifically
    if (error && typeof error === 'object' && 'name' in error) {
      if ((error as any).name === 'ValidationError') {
        const validationErrors = (error as any).errors;
        const missingFields = Object.keys(validationErrors).map(field => 
          `${field}: ${validationErrors[field].message}`
        );
        
        return NextResponse.json({
          success: false,
          message: 'Validation failed',
          details: missingFields,
          error: error instanceof Error ? error.message : String(error)
        }, { status: 400 });
      }
      
      if ((error as any).name === 'CastError') {
        return NextResponse.json({
          success: false,
          message: `Invalid ${(error as any).path} format: ${(error as any).value}`
        }, { status: 400 });
      }
    }
    
    return NextResponse.json({
      success: false,
      message: 'Failed to update skill matrix',
      error: error instanceof Error ? error.message : String(error)
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
      { is_deleted: true, updatedAt: new Date(),
        isActive: false,
        // employeeId: updateData.employeeId,
       },
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
