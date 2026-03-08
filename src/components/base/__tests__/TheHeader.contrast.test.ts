import { describe, it, expect } from 'vitest'

function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function getContrastRatio(
  color1: { r: number; g: number; b: number },
  color2: { r: number; g: number; b: number },
): number {
  const l1 = getRelativeLuminance(color1.r, color1.g, color1.b)
  const l2 = getRelativeLuminance(color2.r, color2.g, color2.b)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function parseRgba(rgba: string): { r: number; g: number; b: number; a: number } {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
  if (!match) {
    throw new Error(`Invalid rgba string: ${rgba}`)
  }
  return {
    r: parseInt(match[1]),
    g: parseInt(match[2]),
    b: parseInt(match[3]),
    a: match[4] ? parseFloat(match[4]) : 1,
  }
}

function parseHex(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace('#', '')
  return {
    r: parseInt(cleaned.substring(0, 2), 16),
    g: parseInt(cleaned.substring(2, 4), 16),
    b: parseInt(cleaned.substring(4, 6), 16),
  }
}

function blendColors(
  fg: { r: number; g: number; b: number; a: number },
  bg: { r: number; g: number; b: number },
): { r: number; g: number; b: number } {
  const alpha = fg.a
  return {
    r: Math.round(fg.r * alpha + bg.r * (1 - alpha)),
    g: Math.round(fg.g * alpha + bg.g * (1 - alpha)),
    b: Math.round(fg.b * alpha + bg.b * (1 - alpha)),
  }
}

describe('TheHeader - Contrast Ratio Verification', () => {
  describe('Light Theme Contrast Ratios', () => {
    it('should have sufficient contrast ratio (≥4.5:1) for text in floating state', () => {
      const textColor = parseHex('#1e293b')
      const glassBg = parseRgba('rgba(255, 255, 255, 0.75)')
      const pageBackground = parseHex('#ffffff')

      const effectiveBackground = blendColors(glassBg, pageBackground)

      const contrastRatio = getContrastRatio(textColor, effectiveBackground)

      expect(contrastRatio).toBeGreaterThanOrEqual(4.5)

      console.log(`Light theme contrast ratio: ${contrastRatio.toFixed(2)}:1`)
    })

    it('should have sufficient contrast for primary color text in floating state', () => {
      const primaryColor = parseHex('#2563eb')
      const glassBg = parseRgba('rgba(255, 255, 255, 0.75)')
      const pageBackground = parseHex('#ffffff')

      const effectiveBackground = blendColors(glassBg, pageBackground)
      const contrastRatio = getContrastRatio(primaryColor, effectiveBackground)

      expect(contrastRatio).toBeGreaterThanOrEqual(4.5)

      console.log(`Light theme primary color contrast ratio: ${contrastRatio.toFixed(2)}:1`)
    })

    it('should have sufficient contrast for secondary text in floating state', () => {
      const secondaryTextColor = parseHex('#64748b')
      const glassBg = parseRgba('rgba(255, 255, 255, 0.75)')
      const pageBackground = parseHex('#ffffff')

      const effectiveBackground = blendColors(glassBg, pageBackground)
      const contrastRatio = getContrastRatio(secondaryTextColor, effectiveBackground)

      expect(contrastRatio).toBeGreaterThanOrEqual(4.5)

      console.log(`Light theme secondary text contrast ratio: ${contrastRatio.toFixed(2)}:1`)
    })
  })

  describe('Dark Theme Contrast Ratios', () => {
    it('should have sufficient contrast ratio (≥4.5:1) for text in floating state', () => {
      const textColor = parseHex('#f1f5f9')
      const glassBg = parseRgba('rgba(26, 26, 26, 0.75)')
      const pageBackground = parseHex('#0f172a')

      const effectiveBackground = blendColors(glassBg, pageBackground)

      const contrastRatio = getContrastRatio(textColor, effectiveBackground)

      expect(contrastRatio).toBeGreaterThanOrEqual(4.5)

      console.log(`Dark theme contrast ratio: ${contrastRatio.toFixed(2)}:1`)
    })

    it('should have sufficient contrast for primary color text in floating state', () => {
      const primaryColor = parseHex('#60a5fa')
      const glassBg = parseRgba('rgba(26, 26, 26, 0.75)')
      const pageBackground = parseHex('#0f172a')

      const effectiveBackground = blendColors(glassBg, pageBackground)
      const contrastRatio = getContrastRatio(primaryColor, effectiveBackground)

      expect(contrastRatio).toBeGreaterThanOrEqual(4.5)

      console.log(`Dark theme primary color contrast ratio: ${contrastRatio.toFixed(2)}:1`)
    })

    it('should have sufficient contrast for secondary text in floating state', () => {
      const secondaryTextColor = parseHex('#94a3b8')
      const glassBg = parseRgba('rgba(26, 26, 26, 0.75)')
      const pageBackground = parseHex('#0f172a')

      const effectiveBackground = blendColors(glassBg, pageBackground)
      const contrastRatio = getContrastRatio(secondaryTextColor, effectiveBackground)

      expect(contrastRatio).toBeGreaterThanOrEqual(4.5)

      console.log(`Dark theme secondary text contrast ratio: ${contrastRatio.toFixed(2)}:1`)
    })
  })

  describe('Cross-Theme Contrast Verification', () => {
    it('should maintain contrast ratios across both themes', () => {
      const lightTextColor = parseHex('#1e293b')
      const lightGlassBg = parseRgba('rgba(255, 255, 255, 0.75)')
      const lightPageBg = parseHex('#ffffff')
      const lightEffectiveBg = blendColors(lightGlassBg, lightPageBg)
      const lightContrast = getContrastRatio(lightTextColor, lightEffectiveBg)

      const darkTextColor = parseHex('#f1f5f9')
      const darkGlassBg = parseRgba('rgba(26, 26, 26, 0.75)')
      const darkPageBg = parseHex('#0f172a')
      const darkEffectiveBg = blendColors(darkGlassBg, darkPageBg)
      const darkContrast = getContrastRatio(darkTextColor, darkEffectiveBg)

      expect(lightContrast).toBeGreaterThanOrEqual(4.5)
      expect(darkContrast).toBeGreaterThanOrEqual(4.5)

      console.log(
        `Light theme: ${lightContrast.toFixed(2)}:1, Dark theme: ${darkContrast.toFixed(2)}:1`,
      )
    })
  })
})
