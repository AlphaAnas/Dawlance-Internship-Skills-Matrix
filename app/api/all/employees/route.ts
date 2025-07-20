



/*
SCHEMA: 
Employees {
	id integer pk increments
	updated_at timestamp
	dispaly_id string
	created_at timestamp
	name varchar(100)
	gender varchar(50)
	current_department_id string > Departments.id
	skill_profile jsonb
}

*/





import { NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().query(`
      SELECT *
      FROM Employees
    `);
    // console.log("record:",result.recordset[0])
    return NextResponse.json({ success: true, data: result.recordset });
  } catch (error: any) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

