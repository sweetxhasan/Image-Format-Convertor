"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileUpload } from "@/components/file-upload"
import { FormatSelector, type ConversionSettings } from "@/components/format-selector"
import { DownloadResults } from "@/components/download-results"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ImageConverter, type ConversionResult } from "@/lib/image-converter"

interface UploadedFile {
  file: File
  preview: string
  id: string
}

export default function HomePage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [conversionSettings, setConversionSettings] = useState<ConversionSettings>({
    format: "jpg",
    quality: 85,
    resize: false,
  })
  const [isConverting, setIsConverting] = useState(false)
  const [conversionResults, setConversionResults] = useState<ConversionResult[]>([])
  const [converter, setConverter] = useState<ImageConverter | null>(null)

  const getConverter = () => {
    if (!converter) {
      setConverter(new ImageConverter())
    }
    return converter
  }

  const handleConvert = async () => {
    if (uploadedFiles.length === 0) return

    setIsConverting(true)
    setConversionResults([])

    try {
      const files = uploadedFiles.map((uf) => uf.file)
      const converterInstance = getConverter()
      if (converterInstance) {
        const results = await converterInstance.convertMultiple(files, conversionSettings)
        setConversionResults(results)
      }
    } catch (error) {
      console.error("Conversion failed:", error)
    } finally {
      setIsConverting(false)
    }
  }

  const handleDownloadAll = () => {
    const converterInstance = getConverter()
    if (converterInstance) {
      converterInstance.downloadMultiple(conversionResults, conversionSettings.format)
    }
  }

  const handleDownloadSingle = (result: ConversionResult) => {
    const converterInstance = getConverter()
    if (converterInstance) {
      const originalName = result.originalFile.name
      const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf("."))
      const newFilename = `${nameWithoutExt}_converted.${conversionSettings.format}`
      converterInstance.downloadFile(result.convertedBlob, newFilename)
    }
  }

  const handleClearResults = () => {
    setConversionResults([])
    setUploadedFiles([])
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section id="home" className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto text-center space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                Professional Image Conversion
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground text-balance leading-tight">
                Advanced Image Format
                <span className="text-primary block"> Converter</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-manrope max-w-3xl mx-auto text-pretty leading-relaxed">
                Convert your images to any format with professional quality and advanced features. Fast, secure, and
                completely free.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 bg-background/50 px-4 py-2 border border-border">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>No file size limits</span>
              </div>
              <div className="flex items-center gap-2 bg-background/50 px-4 py-2 border border-border">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Batch processing</span>
              </div>
              <div className="flex items-center gap-2 bg-background/50 px-4 py-2 border border-border">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Privacy focused</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" className="px-8 py-3 text-base">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="mr-2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                Start Converting
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 text-base bg-transparent">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="mr-2"
                >
                  <polygon points="5,3 19,12 5,21" />
                </svg>
                Watch Demo
              </Button>
            </div>
          </div>
        </section>

        <section id="converter" className="py-16 px-4">
          <div className="container mx-auto max-w-6xl space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Image Converter Tool</h2>
              <p className="text-lg text-muted-foreground font-manrope max-w-2xl mx-auto">
                Upload your images, choose your desired format, and convert with professional quality
              </p>
            </div>

            {/* Upload Section */}
            <div className="bg-muted/30 p-8 border border-border">
              <FileUpload onFilesUploaded={setUploadedFiles} maxFiles={20} />
            </div>

            {/* Settings and Convert */}
            {uploadedFiles.length > 0 && (
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  <FormatSelector onSettingsChange={setConversionSettings} />

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Selected Files ({uploadedFiles.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedFiles.slice(0, 8).map((file) => (
                        <div key={file.id} className="relative group">
                          <div className="aspect-square bg-muted border border-border overflow-hidden">
                            <img
                              src={file.preview || "/placeholder.svg"}
                              alt={file.file.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white text-xs text-center px-2">{file.file.name}</p>
                          </div>
                        </div>
                      ))}
                      {uploadedFiles.length > 8 && (
                        <div className="aspect-square bg-muted border border-border flex items-center justify-center">
                          <p className="text-muted-foreground text-sm">+{uploadedFiles.length - 8} more</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="p-6 bg-primary/5 border-primary/20">
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 text-primary mx-auto mb-4 flex items-center justify-center">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                          >
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Convert</h3>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center py-2 border-b border-border/50">
                          <span className="text-muted-foreground">Files selected:</span>
                          <span className="font-medium text-foreground">{uploadedFiles.length}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border/50">
                          <span className="text-muted-foreground">Output format:</span>
                          <span className="font-medium text-foreground uppercase">{conversionSettings.format}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border/50">
                          <span className="text-muted-foreground">Quality:</span>
                          <span className="font-medium text-foreground">{conversionSettings.quality}%</span>
                        </div>
                        {conversionSettings.resize && (
                          <div className="flex justify-between items-center py-2 border-b border-border/50">
                            <span className="text-muted-foreground">Resize:</span>
                            <span className="font-medium text-foreground">
                              {conversionSettings.width}×{conversionSettings.height}
                            </span>
                          </div>
                        )}
                      </div>

                      <Button onClick={handleConvert} disabled={isConverting} className="w-full" size="lg">
                        {isConverting ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                            Converting...
                          </>
                        ) : (
                          <>
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
                              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                            </svg>
                            Convert Images
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Results */}
            {conversionResults.length > 0 && (
              <div className="bg-muted/30 p-8 border border-border">
                <DownloadResults
                  results={conversionResults}
                  format={conversionSettings.format}
                  onDownloadAll={handleDownloadAll}
                  onDownloadSingle={handleDownloadSingle}
                  onClear={handleClearResults}
                />
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold text-foreground">Why Choose ImageForge?</h2>
              <p className="text-muted-foreground font-manrope max-w-2xl mx-auto">
                Professional-grade image conversion with advanced features and modern design
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  ),
                  title: "Batch Processing",
                  description: "Convert multiple images at once with our advanced batch processing system.",
                },
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  ),
                  title: "Privacy First",
                  description: "All processing happens in your browser. Your images never leave your device.",
                },
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  ),
                  title: "Multiple Formats",
                  description: "Support for JPEG, PNG, WebP, AVIF, GIF, BMP and more formats.",
                },
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    </svg>
                  ),
                  title: "Quality Control",
                  description: "Fine-tune compression settings and resize options for perfect results.",
                },
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  ),
                  title: "Lightning Fast",
                  description: "Optimized conversion engine for maximum speed and efficiency.",
                },
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect width="20" height="14" x="2" y="3" rx="2" ry="2" />
                      <line x1="8" x2="16" y1="21" y2="21" />
                      <line x1="12" x2="12" y1="17" y2="21" />
                    </svg>
                  ),
                  title: "Responsive Design",
                  description: "Works perfectly on desktop, tablet, and mobile devices.",
                },
              ].map((feature, index) => (
                <Card key={index} className="p-6 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-primary/10 text-primary">{feature.icon}</div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground font-manrope text-sm">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
