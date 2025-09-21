"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface UploadedFile {
  file: File
  preview: string
  id: string
}

interface FileUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void
  maxFiles?: number
}

export function FileUpload({ onFilesUploaded, maxFiles = 10 }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substr(2, 9),
      }))

      const updatedFiles = [...uploadedFiles, ...newFiles].slice(0, maxFiles)
      setUploadedFiles(updatedFiles)
      onFilesUploaded(updatedFiles)
    },
    [uploadedFiles, maxFiles, onFilesUploaded],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".webp", ".tiff", ".svg"],
    },
    maxFiles: maxFiles - uploadedFiles.length,
    disabled: uploadedFiles.length >= maxFiles,
  })

  const removeFile = (id: string) => {
    const updatedFiles = uploadedFiles.filter((file) => file.id !== id)
    setUploadedFiles(updatedFiles)
    onFilesUploaded(updatedFiles)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="w-full space-y-6">
      {/* Upload Area */}
      <Card className="p-8">
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-none p-12 text-center cursor-pointer transition-all duration-200
            ${
              isDragActive
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-border hover:border-primary/50 hover:bg-muted/30"
            }
            ${uploadedFiles.length >= maxFiles ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-primary/10 text-primary">
              <svg
                width="48"
                height="48"
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
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                {isDragActive ? "Drop your images here" : "Upload your images"}
              </h3>
              <p className="text-muted-foreground font-manrope">Drag and drop your images here, or click to browse</p>
              <p className="text-sm text-muted-foreground">Supports: JPEG, PNG, GIF, BMP, WebP, TIFF, SVG</p>
            </div>

            {uploadedFiles.length < maxFiles && (
              <Button variant="outline" className="mt-4 bg-transparent">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                Choose Files
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Uploaded Files ({uploadedFiles.length})</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setUploadedFiles([])
                onFilesUploaded([])
              }}
            >
              Clear All
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {uploadedFiles.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className="group relative border border-border p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <img
                      src={uploadedFile.preview || "/placeholder.svg"}
                      alt={uploadedFile.file.name}
                      className="h-12 w-12 object-cover border border-border"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{uploadedFile.file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(uploadedFile.file.size)}</p>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {uploadedFile.file.type.split("/")[1].toUpperCase()}
                    </Badge>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFile(uploadedFile.id)}
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
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
