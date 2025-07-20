// app/api/(post)/skillsMatrix/route.ts



// ```
/**
 * 
WHEN A NEW SKILLS MATRIX IS CREATED SAVE  IT INTO:
SKILLS MATRIX Table
UPDATE THE SKILLS Table
UPDATE THE EMPLOYEES TABLE (IF NEW EMPLOYEE IS CREATED OR THEIR SKILLS ARE UPDATED)
UPDATE THE DEPTS TABLE (IF NEW DEPT IS CREATED)
UPDATE THE MACHINES TABLE (IF NEW MACHINE IS CREATED)
UPDATE THE BRIDGE TABLES FOR ABOVE
 */
// ```



import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const data = { message: 'This is a new POST request', received: body };
  return NextResponse.json(data);
}
