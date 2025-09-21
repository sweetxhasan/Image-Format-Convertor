"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdvancedLoader } from "./advanced-loader"

export interface ConversionStatus {
  id: string
  fileName: string
  status: "pending" | "processing" | "completed" | "error"
  progress: number
  originalSize: number
  convertedSize?: number
  error?: string
}

interface ConversionStatusProps {
  conversions: ConversionStatus[]
  isProcessing: boolean
}

export function ConversionStatus({ conversions, isProcessing }: ConversionStatusProps) {
  if (conversions.length === 0) return null

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusColor = (status: ConversionStatus["status"]) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "processing":
        return "default"
      case "completed":
        return "default"
      case "error":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: ConversionStatus["status"]) => {
    switch (status) {
      case "pending":
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
        )
      case "processing":
        return <div className="animate-spin h-3.5 w-3.5 border border-current border-t-transparent rounded-full"></div>
      case "completed":
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )
      case "error":
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" x2="9" y1="9" y2="15" />
            <line x1="9" x2="15" y1="9" y2="15" />
          </svg>
        )
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Conversion Status</h3>
          {isProcessing && <AdvancedLoader isLoading={true} type="pulse" message="Processing" />}
        </div>

        <div className="space-y-3">
          {conversions.map((conversion) => (
            <div
              key={conversion.id}
              className="flex items-center gap-4 p-3 border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex-shrink-0">{getStatusIcon(conversion.status)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground truncate">{conversion.fileName}</p>
                  <Badge variant={getStatusColor(conversion.status)} className="text-xs">
                    {conversion.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Original: {formatFileSize(conversion.originalSize)}</span>
                  {conversion.convertedSize && (
                    <>
                      <span>•</span>
                      <span>Converted: {formatFileSize(conversion.convertedSize)}</span>
                      <span>•</span>
                      <span className="text-accent">
                        {Math.round(
                          ((conversion.originalSize - conversion.convertedSize) / conversion.originalSize) * 100,
                        )}
                        % smaller
                      </span>
                    </>
                  )}
                </div>

                {conversion.status === "processing" && (
                  <div className="mt-2">
                    <div className="w-full bg-muted h-1 overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${conversion.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {conversion.error && <p className="text-xs text-destructive mt-1">{conversion.error}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
