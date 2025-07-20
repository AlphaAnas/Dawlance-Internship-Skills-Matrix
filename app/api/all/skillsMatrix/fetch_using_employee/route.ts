import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const pool = await getDbConnection();

    const searchParams = req.nextUrl.searchParams;
    const employeeId = searchParams.get('employee_id');
    const skillName = searchParams.get('skill_name');

    if (!employeeId || !skillName) {
      return NextResponse.json(
        { success: false, error: 'Missing required query parameters.' },
        { status: 400 }
      );
    }

    const request = pool.request();
    request.input('employee_id', Number(employeeId));
    request.input('skill_name', skillName);

    const query = `
      DECLARE @display_id NVARCHAR(100);

      SELECT TOP 1 @display_id = display_id
      FROM Employees
      WHERE id = @employee_id;

      SELECT DISTINCT sm.id AS matrix_id
      FROM SkillMatrices sm
      WHERE sm.department_id IN (
          SELECT DISTINCT department_id
          FROM EmployeeWorkHistory
          WHERE employee_id = @employee_id
      )
      AND sm.is_active = 1
      AND EXISTS (
          SELECT 1
          FROM OPENJSON(sm.matrix_data, '$.employees')
          WITH (
              name NVARCHAR(100),
              displayId NVARCHAR(100),
              joinDate NVARCHAR(100),
              skills NVARCHAR(MAX) AS JSON
          ) employee_json
          CROSS APPLY OPENJSON(employee_json.skills) skill_pair
          WHERE employee_json.displayId = @display_id
            AND skill_pair.[key] = @skill_name
      );
    `;

    const result = await request.query(query);
    return NextResponse.json({ success: true, data: result.recordset });
  } catch (error: any) {
    console.error('Error fetching skill matrix:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
