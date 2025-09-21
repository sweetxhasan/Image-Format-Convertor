"use client"

import { useEffect, useState } from "react"

interface AdvancedLoaderProps {
  isLoading: boolean
  progress?: number
  message?: string
  type?: "spinner" | "progress" | "pulse" | "dots"
}

export function AdvancedLoader({
  isLoading,
  progress = 0,
  message = "Loading...",
  type = "spinner",
}: AdvancedLoaderProps) {
  const [dots, setDots] = useState("")

  useEffect(() => {
    if (type === "dots" && isLoading) {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
      }, 500)
      return () => clearInterval(interval)
    }
  }, [type, isLoading])

  if (!isLoading) return null

  const renderLoader = () => {
    switch (type) {
      case "spinner":
        return (
          <div className="flex items-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
            <span className="text-sm text-muted-foreground">{message}</span>
          </div>
        )

      case "progress":
        return (
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{message}</span>
              <span className="text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted h-2 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )

      case "pulse":
        return (
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">{message}</span>
          </div>
        )

      case "dots":
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {message}
              {dots}
            </span>
          </div>
        )

      default:
        return null
    }
  }

  return <div className="flex items-center justify-center p-4">{renderLoader()}</div>
}
