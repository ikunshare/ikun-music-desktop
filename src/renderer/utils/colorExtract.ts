// 播放详情页动态背景用的封面取色。
// 做法：把封面画到 32x32 画布 -> 丢掉接近黑/白/灰的像素 -> 按色相分 12 个桶，
// 用「饱和度 * 明度居中程度」给像素加权求和 -> 取得分最高的几个桶的平均色当主色。

export interface Rgb {
  r: number
  g: number
  b: number
}

const SAMPLE_SIZE = 32
const HUE_BUCKETS = 12
const MAX_COLORS = 4
const CACHE_LIMIT = 32

const cache = new Map<string, Rgb[]>()

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const loadImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve(img)
    }
    img.onerror = () => {
      reject(new Error('load artwork failed'))
    }
    img.src = url
  })

const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  const d = max - min
  if (d === 0) return [0, 0, l]
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h: number
  if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0)
  else if (max === gn) h = (bn - rn) / d + 2
  else h = (rn - gn) / d + 4
  return [h * 60, s, l]
}

const hslToRgb = (h: number, s: number, l: number): Rgb => {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let t: [number, number, number]
  if (h < 60) t = [c, x, 0]
  else if (h < 120) t = [x, c, 0]
  else if (h < 180) t = [0, c, x]
  else if (h < 240) t = [0, x, c]
  else if (h < 300) t = [x, 0, c]
  else t = [c, 0, x]
  return {
    r: Math.round((t[0] + m) * 255),
    g: Math.round((t[1] + m) * 255),
    b: Math.round((t[2] + m) * 255),
  }
}

// 封面上的颜色直接当全屏背景往往太亮/太暗，这里把明度夹到中间区间、饱和度稍微抬高
const toBackgroundColor = ({ r, g, b }: Rgb): Rgb => {
  const [h, s, l] = rgbToHsl(r, g, b)
  return hslToRgb(h, clamp(s * 1.2, 0, 1), clamp(l, 0.3, 0.6))
}

/**
 * 从 RGBA 像素里投票选出主色，按得分从高到低返回
 */
export const pickColors = (data: Uint8ClampedArray): Rgb[] => {
  const buckets = Array.from({ length: HUE_BUCKETS }, () => ({ weight: 0, r: 0, g: 0, b: 0 }))
  const total = { r: 0, g: 0, b: 0, count: 0 }

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    if (data[i + 3] < 125) continue
    total.r += r
    total.g += g
    total.b += b
    total.count += 1

    const [h, s, l] = rgbToHsl(r, g, b)
    // 接近纯黑、纯白、灰色的像素做背景没有辨识度，不参与投票
    if (s < 0.15 || l < 0.12 || l > 0.92) continue

    const bucket = buckets[Math.floor((h / 360) * HUE_BUCKETS) % HUE_BUCKETS]
    // 越鲜艳、明度越接近中间的颜色越像「主色」
    const weight = s * (1 - Math.abs(l - 0.5) * 0.9)
    bucket.weight += weight
    bucket.r += r * weight
    bucket.g += g * weight
    bucket.b += b * weight
  }

  const colors = buckets
    .filter((bucket) => bucket.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, MAX_COLORS)
    .map((bucket) =>
      toBackgroundColor({
        r: bucket.r / bucket.weight,
        g: bucket.g / bucket.weight,
        b: bucket.b / bucket.weight,
      })
    )

  // 整张封面都是灰阶（没有可投票的鲜艳像素）时退回平均色
  if (!colors.length && total.count) {
    colors.push(
      toBackgroundColor({
        r: total.r / total.count,
        g: total.g / total.count,
        b: total.b / total.count,
      })
    )
  }

  return colors
}

const extractColors = async (url: string): Promise<Rgb[]> => {
  const img = await loadImage(url)
  const canvas = document.createElement('canvas')
  canvas.width = SAMPLE_SIZE
  canvas.height = SAMPLE_SIZE
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return []
  ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE)
  return pickColors(ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE).data)
}

/**
 * 取得封面主色，图片加载失败或读取像素被拦时返回空数组
 */
export const getArtworkColors = async (url: string): Promise<Rgb[]> => {
  if (!url) return []
  const cached = cache.get(url)
  if (cached) return cached

  const colors = await extractColors(url).catch(() => [] as Rgb[])
  if (cache.size >= CACHE_LIMIT) cache.clear()
  cache.set(url, colors)
  return colors
}

const shiftLightness = ({ r, g, b }: Rgb, delta: number): Rgb => {
  const [h, s, l] = rgbToHsl(r, g, b)
  return hslToRgb(h, s, clamp(l + delta, 0.12, 0.88))
}

const LIGHTNESS_VARIANTS = [0.16, -0.14, 0.28]

/**
 * 转成可直接写进 CSS 变量的颜色（渐变的各个色标共用这几个变量，换歌时交给 CSS 过渡，
 * 所以这里只输出颜色值，不拼渐变字符串）。主色不够 4 个时用明暗变化补足，避免整屏一个纯色。
 */
export const colorsToCss = (colors: Rgb[], count = 4): string[] => {
  if (!colors.length) return Array.from({ length: count }, () => 'transparent')
  return Array.from({ length: count }, (_, index) => {
    const base = colors[index % colors.length]
    const color =
      index < colors.length ? base : shiftLightness(base, LIGHTNESS_VARIANTS[index - colors.length] ?? 0)
    return `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`
  })
}
