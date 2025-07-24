import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Employee, Skill, EmployeeSkill, Department } from '@/lib/models';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get('departmentId');
    
    // Build the match filter
    const matchFilter: any = { is_deleted: false };
    if (departmentId && departmentId !== 'all') {
      matchFilter.departmentId = departmentId;
    }
    
    // Get employees with their skills and skill levels
    const employeesWithSkills = await Employee.aggregate([
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
        $lookup: {
          from: 'employee_skills',
          localField: '_id',
          foreignField: 'employeeId',
          as: 'employeeSkills'
        }
      },
      {
        $lookup: {
          from: 'skills',
          localField: 'employeeSkills.skillId',
          foreignField: '_id',
          as: 'skills'
        }
      },
      {
        $addFields: {
          department: { $arrayElemAt: ['$department', 0] },
          skillsWithLevels: {
            $map: {
              input: '$employeeSkills',
              as: 'empSkill',
              in: {
                $mergeObjects: [
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$skills',
                          cond: { $eq: ['$$this._id', '$$empSkill.skillId'] }
                        }
                      },
                      0
                    ]
                  },
                  { level: '$$empSkill.level' }
                ]
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          employeeId: 1,
          title: 1,
          department: '$department.name',
          departmentId: 1,
          skills: '$skillsWithLevels',
          skillCount: { $size: '$skillsWithLevels' }
        }
      },
      {
        $sort: { name: 1 }
      }
    ]);

    // Get all skills for the matrix headers
    const allSkills = await Skill.find(
      departmentId && departmentId !== 'all' 
        ? { departmentId, is_deleted: false }
        : { is_deleted: false }
    ).populate('departmentId', 'name').sort({ name: 1 });

    // Create matrix data structure
    const matrix = employeesWithSkills.map(employee => {
      const skillLevels: { [skillId: string]: number } = {};
      
      employee.skills.forEach((skill: any) => {
        skillLevels[skill._id.toString()] = skill.level || 0;
      });

      return {
        employee: {
          id: employee._id,
          name: employee.name,
          employeeId: employee.employeeId,
          title: employee.title,
          department: employee.department,
          skillCount: employee.skillCount
        },
        skillLevels
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        matrix,
        skills: allSkills.map(skill => ({
          id: skill._id,
          name: skill.name,
          category: skill.category,
          isCritical: skill.isCritical,
          isMachineRelated: skill.isMachineRelated,
          department: skill.departmentId?.name
        })),
        employeeCount: employeesWithSkills.length,
        skillCount: allSkills.length
      }
    });

  } catch (error) {
    console.error('Error fetching skills matrix:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch skills matrix',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
