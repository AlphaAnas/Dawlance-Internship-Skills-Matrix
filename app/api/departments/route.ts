import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Department from '../../../lib/models/Department';
import Employee from '../../../lib/models/Employee';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Fetch departments with employee counts
    const departments = await Department.aggregate([
      { $match: { is_deleted: false } },
      {
        $lookup: {
          from: 'employees',
          localField: '_id',
          foreignField: 'department_id',
          as: 'employees',
          pipeline: [
            { $match: { is_deleted: false } }
          ]
        }
      },
      {
        $lookup: {
          from: 'managers',
          localField: '_id',
          foreignField: 'department_id',
          as: 'managers',
          pipeline: [
            { $match: { is_deleted: false } }
          ]
        }
      },
      {
        $addFields: {
          employeeCount: { $size: '$employees' },
          managerCount: { $size: '$managers' },
          avgSkillLevel: {
            $avg: {
              $map: {
                input: '$employees',
                as: 'emp',
                in: {
                  $switch: {
                    branches: [
                      { case: { $eq: ['$$emp.skill_level', 'Expert'] }, then: 4 },
                      { case: { $eq: ['$$emp.skill_level', 'High'] }, then: 3 },
                      { case: { $eq: ['$$emp.skill_level', 'Medium'] }, then: 2 },
                      { case: { $eq: ['$$emp.skill_level', 'Low'] }, then: 1 }
                    ],
                    default: 1
                  }
                }
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          employeeCount: 1,
          managerCount: 1,
          avgSkillLevel: { $round: ['$avgSkillLevel', 2] },
          manager: { $arrayElemAt: ['$managers.name', 0] },
          createdAt: 1,
          updatedAt: 1
        }
      },
      { $sort: { name: 1 } }
    ]);

    return NextResponse.json({
      success: true,
      data: departments,
      count: departments.length
    });

  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch departments',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Validate required fields
    const { name, description } = body;
    
    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Department name is required' },
        { status: 400 }
      );
    }

    // Check if department with name already exists
    const existingDepartment = await Department.findOne({ name, is_deleted: false });
    if (existingDepartment) {
      return NextResponse.json(
        { success: false, message: 'Department with this name already exists' },
        { status: 409 }
      );
    }

    // Create new department
    const newDepartment = new Department({
      name,
      description: description || `${name} department`,
      is_active: body.is_active !== undefined ? body.is_active : true
    });

    const savedDepartment = await newDepartment.save();

    return NextResponse.json({
      success: true,
      data: savedDepartment,
      message: 'Department created successfully'
    });

  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create department',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
