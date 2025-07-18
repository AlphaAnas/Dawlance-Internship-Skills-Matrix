"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building2,
  FileText,
  TrendingUp,
  MapPin,
  Clock,
  ChevronRight,
  BarChart3,
  Target,
  Award,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Dummy data
const dashboardData = {
  user: {
    name: "Ahmad Hassan",
    role: "Skills Matrix Administrator",
    department: "Human Resources",
    avatar: "/placeholder.svg?height=40&width=40",
    lastLogin: "2024-01-15 09:30 AM",
  },
  metrics: {
    totalSkillsMatrices: 45,
    totalEmployees: 1247,
    totalDepartments: 12,
    skillsGapAnalysis: 23,
  },
  departments: [
    { name: "Manufacturing", employees: 456, skillsMatrices: 15 },
    { name: "Quality Control", employees: 123, skillsMatrices: 8 },
    { name: "Maintenance", employees: 89, skillsMatrices: 6 },
    { name: "Engineering", employees: 234, skillsMatrices: 12 },
  ],
  recentActivity: [
    {
      action: "New skills matrix created",
      department: "Manufacturing",
      time: "2 hours ago",
    },
    {
      action: "Employee skills updated",
      department: "Quality Control",
      time: "4 hours ago",
    },
    {
      action: "Skills gap analysis completed",
      department: "Engineering",
      time: "1 day ago",
    },
  ],
};

export default function DawlanceDashboard() {
  const [mounted, setMounted] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setAnimateCards(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-orange-50 relative overflow-hidden">
      <div className="container mx-auto px-2">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Skills Matrices",
              value: dashboardData.metrics.totalSkillsMatrices,
              icon: FileText,
              color: "text-blue-600",
              bgColor: "bg-blue-500/10",
              change: "+12%",
            },
            {
              title: "Total Employees",
              value: dashboardData.metrics.totalEmployees,
              icon: Users,
              color: "text-orange-600",
              bgColor: "bg-orange-500/10",
              change: "+5%",
            },
            {
              title: "Departments",
              value: dashboardData.metrics.totalDepartments,
              icon: Building2,
              color: "text-blue-600",
              bgColor: "bg-blue-500/10",
              change: "0%",
            },
            {
              title: "Skills Gap Analysis",
              value: dashboardData.metrics.skillsGapAnalysis,
              icon: TrendingUp,
              color: "text-orange-600",
              bgColor: "bg-orange-500/10",
              change: "-8%",
            },
          ].map((metric, index) => (
            <Card
              key={metric.title}
              className={`bg-white/70 border-black-500 backdrop-blur-sm transition-all duration-500 hover:bg-white/90 hover:scale-105 hover:shadow-lg ${
                animateCards
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    {/* ⬇️ Increased title font */}
                    <p className="text-base font-semibold text-slate-600 mb-2">
                      {metric.title}
                    </p>

                    {/* ⬇️ Increased metric value font */}
                    <p className="text-3xl font-bold text-slate-800">
                      {metric.value.toLocaleString()}
                    </p>

                    <div className="flex items-center mt-2">
                      {/* ⬇️ Increased change text font */}
                      <span
                        className={`text-sm font-medium ${
                          metric.change.startsWith("+")
                            ? "text-green-600"
                            : metric.change.startsWith("-")
                            ? "text-orange-600"
                            : "text-slate-500"
                        }`}
                      >
                        {metric.change} from last month
                      </span>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${metric.bgColor}`}>
                    <metric.icon className={`h-7 w-7 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: "Employees",
              description: "Manage employee profiles and skill assessments",
              href: "/employees",
              icon: Users,
              color: "from-blue-600 to-blue-700",
            },
            {
              title: "Skills Mapping",
              description:
                "View and analyze skills distribution across departments",
              href: "/skills-mapping",
              icon: BarChart3,
              color: "from-orange-600 to-orange-700",
            },
            {
              title: "Skills Matrix Maker",
              description: "Create and customize new skills matrices",
              href: "/skills_matrix_maker",
              icon: Target,
              color: "from-blue-700 to-orange-600",
            },
          ].map((nav, index) => (
            <Link key={nav.title} href={nav.href}>
              <Card
                className={`bg-gradient-to-br ${
                  nav.color
                } border-0 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl group ${
                  animateCards
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${(index + 4) * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <nav.icon className="h-8 w-8 text-white" />
                    <ChevronRight className="h-5 w-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {nav.title}
                  </h3>
                  <p className="text-white/80 text-sm">{nav.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Department Overview & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Overview */}
          <Card className="bg-white/70 border-slate-200/50 backdrop-blur-sm shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span>Department Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.departments.map((dept, index) => (
                  <div
                    key={dept.name}
                    className={`flex items-center justify-between p-3 rounded-lg bg-slate-50/80 transition-all duration-300 hover:bg-blue-50/80 ${
                      animateCards
                        ? "translate-x-0 opacity-100"
                        : "translate-x-4 opacity-0"
                    }`}
                    style={{ transitionDelay: `${(index + 7) * 100}ms` }}
                  >
                    <div>
                      <p className="font-medium text-slate-800">{dept.name}</p>
                      <p className="text-sm text-slate-600">
                        {dept.employees} employees
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className="border-blue-500/30 text-blue-700 bg-blue-50"
                      >
                        {dept.skillsMatrices} matrices
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white/70 border-slate-200/50 backdrop-blur-sm shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center space-x-2">
                <Award className="h-5 w-5 text-orange-600" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-3 p-3 rounded-lg bg-slate-50/80 transition-all duration-300 hover:bg-orange-50/80 ${
                      animateCards
                        ? "translate-x-0 opacity-100"
                        : "translate-x-4 opacity-0"
                    }`}
                    style={{ transitionDelay: `${(index + 11) * 100}ms` }}
                  >
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-slate-800 text-sm font-medium">
                        {activity.action}
                      </p>
                      <p className="text-slate-600 text-xs">
                        {activity.department} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
