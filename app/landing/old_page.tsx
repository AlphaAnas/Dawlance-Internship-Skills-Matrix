// "use client"

// import { useState } from "react"
// import { motion } from "framer-motion"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import {
//   Search,
//   Plus,
//   Users,
//   BookOpen,
//   Building2,
//   TrendingUp,
//   Target,
//   Award,
//   MoreHorizontal,
//   ArrowRight,
//   Folder,
//   Star,
//   Sparkles,
  
// } from "lucide-react"
// import { useRouter } from "next/navigation"
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// export default function Dashboard() {
//   const [selectedMatrix, setSelectedMatrix] = useState<string | null>(null)
//   const router = useRouter()
//   const kpiData = [
//     {
//       title: "Recent Skills Matrices",
//       count: "24",
//       percentage: "15% Updated",
//       size: "This Month",
//       icon: Target,
//       color: "from-emerald-400 to-emerald-600",
//     },
//     {
//       title: "Total Employees",
//       count: "1,247",
//       percentage: "8% Growth",
//       size: "This Quarter",
//       icon: Users,
//       color: "from-purple-400 to-purple-600",
//     },
//     {
//       title: "Skills Matrices",
//       count: "89",
//       percentage: "12% Active",
//       size: "Departments",
//       icon: BookOpen,
//       color: "from-blue-400 to-blue-600",
//     },
//     {
//       title: "Departments",
//       count: "16",
//       percentage: "100% Coverage",
//       size: "All Active",
//       icon: Building2,
//       color: "from-orange-400 to-orange-600",
//     },
//     {
//       title: "Skill Assessments",
//       count: "456",
//       percentage: "23% Completed",
//       size: "This Month",
//       icon: Award,
//       color: "from-rose-400 to-rose-600",
//     },
//     {
//       title: "Training Programs",
//       count: "32",
//       percentage: "18% In Progress",
//       size: "Active",
//       icon: TrendingUp,
//       color: "from-cyan-400 to-cyan-600",
//     },
//   ]

// const skillsMatrices = [
//   { id: 1, name: "Sheet Metal Fabrication", files: 45, department: "Sheet Metal" },
//   { id: 2, name: "Compressor Installation", files: 38, department: "Refrigeration Systems" },
//   { id: 3, name: "Electrical Wiring Standards", files: 22, department: "Electrical" },
//   { id: 4, name: "Assembly Line Operations", files: 31, department: "Assembly" },
//   { id: 5, name: "Workplace Safety Training", files: 18, department: "Health & Safety" },
//   { id: 6, name: "Quality Inspection Procedures", files: 29, department: "Quality Control" },
//   { id: 7, name: "Powder Coating Process", files: 26, department: "Paint & Coating" },
//   { id: 8, name: "Packaging and Logistics", files: 19, department: "Logistics" },
// ];

//   const skillsGrowthData = [
//     { month: "Jan", skills: 65, assessments: 45 },
//     { month: "Feb", skills: 72, assessments: 52 },
//     { month: "Mar", skills: 78, assessments: 58 },
//     { month: "Apr", skills: 85, assessments: 65 },
//     { month: "May", skills: 89, assessments: 72 },
//     { month: "Jun", skills: 94, assessments: 78 },
//   ]

//   const floatingShapes = [
//     { id: 1, size: "w-16 h-16", position: "top-20 left-20", delay: 0 },
//     { id: 2, size: "w-12 h-12", position: "top-40 right-32", delay: 0.5 },
//     { id: 3, size: "w-20 h-20", position: "bottom-32 left-16", delay: 1 },
//     { id: 4, size: "w-8 h-8", position: "bottom-20 right-20", delay: 1.5 },
//   ]

//   const handleMatrixClick = (matrixId: number, matrixName: string) => {
//     setSelectedMatrix(matrixName)
//     // Navigate to skills matrix page
//     console.log(`Navigating to skills matrix: ${matrixName}`)
//   }

//   return (
//     <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-100 via-blue-100 to-purple-200">
//       {/* Animated Background Shapes */}
//       {floatingShapes.map((shape) => (
//         <motion.div
//           key={shape.id}
//           className={`absolute ${shape.size} ${shape.position} rounded-3xl bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm`}
//           animate={{
//             y: [0, -20, 0],
//             rotate: [0, 180, 360],
//             scale: [1, 1.1, 1],
//           }}
//           transition={{
//             duration: 8,
//             delay: shape.delay,
//             repeat: Number.POSITIVE_INFINITY,
//             ease: "easeInOut",
//           }}
//         />
//       ))}

//       {/* Decorative Elements */}
//       <motion.div
//         animate={{ rotate: 360 }}
//         transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
//         className="absolute top-8 left-8"
//       >
//         <Star className="w-6 h-6 text-blue-400/60" />
//       </motion.div>

//       <motion.div
//         animate={{ scale: [1, 1.2, 1] }}
//         transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
//         className="absolute bottom-16 right-16"
//       >
//         <Sparkles className="w-5 h-5 text-purple-400/60" />
//       </motion.div>

    

