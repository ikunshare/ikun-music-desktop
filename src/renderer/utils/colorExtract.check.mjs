// colorExtract 的自检，直接跑：node src/renderer/utils/colorExtract.check.mjs
import { pickColors, colorsToCss } from './colorExtract.ts'

const pixels = (list) => {
  const data = new Uint8ClampedArray(list.length * 4)
  list.forEach(([r, g, b, a = 255], i) => {
    data[i * 4] = r
    data[i * 4 + 1] = g
    data[i * 4 + 2] = b
    data[i * 4 + 3] = a
  })
  return data
}
const repeat = (pixel, times) => Array.from({ length: times }, () => pixel)

const near = (a, b, tolerance = 24) => a.every((v, i) => Math.abs(v - b[i]) <= tolerance)
const hex = ({ r, g, b }) => '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')

// 1. 纯红
let colors = pickColors(pixels(repeat([255, 0, 0], 400)))
console.log('red ->', colors.map(hex))
console.assert(colors.length === 1 && near([colors[0].r, colors[0].g, colors[0].b], [255, 0, 0]),
  'FAIL: pure red should stay red')

// 2. 70% 蓝 + 30% 绿，蓝应该排第一
colors = pickColors(pixels([...repeat([0, 0, 255], 280), ...repeat([0, 255, 0], 120)]))
console.log('blue+green ->', colors.map(hex))
console.assert(colors.length === 2, 'FAIL: expect two buckets')
console.assert(near([colors[0].r, colors[0].g, colors[0].b], [0, 0, 255]),
  'FAIL: blue should rank first')

// 3. 灰阶封面走平均色兜底
colors = pickColors(pixels(repeat([128, 128, 128], 100)))
console.log('gray ->', colors.map(hex))
console.assert(colors.length === 1 && near([colors[0].r, colors[0].g, colors[0].b], [128, 128, 128], 30),
  'FAIL: grayscale should fall back to average')

// 4. 全透明 -> 空
colors = pickColors(pixels(repeat([255, 0, 0], 10).map(([r, g, b]) => [r, g, b, 0])))
console.assert(colors.length === 0, 'FAIL: transparent pixels should be ignored')

// 5. 同色相的深浅色会并进同一个桶（取平均）
colors = pickColors(pixels([...repeat([120, 0, 0], 200), ...repeat([230, 40, 40], 200)]))
console.log('same hue ->', colors.map(hex))
console.assert(colors.length === 1, 'FAIL: same hue should merge into one bucket')

// 6. 数量相同时，明度居中的亮色比暗色排前面
colors = pickColors(pixels([...repeat([120, 0, 0], 200), ...repeat([0, 220, 220], 200)]))
console.log('vivid vs dark ->', colors.map(hex))
console.assert(near([colors[0].r, colors[0].g, colors[0].b], [0, 220, 220], 30),
  'FAIL: vivid color should outrank dark one')

// 7. 输出 CSS 颜色：单色时用明暗变化补足 4 个色标，空色板输出透明
let css = colorsToCss(pickColors(pixels(repeat([12, 90, 200], 400))))
console.log('css ->', css)
console.assert(css.length === 4 && new Set(css).size === 4,
  'FAIL: single color should be expanded into lightness variants')
console.assert(css[0] === 'rgb(0, 88, 212)', 'FAIL: first slot should be the raw main color')
css = colorsToCss([{ r: 1, g: 2, b: 3 }, { r: 4, g: 5, b: 6 }])
console.assert(css[0] === 'rgb(1, 2, 3)' && css[1] === 'rgb(4, 5, 6)' && css[3] !== css[1],
  'FAIL: two colors should still fill four slots')
console.assert(colorsToCss([]).join() === 'transparent,transparent,transparent,transparent',
  'FAIL: empty palette -> transparent slots')

console.log('all checks done')
