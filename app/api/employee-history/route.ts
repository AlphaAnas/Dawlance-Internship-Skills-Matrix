import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { EmployeeWorkHistory, Employee, Department, Machine, Skill } from '@/lib/models';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId');
    const departmentName = searchParams.get('department');
    const limit = parseInt(searchParams.get('limit') || '100');
    const days = parseInt(searchParams.get('days') || '90'); // Default to last 90 days

    let matchConditions: any = {
      is_deleted: false,
      workDate: {
        $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      }
    };

    // If specific employee ID is provided
    if (employeeId) {
      matchConditions.employeeId = new mongoose.Types.ObjectId(employeeId);
    }

    // If department name is provided, find department first
    if (departmentName) {
      const department = await Department.findOne({ 
        name: { $regex: new RegExp(departmentName, 'i') },
        is_deleted: false 
      });
      
      if (department) {
        matchConditions.departmentId = department._id;
      }
    }

    const employeeHistory = await EmployeeWorkHistory.aggregate([
      { $match: matchConditions },
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee',
          pipeline: [
            { $match: { is_deleted: false } }
          ]
        }
      },
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
          from: 'machines',
          localField: 'machineId',
          foreignField: '_id',
          as: 'machine'
        }
      },
      {
        $lookup: {
          from: 'skills',
          localField: 'skillId',
          foreignField: '_id',
          as: 'skill'
        }
      },
      {
        $addFields: {
          employee: { $arrayElemAt: ['$employee', 0] },
          department: { $arrayElemAt: ['$department', 0] },
          machine: { $arrayElemAt: ['$machine', 0] },
          skill: { $arrayElemAt: ['$skill', 0] }
        }
      },
      {
        $project: {
          _id: 1,
          employeeId: 1,
          employeeName: '$employee.name',
          employeeTitle: '$employee.title',
          employeeSkillLevel: '$employee.skillLevel',
          employeeYearsExperience: '$employee.yearsExperience',
          departmentName: '$department.name',
          machineName: '$machine.name',
          machineType: '$machine.type',
          skillName: '$skill.name',
          skillCategory: '$skill.category',
          workDate: 1,
          hoursWorked: 1,
          productivity: 1,
          qualityScore: 1,
          notes: 1,
          shift: 1,
          createdAt: 1
        }
      },
      { $sort: { workDate: -1, createdAt: -1 } },
      { $limit: limit }
    ]);

    // Calculate performance metrics for employees
    const performanceMetrics = await EmployeeWorkHistory.aggregate([
      { $match: matchConditions },
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee'
        }
      },
      {
        $lookup: {
          from: 'departments',
          localField: 'departmentId',
          foreignField: '_id',
          as: 'department'
        }
      },
      {
        $group: {
          _id: '$employeeId',
          employeeName: { $first: { $arrayElemAt: ['$employee.name', 0] } },
          employeeTitle: { $first: { $arrayElemAt: ['$employee.title', 0] } },
          employeeSkillLevel: { $first: { $arrayElemAt: ['$employee.skillLevel', 0] } },
          employeeYearsExperience: { $first: { $arrayElemAt: ['$employee.yearsExperience', 0] } },
          departmentName: { $first: { $arrayElemAt: ['$department.name', 0] } },
          totalHours: { $sum: '$hoursWorked' },
          avgProductivity: { $avg: '$productivity' },
          avgQualityScore: { $avg: '$qualityScore' },
          workDays: { $sum: 1 },
          maxProductivity: { $max: '$productivity' },
          minProductivity: { $min: '$productivity' },
          maxQualityScore: { $max: '$qualityScore' },
          minQualityScore: { $min: '$qualityScore' },
          recentWorkDates: { $push: '$workDate' },
          skills: { $addToSet: '$skillId' },
          machines: { $addToSet: '$machineId' }
        }
      },
      {
        $addFields: {
          consistency: {
            $cond: {
              if: { $gt: ['$workDays', 5] },
              then: {
                $subtract: [
                  1,
                  {
                    $divide: [
                      { $subtract: ['$maxProductivity', '$minProductivity'] },
                      { $add: ['$maxProductivity', 1] }
                    ]
                  }
                ]
              },
              else: 0.5
            }
          },
          skillVersatility: { $size: '$skills' },
          machineVersatility: { $size: '$machines' }
        }
      },
      {
        $addFields: {
          overallScore: {
            $add: [
              { $multiply: ['$avgProductivity', 0.4] },
              { $multiply: ['$avgQualityScore', 0.3] },
              { $multiply: ['$consistency', 100, 0.2] },
              { $multiply: ['$skillVersatility', 10, 0.1] }
            ]
          }
        }
      },
      { $sort: { overallScore: -1 } }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        history: employeeHistory,
        performanceMetrics: performanceMetrics,
        summary: {
          totalRecords: employeeHistory.length,
          dateRange: {
            from: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
            to: new Date()
          },
          uniqueEmployees: [...new Set(employeeHistory.map(h => h.employeeId))].length
        }
      }
    });

  } catch (error) {
    console.error('Error fetching employee history:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch employee history',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
