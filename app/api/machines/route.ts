import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Machine, Department } from '@/lib/models';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Get all machines with their department information
    const machines = await Machine.aggregate([
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
        $addFields: {
          department: { $arrayElemAt: ['$department', 0] }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          machineId: 1,
          type: 1,
          manufacturer: 1,
          model: 1,
          status: 1,
          specifications: 1,
          department: '$department.name',
          departmentId: 1,
          createdAt: 1,
          updatedAt: 1
        }
      },
      {
        $sort: { name: 1 }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: machines,
      count: machines.length
    });

  } catch (error) {
    console.error('Error fetching machines:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch machines',
        data: [],
        count: 0
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { name, machineId, type, manufacturer, model, departmentId, specifications, status = 'ACTIVE' } = body;

    // Validate required fields
    if (!name || !machineId || !departmentId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: name, machineId, and departmentId are required' 
        },
        { status: 400 }
      );
    }

    // Check if machine with same machineId already exists
    const existingMachine = await Machine.findOne({ 
      machineId, 
      is_deleted: false 
    });

    if (existingMachine) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Machine with this ID already exists' 
        },
        { status: 400 }
      );
    }

    // Verify department exists
    const department = await Department.findById(departmentId);
    if (!department) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Department not found' 
        },
        { status: 404 }
      );
    }

    const machine = new Machine({
      name,
      machineId,
      type,
      manufacturer,
      model,
      departmentId,
      specifications,
      status,
      is_deleted: false
    });

    await machine.save();

    return NextResponse.json({
      success: true,
      data: machine,
      message: 'Machine created successfully'
    });

  } catch (error) {
    console.error('Error creating machine:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create machine' 
      },
      { status: 500 }
    );
  }
}
