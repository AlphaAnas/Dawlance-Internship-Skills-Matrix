




import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // 🔥 FIXED: parse JSON body
    const dept_name = body.dept_name;

    console.log("dept_name:", dept_name);

    const pool = await getDbConnection();

    const result = await pool.request().query(`
      INSERT INTO Departments (name, created_at, updated_at)
      VALUES ('${dept_name}', GETDATE(), GETDATE());
    `);

    return NextResponse.json({ success: true, data: result.recordset });
  } catch (error: any) {
    console.error('Error Inserting departments:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
