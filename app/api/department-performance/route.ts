import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Employee, Department, EmployeeSkill, Skill, Machine, DepartmentPerformance } from '@/lib/models';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const calculate = searchParams.get('calculate') === 'true';
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

    if (calculate) {
      // Calculate and store department performance scores
      await calculateDepartmentPerformance(year);
    }

    // Fetch stored department performance data
    const performanceData = await DepartmentPerformance.find({
      year: year,
      is_deleted: false
    }).sort({ month: 1 });

    console.log(performanceData)

    // Group by month for the response format (only up to current month)
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11, so add 1
    
    // If requesting current year, only show months up to current month
    // If requesting past year, show all 12 months
    const maxMonth = (year === currentYear) ? currentMonth : 12;
    
    const monthlyData = [];
    for (let month = 1; month <= maxMonth; month++) {
      const monthData: any = {
        month: getMonthName(month)
        // Removed target line as requested
      };

      const monthPerformance = performanceData.filter(p => p.month === month);
      
      // Add each department's score for this month
      monthPerformance.forEach(perf => {
        monthData[perf.departmentName] = Math.round(perf.score);
      });

      monthlyData.push(monthData);
    }

    return NextResponse.json({
      success: true,
      data: monthlyData,
      year: year,
      calculatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching department performance:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch department performance',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function calculateDepartmentPerformance(year: number) {
  // Get all departments
  const departments = await Department.find({ is_deleted: false });
  
  for (const department of departments) {
    // Get all machines in this department
    const machines = await Machine.find({ 
      departmentId: department._id, 
      is_deleted: false 
    });

    // Get all employees in this department
    const employees = await Employee.find({ 
      departmentId: department._id, 
      is_deleted: false 
    });

    if (employees.length === 0) continue;

    // Calculate performance for each month (only up to current month for current year)
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const maxMonth = (year === currentYear) ? currentMonth : 12;

    for (let month = 1; month <= maxMonth; month++) {
      let totalEmployeeScores = 0;
      let validEmployeeCount = 0;

      for (const employee of employees) {
        // Get employee's skills
        const employeeSkills = await EmployeeSkill.find({ 
          employeeId: employee._id 
        }).populate('skillId');

        if (employeeSkills.length === 0) continue;

        // Calculate employee score based on skills
        let skillScores = 0;
        let skillCount = 0;

        for (const empSkill of employeeSkills) {
          const skillLevel = empSkill.level?.toLowerCase();
          let score = 1; // default low

          switch (skillLevel) {
            case 'low':
              score = 1;
              break;
            case 'medium':
              score = 2;
              break;
            case 'high':
              score = 3;
              break;
            case 'advanced':
            case 'expert':
              score = 4;
              break;
          }

          skillScores += score;
          skillCount++;
        }

        if (skillCount > 0) {
          // Average skill score for this employee across all machines in department
          const employeeAvgScore = skillScores / skillCount;
          // Average again by number of machines (if employee works on multiple machines)
          const employeeScore = machines.length > 0 ? employeeAvgScore / machines.length * machines.length : employeeAvgScore;
          
          totalEmployeeScores += employeeScore;
          validEmployeeCount++;
        }
      }

      if (validEmployeeCount > 0) {
        // Calculate department score as percentage (1-4 scale converted to 0-100)
        const avgScore = totalEmployeeScores / validEmployeeCount;
        const percentageScore = ((avgScore - 1) / 3) * 100; // Convert 1-4 scale to 0-100%

        // Store or update the performance record
      
        await DepartmentPerformance.findOneAndUpdate(
          {
            departmentId: department._id,
            month: month,
            year: year
          },
          {
            departmentId: department._id,
            departmentName: department.name,
            month: month,
            year: year,
            score: Math.max(0, Math.min(100, percentageScore)), // Clamp between 0-100
            employeeCount: validEmployeeCount,
            machineCount: machines.length,
            calculatedAt: new Date()
          },
          {
            upsert: true,
            new: true
          }
        );
      }
    }
  }
}

function getMonthName(month: number): string {
  const months = [
    '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return months[month] || '';
}
