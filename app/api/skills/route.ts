import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Skill, Department } from '@/lib/models';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Get all skills with their department information
    const skills = await Skill.aggregate([
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
          category: 1,
          isMachineRelated: 1,
          isCritical: 1,
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
      data: skills,
      count: skills.length
    });

  } catch (error) {
    console.error('Error fetching skills:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch skills',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
