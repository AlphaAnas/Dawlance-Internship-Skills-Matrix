import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      isMachine,
      department_id,
      is_critical = false,
      female_trained = false
    } = await req.json();

    const pool = await getDbConnection();

    const result = await pool.request()
      .input('name', name)
      .input('isMachine', isMachine)
      .input('department_id', department_id)
      .input('is_critical', is_critical)
      .input('female_trained', female_trained)
      .query(`
        INSERT INTO Skills (name, isMachine, department_id, is_critical, female_trained, created_at, updated_at)
        VALUES (@name, @isMachine, @department_id, @is_critical, @female_trained, GETDATE(), GETDATE());

        SELECT SCOPE_IDENTITY() AS insertedId;
      `);

    return NextResponse.json({
      success: true,
      message: 'Skill inserted successfully',
      insertedId: result.recordset[0].insertedId
    });

  } catch (error: any) {
    console.error('Error inserting skill:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
