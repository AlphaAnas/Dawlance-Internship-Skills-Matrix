import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seedDatabase';

export async function GET(req: NextRequest) {
  try {
    const result = await seedDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      data: result
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error seeding database:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to seed database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Same as GET - allows both methods
  return GET(req);
}
