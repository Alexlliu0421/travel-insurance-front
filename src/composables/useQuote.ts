// 保費試算邏輯：管理表單狀態、呼叫試算 API
// QuoteForm.vue 只負責呼叫這裡的方法

import { ref, computed } from 'vue'
import { getQuote } from '../services/quote'
import type { QuoteResponseDto } from '../types/quote'

export function useQuote() {
    const departureDate = ref('')
    const returnDate = ref('')
    const insuredBirthDate = ref('')
    const insuredGender = ref<0 | 1>(1)
    const insuredOccupationCode = ref('')
    const coverageId = ref<number | null>(null)

    const result = ref<QuoteResponseDto | null>(null)
    const errorMsg = ref('')
    const loading = ref(false)

    // 即時計算投保天數（純前端預覽用，方便使用者填表單時立刻看到天數）
    // 計算邏輯對應後端 QuoteServiceImpl.calculateInsuredDays()：
    //   後端用 departure.datesUntil(returnDate.plusDays(1)).count()
    //   等同於「回程日 - 出發日 的天數差 + 1」（含頭尾兩天都算）
    // 例：7/1 出發、7/5 回程 → 5 天（1,2,3,4,5 日）
    const insuredDays = computed(() => {
        if (!departureDate.value || !returnDate.value) return null

        const d1 = new Date(departureDate.value)
        const d2 = new Date(returnDate.value)

        // 兩個日期的毫秒差 ÷ 一天的毫秒數(86400000) = 相差天數
        // +1 是因為出發當天也要算進投保天數裡
        const diff = Math.round((d2.getTime() - d1.getTime()) / 86400000) + 1

        // 如果算出來 <= 0（代表回程日比出發日早，日期填反了），回傳 null
        // 真正的「不可早於出發日」驗證交給 q-input 的 :rules 處理，這裡只負責顯示用的天數
        return diff > 0 ? diff : null
    })

    async function submitQuote() {
        loading.value = true
        errorMsg.value = ''
        result.value = null
        try {
            const res = await getQuote({
                departureDate: departureDate.value,
                returnDate: returnDate.value,
                insuredBirthDate: insuredBirthDate.value,
                insuredGender: insuredGender.value,
                insuredOccupationCode: insuredOccupationCode.value,
                coverageId: coverageId.value as number,
            })
            result.value = res.data.data
            return true
        } catch (e: any) {
            errorMsg.value = e.response?.data?.message || '試算失敗，請確認輸入資料'
            return false
        } finally {
            loading.value = false
        }
    }

    return {
        departureDate, returnDate, insuredBirthDate, insuredGender, insuredOccupationCode, coverageId,
        insuredDays,
        result, errorMsg, loading, submitQuote,
    }
}