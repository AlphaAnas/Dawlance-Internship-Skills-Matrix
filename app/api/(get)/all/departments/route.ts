/**
 * schema
 * 
Departments {
	id integer pk increments
	name varchar(100)
	created_at timestamp
	updated_at timestamp
}
 * 
 * 
 */




import { NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().query(`
      SELECT *
      FROM Departments
    `);
    // console.log("record:",result.recordset[0])
    return NextResponse.json({ success: true, data: result.recordset });
  } catch (error: any) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

