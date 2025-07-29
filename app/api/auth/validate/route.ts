import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Employee } from '@/lib/models';
import Admin from '@/lib/models/Admin';
import Manager from '@/lib/models/Manager';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { userId, role } = await req.json();

    if (!userId || !role) {
      return NextResponse.json({
        success: false,
        message: 'User ID and role are required'
      }, { status: 400 });
    }

    let user = null;

    // Validate user exists based on role
    switch (role) {
      case 'admin':
        user = await Admin.findOne({ 
          _id: new mongoose.Types.ObjectId(userId)
        });
        break;

      case 'manager':
        user = await Manager.findOne({ 
          _id: new mongoose.Types.ObjectId(userId), 
          is_deleted: false 
        }).populate('departmentId', 'name');
        break;

      case 'user':
        user = await Employee.findOne({ 
          _id: new mongoose.Types.ObjectId(userId), 
          is_deleted: false 
        }).populate('departmentId', 'name');
        break;

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid role specified'
        }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found or has been deactivated'
      }, { status: 404 });
    }

    // Return validated user data
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      employeeId: user.employeeId || user._id.toString(), // Fallback to _id for admin
      role: role,
      department: user.departmentId?.name || '',
      isValid: true
    };

    return NextResponse.json({
      success: true,
      message: 'User session is valid',
      user: userData
    });

  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to validate session',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
