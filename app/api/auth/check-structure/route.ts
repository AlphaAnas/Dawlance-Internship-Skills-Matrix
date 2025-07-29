import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Employee } from '@/lib/models';
import Admin from '@/lib/models/Admin';
import Manager from '@/lib/models/Manager';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Get sample users from each collection to verify structure
    const sampleEmployee = await Employee.findOne({ is_deleted: false }).populate('departmentId', 'name');
    const sampleAdmin = await Admin.findOne();
    const sampleManager = await Manager.findOne({ is_deleted: false }).populate('departmentId', 'name');

    return NextResponse.json({
      success: true,
      samples: {
        employee: sampleEmployee,
        admin: sampleAdmin,
        manager: sampleManager
      }
    });

  } catch (error) {
    console.error('Error checking database structure:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to check database structure',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
