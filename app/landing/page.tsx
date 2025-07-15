"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { 
  Users, 
  Building2, 
  TrendingUp, 
  Award, 
  BarChart3, 
  PieChart, 
  ArrowRight, 
  Zap,
  Target,
  Shield,
  ChevronRight,
  Star,
  Activity,
  Calendar,
  Briefcase,
  Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { enhancedEmployees, enhancedDepartments } from "../data/enhancedMockData"
import { useTheme } from "../components/ThemeProvider"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

const floatingAnimation = {
  y: [-10, 10, -10],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

export default function LandingPage() {
  const router = useRouter()
  const { isDark } = useTheme()
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalSkills: 0,
    averageSkillLevel: 0,
    skillCoverage: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  // Calculate statistics
  useEffect(() => {
    setTimeout(() => {
      const totalEmployees = enhancedEmployees.length
      const totalDepartments = enhancedDepartments.length
      
      // Calculate total unique skills
      const allSkills = new Set()
      enhancedEmployees.forEach(emp => {
        if (emp.skills) {
          Object.keys(emp.skills).forEach(skill => allSkills.add(skill))
        }
      })
      
      // Calculate average skill level
      let totalSkillPoints = 0
      let skillCount = 0
      let totalPossibleSkills = 0
      
      enhancedEmployees.forEach(emp => {
        if (emp.skills) {
          Object.values(emp.skills).forEach(level => {
            totalPossibleSkills++
            if (level !== "None") {
              skillCount++
              switch (level) {
                case "Highly Skilled": totalSkillPoints += 100; break
                case "Skilled": totalSkillPoints += 75; break
                case "Semi Skilled": totalSkillPoints += 50; break
                case "Low Skilled": totalSkillPoints += 25; break
                default: totalSkillPoints += 0
              }
            }
          })
        }
      })

      setStats({
        totalEmployees,
        totalDepartments,
        totalSkills: allSkills.size,
        averageSkillLevel: skillCount > 0 ? Math.round(totalSkillPoints / skillCount) : 0,
        skillCoverage: totalPossibleSkills > 0 ? Math.round((skillCount / totalPossibleSkills) * 100) : 0
      })
      setIsLoading(false)
    }, 1000)
  }, [])

  const departmentData = enhancedDepartments.map(dept => ({
    name: dept.name,
    employeeCount: enhancedEmployees.filter(emp => emp.departmentId === dept.id).length,
    color: [
      "bg-blue-500",
      "bg-green-500", 
      "bg-purple-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-indigo-500"
    ][parseInt(dept.id) % 6]
  }))

  const features = [
    {
      icon: Users,
      title: "Employee Management",
      description: "Track and manage employee skills across your organization",
      color: "blue"
    },
    {
      icon: BarChart3,
      title: "Skills Analytics",
      description: "Get insights into skill gaps and training needs",
      color: "green"
    },
    {
      icon: Target,
      title: "Performance Tracking",
      description: "Monitor skill development and career progression",
      color: "purple"
    },
    {
      icon: Shield,
      title: "Data Security",
      description: "Enterprise-grade security for your sensitive data",
      color: "red"
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-600 to-blue-700",
      green: "from-green-600 to-green-700",
      purple: "from-purple-600 to-purple-700",
      red: "from-red-600 to-red-700",
      yellow: "from-yellow-600 to-yellow-700",
      indigo: "from-indigo-600 to-indigo-700"
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  // Animated counter component
  const AnimatedCounter = ({ end, duration = 2, suffix = "" }: { end: number, duration?: number, suffix?: string }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      if (isLoading) return
      
      let startTime: number
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = (timestamp - startTime) / (duration * 1000)
        
        if (progress < 1) {
          setCount(Math.floor(end * progress))
          requestAnimationFrame(animate)
        } else {
          setCount(end)
        }
      }
      
      requestAnimationFrame(animate)
    }, [end, duration, isLoading])

    return <span>{count.toLocaleString()}{suffix}</span>
  }

  return (
    <div className={`min-h-screen ${
      isDark 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
        : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
    }`}>
      {/* Hero Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative px-6 pt-20 pb-16 sm:px-8 lg:px-12"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={floatingAnimation}
            className={`absolute top-20 left-10 w-72 h-72 ${isDark ? "bg-blue-500/10" : "bg-blue-500/20"} rounded-full blur-3xl`}
          />
          <motion.div
            animate={{...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1 }}}
            className={`absolute bottom-20 right-10 w-96 h-96 ${isDark ? "bg-purple-500/10" : "bg-purple-500/20"} rounded-full blur-3xl`}
          />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div variants={itemVariants} className="mb-8">
              <Badge className="mb-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 text-sm">
                <Zap className="w-4 h-4 mr-2" />
                Skills Matrix Portal - Dawlance Factory
              </Badge>
              <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                Empower Your{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Workforce
                </span>
              </h1>
              <p className={`mt-6 text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}>
                Transform your employee skill management with our comprehensive skills matrix platform. 
                Track, analyze, and optimize your team's capabilities across all departments.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg shadow-xl"
                onClick={() => router.push('/employees')}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
             
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Live Statistics Dashboard */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="px-6 py-16 sm:px-8 lg:px-12"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className={`text-3xl sm:text-4xl font-bold ${isDark ? "text-white" : "text-gray-900"} mb-4`}>
              Live Dashboard
            </h2>
            <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Real-time insights into your organization's skill landscape
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                title: "Total Employees",
                value: stats.totalEmployees,
                icon: Users,
                color: "blue",
                suffix: "",
                description: "Active workforce members",
                change: "+12%"
              },
              {
                title: "Departments",
                value: stats.totalDepartments,
                icon: Building2,
                color: "green",
                suffix: "",
                description: "Organizational divisions",
                change: "Stable"
              },
              {
                title: "Unique Skills",
                value: stats.totalSkills,
                icon: Award,
                color: "purple",
                suffix: "",
                description: "Tracked competencies",
                change: "+8%"
              },
              {
                title: "Avg. Skill Level",
                value: stats.averageSkillLevel,
                icon: TrendingUp,
                color: "indigo",
                suffix: "%",
                description: "Overall proficiency",
                change: "+5%"
              },
              {
                title: "Skill Coverage",
                value: stats.skillCoverage,
                icon: Target,
                color: "yellow",
                suffix: "%",
                description: "Skills filled ratio",
                change: "+15%"
              }
            ].map((stat, index) => (
              <motion.div key={stat.title} variants={itemVariants}>
                <Card className={`h-full border-0 ${
                  isDark ? "bg-gray-800/50 backdrop-blur-sm" : "bg-white/70 backdrop-blur-sm"
                } shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-105`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${getColorClasses(stat.color)} shadow-lg`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-green-600 bg-green-50">
                        {stat.change}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <h3 className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        {stat.title}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        {isLoading ? (
                          <div className={`h-8 w-16 ${isDark ? "bg-gray-700" : "bg-gray-200"} rounded animate-pulse`} />
                        ) : (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                            className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                          >
                            <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                          </motion.span>
                        )}
                      </div>
                      <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                        {stat.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Interactive Department Visualization */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="px-6 py-16 sm:px-8 lg:px-12"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className={`text-3xl sm:text-4xl font-bold ${isDark ? "text-white" : "text-gray-900"} mb-4`}>
              Department Overview
            </h2>
            <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Interactive visualization of employee distribution across departments
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Department Cards */}
            <motion.div variants={itemVariants} className="space-y-4">
              {departmentData.map((dept, index) => (
                <motion.div
                  key={dept.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-6 rounded-xl border ${
                    isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/70 border-gray-200"
                  } hover:shadow-xl transition-all duration-300 group cursor-pointer relative overflow-hidden`}
                  onClick={() => router.push('/department-overview')}
                >
                  <div className={`absolute inset-0 ${dept.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full ${dept.color} shadow-lg`} />
                        <div>
                          <h3 className={`font-semibold text-lg ${isDark ? "text-white" : "text-gray-900"}`}>
                            {dept.name}
                          </h3>
                          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            <Users className="inline w-4 h-4 mr-1" />
                            {dept.employeeCount} employees
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`px-4 py-2 rounded-full ${dept.color} text-white font-bold text-lg shadow-lg`}>
                          {dept.employeeCount}
                        </div>
                        <ChevronRight className={`h-5 w-5 ${isDark ? "text-gray-400" : "text-gray-600"} group-hover:translate-x-1 transition-transform`} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Animated Circular Chart */}
            <motion.div variants={itemVariants} className="flex justify-center">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  className="w-80 h-80 relative"
                >
                  {departmentData.map((dept, index) => {
                    const angle = (index / departmentData.length) * 360
                    const radius = 120
                    const x = Math.cos((angle * Math.PI) / 180) * radius
                    const y = Math.sin((angle * Math.PI) / 180) * radius
                    
                    return (
                      <motion.div
                        key={dept.name}
                        className={`absolute w-16 h-16 ${dept.color} rounded-full flex items-center justify-center shadow-xl cursor-pointer`}
                        style={{
                          left: `calc(50% + ${x}px - 32px)`,
                          top: `calc(50% + ${y}px - 32px)`,
                        }}
                        whileHover={{ scale: 1.3, zIndex: 10 }}
                        title={`${dept.name}: ${dept.employeeCount} employees`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 1, type: "spring" }}
                      >
                        <span className="text-white font-bold text-lg">{dept.employeeCount}</span>
                      </motion.div>
                    )
                  })}
                </motion.div>
                
                {/* Center Hub */}
                <div className={`absolute inset-0 flex items-center justify-center`}>
                  <motion.div 
                    className={`w-24 h-24 rounded-full border-4 ${
                      isDark ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"
                    } flex items-center justify-center shadow-2xl`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="text-center">
                      <Building2 className={`h-8 w-8 mx-auto mb-1 ${isDark ? "text-white" : "text-gray-900"}`} />
                      <p className={`text-xs font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                        {stats.totalDepartments} Depts
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Platform Features */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="px-6 py-16 sm:px-8 lg:px-12"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className={`text-3xl sm:text-4xl font-bold ${isDark ? "text-white" : "text-gray-900"} mb-4`}>
              Platform Capabilities
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Everything you need to manage and optimize your workforce skills effectively
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -10, rotateY: 5 }}
                className="group"
              >
                <Card className={`h-full border-0 ${
                  isDark ? "bg-gray-800/50 backdrop-blur-sm" : "bg-white/70 backdrop-blur-sm"
                } shadow-xl hover:shadow-2xl transition-all duration-500`}>
                  <CardContent className="p-8 text-center">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${getColorClasses(feature.color)} mb-6 shadow-lg`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className={`text-xl font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                      {feature.title}
                    </h3>
                    <p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Quick Access Modules */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="px-6 py-16 sm:px-8 lg:px-12"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className={`text-3xl sm:text-4xl font-bold ${isDark ? "text-white" : "text-gray-900"} mb-4`}>
              Quick Access
            </h2>
            <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Jump directly to key modules of the platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Skills Mapping",
                description: "View and edit employee skill levels",
                icon: BarChart3,
                route: "/skills-mapping",
                color: "blue"
              },
              {
                title: "Employee Directory",
                description: "Browse all employees and their details",
                icon: Users,
                route: "/employees",
                color: "green"
              },
              {
                title: "Department Overview",
                description: "Analyze department-wise statistics",
                icon: Building2,
                route: "/department-overview",
                color: "purple"
              },
              {
                title: "Staffing Assignment",
                description: "Assign workers to machines optimally",
                icon: Briefcase,
                route: "/staffing-assignment",
                color: "red"
              },
              {
                title: "Matrix Creator",
                description: "Create custom skills matrices",
                icon: Globe,
                route: "/skills_matrix_maker",
                color: "yellow"
              },
              {
                title: "Analytics Dashboard",
                description: "View comprehensive reports",
                icon: PieChart,
                route: "/employees",
                color: "indigo"
              }
            ].map((module, index) => (
              <motion.div
                key={module.title}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card 
                  className={`h-full border-0 ${
                    isDark ? "bg-gray-800/50 backdrop-blur-sm" : "bg-white/70 backdrop-blur-sm"
                  } shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group`}
                  onClick={() => router.push(module.route)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${getColorClasses(module.color)} shadow-lg group-hover:scale-110 transition-transform`}>
                        <module.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold text-lg mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                          {module.title}
                        </h3>
                        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mb-4`}>
                          {module.description}
                        </p>
                        <div className="flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                          Access Module
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="px-6 py-20 sm:px-8 lg:px-12"
      >
        <motion.div 
          variants={itemVariants}
          className={`max-w-4xl mx-auto text-center p-12 rounded-3xl relative overflow-hidden ${
            isDark 
              ? "bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-gray-700" 
              : "bg-gradient-to-r from-blue-600 to-purple-600"
          } shadow-2xl`}
        >
          {/* Background Animation */}
          <div className="absolute inset-0">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360] 
              }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-xl"
            />
            <motion.div
              animate={{ 
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0] 
              }}
              transition={{ 
                duration: 15, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-xl"
            />
          </div>

          <div className="relative z-10">
            <motion.div
              animate={floatingAnimation}
              className="mb-8"
            >
              <Star className="h-16 w-16 text-white mx-auto" />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Workforce Management?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join the digital transformation of workforce management. Start optimizing your team's potential today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl"
                onClick={() => router.push('/login')}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Start Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                onClick={() => router.push('/skills-mapping')}
              >
                Explore Platform
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.section>
    </div>
  )
}