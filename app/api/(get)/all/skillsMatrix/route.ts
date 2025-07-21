//  {
//     id: "fab-001",
//     name: "Sheet Metal Cutting & Forming",
//     description: "Core competencies for sheet metal cutting, bending, and forming operations using various machinery and hand tools.",
//     departmentId: "1",
//     department: "Sheet Metal Fabrication",
//     skills: ["Plasma Cutting", "Laser Cutting", "Press Brake Operation", "Shearing", "Roll Forming"],
//     employees: [
//       {
//         name: "Mike Rodriguez",
//         displayId: "FAB001",
//         skills: {
//           "Plasma Cutting": "Highly Skilled",
//           "Laser Cutting": "Skilled",
//           "Press Brake Operation": "Highly Skilled",
//           "Shearing": "Skilled",
//           "Roll Forming": "Semi Skilled"
//         },
//         joinDate: "2019-03-15"
//       },
//       {
//         name: "Carlos Martinez",
//         displayId: "FAB002",
//         skills: {
//           "Plasma Cutting": "Skilled",
//           "Laser Cutting": "Highly Skilled",
//           "Press Brake Operation": "Skilled",
//           "Shearing": "Highly Skilled",
//           "Roll Forming": "Skilled"
//         },
//         joinDate: "2020-11-08"
//       },
//       {
//         name: "Tony Williams",
//         displayId: "FAB003",
//         skills: {
//           "Plasma Cutting": "Semi Skilled",
//           "Laser Cutting": "Skilled",
//           "Press Brake Operation": "Low Skilled",
//           "Shearing": "Semi Skilled",
//           "Roll Forming": "Highly Skilled"
//         },
//         joinDate: "2023-01-20"
//       },
//       {
//         name: "James Thompson",
//         displayId: "FAB004",
//         skills: {
//           "Plasma Cutting": "Highly Skilled",
//           "Laser Cutting": "Skilled",
//           "Press Brake Operation": "Skilled",
//           "Shearing": "Skilled",
//           "Roll Forming": "Skilled"
//         },
//         joinDate: "2018-07-12"
//       }
//     ],
//     createdAt: "2024-01-10",
//     createdBy: "Production Manager",
//     lastModified: "2024-01-15",
//     color: "from-orange-500 to-red-500"
//   },


import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const pool = await getDbConnection();

    const searchParams = req.nextUrl.searchParams;
    const idParam = searchParams.get('id'); // Single ID

    const request = pool.request();

    let query = '';
    if (idParam) {
      const id = parseInt(idParam);
      if (isNaN(id)) {
        return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
      }

      query = `SELECT * FROM SkillMatrices WHERE id = @id`;
      request.input('id', id);
    } else {
      query = `SELECT * FROM SkillMatrices`;
    }

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
