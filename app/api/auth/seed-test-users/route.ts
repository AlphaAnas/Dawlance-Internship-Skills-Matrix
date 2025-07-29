import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Employee, Department } from '@/lib/models';
import Admin from '@/lib/models/Admin';
import Manager from '@/lib/models/Manager';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Create test departments if they don't exist
    const testDept = await Department.findOneAndUpdate(
      { name: 'Test Department' },
      { 
        name: 'Test Department',
        description: 'Test department for authentication',
        is_deleted: false
      },
      { upsert: true, new: true }
    );

    // Create test admin
    await Admin.findOneAndUpdate(
      { email: 'admin@dawlance.com' },
      {
        name: 'System Administrator',
        email: 'admin@dawlance.com',
        employeeId: 'ADM-001',
        is_deleted: false
      },
      { upsert: true, new: true }
    );

    // Create test manager
    await Manager.findOneAndUpdate(
      { email: 'manager@dawlance.com' },
      {
        name: 'John Manager',
        email: 'manager@dawlance.com',
        employeeId: 'MGR-001',
        departmentId: testDept._id,
        phone: '+1234567890',
        is_deleted: false
      },
      { upsert: true, new: true }
    );

    // Create test employee (user)
    await Employee.findOneAndUpdate(
      { email: 'user@dawlance.com' },
      {
        name: 'Jane Employee',
        email: 'user@dawlance.com',
        employeeId: 'EMP-TEST-001',
        departmentId: testDept._id,
        gender: 'Female',
        title: 'Test Employee',
        yearsExperience: 3,
        is_deleted: false
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Test users created successfully',
      testUsers: [
        { email: 'admin@dawlance.com', role: 'admin', name: 'System Administrator' },
        { email: 'manager@dawlance.com', role: 'manager', name: 'John Manager' },
        { email: 'user@dawlance.com', role: 'user', name: 'Jane Employee' }
      ]
    });

  } catch (error) {
    console.error('Error creating test users:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create test users',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
