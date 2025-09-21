"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ConversionProgressProps {
  isConverting: boolean
  progress: number
  currentFile: string
  totalFiles: number
  completedFiles: number
}

export function ConversionProgress({
  isConverting,
  progress,
  currentFile,
  totalFiles,
  completedFiles,
}: ConversionProgressProps) {
  if (!isConverting) return null

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Converting Images</h3>
          <span className="text-sm text-muted-foreground">
            {completedFiles} of {totalFiles} completed
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground truncate max-w-xs">{currentFile}</span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
          <span>Processing your images...</span>
        </div>
      </div>
    </Card>
  )
}
