import { ref } from 'vue'
import { calculateQuote, applyPolicy } from '../services/policy'
import type { QuoteRequest, QuoteResult, ApplyRequest, PolicyDetail } from '../types/policy'

const quoteRequest = ref<QuoteRequest | null>(null)  // 新增：儲存試算條件
const quoteResult = ref<QuoteResult | null>(null)
const policyDetail = ref<PolicyDetail | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export function usePolicy() {

  async function quote(payload: QuoteRequest) {
    loading.value = true
    error.value = null
    try {
      const res = await calculateQuote(payload)
      quoteRequest.value = payload  // 儲存試算條件
      quoteResult.value = res.data.data
    } catch (e: any) {
      error.value = e.response?.data?.message ?? '試算失敗'
    } finally {
      loading.value = false
    }
  }

  async function apply(payload: ApplyRequest) {
    loading.value = true
    error.value = null
    try {
      const res = await applyPolicy(payload)
      policyDetail.value = res.data.data
    } catch (e: any) {
      error.value = e.response?.data?.message ?? '投保失敗'
    } finally {
      loading.value = false
    }
  }

  function resetQuote() {
    quoteRequest.value = null
    quoteResult.value = null
    policyDetail.value = null
    error.value = null
  }

  return {
    quoteRequest,
    quoteResult,
    policyDetail,
    loading,
    error,
    quote,
    apply,
    resetQuote
  }
}