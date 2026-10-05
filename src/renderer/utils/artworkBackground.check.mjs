// artworkBackground 的自检，直接跑：node src/renderer/utils/artworkBackground.check.mjs
import {
  fitArtworkPalette,
  getArtworkForeground,
  getBackgroundModel,
  getContrastRatio,
  getVeilOpacity,
} from './artworkBackground.ts'

const parse = (css) => {
  const [r, g, b, a = 1] = css.match(/[\d.]+/g).map(Number)
  return { r, g, b, a }
}
const css = (s) => parse(s)

// 只检查不透明的 rgb()，带 alpha 的进度条色按同样的色相另算
const parseRgb = (value) => {
  const m = value.match(/rgba?\((\d+), (\d+), (\d+)/)
  return { r: +m[1], g: +m[2], b: +m[3] }
}

const LIGHT_THEME = { r: 243, g: 243, b: 243, a: 1 }
const DARK_THEME = { r: 32, g: 32, b: 32, a: 1 }

const palettes = {
  vividRed: [{ r: 220, g: 60, b: 60 }, { r: 255, g: 140, b: 90 }],
  vividBlue: [{ r: 40, g: 90, b: 220 }, { r: 120, g: 200, b: 255 }],
  yellow: [{ r: 250, g: 220, b: 60 }],
  nearWhite: [{ r: 245, g: 245, b: 245 }],
  nearBlack: [{ r: 20, g: 20, b: 20 }],
  grey: [{ r: 128, g: 128, b: 128 }],
  mixed: [
    { r: 30, g: 30, b: 30 },
    { r: 240, g: 240, b: 240 },
    { r: 200, g: 40, b: 40 },
  ],
}

let failed = false
const check = (ok, message) => {
  if (!ok) {
    failed = true
    console.log('FAIL:', message)
  }
}

// 1. 遮罩透明度换算出的「渐变可见比例」应当落在合理区间
for (const intensity of [0, 60, 100]) {
  const { veil, inner } = getVeilOpacity(intensity)
  const { gradientWeight } = getBackgroundModel(LIGHT_THEME, LIGHT_THEME, intensity)
  console.log(`intensity ${intensity}: veil ${veil}/${inner} -> gradient ${gradientWeight.toFixed(3)}`)
  check(gradientWeight >= 0 && gradientWeight <= 1, `gradientWeight 越界: ${gradientWeight}`)
}
check(
  getBackgroundModel(LIGHT_THEME, LIGHT_THEME, 100).gradientWeight >
    getBackgroundModel(LIGHT_THEME, LIGHT_THEME, 0).gradientWeight,
  '浓度越高，封面主色占比应该越大'
)

// 2. 任意封面 + 任意主题下，正文/次要文字/进度条都要够对比
for (const [themeName, theme] of [['light', LIGHT_THEME], ['dark', DARK_THEME]]) {
  for (const [paletteName, palette] of Object.entries(palettes)) {
    for (const intensity of [0, 60, 100]) {
      const { base, gradientWeight } = getBackgroundModel(theme, theme, intensity)
      // 渲染用的颜色和算前景色的颜色必须是同一组
      const fitted = fitArtworkPalette(palette, base, gradientWeight)
      const foreground = getArtworkForeground({ palette: fitted, base, gradientWeight })
      const backgrounds = fitted.map((c) => ({
        r: base.r + (c.r - base.r) * gradientWeight,
        g: base.g + (c.g - base.g) * gradientWeight,
        b: base.b + (c.b - base.b) * gradientWeight,
      }))
      const worst = (value) => Math.min(...backgrounds.map((bg) => getContrastRatio(parseRgb(value), bg)))

      check(worst(foreground.font) >= 4.5, `${themeName}/${paletteName}@${intensity} 正文对比度 ${worst(foreground.font).toFixed(2)} < 4.5`)
      check(worst(foreground.fontWeak) >= 3.5, `${themeName}/${paletteName}@${intensity} 次要文字对比度 ${worst(foreground.fontWeak).toFixed(2)} < 3.5`)
      check(worst(foreground.accent) >= 3, `${themeName}/${paletteName}@${intensity} 强调色对比度 ${worst(foreground.accent).toFixed(2)} < 3`)
    }
  }
}

// 3. 强调色要尽量保留封面主色的色相：主色本身够对比时不做改动
{
  const palette = [{ r: 220, g: 60, b: 60 }]
  const { base, gradientWeight } = getBackgroundModel(LIGHT_THEME, LIGHT_THEME, 60)
  const foreground = getArtworkForeground({ palette, base, gradientWeight })
  const backgrounds = palette.map((c) => ({
    r: base.r + (c.r - base.r) * gradientWeight,
    g: base.g + (c.g - base.g) * gradientWeight,
    b: base.b + (c.b - base.b) * gradientWeight,
  }))
  console.log('accent 保留检查 ->', foreground.accent, '对比度', getContrastRatio(parseRgb(foreground.accent), backgrounds[0]).toFixed(2))
  check(
    parseRgb(foreground.accent).r > parseRgb(foreground.accent).b,
    '主色够对比时不该把色相改掉'
  )
}

// 4. 没有主色时不输出前景色
check(getArtworkForeground({ palette: [], base: { r: 0, g: 0, b: 0 }, gradientWeight: 0.5 }) == null, '空色板应当返回 null')

// 5. 深色主题下文字应该偏亮
{
  const { base, gradientWeight } = getBackgroundModel(DARK_THEME, DARK_THEME, 60)
  const foreground = getArtworkForeground({ palette: palettes.vividBlue, base, gradientWeight })
  const font = parseRgb(foreground.font)
  console.log('暗色主题文字 ->', foreground.font, '| 亮色主题文字应相反')
  check(font.r > 128 && font.g > 128 && font.b > 128, '暗色背景上的文字应当偏亮')
}

console.log(failed ? '有失败项' : 'all checks done')
process.exit(failed ? 1 : 0)
