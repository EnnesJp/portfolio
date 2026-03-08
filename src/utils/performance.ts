export interface PerformanceMetrics {
  fps: number
  scrollEventCount: number
  rafCallCount: number
  averageFrameTime: number
}

export class PerformanceMonitor {
  private frameCount = 0
  private lastFrameTime = 0
  private frameTimes: number[] = []
  private scrollEventCount = 0
  private rafCallCount = 0
  private isMonitoring = false
  private animationFrameId: number | null = null

  start(): void {
    if (this.isMonitoring) return

    this.isMonitoring = true
    this.frameCount = 0
    this.lastFrameTime = performance.now()
    this.frameTimes = []
    this.scrollEventCount = 0
    this.rafCallCount = 0

    this.measureFrameRate()
  }

  stop(): PerformanceMetrics {
    this.isMonitoring = false

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }

    const averageFrameTime =
      this.frameTimes.length > 0
        ? this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length
        : 0

    const fps = averageFrameTime > 0 ? 1000 / averageFrameTime : 0

    return {
      fps: Math.round(fps),
      scrollEventCount: this.scrollEventCount,
      rafCallCount: this.rafCallCount,
      averageFrameTime: Math.round(averageFrameTime * 100) / 100,
    }
  }

  recordScrollEvent(): void {
    if (this.isMonitoring) {
      this.scrollEventCount++
    }
  }

  recordRAFCall(): void {
    if (this.isMonitoring) {
      this.rafCallCount++
    }
  }

  private measureFrameRate(): void {
    if (!this.isMonitoring) return

    const currentTime = performance.now()
    const frameTime = currentTime - this.lastFrameTime

    if (this.frameCount > 0) {
      this.frameTimes.push(frameTime)

      if (this.frameTimes.length > 60) {
        this.frameTimes.shift()
      }
    }

    this.lastFrameTime = currentTime
    this.frameCount++

    this.animationFrameId = requestAnimationFrame(() => this.measureFrameRate())
  }

  isPerformanceDegraded(metrics: PerformanceMetrics, targetFps = 60): boolean {
    return metrics.fps < targetFps * 0.8
  }
}

export const performanceMonitor = new PerformanceMonitor()

export function isPerformanceAPIAvailable(): boolean {
  return typeof performance !== 'undefined' && typeof performance.now === 'function'
}

export function logPerformanceMetrics(metrics: PerformanceMetrics, label = 'Performance'): void {
  if (import.meta.env.DEV) {
    console.group(`${label} Metrics`)
    console.log(`FPS: ${metrics.fps}`)
    console.log(`Average Frame Time: ${metrics.averageFrameTime}ms`)
    console.log(`Scroll Events: ${metrics.scrollEventCount}`)
    console.log(`RAF Calls: ${metrics.rafCallCount}`)
    console.groupEnd()
  }
}
