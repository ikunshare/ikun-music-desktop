// 封面动态背景的参数换算。播放详情页用它生成 CSS 变量，参数面板用它显示当前值，
// 两边共用同一份换算，避免面板显示的值和实际效果对不上。
import type { Rgb } from './colorExtract'

export const ARTWORK_SETTING_KEYS = {
  motion: 'playDetail.artworkBackground.motion',
  speed: 'playDetail.artworkBackground.speed',
  intensity: 'playDetail.artworkBackground.intensity',
  duration: 'playDetail.artworkBackground.duration',
} as const

/** 流动幅度（0-100）-> 漂移动画的缩放区间 */
export const getZoomRange = (motion: number): [string, string] => [
  (1 + (motion / 100) * 0.02).toFixed(3),
  (1.04 + (motion / 100) * 0.14).toFixed(3),
]

/** 流动速度（0-100）-> 漂移一个来回的时长 */
export const getDriftDuration = (speed: number): string => `${(48 - (speed / 100) * 36).toFixed(1)}s`

/** 过渡时长（0-100）-> 换歌时颜色插值的秒数 */
export const getMorphDuration = (duration: number): string =>
  `${(0.6 + (duration / 100) * 3.4).toFixed(2)}s`

/** 背景浓度（0-100）-> 主题底色遮罩的两层不透明度 */
export const getVeilOpacity = (intensity: number) => {
  const veil = 0.92 - (intensity / 100) * 0.72
  return { veil: veil.toFixed(3), inner: (veil * 0.45).toFixed(3) }
}

// .bg 元素自身的不透明度，取值与 PlayDetail 的样式一致
const BACKGROUND_LAYER_OPACITY = 0.7

