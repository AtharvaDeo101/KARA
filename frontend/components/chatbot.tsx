"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User, AlertCircle } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AI learning assistant powered by Gemini. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setError(null)

    // Add user message to chat
    const newMessages = [...messages, { role: "user" as const, content: userMessage }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

      // Call backend API for Gemini response
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-10), // Send last 10 messages for context
        }),
      })

      // Get response text for better error messages
      const responseText = await response.text()

      if (!response.ok) {
        let errorMessage = "Failed to get response from chatbot"

        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.detail || errorMessage
        } catch {
          errorMessage = responseText || errorMessage
        }

        // More specific Gemini-related errors
        if (response.status === 500 && errorMessage.includes("Gemini API key")) {
          throw new Error("Gemini API key not configured. Please check backend .env file.")
        } else if (response.status === 504) {
          throw new Error("Request timed out. Please try again.")
        } else if (response.status === 401) {
          throw new Error("Invalid Gemini API key. Please check your configuration.")
        } else {
          throw new Error(errorMessage)
        }
      }

      const data = JSON.parse(responseText)

      // Add assistant response
      setMessages([...newMessages, { role: "assistant", content: data.response }])
      setError(null)
    } catch (err) {
      console.error("Chatbot error:", err)
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"

      setError(errorMessage)

      // Add error message to chat
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: `I'm sorry, I encountered an error: ${errorMessage}\n\nPlease make sure:\n• Backend server is running on port 8000\n• GEMINI_API_KEY is configured in backend/.env\n• You have internet connection`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg hover:scale-110 transition-transform z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Learning Assistant</CardTitle>
                {error && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    Connection issue
                  </p>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about learning..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" size="sm" disabled={isLoading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
            {error && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Tip: Check if backend is running and GEMINI_API_KEY is set
              </p>
            )}
          </div>
        </Card>
      )}
    </>
  )
}