"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

// Use a flexible interface that matches the actual employee data structure
interface FlexibleEmployee {
  id?: string
  name?: string
  gender?: string
  department?: string
  skillLevel?: string
  yearsExperience?: number
}

interface SkillLevelBreakdownProps {
  data: FlexibleEmployee[]
}

export default function SkillLevelBreakdown({ data }: SkillLevelBreakdownProps) {
  // Helper function to normalize skill levels (treat Expert as Advanced)
  const normalizeSkillLevel = (skillLevel: string | undefined) => {
    if (!skillLevel) return '';
    if (skillLevel === 'Expert' || skillLevel === 'Advanced') return 'Advanced';
    return skillLevel;
  };

  // Filter out employees without department and get unique departments
  const validData = data.filter(emp => emp.department && emp.skillLevel && emp.gender);
  const departments = [...new Set(validData.map((employee) => employee.department))].filter(Boolean) as string[];

  const skillBreakdownData = departments.map((department) => {
    const employees = validData.filter((e) => e.department === department)
    const maleEmployees = employees.filter((e) => 
      e.gender?.toLowerCase() === "male" || e.gender === "Male" || e.gender === "MALE"
    )
    const femaleEmployees = employees.filter((e) => 
      e.gender?.toLowerCase() === "female" || e.gender === "Female" || e.gender === "FEMALE"
    )

    return {
      name: department.replace(" ", "\n"),
      "Male Advanced": maleEmployees.filter((e) => normalizeSkillLevel(e.skillLevel) === "Advanced").length,
      "Female Advanced": femaleEmployees.filter((e) => normalizeSkillLevel(e.skillLevel) === "Advanced").length,
      "Male High": maleEmployees.filter((e) => e.skillLevel === "High").length,
      "Female High": femaleEmployees.filter((e) => e.skillLevel === "High").length,
      "Male Medium": maleEmployees.filter((e) => e.skillLevel === "Medium").length,
      "Female Medium": femaleEmployees.filter((e) => e.skillLevel === "Medium").length,
      "Male Low": maleEmployees.filter((e) => e.skillLevel === "Low").length,
      "Female Low": femaleEmployees.filter((e) => e.skillLevel === "Low").length,
    }
  })

  // Add debugging
  console.log("SkillLevelBreakdown - Valid Data Count:", validData.length);
  console.log("SkillLevelBreakdown - Departments:", departments);
  console.log("SkillLevelBreakdown - Chart Data:", skillBreakdownData);

  // Return early if no valid data
  if (!validData.length || !departments.length) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">No Data Available</p>
          <p className="text-sm">No valid employee data found for skill level breakdown</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={skillBreakdownData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={11} />
          <YAxis fontSize={11} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "11px" }} />

          {/* Advanced Level */}
          <Bar dataKey="Male Advanced" stackId="Advanced" fill="#AF52DE" name="Male Advanced" />
          <Bar dataKey="Female Advanced" stackId="Advanced" fill="#E980FC" name="Female Advanced" />

          {/* High Level */}
          <Bar dataKey="Male High" stackId="high" fill="#007AFF" name="Male High" />
          <Bar dataKey="Female High" stackId="high" fill="#64D2FF" name="Female High" />

          {/* Medium Level */}
          <Bar dataKey="Male Medium" stackId="medium" fill="#FFCC00" name="Male Medium" />
          <Bar dataKey="Female Medium" stackId="medium" fill="#FFE066" name="Female Medium" />

          {/* Low Level */}
          <Bar dataKey="Male Low" stackId="low" fill="#FF3B30" name="Male Low" />
          <Bar dataKey="Female Low" stackId="low" fill="#FF6B6B" name="Female Low" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
