
//   {
//     displayId: "1",
//     name: "Ahmed Raza",
//     gender:"MALE",
//     departmentId: "1",
//     skills: {
//       "CNC Machine": "High",
//       "Welding Robot": "Medium",
//       "Assembly Line": "Advanced",
//     },
//   },

import { NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';

export async function GET( id: { url: string }) {
  try {
    console.log("Hello work")
    const pool = await getDbConnection();
    const { searchParams } = new URL(id.url);
    const departmentId = searchParams.get('departmentId');
    if (!departmentId) {
      return NextResponse.json(
        { success: false, error: 'Department ID is required' },
        { status: 400 }
      );
    }

    const result = await pool.request().query(`
        SELECT
            e.id AS displayId,
            e.name,
            e.gender,
            e.current_department_id AS departmentId,
            (
            SELECT 
                s.name AS skillName,
                CASE es.skill_level
                WHEN 1 THEN 'Low'
                WHEN 2 THEN 'Medium'
                WHEN 3 THEN 'High'
                WHEN 4 THEN 'Advanced'
                ELSE 'Unknown'
                END AS skillLevel
            FROM EmployeeSkills es
            JOIN Skills s ON s.id = es.skill_id
            WHERE es.employee_id = e.id
            FOR JSON PATH
            ) AS skills
        FROM Employees e
        WHERE e.current_department_id = ${departmentId};
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

