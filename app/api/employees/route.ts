import { NextResponse } from "next/server";
import { prisma } from "../../utils/prisma"; // use alias if configured
import { NextRequest } from "next/server";

function getSkillLabel(level: number): string {
  if (level >= 4) return "High";
  if (level === 3) return "Advanced";
  if (level === 2) return "Medium";
  if (level === 1) return "Basic";
  return "Unknown";
}

export async function GET(req: NextRequest) {
  try {
    console.log("Received request from server: ", req)
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("id");

    const queryOptions = {
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
    };

    if (employeeId) {
      const emp = await prisma.employee.findUnique({
        where: { id: Number(employeeId) },
        ...queryOptions,
      });

      if (!emp) {
        return NextResponse.json(
          { error: "Employee not found" },
          { status: 404 }
        );
      }

      const formatted = {
        displayId: emp.display_id,
        name: emp.name,
        gender: emp.gender,
        departmentId: emp.current_department_id.toString(),
        skills: Object.fromEntries(
          emp.skills.map((s) => [s.skill.name, getSkillLabel(s.skill_level)])
        ),
      };

      return NextResponse.json(formatted);
    }

    const employees = await prisma.employee.findMany(queryOptions);

    console.log("EMPLOYEES FETCHED NOW !!!")
    const formattedAll = employees.map((emp) => ({
      displayId: emp.display_id,
      name: emp.name,
      gender: emp.gender,
      departmentId: emp.current_department_id.toString(),
      skills: Object.fromEntries(
        emp.skills.map((s) => [s.skill.name, getSkillLabel(s.skill_level)])
      ),
    }));

    return NextResponse.json(formattedAll);
  } catch (err) {
    console.error("❌ GET /api/employees error:", err);
    return NextResponse.json(
      { error: "Failed to fetch employee(s)" },
      { status: 500 }
    );
  }
}


// POST a new employee
export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    console.log('Received:', json);
    const parsed = EmployeeSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    //   const newEmployee: Employee = {
      //   name: data.name,
      //   displayId: data.displayId,
      //   gender: data.gender,
      //   departmentId: data.departmentId,
      // };
    // check if the json is correct


    console.log("Parsed Employee Data:", parsed.data);
    const employee = await prisma.employee.create({
      data: parsed.data,
    });

    return NextResponse.json(safeJson({ employee }), { status: 201 });
  } catch (error) {
    console.error("❌ POST /api/employees error:", error);
    
    // Handle Prisma specific errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        // Unique constraint violation
        const field = (error.meta?.target as string[])?.join(', ') || 'field';
        return NextResponse.json(
          { 
            error: "Duplicate entry", 
            message: `An employee with this ${field} already exists` 
          },
          { status: 409 } // Conflict status code
        );
      }
      
      if (error.code === 'P2003') {
        // Foreign key constraint violation
        return NextResponse.json(
          { 
            error: "Invalid reference", 
            message: "Referenced department does not exist" 
          },
          { status: 400 }
        );
      }
    }
    
    // Generic error for unexpected issues
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