//       <div className="p-6">
//         {/* Top Section */}
//         <motion.div
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//           className="mb-8"
//         >
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-medium text-gray-800">All Metrics</h2>
//             <div className="flex items-center space-x-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
//                 <Input
//                   placeholder="Search..."
//                   className="pl-10 w-64 bg-white/70 border-white/60 text-gray-800 placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-200"
//                 />
//               </div>
//               <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0">
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add Matrix
//               </Button>
//             </div>
//           </div>

//           {/* KPI Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {kpiData.map((item, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ duration: 0.6, delay: 0.1 * index }}
//                 whileHover={{ scale: 1.02 }}
//               >
//                 <Card className="bg-white/70 backdrop-blur-md border-white/60 hover:bg-white/80 transition-all duration-300 shadow-lg">
//                   <CardContent className="p-6">
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <div
//                           className={`w-12 h-12 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center mb-4`}
//                         >
//                           <item.icon className="w-6 h-6 text-white" />
//                         </div>
//                         <h3 className="font-medium text-gray-800 mb-1">{item.title}</h3>
//                         <p className="text-sm text-gray-600 mb-2">{item.percentage}</p>
//                         <p className="text-2xl font-bold text-gray-900">{item.count}</p>
//                         <p className="text-sm text-gray-600">{item.size}</p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Skills Matrices Section */}
//           <motion.div
//             initial={{ x: -20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ duration: 0.6, delay: 0.4 }}
//             className="lg:col-span-2"
//           >
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-lg font-medium text-gray-800">All Skills Matrices</h2>
//               <Button variant="ghost" 
//                 onClick={() => router.push("/skills-mapping")}
//               className="text-gray-700 hover:text-gray-900 hover:bg-white/50">
//                 View All
//                 <ArrowRight className="w-4 h-4 ml-2" />
//               </Button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {skillsMatrices.map((matrix, index) => (
//                 <motion.div
//                   key={matrix.id}
//                   initial={{ y: 20, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ duration: 0.6, delay: 0.1 * index }}
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   <Card
//                     className="bg-white/70 backdrop-blur-md border-white/60 hover:bg-white/80 transition-all duration-300 cursor-pointer shadow-lg"
//                     onClick={() => handleMatrixClick(matrix.id, matrix.name)}
//                   >
//                     <CardContent className="p-6">
//                       <div className="flex items-start justify-between mb-4">
//                         <div className="flex items-center space-x-3">
//                           <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
//                             <Folder className="w-6 h-6 text-white" />
//                           </div>
//                           <div>
//                             <h3 className="font-medium text-gray-800">{matrix.name}</h3>
//                             <p className="text-sm text-gray-600">{matrix.files} Skills</p>
//                           </div>
//                         </div>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="text-gray-500 hover:text-gray-700 hover:bg-white/30"
//                         >
//                           <MoreHorizontal className="w-4 h-4" />
//                         </Button>
//                       </div>
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-600">{matrix.department}</span>
//                         <span className="font-medium text-gray-800">{matrix.size}</span>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           {/* Skills Growth Chart */}
//           <motion.div
//             initial={{ x: 20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ duration: 0.6, delay: 0.6 }}
//             className="lg:col-span-1"
//           >
//             <Card className="bg-white/70 backdrop-blur-md border-white/60 shadow-lg">
//               <CardHeader>
//                 <CardTitle className="text-lg font-medium text-gray-800">Skills Growth</CardTitle>
//                 <p className="text-sm text-gray-600">Monthly skills development progress</p>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={skillsGrowthData}>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                       <XAxis
//                         dataKey="month"
//                         axisLine={false}
//                         tickLine={false}
//                         tick={{ fill: "#64748b", fontSize: 12 }}
//                       />
//                       <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
//                       <Tooltip
//                         contentStyle={{
//                           backgroundColor: "rgba(255, 255, 255, 0.9)",
//                           border: "none",
//                           borderRadius: "8px",
//                           boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//                         }}
//                       />
//                       <Line
//                         type="monotone"
//                         dataKey="skills"
//                         stroke="#3b82f6"
//                         strokeWidth={3}
//                         dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
//                         name="Skills Matrices"
//                       />
//                       <Line
//                         type="monotone"
//                         dataKey="assessments"
//                         stroke="#8b5cf6"
//                         strokeWidth={3}
//                         dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
//                         name="Assessments"
//                       />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>

//                 <div className="mt-4 space-y-2">
//                   <div className="flex items-center justify-between text-sm">
//                     <div className="flex items-center space-x-2">
//                       <div className="w-3 h-3 rounded-full bg-blue-500"></div>
//                       <span className="text-gray-600">Skills Matrices</span>
//                     </div>
//                     <span className="font-medium text-gray-800">94</span>
//                   </div>
//                   <div className="flex items-center justify-between text-sm">
//                     <div className="flex items-center space-x-2">
//                       <div className="w-3 h-3 rounded-full bg-purple-500"></div>
//                       <span className="text-gray-600">Assessments</span>
//                     </div>
//                     <span className="font-medium text-gray-800">78</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   )
// }
