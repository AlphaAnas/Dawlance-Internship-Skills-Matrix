import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../utils/prisma"; // use alias if configured
import { z } from "zod";
import { Prisma } from "@prisma/client";

// Schema for POST body validation
const EmployeeSchema = z.object({
  name: z.string().min(1),
  display_id: z.string().min(1),
  gender: z.enum(["MALE", "FEMALE"]),
  current_department_id: z.number().int().positive(),
});

// Utility: safely serialize BigInt
function safeJson(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? v.toString() : v))
  );
}

// GET all employees
export async function GET() {
  try {
    const employees = await prisma.employee.findMany();
    return NextResponse.json(safeJson({ employees }));
  } catch (err) {
    console.error("❌ GET /api/employees error:", err);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

// POST a new employee
export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = EmployeeSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

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
