



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





import { NextResponse, NextRequest } from 'next/server';
import { getDbConnection } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const pool = await getDbConnection();
    const searchParams = req.nextUrl.searchParams;

    const id = searchParams.get('id');
    const department = searchParams.get('department');

    let query = `
      SELECT e.*, d.name AS department_name
      FROM Employees e
      LEFT JOIN Departments d ON e.current_department_id = d.id
    `;

    if (id) {
      query += ` WHERE e.id = ${id}`;
    } else if (department) {
      query += ` WHERE d.name = '${department}'`;
    }

    const result = await pool.request().query(query);

    return NextResponse.json({ success: true, data: result.recordset });
  } catch (error: any) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

