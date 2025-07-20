import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const pool = await getDbConnection();

    // Extract query param: ?ids=1,2,3
    const searchParams = req.nextUrl.searchParams;
    const idsParam = searchParams.get('ids'); // e.g., "1,2,3"

    if (!idsParam) {
      return NextResponse.json({ success: false, error: 'No IDs provided' }, { status: 400 });
    }

    const ids = idsParam.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

    if (ids.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid ID list' }, { status: 400 });
    }

    // Build placeholders: @id0, @id1, ...
    const placeholders = ids.map((_, idx) => `@id${idx}`).join(', ');

    const query = `
      SELECT 
        e.name AS employee_name,
        s.name AS skill_name,
        d.name AS department_name,
        m.name AS machine_name,
        ew.skill_level,
        ew.from_date,
        COALESCE(ew.end_date, GETDATE()) AS end_date,
        DATEDIFF(DAY, ew.from_date, COALESCE(ew.end_date, GETDATE())) AS days_worked
      FROM 
        EmployeeWorkHistory ew
      JOIN Employees e ON e.id = ew.employee_id
      JOIN Skills s ON s.id = ew.skill_id
      JOIN Departments d ON d.id = ew.department_id
      LEFT JOIN Machines m ON m.id = ew.machine_id
      WHERE ew.employee_id IN (${placeholders})
      ORDER BY e.name, ew.from_date;
    `;

    const request = pool.request();
    ids.forEach((id, idx) => {
      request.input(`id${idx}`, id);
    });

    const result = await request.query(query);

    return NextResponse.json({ success: true, data: result.recordset });
  } catch (error: any) {
    console.error('Error fetching work history:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
