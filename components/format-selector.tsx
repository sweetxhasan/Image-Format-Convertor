"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"

export interface ConversionSettings {
  format: string
  quality: number
  resize: boolean
  width?: number
  height?: number
}

interface FormatSelectorProps {
  onSettingsChange: (settings: ConversionSettings) => void
}

const formats = [
  { name: "JPEG", ext: "jpg", description: "Best for photos", lossy: true },
  { name: "PNG", ext: "png", description: "Best for graphics", lossy: false },
  { name: "WebP", ext: "webp", description: "Modern web format", lossy: true },
  { name: "AVIF", ext: "avif", description: "Next-gen format", lossy: true },
  { name: "GIF", ext: "gif", description: "Animated images", lossy: false },
  { name: "BMP", ext: "bmp", description: "Uncompressed", lossy: false },
]

export function FormatSelector({ onSettingsChange }: FormatSelectorProps) {
  const [selectedFormat, setSelectedFormat] = useState("jpg")
  const [quality, setQuality] = useState([85])
  const [resize, setResize] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 })

  const handleFormatChange = (format: string) => {
    setSelectedFormat(format)
    updateSettings(format, quality[0], resize, dimensions)
  }

  const handleQualityChange = (newQuality: number[]) => {
    setQuality(newQuality)
    updateSettings(selectedFormat, newQuality[0], resize, dimensions)
  }

  const updateSettings = (format: string, qualityValue: number, resizeEnabled: boolean, dims: typeof dimensions) => {
    onSettingsChange({
      format,
      quality: qualityValue,
      resize: resizeEnabled,
      width: resizeEnabled ? dims.width : undefined,
      height: resizeEnabled ? dims.height : undefined,
    })
  }

  const selectedFormatInfo = formats.find((f) => f.ext === selectedFormat)

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Output Format</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {formats.map((format) => (
            <Button
              key={format.ext}
              variant={selectedFormat === format.ext ? "default" : "outline"}
              className="h-auto p-4 flex flex-col items-start gap-2"
              onClick={() => handleFormatChange(format.ext)}
            >
              <div className="flex items-center gap-2 w-full">
                <span className="font-semibold">{format.name}</span>
                {format.lossy && (
                  <Badge variant="secondary" className="text-xs">
                    Lossy
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground text-left">{format.description}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Quality Settings */}
      {selectedFormatInfo?.lossy && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-foreground">Quality</h4>
            <span className="text-sm text-muted-foreground">{quality[0]}%</span>
          </div>
          <Slider value={quality} onValueChange={handleQualityChange} max={100} min={1} step={1} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Smaller file</span>
            <span>Better quality</span>
          </div>
        </div>
      )}

      {/* Resize Options */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <input
            type="checkbox"
            id="resize"
            checked={resize}
            onChange={(e) => {
              setResize(e.target.checked)
              updateSettings(selectedFormat, quality[0], e.target.checked, dimensions)
            }}
            className="h-4 w-4 text-primary border-border focus:ring-primary"
          />
          <label htmlFor="resize" className="text-sm font-medium text-foreground">
            Resize images
          </label>
        </div>

        {resize && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Width</label>
              <input
                type="number"
                value={dimensions.width}
                onChange={(e) => {
                  const newDims = { ...dimensions, width: Number.parseInt(e.target.value) || 0 }
                  setDimensions(newDims)
                  updateSettings(selectedFormat, quality[0], resize, newDims)
                }}
                className="w-full mt-1 px-3 py-2 border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Height</label>
              <input
                type="number"
                value={dimensions.height}
                onChange={(e) => {
                  const newDims = { ...dimensions, height: Number.parseInt(e.target.value) || 0 }
                  setDimensions(newDims)
                  updateSettings(selectedFormat, quality[0], resize, newDims)
                }}
                className="w-full mt-1 px-3 py-2 border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