export interface Rgba extends Rgb {
  a: number
}

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1)
const mix = (a: Rgb, b: Rgb, t: number): Rgb => ({
  r: a.r + (b.r - a.r) * t,
  g: a.g + (b.g - a.g) * t,
  b: a.b + (b.b - a.b) * t,
})
const toCss = ({ r, g, b }: Rgb, alpha = 1) =>
  alpha >= 1
    ? `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
    : `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`

const toLinear = (value: number) => {
  const c = value / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

/** WCAG 相对亮度 */
export const getLuminance = ({ r, g, b }: Rgb) =>
  0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)

/** WCAG 对比度，1 ~ 21 */
export const getContrastRatio = (a: Rgb, b: Rgb) => {
  const la = getLuminance(a)
  const lb = getLuminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

/**
 * 把主题底色和遮罩折算成「实际看到的背景」：
 * 底色 base 占 (1 - gradientWeight)，封面主色占 gradientWeight。
 */
export const getBackgroundModel = (mainBackground: Rgba, appBackground: Rgba, intensity: number) => {
  const { veil, inner } = getVeilOpacity(intensity)
  const afterAlpha = Number(veil) * BACKGROUND_LAYER_OPACITY * clamp01(mainBackground.a)
  const beforeAlpha = Number(inner) * BACKGROUND_LAYER_OPACITY * clamp01(appBackground.a)
  const rest = 1 - afterAlpha
  const gradientWeight = rest * (1 - beforeAlpha)
  const themeWeight = 1 - gradientWeight
  const appWeight = rest * beforeAlpha
  const base: Rgb =
    themeWeight <= 0
      ? mainBackground
      : {
          r: (mainBackground.r * afterAlpha + appBackground.r * appWeight) / themeWeight,
          g: (mainBackground.g * afterAlpha + appBackground.g * appWeight) / themeWeight,
          b: (mainBackground.b * afterAlpha + appBackground.b * appWeight) / themeWeight,
        }
  return { base, gradientWeight }
}

const WHITE: Rgb = { r: 255, g: 255, b: 255 }
const BLACK: Rgb = { r: 0, g: 0, b: 0 }

const minContrast = (color: Rgb, backgrounds: Rgb[]) =>
  Math.min(...backgrounds.map((background) => getContrastRatio(color, background)))

// 取整到和实际渲染同一个值，免得算出来的对比度差一点点
const round = ({ r, g, b }: Rgb): Rgb => ({ r: Math.round(r), g: Math.round(g), b: Math.round(b) })

/**
 * 从带色的极端色出发，按需往纯黑/纯白推，直到和每一个背景色都拉开要求对比度
 */
const pickReadable = (backgrounds: Rgb[], extreme: Rgb, tint: Rgb, target: number) => {
  for (let step = 0; step <= 10; step++) {
    const color = round(mix(tint, extreme, step / 10))
    const ratio = minContrast(color, backgrounds)
    if (ratio >= target) return { color, ratio }
  }
  const color = extreme
  return { color, ratio: minContrast(color, backgrounds) }
}

// 文字用与背景相反的极端色，再混一点主色让它和背景是一套色
const pickTextColor = (backgrounds: Rgb[], extreme: Rgb, tintColor: Rgb, target: number) =>
  pickReadable(backgrounds, extreme, mix(extreme, tintColor, 0.22), target).color

// 强调色保留封面主色的色相，只有对比度不够时才往极端色推
const pickAccent = (backgrounds: Rgb[], extreme: Rgb, source: Rgb, target: number) =>
  minContrast(source, backgrounds) >= target
    ? source
    : pickReadable(backgrounds, extreme, source, target).color

export interface ArtworkForeground {
  font: string
  fontWeak: string
  accent: string
  accentA200: string
  accentA400: string
  accentA600: string
  accentA800: string
}

const getBackgrounds = (palette: Rgb[], base: Rgb, gradientWeight: number) =>
  palette.map((color) => mix(base, color, gradientWeight))

// 单个文字色能达到的最好结果：白或黑里取对背景更有利的那个
const bestAchievable = (backgrounds: Rgb[]) =>
  Math.max(minContrast(WHITE, backgrounds), minContrast(BLACK, backgrounds))

/**
 * 封面上同时有极亮和极暗的主色时（比如黑底白字的海报），渐变两端会跨过明暗两侧，
 * 任何单一文字色都顾不过来。这时把主色整体往平均值收一收，压掉背景的明暗跨度，
 * 保证后面一定能挑出够对比的文字色。收不动才停，正常的封面不会被改。
 */
export const fitArtworkPalette = (
  palette: Rgb[],
  base: Rgb,
  gradientWeight: number,
  target = 4.5
): Rgb[] => {
  if (palette.length < 2) return palette
  if (bestAchievable(getBackgrounds(palette, base, gradientWeight)) >= target) return palette

  const mean = palette.reduce(
    (acc, color) => ({ r: acc.r + color.r / palette.length, g: acc.g + color.g / palette.length, b: acc.b + color.b / palette.length }),
    { r: 0, g: 0, b: 0 }
  )
  for (let step = 1; step <= 20; step++) {
    const fitted = palette.map((color) => mix(mean, color, 1 - step / 20))
    if (bestAchievable(getBackgrounds(fitted, base, gradientWeight)) >= target) return fitted
  }
  return palette.map(() => mean)
}

/**
 * 算播放详情页的前景色。渐变上每个色标实际呈现的颜色都要照顾到，
 * 按 WCAG 对比度校正：正文 4.5、次要文字 3.5、进度条与频谱 3，
 * 这样换到任意封面，文字和进度条都不会糊在背景里。
 * palette 应当先过一遍 fitArtworkPalette，渲染用的颜色要和这里算的一致。
 */
export const getArtworkForeground = ({
  palette,
  base,
  gradientWeight,
}: {
  palette: Rgb[]
  base: Rgb
  gradientWeight: number
}): ArtworkForeground | null => {
  if (!palette.length) return null

  const backgrounds = getBackgrounds(palette, base, gradientWeight)
  const extreme = minContrast(WHITE, backgrounds) >= minContrast(BLACK, backgrounds) ? WHITE : BLACK
  const accentSource = palette[0]
  const accent = pickAccent(backgrounds, extreme, accentSource, 3)
  const font = pickTextColor(backgrounds, extreme, accentSource, 4.5)
  // 次要文字从正文色往背景方向退一点，保住层次，再按对比度兜底
  const meanBackground = backgrounds.reduce(
    (acc, color) => ({
      r: acc.r + color.r / backgrounds.length,
      g: acc.g + color.g / backgrounds.length,
      b: acc.b + color.b / backgrounds.length,
    }),
    { r: 0, g: 0, b: 0 }
  )

  return {
    font: toCss(font),
    fontWeak: toCss(pickReadable(backgrounds, extreme, mix(font, meanBackground, 0.45), 3.5).color),
    accent: toCss(accent),
    accentA200: toCss(accent, 0.2),
    accentA400: toCss(accent, 0.4),
    accentA600: toCss(accent, 0.6),
    accentA800: toCss(accent, 0.8),
  }
}
