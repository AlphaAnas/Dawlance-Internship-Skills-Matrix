import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Employee, Department } from '@/lib/models';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Test basic database operations
    const employeeCount = await Employee.countDocuments({ is_deleted: false });
    const departmentCount = await Department.countDocuments({ is_deleted: false });
    
    return NextResponse.json({
      success: true,
      status: 'connected',
      message: 'Database connection is healthy',
      data: {
        employeeCount,
        departmentCount,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Database health check failed:', error);
    
    return NextResponse.json({
      success: false,
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
