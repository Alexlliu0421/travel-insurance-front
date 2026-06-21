<script setup lang="ts">
// 用多個 defineModel，跟父層（RegisterPage.vue）逐一綁定欄位
// 好處：父層用 v-model:name="name" v-model:idNumber="idNumber" 這種寫法，
//      清楚知道每個欄位對應到哪個變數，不用傳一整包物件進來
const name = defineModel<string>('name', { default: '' })
const idNumber = defineModel<string>('idNumber', { default: '' })
const birthDate = defineModel<string>('birthDate', { default: '' })
const gender = defineModel<string>('gender', { default: '' })
const occupationName = defineModel<string>('occupationName', { default: '' })
const email = defineModel<string>('email', { default: '' })
const phone = defineModel<string>('phone', { default: '' })
const address = defineModel<string>('address', { default: '' })
const nationality = defineModel<string>('nationality', { default: '台灣' })

// --- 即時驗證規則 ---
// 身分證字號：第一個字母 + 1或2 + 8個數字
// 身分證字號檢查碼表（字母對應到固定的兩位數代碼）
const idLetterMap: Record<string, number> = {
  A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, G: 16, H: 17, I: 34,
  J: 18, K: 19, L: 20, M: 21, N: 22, O: 35, P: 23, Q: 24, R: 25,
  S: 26, T: 27, U: 28, V: 29, W: 32, X: 30, Y: 31, Z: 33,
}

// 真正驗證身分證字號的合法性（不只是格式，連檢查碼都驗證）
function isValidTaiwanId(id: string): boolean {
  if (!/^[A-Z][12]\d{8}$/.test(id)) return false

  const firstChar = id[0]
  if (!firstChar) return false

  const code = idLetterMap[firstChar]
  if (code === undefined) return false

  const n1 = Math.floor(code / 10)
  const n2 = code % 10
  const digits = id.slice(1).split('').map(Number)

  const weights = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1]
  const values = [n1, n2, ...digits]

  const sum = values.reduce((acc, val, i) => acc + val * (weights[i] ?? 0), 0)

  return sum % 10 === 0
}

const idNumberRule = (val: string) =>
  isValidTaiwanId(val) || '身分證字號格式錯誤'

const emailRule = (val: string) =>
  /^[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}$/.test(val) || 'Email 格式錯誤'

const phoneRule = (val: string) =>
  /^09\d{8}$/.test(val) || '手機號碼格式錯誤'

// 通用的「不可為空值」規則，傳入欄位名稱顯示在錯誤訊息裡
const requiredRule = (label: string) => (val: string) =>
  (val && val.length > 0) || `${label}不可為空值`

// 職業選項：對應後端 occupation_rates 的新版英文代碼
const occupationOptions = [
  { label: '一般觀光旅遊 / 度假 / 探親', value: 'TOURIST' },
  { label: '辦公室內勤 / 一般商務出差', value: 'OFFICE' },
  { label: '學生 / 專職家庭主婦 / 退休人員', value: 'STUDENT' },
  { label: '餐飲服務 / 零售門市 / 業務外勤', value: 'SERVICE' },
  { label: '勞動製造 / 技術維修 / 司機運輸', value: 'LABOR' },
  { label: '航空機組員 / 船員 / 導遊領隊', value: 'CREW' },
  { label: '其他勞力作業', value: 'HIGHRISK' },
]

const nationalityOptions = [
  '台灣', '中國', '香港', '澳門', '日本', '韓國', '新加坡', '馬來西亞',
  '印尼', '菲律賓', '泰國', '越南', '柬埔寨', '緬甸', '印度',
  '美國', '加拿大', '墨西哥', '巴西', '阿根廷',
  '英國', '法國', '德國', '義大利', '西班牙', '荷蘭', '瑞士', '瑞典',
  '挪威', '丹麥', '芬蘭', '波蘭', '俄羅斯', '土耳其',
  '澳洲', '紐西蘭',
  '南非', '埃及',
  '沙烏地阿拉伯', '阿拉伯聯合大公國', '以色列',
]
</script>

<template>
  <div>
    <q-select v-model="nationality" :options="nationalityOptions" label="國籍別" outlined class="q-mb-md" />

    <q-input v-model="idNumber" label="身分證字號" outlined class="q-mb-md" :rules="[idNumberRule]" lazy-rules />

    <q-input v-model="name" label="姓名" outlined class="q-mb-md" :rules="[requiredRule('姓名')]" lazy-rules />

    <q-input v-model="birthDate" label="出生年月日" placeholder="YYYY-MM-DD" outlined class="q-mb-md"
      :rules="[requiredRule('出生年月日')]" lazy-rules />

    <div class="q-mb-md">
      <div class="text-caption q-mb-xs">性別</div>
      <q-radio v-model="gender" val="MALE" label="男" />
      <q-radio v-model="gender" val="FEMALE" label="女" />
    </div>

    <q-select v-model="occupationName" :options="occupationOptions" option-value="value" option-label="label" emit-value
      map-options label="職業" outlined class="q-mb-md" :rules="[requiredRule('職業')]" lazy-rules />

    <q-input v-model="email" label="Email" outlined class="q-mb-md" :rules="[emailRule]" lazy-rules />

    <q-input v-model="phone" label="手機號碼" outlined class="q-mb-md" :rules="[phoneRule]" lazy-rules />

    <q-input v-model="address" label="地址" outlined class="q-mb-md" :rules="[requiredRule('地址')]" lazy-rules />
  </div>
</template>