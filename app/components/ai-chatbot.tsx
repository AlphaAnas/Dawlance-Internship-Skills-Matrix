"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Bot, X, Send, MessageCircle, Clock, Users, Award, Building2, Wifi, WifiOff, Zap, AlertCircle } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

interface Employee {
  id: string | number
  name: string
  department: string
  skillLevel: string
  performanceScore?: number
  gender: string
  yearsExperience?: number
  title?: string
}

interface AIChatbotProps {
  data: Employee[]
}

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  isTyping?: boolean
}

interface PrewrittenPrompt {
  id: string
  text: string
  icon: React.ReactNode
  description: string
  category: string
  color: string
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AIChatbot({ data }: AIChatbotProps) {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // ============================================================================
  // PREDEFINED PROMPTS CONFIGURATION
  // ============================================================================

  const prewrittenPrompts: PrewrittenPrompt[] = [
    {
      id: "top-sheet-molding",
      text: "Give me top 10 employees of Sheet Molding department",
      icon: <Users className="h-4 w-4" />,
      description: "Top Sheet Molding Performers",
      category: "Department",
      color: "bg-blue-500",
    },
    {
      id: "skill-distribution",
      text: "What is the skill level distribution across all departments?",
      icon: <Award className="h-4 w-4" />,
      description: "Skill Level Breakdown",
      category: "Skills",
      color: "bg-purple-500",
    },
    {
      id: "gender-diversity",
      text: "Show me gender diversity statistics by department",
      icon: <Users className="h-4 w-4" />,
      description: "Gender Diversity Report",
      category: "Diversity",
      color: "bg-green-500",
    },
    {
      id: "experience-analysis",
      text: "Which employees have the most experience in high-skill positions?",
      icon: <Clock className="h-4 w-4" />,
      description: "Experience Analysis",
      category: "Experience",
      color: "bg-orange-500",
    },
  ]

  // ============================================================================
  // EFFECTS & LIFECYCLE
  // ============================================================================

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // ============================================================================
  // STATUS HELPERS
  // ============================================================================

  const getConnectionStatus = () => {
    if (!isOnline) return { status: "offline", color: "red", icon: WifiOff, text: "Offline" }
    // Always show as enhanced since API key is handled server-side
    return { status: "online", color: "green", icon: Wifi, text: "AI Enhanced" }
  }

  // ============================================================================
  // MESSAGE MANAGEMENT
  // ============================================================================

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message])
  }

  // ============================================================================
  // DATA PROCESSING & ANALYSIS
  // ============================================================================

  const processEmployeeQuery = (prompt: string): string => {
    const normalizeSkillLevel = (skillLevel: string | undefined) => {
      if (!skillLevel) return ""
      if (skillLevel === "Expert" || skillLevel === "Advanced") return "Advanced"
      return skillLevel
    }

    // Sheet Molding department analysis
    if (prompt.toLowerCase().includes("sheet molding") || prompt.toLowerCase().includes("sheet metal")) {
      const sheetMoldingEmployees = data.filter(
        (emp) =>
          emp.department?.toLowerCase().includes("sheet") ||
          emp.department?.toLowerCase().includes("molding") ||
          emp.department?.toLowerCase().includes("metal"),
      )

      if (sheetMoldingEmployees.length === 0) {
        return (
          "❌ **No Sheet Molding employees found.**\n\n📋 **Available departments:**\n" +
          [...new Set(data.map((emp) => emp.department))].map((dept) => `• ${dept}`).join("\n")
        )
      }

      // Sort by skill level and experience
      const sortedEmployees = sheetMoldingEmployees
        .sort((a, b) => {
          const skillOrder = { Advanced: 4, Expert: 4, High: 3, Medium: 2, Low: 1 }
          const aSkill = skillOrder[a.skillLevel as keyof typeof skillOrder] || 0
          const bSkill = skillOrder[b.skillLevel as keyof typeof skillOrder] || 0

          if (aSkill !== bSkill) return bSkill - aSkill
          return (b.yearsExperience || 0) - (a.yearsExperience || 0)
        })
        .slice(0, 10)

      let response = `🏆 **TOP ${sortedEmployees.length} SHEET MOLDING EMPLOYEES**\n\n`

      sortedEmployees.forEach((emp, index) => {
        const normalizedSkill = normalizeSkillLevel(emp.skillLevel)
        response += `**${index + 1}. ${emp.name}**\n`
        response += `   🎯 **Skill Level:** ${normalizedSkill}\n`
        response += `   ⏱️ **Experience:** ${emp.yearsExperience || "N/A"} years\n`
        response += `   💼 **Title:** ${emp.title || "N/A"}\n`
        response += `   👤 **Gender:** ${emp.gender}\n\n`
      })

      return response
    }

    // Skill distribution analysis
    if (prompt.toLowerCase().includes("skill level distribution") || prompt.toLowerCase().includes("skill breakdown")) {
      const skillCounts = data.reduce(
        (acc, emp) => {
          const skill = normalizeSkillLevel(emp.skillLevel)
          acc[skill] = (acc[skill] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      let response = "📊 **SKILL LEVEL DISTRIBUTION**\n\n"
      const total = data.length

      Object.entries(skillCounts)
        .sort(([, a], [, b]) => b - a)
        .forEach(([skill, count]) => {
          const percentage = ((count / total) * 100).toFixed(1)
          const bar = "█".repeat(Math.round((count / total) * 20))
          response += `**${skill}:** ${count} employees (${percentage}%)\n${bar}\n\n`
        })

      response += `📈 **Total Employees:** ${total}`
      return response
    }

    // Gender diversity analysis
    if (prompt.toLowerCase().includes("gender diversity") || prompt.toLowerCase().includes("gender statistics")) {
      const departments = [...new Set(data.map((emp) => emp.department))]
      let response = "👥 **GENDER DIVERSITY BY DEPARTMENT**\n\n"

      departments.forEach((dept) => {
        const deptEmployees = data.filter((emp) => emp.department === dept)
        const maleCount = deptEmployees.filter((emp) => emp.gender === "Male").length
        const femaleCount = deptEmployees.filter((emp) => emp.gender === "Female").length
        const total = deptEmployees.length

        if (total > 0) {
          const femalePercentage = ((femaleCount / total) * 100).toFixed(1)
          const malePercentage = ((maleCount / total) * 100).toFixed(1)

          response += `**${dept}** (${total} employees)\n`
          response += `   👨 **Male:** ${maleCount} (${malePercentage}%)\n`
          response += `   👩 **Female:** ${femaleCount} (${femalePercentage}%)\n\n`
        }
      })

      return response
    }

    // Default comprehensive response
    return `🤖 **AI EMPLOYEE ASSISTANT READY!**

🔍 **What I can analyze:**
• 👥 **Department Performance** - Top performers by department
• 🎯 **Skill Distributions** - Skill level breakdowns and analysis  
• 📊 **Diversity Metrics** - Gender diversity across departments
• ⏱️ **Experience Analysis** - Experience vs skill correlations
• 🏢 **Department Comparisons** - Performance between departments
• 📈 **Training Insights** - Identify skill development needs

📋 **Current Dataset:**
• **Total Employees:** ${data.length}
• **Departments:** ${[...new Set(data.map((emp) => emp.department))].length}
• **Skill Levels:** ${[...new Set(data.map((emp) => emp.skillLevel))].join(", ")}

💡 **Quick Start:** Click any suggested question below, or ask me anything about your employee data!`
  }

  // ============================================================================
  // AI SERVICE INTEGRATION - SERVER-SIDE API
  // ============================================================================

  const callAIService = async (prompt: string): Promise<string> => {
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
    }

    const maxRetries = 3
    const baseDelay = 1000 // 1 second

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Call our API route instead of directly calling Gemini
        const response = await fetch('/api/chat', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an advanced AI assistant analyzing employee data for a manufacturing company.

**Context Data:**
${JSON.stringify(contextData, null, 2)}

**User Query:** ${prompt}

**Instructions:**
- Provide detailed, actionable insights based on the employee data
- Use markdown formatting with **bold text** and bullet points for clarity
- Include specific numbers, percentages, and concrete recommendations
- If analyzing trends, suggest actionable next steps
- Be comprehensive but concise
- Focus on business value and practical insights
- Use emojis for better readability

**Response Format:** Provide structured analysis with clear sections and actionable recommendations.`,
                  },
                ],
              },
            ],
          }),
        })

        // Handle different HTTP status codes appropriately
        if (response.status === 429) {
          // Rate limit exceeded - wait and retry
          const retryDelay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000
          console.log(`Rate limited. Retrying in ${retryDelay}ms (attempt ${attempt + 1}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, retryDelay))
          continue
        }

        const result = await response.json()

        // Check if API returned an error or fallback flag
        if (result.error || result.fallback) {
          throw new Error(result.message || result.error || 'API call failed')
        }

        // Validate response structure
        if (!result.candidates || result.candidates.length === 0) {
          throw new Error("No response candidates returned from AI service")
        }

        const candidate = result.candidates[0]
        
        // Check for safety blocks or finish reasons
        if (candidate.finishReason === "SAFETY") {
          throw new Error("Response blocked due to safety filters")
        }
        
        if (candidate.finishReason === "RECITATION") {
          throw new Error("Response blocked due to recitation concerns")
        }

        const responseText = candidate.content?.parts?.[0]?.text
        
        if (!responseText || responseText.trim().length === 0) {
          throw new Error("Empty response received from AI service")
        }

        return responseText

      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error)
        
        // If it's the last attempt, throw the error
        if (attempt === maxRetries - 1) {
          throw error
        }
        
        // Wait before retrying (exponential backoff)
        const retryDelay = baseDelay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, retryDelay))
      }
    }

    throw new Error("Max retries exceeded")
  }

  // ============================================================================
  // MESSAGE HANDLING
  // ============================================================================

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    }
    addMessage(userMessage)
    setInputValue("")
    setIsLoading(true)

    // Add typing indicator
    const typingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: "🤖 AI is analyzing your request...",
      isUser: false,
      timestamp: new Date(),
      isTyping: true,
    }
    addMessage(typingMessage)

    try {
      let response: string
      const connectionStatus = getConnectionStatus()

      if (connectionStatus.status === "online") {
        // Use API route
        response = await callAIService(message)
      } else {
        // Use local data analysis
        response = processEmployeeQuery(message)
        if (connectionStatus.status === "offline") {
          response = "🔄 **Working Offline** - Using local data analysis\n\n" + response
        }
      }

      // Remove typing indicator and add actual response
      setMessages((prev) => prev.filter((msg) => !msg.isTyping))
      
      const aiMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      }
      addMessage(aiMessage)

    } catch (error) {
      console.error("AI Service Error:", error)
      setMessages((prev) => prev.filter((msg) => !msg.isTyping))

      const errorMessage: Message = {
        id: (Date.now() + 3).toString(),
        text: "⚠️ **AI Service Unavailable** - Using local analysis instead\n\n" + processEmployeeQuery(message),
        isUser: false,
        timestamp: new Date(),
      }
      addMessage(errorMessage)
    }

    setIsLoading(false)
  }

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt)
  }

  // ============================================================================
  // CHAT INITIALIZATION
  // ============================================================================

  const openChat = () => {
    setIsOpen(true)
    if (messages.length === 0) {
      addMessage({
        id: "welcome",
        text: "👋 **Welcome to AI Employee Assistant!**\n\nI'm here to help you analyze your workforce data and provide actionable insights with AI enhancement.\n\n🚀 **Get Started:**\n• Click any suggested question below\n• Or type your own question in the input field\n\n💡 I can provide detailed analysis, trends, and strategic recommendations!",
        isUser: false,
        timestamp: new Date(),
      })
    }
  }

  const connectionStatus = getConnectionStatus()
  const StatusIcon = connectionStatus.icon

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
              {connectionStatus.text}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-5xl h-[85vh] overflow-hidden bg-white shadow-2xl border-0 flex flex-col">
            {/* Header */}
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white flex-shrink-0 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Bot className="h-8 w-8" />
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
                    <CardTitle className="text-xl font-bold">AI Employee Assistant</CardTitle>
                    <CardDescription className="text-blue-100 font-medium flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 ${
                        connectionStatus.color === "green" ? "text-green-200" : 
                        connectionStatus.color === "yellow" ? "text-yellow-200" : "text-red-200"
                      }`}>
                        <StatusIcon className="h-3 w-3" />
                        {connectionStatus.text}
                      </span>
                      • {data.length} employees ready for analysis
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {/* Chat Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col">
                {/* Status Banner */}
                {connectionStatus.status === "offline" && (
                  <div className="p-3 bg-red-50 border-b border-red-200">
                    <div className="flex items-center gap-2 text-sm text-red-800">
                      <StatusIcon className="h-4 w-4" />
                      <span className="font-medium">
                        Working Offline - Using local data analysis only
                      </span>
                    </div>
                  </div>
                )}

                {/* Messages Area */}
                <div className="flex-1 min-h-0">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-4 max-w-4xl mx-auto">
                      {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[80%] p-3 rounded-2xl ${
                              message.isUser
                                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                                : message.isTyping
                                  ? "bg-gray-100 text-gray-600 animate-pulse border border-gray-200"
                                  : "bg-gray-50 text-gray-800 border border-gray-200 shadow-sm"
                            }`}
                          >
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</div>
                            <div className={`text-xs mt-2 ${message.isUser ? "text-blue-100" : "text-gray-500"}`}>
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </div>

                {/* Input Area */}
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex gap-3 max-w-4xl mx-auto">
                    <Input
                      placeholder="Ask me about employees, departments, skills, diversity..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage(inputValue)}
                      disabled={isLoading}
                      className="flex-1 h-11 text-sm border-gray-300 focus:border-blue-500"
                    />
                    <Button
                      onClick={() => handleSendMessage(inputValue)}
                      disabled={isLoading || !inputValue.trim()}
                      className="h-11 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Actions Sidebar */}
              <div className="w-80 border-l bg-gray-50 flex flex-col">
                <div className="p-4 border-b bg-white">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <h3 className="font-bold text-gray-800 text-sm">Quick Questions</h3>
                  </div>
                  <p className="text-xs text-gray-600">
                    Click any question to get instant insights powered by Gemini 2.0.
                  </p>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {prewrittenPrompts.map((prompt) => (
                      <Button
                        key={prompt.id}
                        variant="outline"
                        className="w-full p-3 h-auto text-left justify-start hover:bg-blue-50 hover:border-blue-300 border-gray-200 transition-all duration-200 group"
                        onClick={() => handlePromptClick(prompt.text)}
                        disabled={isLoading}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div
                            className={`${prompt.color} text-white p-2 rounded-md group-hover:scale-110 transition-transform flex-shrink-0`}
                          >
                            {prompt.icon}
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className="font-medium text-gray-800 text-xs mb-1">{prompt.description}</div>
                            <div className="text-xs text-gray-600 leading-relaxed mb-2 line-clamp-2">{prompt.text}</div>
                            <Badge variant="secondary" className="text-xs">
                              {prompt.category}
                            </Badge>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>

                {/* Info Panel */}
                <div className="p-4 border-t bg-white">
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-xs text-blue-800 font-medium mb-1">🚀 AI Enhanced</div>
                      <div className="text-xs text-blue-700">
                        Advanced AI analysis with strategic insights and recommendations!
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Total Employees:</span>
                        <span className="font-medium">{data.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Departments:</span>
                        <span className="font-medium">{[...new Set(data.map((emp) => emp.department))].length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}