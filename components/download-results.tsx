"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ConversionResult } from "@/lib/image-converter"

interface DownloadResultsProps {
  results: ConversionResult[]
  format: string
  onDownloadAll: () => void
  onDownloadSingle: (result: ConversionResult) => void
  onClear: () => void
}

export function DownloadResults({ results, format, onDownloadAll, onDownloadSingle, onClear }: DownloadResultsProps) {
  const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set())

  if (results.length === 0) return null

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const totalOriginalSize = results.reduce((sum, result) => sum + result.originalSize, 0)
  const totalConvertedSize = results.reduce((sum, result) => sum + result.convertedSize, 0)
  const totalSavings = ((totalOriginalSize - totalConvertedSize) / totalOriginalSize) * 100

  const toggleSelection = (resultId: string) => {
    const newSelected = new Set(selectedResults)
    if (newSelected.has(resultId)) {
      newSelected.delete(resultId)
    } else {
      newSelected.add(resultId)
    }
    setSelectedResults(newSelected)
  }

  const selectAll = () => {
    if (selectedResults.size === results.length) {
      setSelectedResults(new Set())
    } else {
      setSelectedResults(new Set(results.map((_, index) => index.toString())))
    }
  }

  return (
    <Card className="p-6 space-y-6">
      {/* Header with Stats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Conversion Complete</h3>
          <Badge variant="default" className="bg-accent text-accent-foreground">
            {results.length} files converted
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/30 border border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{formatFileSize(totalOriginalSize)}</p>
            <p className="text-xs text-muted-foreground">Original Size</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{formatFileSize(totalConvertedSize)}</p>
            <p className="text-xs text-muted-foreground">Converted Size</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">{totalSavings.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Space Saved</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={onDownloadAll} className="flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7,10 12,15 17,10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          Download All ({results.length})
        </Button>

        <Button variant="outline" onClick={selectAll} className="flex items-center gap-2 bg-transparent">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 11H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h5m0-6v6m0-6h7a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-7m0-6v6" />
          </svg>
          {selectedResults.size === results.length ? "Deselect All" : "Select All"}
        </Button>

        <Button
          variant="outline"
          onClick={onClear}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground bg-transparent"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
          Clear Results
        </Button>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {results.map((result, index) => {
          const resultId = index.toString()
          const isSelected = selectedResults.has(resultId)
          const originalName = result.originalFile.name
          const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf("."))
          const newFilename = `${nameWithoutExt}_converted.${format}`

          return (
            <div
              key={index}
              className={`
                flex items-center gap-4 p-4 border transition-all duration-200
                ${isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
              `}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleSelection(resultId)}
                className="h-4 w-4 text-primary border-border focus:ring-primary"
              />

              <div className="flex-shrink-0">
                <img
                  src={result.convertedUrl || "/placeholder.svg"}
                  alt={result.originalFile.name}
                  className="h-12 w-12 object-cover border border-border"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground truncate">{newFilename}</p>
                  <Badge variant="secondary" className="text-xs">
                    {format.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    {formatFileSize(result.originalSize)} → {formatFileSize(result.convertedSize)}
                  </span>
                  <span className="text-accent">{result.compressionRatio.toFixed(1)}% smaller</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => onDownloadSingle(result)} className="h-8 px-3">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7,10 12,15 17,10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(result.convertedUrl, "_blank")}
                  className="h-8 px-3"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
