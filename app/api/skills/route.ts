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

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { name, category, isMachineRelated, isCritical, departmentId, description } = body;

    // Validate required fields
    if (!name || !category) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: name and category are required'
      }, { status: 400 });
    }

    // Check if skill already exists
    const existingSkill = await Skill.findOne({ name: name.trim(), is_deleted: false });
    if (existingSkill) {
      return NextResponse.json({
        success: false,
        message: 'Skill with this name already exists'
      }, { status: 409 });
    }

    // Verify department exists if departmentId is provided
    if (departmentId) {
      const department = await Department.findById(departmentId);
      if (!department) {
        return NextResponse.json({
          success: false,
          message: 'Department not found'
        }, { status: 404 });
      }
    }

    // Create new skill
    const newSkill = new Skill({
      name: name.trim(),
      description: description || '',
      category: category.toUpperCase(),
      isMachineRelated: isMachineRelated || false,
      isCritical: isCritical || false,
      departmentId: departmentId || null
    });

    const savedSkill = await newSkill.save();

    // Populate department information for response
    await savedSkill.populate('departmentId', 'name');

    return NextResponse.json({
      success: true,
      message: 'Skill created successfully',
      data: {
        _id: savedSkill._id,
        name: savedSkill.name,
        description: savedSkill.description,
        category: savedSkill.category,
        isMachineRelated: savedSkill.isMachineRelated,
        isCritical: savedSkill.isCritical,
        department: savedSkill.departmentId?.name || null,
        departmentId: savedSkill.departmentId,
        createdAt: savedSkill.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating skill:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to create skill',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
