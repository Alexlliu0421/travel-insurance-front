import { ref } from 'vue'
import { fetchPlans, cancelPlan, downloadPlan } from '../services/plans'
import type { PlanSummary, CancelRequest } from '../types/plans'
import type { PolicyDetail } from '../types/policy'

const plans = ref<PlanSummary[]>([])
const selectedPlan = ref<PlanSummary | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export function usePlans() {

  async function getPlans() {
    loading.value = true
    error.value = null
    try {
      const res = await fetchPlans()
      plans.value = res.data.data
    } catch (e: any) {
      error.value = e.response?.data?.message ?? '查詢保單失敗'
    } finally {
      loading.value = false
    }
  }

  async function cancel(payload: CancelRequest) {
    loading.value = true
    error.value = null
    try {
      await cancelPlan(payload)
      await getPlans()  // 取消後自動刷新列表
    } catch (e: any) {
      error.value = e.response?.data?.message ?? '取消失敗'
    } finally {
      loading.value = false
    }
  }

  async function download(policyId: number, policyNumber: string) {
    error.value = null
    try {
      const res = await downloadPlan(policyId)
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.download = `${policyNumber}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch (e: any) {
      error.value = e.response?.data?.message ?? '下載失敗'
    }
  }

  function selectPlan(plan: PlanSummary) {
    selectedPlan.value = plan
  }

  function clearSelectedPlan() {
    selectedPlan.value = null
  }

  return {
    plans,
    selectedPlan,
    loading,
    error,
    getPlans,
    cancel,
    download,
    selectPlan,
    clearSelectedPlan
  }
}