import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { SkillMatrix, Department, Employee } from '@/lib/models';

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

    // Prepare matrix data structure
    const matrixData = {
      employees,
      skills,
      skillLevels,
      employeeCount: employees.length,
      skillCount: skills.length,
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

    return NextResponse.json({
      success: true,
      message: 'Skill matrix saved successfully',
      data: {
        id: savedMatrix._id,
        name: savedMatrix.name,
        department: savedMatrix.departmentId.name,
        employeeCount: matrixData.employeeCount,
        skillCount: matrixData.skillCount,
        createdAt: savedMatrix.createdAt
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
