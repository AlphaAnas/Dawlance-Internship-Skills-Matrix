import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Employee } from '@/lib/models';
import Admin from '@/lib/models/Admin';
import Manager from '@/lib/models/Manager';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, password, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json({
        success: false,
        message: 'Email and role are required'
      }, { status: 400 });
    }

    let user = null;
    let userName = '';
    let userEmployeeId = '';

    // Based on role, check different collections
    switch (role) {
      case 'admin':
        user = await Admin.findOne({ 
          email: email.toLowerCase()
        });
        if (user) {
          userName = user.name;
          userEmployeeId = user._id.toString(); // Use _id as employeeId for admin
        }
        break;

      case 'manager':
        user = await Manager.findOne({ 
          email: email.toLowerCase(), 
          is_deleted: false 
        }).populate('departmentId', 'name');
        if (user) {
          userName = user.name;
          userEmployeeId = user.employeeId;
        }
        break;

      case 'user':
        // For users, we'll look in the Employee collection
        user = await Employee.findOne({ 
          email: email.toLowerCase(), 
          is_deleted: false 
        }).populate('departmentId', 'name');
        if (user) {
          userName = user.name;
          userEmployeeId = user.employeeId;
        }
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
        message: 'Invalid credentials or user not found'
      }, { status: 401 });
    }

    // For now, we'll skip password validation since the models don't have password fields
    // In a real application, you would validate the password here
    
    // Return user session data
    const sessionData = {
      id: user._id,
      name: userName,
      email: user.email,
      employeeId: userEmployeeId,
      role: role,
      department: user.departmentId?.name || '',
      loginTime: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: sessionData
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
