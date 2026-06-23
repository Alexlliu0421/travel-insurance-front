// 假驗證碼工具（純前端展示用，不送後端驗證）
// 用 Canvas 畫出隨機文字 + 簡單扭曲效果，模仿真實圖形驗證碼的視覺
// 排除容易混淆的字元（0/O、1/I），每次刷新都會產生新的隨機文字

import { ref, onMounted } from 'vue'

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
// Java 常見寫法（像 min + (int)(Math.random() * (max - min + 1))）是完全一樣的數學公式，
// 只是 JS 用 Math.floor() 取代 Java 的 (int) 強制轉型來去掉小數。
export function useCaptcha() {
  const canvasRef = ref<HTMLCanvasElement | null>(null)
  const captchaText = ref('')

  // 產生隨機文字（預設 4 個字）
  function generateText(length = 4) {
    let text = ''                          // 準備一個空字串，之後逐字疊加
    for (let i = 0; i < length; i++) {     // 重複跑 4 次（length 預設是 4）
      text += CHARS[randomInt(0, CHARS.length - 1)]
      // CHARS.length - 1 是這串字的最後一個索引位置
      // randomInt(0, CHARS.length-1) 隨機抽一個索引號碼
      // CHARS[隨機索引] 就是從 CHARS 這串字裡，隨機挑出「一個字元」
      // 用 += 把這個字元接到 text 後面
    }
    return text                            // 跑完 4 次迴圈，text 就會是 4 個隨機字元組成的字串
  }

  // 在 Canvas 上畫出扭曲文字 + 干擾線/雜訊點
  function draw() {
    const canvas = canvasRef.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height

    // 背景
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(0, 0, w, h)

    // 干擾線（5條）
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${randomInt(0, 200)},${randomInt(0, 200)},${randomInt(0, 200)},0.5)`
      ctx.beginPath()
      ctx.moveTo(randomInt(0, w), randomInt(0, h))
      ctx.lineTo(randomInt(0, w), randomInt(0, h))
      ctx.stroke()
    }

    // 畫每個字元，隨機旋轉、隨機顏色
    const charWidth = w / captchaText.value.length
    captchaText.value.split('').forEach((char, i) => {
      ctx.save()
      const x = charWidth * i + charWidth / 2
      const y = h / 2
      ctx.translate(x, y)
      ctx.rotate((randomInt(-25, 25) * Math.PI) / 180)
      ctx.font = 'bold 24px sans-serif'
      ctx.fillStyle = `rgb(${randomInt(0, 100)},${randomInt(0, 100)},${randomInt(0, 100)})`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(char, 0, 0)
      ctx.restore()
    })

    // 干擾點（30個）
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(${randomInt(0, 200)},${randomInt(0, 200)},${randomInt(0, 200)},0.5)`
      ctx.beginPath()
      ctx.arc(randomInt(0, w), randomInt(0, h), 1, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // 重新產生一組新的驗證碼
  function refresh() {
    captchaText.value = generateText()
    draw()
  }

  // 比對使用者輸入是否正確（不分大小寫）
  function verify(input: string) {
    return input.trim().toUpperCase() === captchaText.value.toUpperCase()
  }

  // 元件掛載時，自動產生第一組驗證碼
  onMounted(() => {
    refresh()
  })

  return { canvasRef, refresh, verify }
}