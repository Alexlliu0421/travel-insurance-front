<script setup lang="ts">
import { useQuote } from '../composables/useQuote'
import { computed, ref, watch } from 'vue'

// 被保人生日改成年/月/日三個下拉選單，取代原本的日曆元件
// 原因：要選 85 歲以上的生日時，日曆要一年一年往回翻，操作太麻煩
const currentYear = new Date().getFullYear()
const birthYear = ref<number | null>(null)
const birthMonth = ref<number | null>(null)
const birthDay = ref<number | null>(null)

// 年份選單：從今年往回推 100 年（涵蓋85歲以上的測試情境）
const yearOptions = Array.from({ length: 101 }, (_, i) => currentYear - i)
const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)
const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1)

// 三個下拉都選好後，組合成 YYYY-MM-DD 字串，寫回 insuredBirthDate
// padStart(2, '0') 確保月、日是兩位數（例如 5 要變成 05），符合日期格式
watch([birthYear, birthMonth, birthDay], ([y, m, d]) => {
  if (y && m && d) {
    const mm = String(m).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    insuredBirthDate.value = `${y}-${mm}-${dd}`
  } else {
    insuredBirthDate.value = ''
  }
})

// 三個都選完才顯示錯誤訊息，避免使用者選到一半就被提示「不可為空白」
const birthErrorMsg = computed(() => {
  if (!birthYear.value || !birthMonth.value || !birthDay.value) return ''
  const res = birthRule(insuredBirthDate.value)
  return typeof res === 'string' ? res : ''
})
const {
  departureDate, returnDate, insuredBirthDate, insuredGender, insuredOccupationCode, coverageId,
  insuredDays,
  result, errorMsg, loading, submitQuote,
} = useQuote()

// 職業選項：跟註冊頁同一套代碼，對應資料庫 occupation_rates
const occupationOptions = [
  { label: '一般觀光旅遊 / 度假 / 探親', value: 'TOURIST' },
  { label: '辦公室內勤 / 一般商務出差', value: 'OFFICE' },
  { label: '學生 / 專職家庭主婦 / 退休人員', value: 'STUDENT' },
  { label: '餐飲服務 / 零售門市 / 業務外勤', value: 'SERVICE' },
  { label: '勞動製造 / 技術維修 / 司機運輸', value: 'LABOR' },
  { label: '航空機組員 / 船員 / 導遊領隊', value: 'CREW' },
  { label: '其他勞力作業', value: 'HIGHRISK' },
]

// 保額選項：對應資料庫目前啟用中的 coverage_amounts (id 1004~1007)
const coverageOptions = [
  { label: '100萬', value: 1 },
  { label: '300萬', value: 2 },
  { label: '500萬', value: 3 },
  { label: '1000萬', value: 4 },
]

// 即時驗證規則，對應後端 QuoteServiceImpl 的限制
//
// new Date().toISOString() 會產生像 "2026-06-22T14:30:00.000Z" 這種完整時間字串
// .split('T')[0] 用 'T' 字元切開，取前半段，只留下日期部分 "2026-06-22"
// （這樣才能跟 <input type="date"> 的格式一致，方便比較大小）
//
// ?? '' 是給 TypeScript 看的安全寫法：
// TS 不知道 split('T') 一定會切出東西，理論上覺得「可能是 undefined」
// 加上 ?? '' 代表「如果真的是 undefined，就用空字串代替」，避免編譯報錯
// 實務上這裡永遠不會是 undefined，純粹是滿足 TypeScript 的型別檢查
const todayStr = new Date().toISOString().split('T')[0] ?? ''
const departureRule = (val: string) =>
  (val && val >= todayStr) || '出發日不得早於今日'

const returnRule = (val: string) =>
  (val && val > departureDate.value) || '回程日必須晚於出發日'

const daysRule = () => {
  if (insuredDays.value === null) return true
  return (insuredDays.value >= 3 && insuredDays.value <= 180) || '投保天數須介於 3 至 180 天'
}

const birthRule = (val: string) => {
  if (!val) return '出生日期不可為空值'
  const age = Math.floor((Date.now() - new Date(val).getTime()) / (365.25 * 86400000))
  return age <= 85 || '被保人年齡超過 85 歲，無法投保'
}
</script>

<template>
  <div id="quote-section" class="q-px-xl q-py-xl" style="background-color: #fafafa;">
    <div class="text-h4 text-weight-bold text-center q-mb-md">一鍵速算保費</div>
    <div class="text-subtitle1 text-grey-7 text-center q-mb-xl">
      輸入旅遊資訊，立即試算保費
    </div>

    <div class="row justify-center">
      <div class="col-12 col-md-6">
        <q-card flat bordered class="q-pa-lg">
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-input v-model="departureDate" type="date" label="出發日" outlined :rules="[departureRule]" lazy-rules />
            </div>
            <div class="col-6">
              <q-input v-model="returnDate" type="date" label="回程日" outlined :rules="[returnRule, daysRule]"
                lazy-rules />
            </div>
          </div>

          <div v-if="insuredDays" class="text-caption text-grey-7 q-mb-md">
            投保天數：{{ insuredDays }} 天
          </div>

          <div class="q-mb-md">
            <div class="text-caption q-mb-xs">被保人生日</div>
            <div class="row q-col-gutter-sm">
              <div class="col-4">
                <q-select v-model="birthYear" :options="yearOptions" label="年" outlined dense />
              </div>
              <div class="col-4">
                <q-select v-model="birthMonth" :options="monthOptions" label="月" outlined dense />
              </div>
              <div class="col-4">
                <q-select v-model="birthDay" :options="dayOptions" label="日" outlined dense />
              </div>
            </div>
            <div v-if="birthErrorMsg" class="text-negative text-caption q-mt-xs">{{ birthErrorMsg }}</div>
          </div>

          <div class="q-mb-md">
            <div class="text-caption q-mb-xs">被保人性別</div>
            <q-radio v-model="insuredGender" :val="1" label="男" />
            <q-radio v-model="insuredGender" :val="0" label="女" />
          </div>

          <q-select v-model="insuredOccupationCode" :options="occupationOptions" option-value="value"
            option-label="label" emit-value map-options label="被保人職業" outlined class="q-mb-md" />

          <q-select v-model="coverageId" :options="coverageOptions" option-value="value" option-label="label" emit-value
            map-options label="保額方案" outlined class="q-mb-lg" />

          <q-btn color="primary" label="試算保費" class="full-width" size="lg" :loading="loading" @click="submitQuote" />

          <div v-if="errorMsg" class="text-negative text-caption q-mt-md">{{ errorMsg }}</div>

          <!-- 試算結果 -->
          <q-card v-if="result" flat class="bg-blue-1 q-mt-lg q-pa-md">
            <div class="row justify-between q-mb-xs">
              <div class="text-grey-7">保額</div>
              <div class="text-weight-bold">NT$ {{ result.coverageAmount.toLocaleString() }}</div>
            </div>
            <div class="row justify-between q-mb-xs">
              <div class="text-grey-7">投保天數</div>
              <div class="text-weight-bold">{{ result.insuredDays }} 天</div>
            </div>
            <q-separator class="q-my-sm" />
            <div class="row justify-between">
              <div class="text-subtitle1">應付保費</div>
              <div class="text-h5 text-primary text-weight-bold">
                NT$ {{ result.finalPremium.toLocaleString() }}
              </div>
            </div>
          </q-card>
        </q-card>
      </div>
    </div>
  </div>
</template>