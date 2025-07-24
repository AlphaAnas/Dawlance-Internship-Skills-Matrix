import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { SkillMatrix } from '@/lib/models';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { id } = params;

    // Get skill matrix with department information
    const matrix = await SkillMatrix.findById(id)
      .populate('departmentId', 'name')
      .exec();

    if (!matrix || matrix.is_deleted) {
      return NextResponse.json({
        success: false,
        message: 'Skill matrix not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: matrix._id,
        name: matrix.name,
        description: matrix.description,
        department: matrix.departmentId.name,
        departmentId: matrix.departmentId._id,
        matrixData: matrix.matrixData,
        version: matrix.version,
        isActive: matrix.isActive,
        createdAt: matrix.createdAt,
        updatedAt: matrix.updatedAt
      }
    });

  } catch (error) {
    console.error('Error fetching skill matrix:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch skill matrix',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { id } = params;

    // Soft delete the matrix
    const result = await SkillMatrix.findByIdAndUpdate(
      id,
      { is_deleted: true, isActive: false },
      { new: true }
    );

    if (!result) {
      return NextResponse.json({
        success: false,
        message: 'Skill matrix not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Skill matrix deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting skill matrix:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to delete skill matrix',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
