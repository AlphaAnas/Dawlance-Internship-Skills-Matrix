"use client";

import type React from "react";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  Bot,
  Send,
  Users,
  Award,
  Clock,
  Building2,
  Wifi,
  WifiOff,
  Zap,
  Sparkles,
  TrendingUp,
  BarChart3,
  Star,
  Trophy,
  UserCheck,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

interface Employee {
  id: string | number;
  name: string;
  department: string;
  skillLevel: string;
  performanceScore?: number;
  gender: string;
  yearsExperience?: number;
  title?: string;
}

interface AIChatbotProps {
  data: Employee[];
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
  data?: any; // For structured data
  type?:
    | "text"
    | "employee-list"
    | "skill-distribution"
    | "diversity-report"
    | "analysis"
    | "detailed-employee-list";
}

interface PrewrittenPrompt {
  id: string;
  text: string;
  icon: React.ReactNode;
  description: string;
  category: string;
  gradient: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AIChatbot({ data }: AIChatbotProps) {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showPrompts, setShowPrompts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ============================================================================
  // PREDEFINED PROMPTS CONFIGURATION
  // ============================================================================

  const prewrittenPrompts: PrewrittenPrompt[] = [
    {
      id: "top-sheet-molding",
      text: "Give me top 10 employees of Sheet Molding department",
      icon: <Users className="h-5 w-5" />,
      description: "Top Sheet Molding Performers",
      category: "Department Analysis",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "skill-distribution",
      text: "What is the skill level distribution across all departments?",
      icon: <Award className="h-5 w-5" />,
      description: "Skill Level Breakdown",
      category: "Skills Analysis",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "gender-diversity",
      text: "Show me gender diversity statistics by department with female employee names and skills",
      icon: <TrendingUp className="h-5 w-5" />,
      description: "Gender Diversity Report",
      category: "Diversity Metrics",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: "experience-analysis",
      text: "Who are the most experienced employees in the organization and why were they selected?",
      icon: <Clock className="h-5 w-5" />,
      description: "Experience Analysis",
      category: "Experience Insights",
      gradient: "from-orange-500 to-red-500",
    },
    {
      id: "performance-trends",
      text: "Analyze performance trends across departments",
      icon: <BarChart3 className="h-5 w-5" />,
      description: "Performance Trends",
      category: "Performance Analysis",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      id: "training-needs",
      text: "Identify employees who need skill development training",
      icon: <Sparkles className="h-5 w-5" />,
      description: "Training Recommendations",
      category: "Development Plans",
      gradient: "from-teal-500 to-blue-500",
    },
  ];

  // ============================================================================
  // EFFECTS & LIFECYCLE
  // ============================================================================

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Hide prompts when user starts chatting
  useEffect(() => {
    if (messages.length > 0) {
      setShowPrompts(false);
    }
  }, [messages]);

  // ============================================================================
  // COMPUTED VALUES FOR ANALYSIS REPORTS
  // ============================================================================

  // Get the current analysis data from messages
  const currentAnalysisData = useMemo(() => {
    const analysisMessage = messages.find(
      (msg) => msg.type === "analysis" && msg.data
    );
    return analysisMessage?.data || null;
  }, [messages]);

  // Compute analysis employees
  const analysisEmployees = useMemo(() => {
    return currentAnalysisData?.employees || [];
  }, [currentAnalysisData]);

  // Compute average experience
  const averageExperience = useMemo(() => {
    if (!analysisEmployees.length) return 0;
    const totalExp = analysisEmployees.reduce((sum: number, emp: any) => {
      const exp = parseInt(
        emp.experience?.toString().replace(/[^\d]/g, "") || "0"
      );
      return sum + exp;
    }, 0);
    return Math.round(totalExp / analysisEmployees.length);
  }, [analysisEmployees]);

  // Compute skill level distribution
  const skillLevelDistribution = useMemo(() => {
    const distribution: any = {};
    analysisEmployees.forEach((emp: any) => {
      const level = emp.skillLevel || "Unknown";
      distribution[level] = (distribution[level] || 0) + 1;
    });
    return distribution;
  }, [analysisEmployees]);

  // ============================================================================
  // STATUS HELPERS
  // ============================================================================

  const getConnectionStatus = () => {
    if (!isOnline)
      return {
        status: "offline",
        color: "red",
        icon: WifiOff,
        text: "Offline",
      };
    return {
      status: "online",
      color: "green",
      icon: Wifi,
      text: "AI Enhanced",
    };
  };

  // ============================================================================
  // DATABASE LOOKUP FUNCTIONS
  // ============================================================================

  const getEmployeeDetailsByNames = (employeeNames: string[]): any[] => {
    const foundEmployees: any[] = [];
    console.log('Searching for employees with names:', employeeNames);
    console.log('Database has', data.length, 'total employees');

    employeeNames.forEach((name) => {
      console.log(`Searching for employee: "${name}"`);
      
      // Search for exact matches first, then partial matches
      const exactMatch = data.find(
        (emp) => emp.name?.toLowerCase().trim() === name.toLowerCase().trim()
      );

      if (exactMatch) {
        console.log(`Found exact match for "${name}":`, exactMatch.name);
        foundEmployees.push(exactMatch);
      } else {
        console.log(`No exact match for "${name}", trying partial match...`);
        
        // Try partial match (first name or last name)
        const partialMatch = data.find((emp) => {
          const empNameLower = emp.name?.toLowerCase() || "";
          const searchNameLower = name.toLowerCase();
          const isMatch = empNameLower.includes(searchNameLower) || searchNameLower.includes(empNameLower);
          
          if (isMatch) {
            console.log(`Partial match found: "${emp.name}" matches "${name}"`);
          }
          
          return isMatch;
        });

        if (partialMatch) {
          console.log(`Found partial match for "${name}":`, partialMatch.name);
          foundEmployees.push(partialMatch);
        } else {
          console.log(`No match found for "${name}"`);
          // Show some sample names from database for debugging
          const sampleNames = data.slice(0, 3).map(emp => emp.name);
          console.log('Sample database names:', sampleNames);
        }
      }
    });

    console.log(`Total matches found: ${foundEmployees.length}`);
    return foundEmployees;
  };

  const renderDetailedEmployeeCards = (employees: any[]) => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-xl border border-blue-200 shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Employee Detailed Records
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Complete employee information retrieved from database
            </p>
            <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {employees.length} employees found
              </span>
            </div>
          </div>
        </div>

        {/* Employee Cards */}
        <div className="grid gap-6">
          {employees.map((emp, index) => (
            <div
              key={index}
              className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300"
            >
              {/* Employee Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl shadow-lg">
                      {emp.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 2) || "NA"}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      <UserCheck className="h-3 w-3 text-white" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {emp.name || "Unknown Employee"}
                    </h4>
                    <p className="text-gray-600 font-medium text-lg">
                      {emp.title || emp.department || "No Title"}
                    </p>
                    {emp.department && emp.title && (
                      <p className="text-sm text-gray-500">{emp.department}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Badge
                    className={`bg-gradient-to-r ${
                      emp.skillLevel === "Advanced" ||
                      emp.skillLevel === "Expert"
                        ? "from-amber-400 to-orange-500"
                        : emp.skillLevel === "High"
                        ? "from-blue-400 to-blue-600"
                        : "from-green-400 to-green-600"
                    } text-white border-0 shadow-md flex items-center gap-1 px-3 py-1`}
                  >
                    {emp.skillLevel === "Advanced" ||
                    emp.skillLevel === "Expert" ? (
                      <Trophy className="h-4 w-4" />
                    ) : emp.skillLevel === "High" ? (
                      <Star className="h-4 w-4" />
                    ) : (
                      <UserCheck className="h-4 w-4" />
                    )}
                    {emp.skillLevel || "Not Specified"}
                  </Badge>
                </div>
              </div>

              {/* Detailed Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {emp.yearsExperience || 0}
                  </div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-green-600 mb-1">
                    {emp.gender || "Not Specified"}
                  </div>
                  <div className="text-sm text-gray-600">Gender</div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <div className="text-sm font-bold text-purple-600 mb-1 truncate">
                    {emp.department || "No Department"}
                  </div>
                  <div className="text-sm text-gray-600">Department</div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                  <div className="text-sm font-bold text-orange-600 mb-1">
                    ID: {emp.id || index + 1}
                  </div>
                  <div className="text-sm text-gray-600">Employee ID</div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                {/* Skills Section */}
                {emp.skillLevel && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-indigo-600" />
                      <span className="text-sm font-semibold text-indigo-800">
                        Skill Level
                      </span>
                    </div>
                    <div className="text-sm text-indigo-700 font-medium">
                      {emp.skillLevel} - Professional competency level
                    </div>
                  </div>
                )}

                {/* Experience Details */}
                {emp.yearsExperience && emp.yearsExperience > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-semibold text-amber-800">
                        Experience Details
                      </span>
                    </div>
                    <div className="text-sm text-amber-700">
                      {emp.yearsExperience} years of professional experience in{" "}
                      {emp.department || "various departments"}
                    </div>
                  </div>
                )}

                {/* Department Information */}
                {emp.department && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-semibold text-emerald-800">
                        Department Information
                      </span>
                    </div>
                    <div className="text-sm text-emerald-700">
                      Currently working in {emp.department} department
                      {emp.title && ` as ${emp.title}`}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <span className="text-lg font-bold text-gray-800">
              {employees.length}
            </span>
            <span className="text-gray-600 ml-2">
              Complete Employee Records Retrieved
            </span>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // MESSAGE MANAGEMENT
  // ============================================================================

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  // ============================================================================
  // UI RENDERING COMPONENTS
  // ============================================================================

  const renderEmployeeList = (data: any) => {
    const getSkillIcon = (skillLevel: string) => {
      switch (skillLevel?.toLowerCase()) {
        case "advanced":
        case "expert":
          return <Trophy className="h-4 w-4" />;
        case "high":
          return <Star className="h-4 w-4" />;
        case "medium":
          return <UserCheck className="h-4 w-4" />;
        default:
          return <Briefcase className="h-4 w-4" />;
      }
    };

    const getSkillColor = (skillLevel: string) => {
      switch (skillLevel?.toLowerCase()) {
        case "advanced":
        case "expert":
          return "from-amber-400 to-orange-500";
        case "high":
          return "from-blue-400 to-blue-600";
        case "medium":
          return "from-green-400 to-green-600";
        default:
          return "from-gray-400 to-gray-600";
      }
    };

    const sortedEmployees = useMemo(() => {
      return (
        data.employees?.sort(
          (a: any, b: any) => (a.rank || 0) - (b.rank || 0)
        ) || []
      );
    }, [data.employees]);

    return (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 p-6 rounded-xl border border-blue-200 shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">{data.title}</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">{data.summary}</p>
            <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {sortedEmployees.length} employees
              </span>
              <span className="flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                Top performers
              </span>
            </div>
          </div>
        </div>

        {/* Employee Grid */}
        <div className="grid gap-4">
          {sortedEmployees.map((emp: any, index: number) => (
            <div
              key={index}
              className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Employee Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <div className="relative">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
                      #{emp.rank || index + 1}
                    </div>
                    {(emp.rank || index + 1) <= 3 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                        <Trophy className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Employee Info */}
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {emp.name}
                    </h4>
                    <p className="text-gray-600 font-medium">
                      {emp.title || emp.department}
                    </p>
                    {emp.department && emp.title && (
                      <p className="text-sm text-gray-500">{emp.department}</p>
                    )}
                  </div>
                </div>

                {/* Skill Level Badge */}
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    className={`bg-gradient-to-r ${getSkillColor(
                      emp.skillLevel
                    )} text-white border-0 shadow-md flex items-center gap-1 px-3 py-1`}
                  >
                    {getSkillIcon(emp.skillLevel)}
                    {emp.skillLevel}
                  </Badge>
                </div>
              </div>

              {/* Employee Details Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                {emp.experience && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {emp.experience}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      Years Experience
                    </div>
                  </div>
                )}
                {emp.gender && (
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-700">
                      {emp.gender}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      Gender
                    </div>
                  </div>
                )}
                {emp.department && (
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-700 truncate">
                      {emp.department}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      Department
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-sm font-bold text-purple-600">
                    Rank #{emp.rank || index + 1}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    Position
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              {emp.skills && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-800">
                      Key Skills
                    </span>
                  </div>
                  <div className="text-sm text-blue-700 font-medium">
                    {Array.isArray(emp.skills)
                      ? emp.skills.join(" • ")
                      : emp.skills}
                  </div>
                </div>
              )}

              {/* Reason Section */}
              {emp.reason && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-800">
                      Selection Criteria
                    </span>
                  </div>
                  <div className="text-sm text-green-700 leading-relaxed">
                    {emp.reason}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <span className="text-lg font-bold text-gray-800">
              {sortedEmployees.length}
            </span>
            <span className="text-gray-600 ml-2">
              Top Performing Employees Listed
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderDiversityReport = (data: any) => {
    const totalEmployees = useMemo(() => {
      return (
        data.departments?.reduce(
          (sum: number, dept: any) => sum + (dept.total || 0),
          0
        ) || 0
      );
    }, [data.departments]);

    const femaleCount = useMemo(() => {
      return (
        data.departments?.reduce(
          (sum: number, dept: any) => sum + (dept.femaleCount || 0),
          0
        ) || 0
      );
    }, [data.departments]);

    const overallFemalePercentage =
      totalEmployees > 0 ? Math.round((femaleCount / totalEmployees) * 100) : 0;

    return (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-pink-50 via-green-50 to-emerald-50 p-6 rounded-xl border border-pink-200 shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-emerald-500/5"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-r from-pink-500 to-emerald-600 p-2 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">{data.title}</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">{data.summary}</p>
            <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {totalEmployees} total employees
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {data.departments?.length || 0} departments
              </span>
            </div>
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="mb-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {femaleCount}
              </div>
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-1">
              Female Employees
            </h4>
            <div className="text-3xl font-bold text-pink-600 mb-2">
              {overallFemalePercentage}%
            </div>
            <div className="text-sm text-gray-500">of workforce</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="mb-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {totalEmployees - femaleCount}
              </div>
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-1">
              Male Employees
            </h4>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {100 - overallFemalePercentage}%
            </div>
            <div className="text-sm text-gray-500">of workforce</div>
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <h4 className="text-lg font-bold text-gray-800">
              Department Breakdown
            </h4>
          </div>

          <div className="grid gap-6">
            {data.departments?.map((dept: any, index: number) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-lg font-semibold text-gray-800">
                    {dept.department}
                  </h5>
                  <div className="flex gap-2">
                    <Badge className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
                      {dept.femaleCount} females
                    </Badge>
                    <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                      {dept.total} total
                    </Badge>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Female: {dept.femalePercentage}%</span>
                    <span>
                      Male:{" "}
                      {(100 - parseFloat(dept.femalePercentage)).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex rounded-lg overflow-hidden h-4 bg-gray-200 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-pink-400 to-pink-600 transition-all duration-500 flex items-center justify-center"
                      style={{ width: `${dept.femalePercentage}%` }}
                    >
                      {parseFloat(dept.femalePercentage) > 15 && (
                        <span className="text-xs text-white font-medium">
                          {dept.femaleCount}
                        </span>
                      )}
                    </div>
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500 flex items-center justify-center"
                      style={{
                        width: `${100 - parseFloat(dept.femalePercentage)}%`,
                      }}
                    >
                      {100 - parseFloat(dept.femalePercentage) > 15 && (
                        <span className="text-xs text-white font-medium">
                          {dept.total - dept.femaleCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Female Employees Details */}
                {dept.females && dept.females.length > 0 && (
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <UserCheck className="h-4 w-4 text-pink-600" />
                      <h6 className="text-sm font-semibold text-pink-800">
                        Female Employees
                      </h6>
                    </div>
                    <div className="grid gap-3">
                      {dept.females.map((emp: any, empIndex: number) => (
                        <div
                          key={empIndex}
                          className="bg-white border border-pink-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="font-semibold text-gray-800">
                                {emp.name}
                              </span>
                              {emp.title && (
                                <span className="text-sm text-gray-600 ml-2">
                                  • {emp.title}
                                </span>
                              )}
                            </div>
                            <Badge
                              className={`text-xs ${
                                emp.skillLevel === "Advanced" ||
                                emp.skillLevel === "Expert"
                                  ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white"
                                  : emp.skillLevel === "High"
                                  ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white"
                                  : "bg-gradient-to-r from-green-400 to-green-600 text-white"
                              }`}
                            >
                              {emp.skillLevel}
                            </Badge>
                          </div>
                          {emp.skills && (
                            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                              <span className="font-medium text-gray-700">
                                Skills:
                              </span>{" "}
                              {Array.isArray(emp.skills)
                                ? emp.skills.join(" • ")
                                : emp.skills}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Summary Insights */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-2 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h4 className="text-lg font-bold text-gray-800">
              Diversity Summary
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                {overallFemalePercentage}%
              </div>
              <div className="text-sm text-gray-600">Female Representation</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {data.departments?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Departments Analyzed</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {totalEmployees}
              </div>
              <div className="text-sm text-gray-600">Total Employees</div>
            </div>
          </div>
        </div>

        {/* Detailed Employee Records (if available) */}
        {data.detailedFemaleEmployees &&
          data.detailedFemaleEmployees.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-800">
                  Detailed Female Employee Records
                </h4>
              </div>
              {renderDetailedEmployeeCards(data.detailedFemaleEmployees)}
            </div>
          )}
      </div>
    );
  };

  const renderAnalysisReport = (
    data: any,
    analysisEmployees: any[],
    averageExperience: number,
    skillLevelDistribution: any
  ) => {
    const getExperienceIcon = (experience: string) => {
      const years = parseInt(
        experience?.toString().replace(/[^\d]/g, "") || "0"
      );
      if (years >= 10) return <Star className="h-4 w-4" />;
      if (years >= 5) return <Award className="h-4 w-4" />;
      return <Briefcase className="h-4 w-4" />;
    };

    const getExperienceColor = (experience: string) => {
      const years = parseInt(
        experience?.toString().replace(/[^\d]/g, "") || "0"
      );
      if (years >= 10) return "from-amber-400 to-orange-500";
      if (years >= 5) return "from-blue-400 to-blue-600";
      return "from-green-400 to-green-600";
    };

    return (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 p-6 rounded-xl border border-indigo-200 shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">{data.title}</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">{data.summary}</p>
            <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {analysisEmployees.length} employees analyzed
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                {averageExperience} years avg experience
              </span>
            </div>
          </div>
        </div>

        {/* Analysis Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {analysisEmployees.length}
              </div>
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-1">
              Total Analyzed
            </h4>
            <div className="text-sm text-gray-500">Employee Records</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {averageExperience}
              </div>
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-1">
              Avg Experience
            </h4>
            <div className="text-sm text-gray-500">Years</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {Object.keys(skillLevelDistribution).length}
              </div>
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-1">
              Skill Levels
            </h4>
            <div className="text-sm text-gray-500">Categories</div>
          </div>
        </div>

        {/* Employee Analysis Cards */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h4 className="text-lg font-bold text-gray-800">
              Detailed Analysis
            </h4>
          </div>

          <div className="grid gap-5">
            {analysisEmployees.map((emp: any, index: number) => (
              <div
                key={index}
                className="group border border-gray-200 rounded-lg p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-300"
              >
                {/* Employee Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
                        {emp.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                        <UserCheck className="h-3 w-3 text-white" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                        {emp.name}
                      </h4>
                      <p className="text-gray-600 font-medium">
                        {emp.department}
                      </p>
                    </div>
                  </div>

                  <Badge
                    className={`bg-gradient-to-r ${
                      emp.skillLevel === "Advanced" ||
                      emp.skillLevel === "Expert"
                        ? "from-amber-400 to-orange-500"
                        : emp.skillLevel === "High"
                        ? "from-blue-400 to-blue-600"
                        : "from-green-400 to-green-600"
                    } text-white border-0 shadow-md`}
                  >
                    {emp.skillLevel}
                  </Badge>
                </div>

                {/* Employee Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {emp.experience && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-r ${getExperienceColor(
                          emp.experience
                        )} text-white`}
                      >
                        {getExperienceIcon(emp.experience)}
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Experience</div>
                        <div className="font-semibold text-gray-800">
                          {emp.experience}
                        </div>
                      </div>
                    </div>
                  )}

                  {emp.department && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 text-white">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Department</div>
                        <div className="font-semibold text-gray-800">
                          {emp.department}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Skills Section */}
                {emp.skills && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-800">
                        Skills & Expertise
                      </span>
                    </div>
                    <div className="text-sm text-blue-700 font-medium">
                      {Array.isArray(emp.skills)
                        ? emp.skills.join(" • ")
                        : emp.skills}
                    </div>
                  </div>
                )}

                {/* Analysis Reason */}
                {emp.reason && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-800">
                        Analysis Insight
                      </span>
                    </div>
                    <div className="text-sm text-green-700 leading-relaxed">
                      {emp.reason}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Summary Insights */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-2 rounded-lg">
              <Award className="h-5 w-5 text-white" />
            </div>
            <h4 className="text-lg font-bold text-gray-800">
              Skill Level Distribution
            </h4>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(skillLevelDistribution).map(
              ([level, count]: [string, any]) => (
                <div
                  key={level}
                  className="bg-white p-4 rounded-lg shadow-sm text-center"
                >
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {count}
                  </div>
                  <div className="text-sm text-gray-600">{level}</div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // DATA PROCESSING & ANALYSIS
  // ============================================================================

  const processEmployeeQuery = (prompt: string): { message: Message } => {
    const normalizeSkillLevel = (skillLevel: string | undefined) => {
      if (!skillLevel) return "";
      if (skillLevel === "Expert" || skillLevel === "Advanced")
        return "Advanced";
      return skillLevel;
    };

    // Check for general greetings and non-employee queries first
    const generalQueries = [
      "hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening",
      "how are you", "what's up", "what can you do", "help", "about", "who are you",
      "what are you", "thanks", "thank you", "bye", "goodbye", "see you"
    ];

    const isGeneralQuery = generalQueries.some(greeting => 
      prompt.toLowerCase().includes(greeting.toLowerCase())
    );

    if (isGeneralQuery || prompt.trim().length < 10) {
      return {
        message: {
          id: Date.now().toString(),
          text: `Hello! 👋 I'm your AI Employee Assistant for the Dawlance Skills Matrix System.

I can help you analyze employee data and provide insights about:

🔍 **What I can do for you:**
• **Top Employees Analysis** - Find top performers by department
• **Gender Diversity Reports** - Get detailed diversity statistics
• **Experience Analysis** - Identify most experienced staff
• **Skill Level Distribution** - Analyze skill breakdowns
• **Department Performance** - Compare department metrics
• **Training Recommendations** - Identify development needs

📊 **Current Database:** ${data.length} employees across ${[...new Set(data.map((emp) => emp.department))].length} departments

💡 **Try asking me things like:**
• "Give me top 10 employees of Sheet Molding department"
• "Show me gender diversity statistics by department"
• "Who are the most experienced employees?"
• "What is the skill level distribution?"

How can I assist you with your employee analysis today?`,
          isUser: false,
          timestamp: new Date(),
          type: "text",
        },
      };
    }

    // Sheet Molding department analysis - Top employees
    if (
      prompt.toLowerCase().includes("sheet molding") ||
      prompt.toLowerCase().includes("sheet metal") ||
      prompt.toLowerCase().includes("top 10") ||
      prompt.toLowerCase().includes("top employees")
    ) {
      const sheetMoldingEmployees = data.filter(
        (emp) =>
          emp.department?.toLowerCase().includes("sheet") ||
          emp.department?.toLowerCase().includes("molding") ||
          emp.department?.toLowerCase().includes("metal")
      );

      if (sheetMoldingEmployees.length === 0) {
        return {
          message: {
            id: Date.now().toString(),
            text: "No Sheet Molding employees found in the current dataset.",
            isUser: false,
            timestamp: new Date(),
            type: "text",
          },
        };
      }

      const sortedEmployees = sheetMoldingEmployees
        .sort((a, b) => {
          const skillOrder = {
            Advanced: 4,
            Expert: 4,
            High: 3,
            Medium: 2,
            Low: 1,
          };
          const aSkill =
            skillOrder[a.skillLevel as keyof typeof skillOrder] || 0;
          const bSkill =
            skillOrder[b.skillLevel as keyof typeof skillOrder] || 0;

          if (aSkill !== bSkill) return bSkill - aSkill;
          return (b.yearsExperience || 0) - (a.yearsExperience || 0);
        })
        .slice(0, 10);

      return {
        message: {
          id: Date.now().toString(),
          text: `Found ${sortedEmployees.length} top performers in Sheet Molding department`,
          isUser: false,
          timestamp: new Date(),
          type: "employee-list",
          data: {
            title: `Top ${sortedEmployees.length} Sheet Molding Employees`,
            employees: sortedEmployees.map((emp, index) => ({
              rank: index + 1,
              name: emp.name,
              skillLevel: normalizeSkillLevel(emp.skillLevel),
              experience: emp.yearsExperience || 0,
              title: emp.title || "N/A",
              gender: emp.gender,
              department: emp.department,
              skills: emp.skillLevel, // You can expand this with actual skills array if available
            })),
            summary: `Analysis of ${sheetMoldingEmployees.length} employees in Sheet Molding department, ranked by skill level and experience.`,
          },
        },
      };
    }

    // Gender diversity analysis
    if (
      prompt.toLowerCase().includes("gender diversity") ||
      prompt.toLowerCase().includes("gender statistics")
    ) {
      const departments = [...new Set(data.map((emp) => emp.department))];
      const diversityData = departments
        .map((dept) => {
          const deptEmployees = data.filter((emp) => emp.department === dept);
          const femaleEmployees = deptEmployees.filter(
            (emp) => emp.gender === "Female"
          );
          const maleCount = deptEmployees.filter(
            (emp) => emp.gender === "Male"
          ).length;
          const total = deptEmployees.length;

          return {
            department: dept,
            total,
            femaleCount: femaleEmployees.length,
            maleCount,
            femalePercentage:
              total > 0
                ? ((femaleEmployees.length / total) * 100).toFixed(1)
                : "0",
            malePercentage:
              total > 0 ? ((maleCount / total) * 100).toFixed(1) : "0",
            females: femaleEmployees.map((emp) => ({
              name: emp.name,
              skillLevel: normalizeSkillLevel(emp.skillLevel),
              title: emp.title,
              skills: emp.skillLevel, // You can expand this with actual skills array
            })),
          };
        })
        .filter((dept) => dept.total > 0);

      return {
        message: {
          id: Date.now().toString(),
          text: `Gender diversity analysis across ${departments.length} departments`,
          isUser: false,
          timestamp: new Date(),
          type: "diversity-report",
          data: {
            title: "Gender Diversity by Department",
            departments: diversityData,
            summary: `Comprehensive gender diversity analysis showing female employees and their skills across all departments.`,
          },
        },
      };
    }

    // Most experienced employees analysis
    if (
      prompt.toLowerCase().includes("most experience") ||
      prompt.toLowerCase().includes("experienced employee")
    ) {
      // Extract department from prompt if mentioned
      const mentionedDept = data.find((emp) =>
        prompt.toLowerCase().includes(emp.department?.toLowerCase() || "")
      )?.department;

      let targetEmployees = data;
      let deptText = "the organization";

      if (mentionedDept) {
        targetEmployees = data.filter(
          (emp) => emp.department === mentionedDept
        );
        deptText = mentionedDept;
      }

      const experiencedEmployees = targetEmployees
        .filter((emp) => emp.yearsExperience && emp.yearsExperience > 0)
        .sort((a, b) => {
          // Sort by experience first, then by skill level
          const expDiff = (b.yearsExperience || 0) - (a.yearsExperience || 0);
          if (expDiff !== 0) return expDiff;

          const skillOrder = {
            Advanced: 4,
            Expert: 4,
            High: 3,
            Medium: 2,
            Low: 1,
          };
          const aSkill =
            skillOrder[a.skillLevel as keyof typeof skillOrder] || 0;
          const bSkill =
            skillOrder[b.skillLevel as keyof typeof skillOrder] || 0;
          return bSkill - aSkill;
        })
        .slice(0, 5); // Top 5 most experienced

      return {
        message: {
          id: Date.now().toString(),
          text: `Most experienced employees in ${deptText}`,
          isUser: false,
          timestamp: new Date(),
          type: "analysis",
          data: {
            title: `Most Experienced Employees in ${deptText}`,
            employees: experiencedEmployees.map((emp) => {
              let reason = `Selected for ${emp.yearsExperience} years of experience`;
              if (
                emp.skillLevel === "Advanced" ||
                emp.skillLevel === "Expert"
              ) {
                reason += ` and advanced skill level (${emp.skillLevel})`;
              }
              reason += `. Demonstrates long-term commitment and expertise.`;

              return {
                name: emp.name,
                skillLevel: normalizeSkillLevel(emp.skillLevel),
                experience: emp.yearsExperience,
                department: emp.department,
                title: emp.title,
                skills: emp.skillLevel, // You can expand this
                reason,
              };
            }),
            summary: `Analysis of the most experienced employees in ${deptText}, selected based on years of experience and skill level.`,
          },
        },
      };
    }

    // Skill distribution analysis
    if (
      prompt.toLowerCase().includes("skill level distribution") ||
      prompt.toLowerCase().includes("skill breakdown")
    ) {
      const skillCounts = data.reduce((acc, emp) => {
        const skill = normalizeSkillLevel(emp.skillLevel);
        acc[skill] = (acc[skill] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const total = data.length;
      const skillData = Object.entries(skillCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([skill, count]) => ({
          skill,
          count,
          percentage: ((count / total) * 100).toFixed(1),
        }));

      return {
        message: {
          id: Date.now().toString(),
          text: `Skill level distribution across ${total} employees`,
          isUser: false,
          timestamp: new Date(),
          type: "analysis",
          data: {
            title: "Skill Level Distribution",
            skills: skillData,
            total,
            summary: `Analysis of skill levels across all ${total} employees in the organization.`,
          },
        },
      };
    }

    // Default response for unrecognized queries
    return {
      message: {
        id: Date.now().toString(),
        text: `I'm sorry, I didn't understand that query. 

I'm specifically designed to help you analyze employee data for the Dawlance Skills Matrix System.

🔍 **Here's what I can help you with:**

• **"Give me top 10 employees of Sheet Molding department"** - Get top performers
• **"Show me gender diversity statistics by department"** - Diversity analysis  
• **"Who are the most experienced employees?"** - Experience insights
• **"What is the skill level distribution across all departments?"** - Skill analysis

📊 **Available Data:** ${data.length} employees across ${[...new Set(data.map((emp) => emp.department))].length} departments

Please try asking about employee analysis, department performance, skill levels, or diversity statistics. I'm here to help with your HR and staffing insights!`,
        isUser: false,
        timestamp: new Date(),
        type: "text",
      },
    };
  };

  // ============================================================================
  // AI SERVICE INTEGRATION (Same as before)
  // ============================================================================

  const callAIService = async (prompt: string): Promise<Message> => {
    // Check for general greetings and non-employee queries first
    const generalQueries = [
      "hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening",
      "how are you", "what's up", "what can you do", "help", "about", "who are you",
      "what are you", "thanks", "thank you", "bye", "goodbye", "see you"
    ];

    const isGeneralQuery = generalQueries.some(greeting => 
      prompt.toLowerCase().includes(greeting.toLowerCase())
    );

    if (isGeneralQuery || prompt.trim().length < 10) {
      return {
        id: Date.now().toString(),
        text: `Hello! 👋 I'm your AI Employee Assistant for the Dawlance Skills Matrix System.

I can help you analyze employee data and provide insights about:

🔍 **What I can do for you:**
• **Top Employees Analysis** - Find top performers by department
• **Gender Diversity Reports** - Get detailed diversity statistics
• **Experience Analysis** - Identify most experienced staff
• **Skill Level Distribution** - Analyze skill breakdowns
• **Department Performance** - Compare department metrics
• **Training Recommendations** - Identify development needs

📊 **Current Database:** ${data.length} employees across ${[...new Set(data.map((emp) => emp.department))].length} departments

💡 **Try asking me things like:**
• "Give me top 10 employees of Sheet Molding department"
• "Show me gender diversity statistics by department"
• "Who are the most experienced employees?"
• "What is the skill level distribution?"

How can I assist you with your employee analysis today?`,
        isUser: false,
        timestamp: new Date(),
        type: "text",
      };
    }

    const contextData = {
      totalEmployees: data.length,
      departments: [...new Set(data.map((emp) => emp.department))],
      skillLevels: [...new Set(data.map((emp) => emp.skillLevel))],
      sampleEmployees: data.slice(0, 5).map((emp) => ({
        name: emp.name,
        department: emp.department,
        skillLevel: emp.skillLevel,
        experience: emp.yearsExperience,
        gender: emp.gender,
      })),
    };

    const maxRetries = 3;
    const baseDelay = 1000;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a backend AI for a staffing and HR dashboard used in a manufacturing factory. Your job is to respond to HR-related queries from management and output strictly JSON-formatted data, which will be consumed and rendered by a React UI.

**Context Data:**
${JSON.stringify(contextData, null, 2)}

**User Query:** ${prompt}

Based on the user query, use the correct JSON structure from the following:

**Available Response Format(s):**

🔹 **1. Top 10 Employees**
_Use this format if the user asks for top employees by performance, skill, or value._

\`\`\`json
{
  "topEmployees": [
    {
      "name": "John Doe",
      "skills": ["Welding", "Lathe Operation"]
    },
    {
      "name": "Ayesha Khan",
      "skills": ["Assembly", "Quality Check"]
    }
  ]
}
\`\`\`
🔹 2. Gender Diversity by Department
If the user asks about gender distribution (e.g., number of female employees in each department), return:

{
  "genderDiversity": [
    {
      "department": "Sheet Metal",
      "femaleCount": 3,
      "females": [
        { "name": "Fatima", "skills": ["Cutting", "Stamping"] },
        { "name": "Sara", "skills": ["Lathe"] },
        { "name": "Arooj", "skills": ["Packing"] }
      ]
    },
    {
      "department": "Assembly", 
      "femaleCount": 2,
      "females": [
        { "name": "Nadia", "skills": ["Assembly"] },
        { "name": "Zoya", "skills": ["Inspection", "Packing"] }
      ]
    }
  ]
}

🔹 3. Most Experienced Employee in a Department
If the user asks who is the most experienced employee in a given department, return:

{
  "mostExperiencedEmployee": {
    "department": "Paint Shop",
    "employee": {
      "name": "Irfan Malik",
      "yearsExperience": 12,
      "skills": ["Spray Painting", "Color Mixing"],
      "reasonSelected": "Has 12 years of experience and skills that overlap with multiple critical tasks in the department."
    }
  }
}



📌 Output Rules:
- Return the appropriate JSON now based on the user query above.
- Do not include extra commentary or explanation outside the JSON.
- Return empty arrays or appropriate fields if data is missing.
- Always ensure JSON is well-structured and parsable.
- Respond ONLY with valid JSON. No additional text, explanations, or markdown formatting.`,
                  },
                ],
              },
            ],
          }),
        });

        if (response.status === 429) {
          const retryDelay =
            baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
          console.log(
            `Rate limited. Retrying in ${retryDelay}ms (attempt ${
              attempt + 1
            }/${maxRetries})`
          );
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          continue;
        }

        const result = await response.json();

        if (result.error || result.fallback) {
          throw new Error(result.message || result.error || "API call failed");
        }

        if (!result.candidates || result.candidates.length === 0) {
          throw new Error("No response candidates returned from AI service");
        }

        const candidate = result.candidates[0];

        if (candidate.finishReason === "SAFETY") {
          throw new Error("Response blocked due to safety filters");
        }

        if (candidate.finishReason === "RECITATION") {
          throw new Error("Response blocked due to recitation concerns");
        }

        const responseText = candidate.content?.parts?.[0]?.text;

        if (!responseText || responseText.trim().length === 0) {
          throw new Error("Empty response received from AI service");
        }

        // Try to parse JSON response
        try {
          console.log(`Original AI response: ${responseText}`);
          
          // Clean the response text to remove markdown code blocks if present
          let cleanedResponse = responseText.trim();
          
          // Remove markdown code block syntax if present
          if (cleanedResponse.startsWith('```json')) {
            cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
            console.log('Removed ```json markdown formatting');
          } else if (cleanedResponse.startsWith('```')) {
            cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
            console.log('Removed ``` markdown formatting');
          }
          
          // Additional cleanup for any extra whitespace or newlines
          cleanedResponse = cleanedResponse.trim();
          
          console.log(`Cleaned response text: ${cleanedResponse}`);
          
          const jsonResponse = JSON.parse(cleanedResponse);
          console.log("Successfully parsed JSON response:", jsonResponse);
          console.log("Available JSON keys:", Object.keys(jsonResponse));
          
          // Handle new simplified JSON structures
          // Check for topEmployees, genderDiversity, and mostExperiencedEmployee keys
          
          if (
            jsonResponse.topEmployees &&
            Array.isArray(jsonResponse.topEmployees) &&
            jsonResponse.topEmployees.length > 0
          ) {
            console.log('✅ Processing topEmployees - Count:', jsonResponse.topEmployees.length);
            const employeeNames = jsonResponse.topEmployees.map(
              (emp: any) => emp.name
            );
            console.log('Employee names to search for:', employeeNames);
            console.log('Total employees in database:', data.length);
            console.log('Sample database employee names:', data.slice(0, 5).map(emp => emp.name));
            
            const detailedEmployees = getEmployeeDetailsByNames(employeeNames);
            // console.log(
            //   `Detailed employee records found: ${detailedEmployees.length}`
            // );

            if (detailedEmployees.length > 0) {
              return {
                id: Date.now().toString(),
                text: `Found ${detailedEmployees.length} detailed employee records from database`,
                isUser: false,
                timestamp: new Date(),
                type: "detailed-employee-list",
                data: {
                  employees: detailedEmployees,
                  originalQuery: jsonResponse.topEmployees,
                },
              };
            } else {
              // Fallback to original format if no detailed records found
              // console.log('No detailed records found, using fallback format');
              return {
                id: Date.now().toString(),
                text: `Found ${jsonResponse.topEmployees.length} top performing employees (using AI data)`,
                isUser: false,
                timestamp: new Date(),
                type: "employee-list",
                data: {
                  title: `Top ${jsonResponse.topEmployees.length} Performing Employees`,
                  summary: `Analysis of top performing employees based on AI analysis`,
                  employees: jsonResponse.topEmployees.map(
                    (emp: any, index: number) => ({
                      rank: index + 1,
                      name: emp.name,
                      skills: Array.isArray(emp.skills)
                        ? emp.skills.join(", ")
                        : emp.skills || "No skills listed",
                      skillLevel: "High", // Default since not provided in new format
                      department: emp.department || "Various",
                      experience: emp.yearsExperience || "N/A",
                    })
                  ),
                },
              };
            }
          }

          if (jsonResponse.genderDiversity) {
            console.log('✅ Processing genderDiversity - Departments:', jsonResponse.genderDiversity.length);
            // Extract female employee names for database lookup
            const femaleEmployeeNames: string[] = [];
            jsonResponse.genderDiversity.forEach((dept: any) => {
              if (dept.females) {
                dept.females.forEach((emp: any) => {
                  femaleEmployeeNames.push(emp.name);
                });
              }
            });
            console.log('Female employee names to search for:', femaleEmployeeNames);

            const detailedFemaleEmployees =
              getEmployeeDetailsByNames(femaleEmployeeNames);
            console.log('Detailed female employee records found:', detailedFemaleEmployees.length);

            return {
              id: Date.now().toString(),
              text: `Gender diversity analysis across ${jsonResponse.genderDiversity.length} departments`,
              isUser: false,
              timestamp: new Date(),
              type: "diversity-report",
              data: {
                title: "Gender Diversity by Department",
                summary:
                  "Comprehensive gender diversity analysis showing female employees and their skills across departments",
                detailedFemaleEmployees: detailedFemaleEmployees, // Add detailed employee data
                departments: jsonResponse.genderDiversity.map((dept: any) => ({
                  department: dept.department,
                  total: dept.femaleCount + (dept.maleCount || 0), // Estimate if male count not provided
                  femaleCount: dept.femaleCount,
                  femalePercentage: dept.total
                    ? ((dept.femaleCount / dept.total) * 100).toFixed(1)
                    : "0",
                  females: dept.females.map((emp: any) => ({
                    name: emp.name,
                    skills: Array.isArray(emp.skills)
                      ? emp.skills.join(", ")
                      : emp.skills,
                    skillLevel: "Medium", // Default since not provided
                    title: emp.title || "Employee",
                  })),
                })),
              },
            };
          }

          if (jsonResponse.mostExperiencedEmployee) {
            console.log('✅ Processing mostExperiencedEmployee in department:', jsonResponse.mostExperiencedEmployee.department);
            const emp = jsonResponse.mostExperiencedEmployee.employee;
            console.log('Employee name to search for:', emp.name);

            // Try to get detailed employee record from database
            const detailedEmployee = getEmployeeDetailsByNames([emp.name]);
            console.log(
              `Detailed employee records found: ${detailedEmployee.length}`
            );
            if (detailedEmployee.length > 0) {
              return {
                id: Date.now().toString(),
                text: `Most experienced employee in ${jsonResponse.mostExperiencedEmployee.department}`,
                isUser: false,
                timestamp: new Date(),
                type: "detailed-employee-list",
                data: {
                  employees: detailedEmployee,
                  originalQuery: jsonResponse.mostExperiencedEmployee,
                },
              };
            } else {
              // Fallback to original format
              return {
                id: Date.now().toString(),
                text: `Most experienced employee in ${jsonResponse.mostExperiencedEmployee.department}`,
                isUser: false,
                timestamp: new Date(),
                type: "analysis",
                data: {
                  title: `Most Experienced Employee in ${jsonResponse.mostExperiencedEmployee.department}`,
                  summary: `Analysis of the most experienced employee in the ${jsonResponse.mostExperiencedEmployee.department} department`,
                  employees: [
                    {
                      name: emp.name,
                      experience: emp.yearsExperience,
                      department:
                        jsonResponse.mostExperiencedEmployee.department,
                      skills: Array.isArray(emp.skills)
                        ? emp.skills.join(", ")
                        : emp.skills,
                      skillLevel: "Advanced", // Default for most experienced
                      reason: emp.reasonSelected,
                    },
                  ],
                },
              };
            }
          }

          // Fallback for legacy format
          return {
            id: Date.now().toString(),
            text: jsonResponse.summary || "AI Analysis Complete",
            isUser: false,
            timestamp: new Date(),
            type: jsonResponse.type || "analysis",
            data: jsonResponse,
          };
        } catch (parseError) {
          // If JSON parsing fails, return as text
          console.log("Failed to parse JSON response, returning as text:", parseError);
          return {
            id: Date.now().toString(),
            text: responseText,
            isUser: false,
            timestamp: new Date(),
            type: "text",
          };
        }
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);

        if (attempt === maxRetries - 1) {
          throw error;
        }

        const retryDelay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }

    throw new Error("Max retries exceeded");
  };

  // ============================================================================
  // MESSAGE HANDLING
  // ============================================================================

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
      type: "text",
    };
    addMessage(userMessage);
    setInputValue("");
    setIsLoading(true);

    const typingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: "AI is analyzing your request...",
      isUser: false,
      timestamp: new Date(),
      isTyping: true,
      type: "text",
    };
    addMessage(typingMessage);

    try {
      let aiMessage: Message;
      const connectionStatus = getConnectionStatus();

      if (connectionStatus.status === "online") {
        aiMessage = await callAIService(message);
      } else {
        const result = processEmployeeQuery(message);
        aiMessage = result.message;
        if (connectionStatus.status === "offline") {
          aiMessage.text =
            "Working Offline - Using local data analysis: " + aiMessage.text;
        }
      }

      setMessages((prev) => prev.filter((msg) => !msg.isTyping));
      addMessage(aiMessage);
    } catch (error) {
      console.error("AI Service Error:", error);
      setMessages((prev) => prev.filter((msg) => !msg.isTyping));

      const result = processEmployeeQuery(message);
      const errorMessage: Message = {
        ...result.message,
        id: (Date.now() + 3).toString(),
        text:
          "AI Service Unavailable - Using local analysis: " +
          result.message.text,
      };
      addMessage(errorMessage);
    }

    setIsLoading(false);
  };

  const handlePromptClick = (prompt: string) => {
    // Set the prompt text in the input field instead of sending directly
    setInputValue(prompt);
    setShowPrompts(false); // Hide the prompts to show the chat interface

    // Add a small delay then focus the input field
    setTimeout(() => {
      const inputElement = document.querySelector(
        'input[placeholder*="Ask me about"]'
      ) as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
        inputElement.setSelectionRange(
          inputElement.value.length,
          inputElement.value.length
        );
      }
    }, 100);
  };

  // ============================================================================
  // CHAT INITIALIZATION
  // ============================================================================

  const openChat = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      // Don't add welcome message since we have the prompts screen
    }
  };

  const connectionStatus = getConnectionStatus();
  const StatusIcon = connectionStatus.icon;

  // ============================================================================
  // RENDER COMPONENT
  // ============================================================================

  return (
    <>
      {/* Floating AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          <Button
            onClick={openChat}
            className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Bot className="h-8 w-8 text-white" />
          </Button>

          {/* Status Indicator */}
          <div
            className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-sm ${
              connectionStatus.color === "green"
                ? "bg-green-400"
                : connectionStatus.color === "yellow"
                ? "bg-yellow-400"
                : "bg-red-400"
            }`}
          >
            <StatusIcon className="h-2.5 w-2.5 text-white m-0.5" />
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
              AI Skills Assistant - {connectionStatus.text}
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Chat Interface */}
      {isOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div
                    className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      connectionStatus.color === "green"
                        ? "bg-green-400"
                        : connectionStatus.color === "yellow"
                        ? "bg-yellow-400"
                        : "bg-red-400"
                    }`}
                  >
                    <StatusIcon className="h-2 w-2 text-white m-0.5" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Skills Matrix AI Assistant
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span
                      className={`flex items-center gap-1 ${
                        connectionStatus.color === "green"
                          ? "text-green-600"
                          : connectionStatus.color === "yellow"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {connectionStatus.text}
                    </span>
                    <span>•</span>
                    <span>{data.length} employees</span>
                    <span>•</span>
                    <span>
                      {[...new Set(data.map((emp) => emp.department))].length}{" "}
                      departments
                    </span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 h-10 w-10 rounded-full"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Welcome Screen with Prompts */}
            {showPrompts && messages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="max-w-4xl w-full space-y-8">
                  {/* Welcome Message */}
                  <div className="text-center space-y-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                      <h2 className="text-4xl font-bold">
                        How can I help you today?
                      </h2>
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      I'm your AI assistant for analyzing employee data and
                      providing strategic insights. Click any prompt below to
                      get started, or type your own question about your
                      workforce.
                    </p>
                  </div>

                  {/* Prewritten Prompts Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {prewrittenPrompts.map((prompt) => (
                      <Button
                        key={prompt.id}
                        variant="outline"
                        className="h-auto min-h-[160px] max-h-[180px] p-4 text-left justify-start hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-gray-300 group relative overflow-hidden"
                        onClick={() => handlePromptClick(prompt.text)}
                        disabled={isLoading}
                      >
                        <div className="flex flex-col items-start gap-3 w-full h-full">
                          <div
                            className={`bg-gradient-to-r ${prompt.gradient} text-white p-2.5 rounded-lg group-hover:scale-105 transition-transform flex-shrink-0`}
                          >
                            {prompt.icon}
                          </div>
                          <div className="space-y-2 flex-1 w-full">
                            <h3
                              className="font-semibold text-gray-800 text-sm leading-tight overflow-hidden"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {prompt.description}
                            </h3>
                            <p
                              className="text-xs text-gray-600 leading-relaxed overflow-hidden break-words"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {prompt.text}
                            </p>
                            <div className="pt-1">
                              <Badge
                                variant="secondary"
                                className="text-[10px] px-2 py-1 truncate max-w-full"
                              >
                                {prompt.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {messages.length > 0 && (
              <div className="flex-1 min-h-0">
                <ScrollArea className="h-full">
                  <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.isUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex gap-4 max-w-[85%] ${
                            message.isUser ? "flex-row-reverse" : "flex-row"
                          }`}
                        >
                          {/* Avatar */}
                          <div className="flex-shrink-0">
                            {message.isUser ? (
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  You
                                </span>
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <Bot className="h-4 w-4 text-gray-600" />
                              </div>
                            )}
                          </div>

                          {/* Message Content */}
                          <div
                            className={`flex flex-col ${
                              message.isUser ? "items-end" : "items-start"
                            }`}
                          >
                            <div
                              className={`${
                                message.isUser
                                  ? "p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                                  : message.isTyping
                                  ? "p-4 rounded-2xl bg-gray-100 text-gray-600 animate-pulse"
                                  : message.type === "employee-list" ||
                                    message.type === "diversity-report" ||
                                    message.type === "analysis" ||
                                    message.type === "detailed-employee-list"
                                  ? "w-full"
                                  : "p-4 rounded-2xl bg-gray-50 text-gray-800 border border-gray-200"
                              }`}
                            >
                              {/* Render different message types */}
                              {!message.isUser &&
                              message.type === "employee-list" &&
                              message.data ? (
                                renderEmployeeList(message.data)
                              ) : !message.isUser &&
                                message.type === "detailed-employee-list" &&
                                message.data ? (
                                renderDetailedEmployeeCards(
                                  message.data.employees
                                )
                              ) : !message.isUser &&
                                message.type === "diversity-report" &&
                                message.data ? (
                                renderDiversityReport(message.data)
                              ) : !message.isUser &&
                                message.type === "analysis" &&
                                message.data ? (
                                renderAnalysisReport(
                                  message.data,
                                  analysisEmployees,
                                  averageExperience,
                                  skillLevelDistribution
                                )
                              ) : (
                                <div
                                  className={`whitespace-pre-wrap leading-relaxed ${
                                    message.isUser
                                      ? "text-sm"
                                      : "text-sm prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-gray-800 prose-strong:font-semibold prose-strong:text-gray-900"
                                  }`}
                                  style={{
                                    fontFamily: message.isUser
                                      ? "inherit"
                                      : "ui-sans-serif, system-ui, -apple-system, sans-serif",
                                    lineHeight: "1.6",
                                  }}
                                >
                                  {message.text}
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 px-1">
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Input Area - Fixed at bottom */}
            <div className="flex-shrink-0 border-t border-gray-200 bg-white px-6 py-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex gap-3 items-end">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Ask me about employees, departments, skills, diversity, performance..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        !e.shiftKey &&
                        handleSendMessage(inputValue)
                      }
                      disabled={isLoading}
                      className="h-12 text-sm border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pr-12 resize-none"
                    />
                  </div>
                  <Button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={isLoading || !inputValue.trim()}
                    className="h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {/* Status indicator */}
                {!isOnline && (
                  <div className="flex items-center gap-2 text-sm text-red-600 mt-2">
                    <WifiOff className="h-4 w-4" />
                    <span>Working offline - using local data analysis</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
