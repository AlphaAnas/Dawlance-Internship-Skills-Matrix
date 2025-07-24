import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Employee, Department, Skill, EmployeeSkill } from '@/lib/models';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Get comprehensive statistics
    const [
      totalEmployees,
      totalDepartments,
      totalSkills,
      employeesByDepartment,
      skillLevelDistribution,
      genderDistribution
    ] = await Promise.all([
      Employee.countDocuments({ is_deleted: false }),
      Department.countDocuments({ is_deleted: false }),
      Skill.countDocuments({ is_deleted: false }),
      
      // Employees by department
      Employee.aggregate([
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
          $group: {
            _id: '$department.name',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Skill level distribution (calculated from employee skills)
      EmployeeSkill.aggregate([
        {
          $lookup: {
            from: 'employees',
            localField: 'employeeId',
            foreignField: '_id',
            as: 'employee'
          }
        },
        {
          $match: {
            'employee.is_deleted': false
          }
        },
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $gte: ['$level', 4] }, then: 'Expert' },
                  { case: { $gte: ['$level', 3] }, then: 'High' },
                  { case: { $gte: ['$level', 2] }, then: 'Medium' }
                ],
                default: 'Low'
              }
            },
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Gender distribution
      Employee.aggregate([
        { $match: { is_deleted: false } },
        {
          $group: {
            _id: '$gender',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalEmployees,
          totalDepartments,
          totalSkills,
          lastUpdated: new Date().toISOString()
        },
        distributions: {
          departments: employeesByDepartment,
          skillLevels: skillLevelDistribution,
          genders: genderDistribution
        }
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
