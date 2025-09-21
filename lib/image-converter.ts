export interface ConversionResult {
  originalFile: File
  convertedBlob: Blob
  convertedUrl: string
  originalSize: number
  convertedSize: number
  compressionRatio: number
}

export interface ConversionSettings {
  format: string
  quality: number
  resize: boolean
  width?: number
  height?: number
}

export class ImageConverter {
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null

  private initCanvas() {
    if (typeof window === "undefined") {
      throw new Error("ImageConverter can only be used in browser environment")
    }

    if (!this.canvas) {
      this.canvas = document.createElement("canvas")
      this.ctx = this.canvas.getContext("2d")!
    }
  }

  async convertImage(file: File, settings: ConversionSettings): Promise<ConversionResult> {
    this.initCanvas()

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        try {
          // Calculate dimensions
          const { width, height } = this.calculateDimensions(img.width, img.height, settings)

          // Set canvas size
          this.canvas!.width = width
          this.canvas!.height = height

          // Clear canvas and draw image
          this.ctx!.clearRect(0, 0, width, height)
          this.ctx!.drawImage(img, 0, 0, width, height)

          // Convert to desired format
          const mimeType = this.getMimeType(settings.format)
          const quality = settings.quality / 100

          this.canvas!.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to convert image"))
                return
              }

              const convertedUrl = URL.createObjectURL(blob)
              const compressionRatio = ((file.size - blob.size) / file.size) * 100

              resolve({
                originalFile: file,
                convertedBlob: blob,
                convertedUrl,
                originalSize: file.size,
                convertedSize: blob.size,
                compressionRatio: Math.max(0, compressionRatio),
              })
            },
            mimeType,
            quality,
          )
        } catch (error) {
          reject(error)
        }
      }

      img.onerror = () => {
        reject(new Error("Failed to load image"))
      }

      img.src = URL.createObjectURL(file)
    })
  }

  private calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    settings: ConversionSettings,
  ): { width: number; height: number } {
    if (!settings.resize || !settings.width || !settings.height) {
      return { width: originalWidth, height: originalHeight }
    }

    const targetWidth = settings.width
    const targetHeight = settings.height
    const aspectRatio = originalWidth / originalHeight

    // Maintain aspect ratio
    if (targetWidth / targetHeight > aspectRatio) {
      return {
        width: Math.round(targetHeight * aspectRatio),
        height: targetHeight,
      }
    } else {
      return {
        width: targetWidth,
        height: Math.round(targetWidth / aspectRatio),
      }
    }
  }

  private getMimeType(format: string): string {
    const mimeTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      bmp: "image/bmp",
      gif: "image/gif",
    }

    return mimeTypes[format.toLowerCase()] || "image/jpeg"
  }

  async convertMultiple(
    files: File[],
    settings: ConversionSettings,
    onProgress?: (progress: number, currentFile: string) => void,
  ): Promise<ConversionResult[]> {
    const results: ConversionResult[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (onProgress) {
        onProgress((i / files.length) * 100, file.name)
      }

      try {
        const result = await this.convertImage(file, settings)
        results.push(result)
      } catch (error) {
        console.error(`Failed to convert ${file.name}:`, error)
        // Continue with other files even if one fails
      }
    }

    if (onProgress) {
      onProgress(100, "Complete")
    }

    return results
  }

  downloadFile(blob: Blob, filename: string) {
    if (typeof window === "undefined") return

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  downloadMultiple(results: ConversionResult[], format: string) {
    results.forEach((result, index) => {
      const originalName = result.originalFile.name
      const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf("."))
      const newFilename = `${nameWithoutExt}_converted.${format}`

      // Add small delay between downloads to avoid browser blocking
      setTimeout(() => {
        this.downloadFile(result.convertedBlob, newFilename)
      }, index * 100)
    })
  }
}
