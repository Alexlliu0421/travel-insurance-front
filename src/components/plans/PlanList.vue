<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePlans } from '../../composables/usePlans'
import type { PlanSummary } from '../../types/plans'

const { plans, loading, error, cancel, download, selectPlan } = usePlans()
const router = useRouter()

const CANCELLABLE_STATUSES = ['DRAFT', 'SIGNING']
const DOWNLOADABLE_STATUSES = ['DRAFT', 'SIGNING', 'FINISH']

const showCancelDialog = ref(false)
const cancelReason = ref('')
const targetPlan = ref<PlanSummary | null>(null)

const statusConfig: Record<string, { label: string; color: string }> = {
  DRAFT:    { label: '待審核', color: 'orange' },
  SIGNING:  { label: '審核中', color: 'blue' },
  FINISH:   { label: '已生效', color: 'green' },
  REJECTED: { label: '審核駁回', color: 'red' },
  VOID: { label: '已取消', color: 'grey' }
}

function onCancelClick(plan: PlanSummary) {
  targetPlan.value = plan
  cancelReason.value = ''
  showCancelDialog.value = true
}

async function onConfirmCancel() {
  if (!targetPlan.value) return
  await cancel({
    policyId: targetPlan.value.policyId,
    reason: cancelReason.value
  })
  if (!error.value) showCancelDialog.value = false
}

function onDownload(plan: PlanSummary) {
  if (!DOWNLOADABLE_STATUSES.includes(plan.status)) return
  download(plan.policyId, plan.policyNumber)
}

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div>
    <div class="row items-center q-mb-lg">
      <q-btn flat round icon="arrow_back" @click="goBack" />
      <div class="text-h5 text-weight-bold q-ml-sm">我的保單</div>
    </div>

    <div v-if="loading" class="column items-center q-py-xl">
      <q-spinner size="40px" color="green" />
    </div>

    <q-banner v-else-if="error" class="bg-red-1 text-red q-mb-md" rounded>
      {{ error }}
    </q-banner>

    <div v-else-if="plans.length === 0" class="column items-center q-py-xl text-grey">
      <q-icon name="description" size="56px" class="q-mb-md" />
      <div>目前沒有保單紀錄</div>
      <q-btn flat color="green" label="立即投保" to="/client/policy" class="q-mt-md" />
    </div>

    <div v-else class="column q-gutter-md">
      <q-card
        v-for="plan in plans"
        :key="plan.policyId"
        flat
        bordered
      >
        <q-card-section class="row items-center" style="height: 80px;">

          <!-- 左側：保單資訊，點擊進詳情 -->
          <div class="col cursor-pointer" @click="selectPlan(plan)">
            <div class="row q-gutter-lg text-body2 items-center">
              <div class="column" style="min-width: 80px;">
                <span class="text-grey text-caption">被保人</span>
                <span>{{ plan.insuredName }}</span>
              </div>
              <div class="column" style="min-width: 180px;">
                <span class="text-grey text-caption">旅遊期間</span>
                <span>{{ plan.departureDate }} ～ {{ plan.returnDate }}</span>
              </div>
              <div class="column" style="min-width: 60px;">
                <span class="text-grey text-caption">投保天數</span>
                <span>{{ plan.insuredDays }} 天</span>
              </div>
              <div class="column">
                <span class="text-grey text-caption">狀態</span>
                <q-badge
                  :color="statusConfig[plan.status]?.color ?? 'grey'"
                  :label="statusConfig[plan.status]?.label ?? plan.status"
                />
              </div>
            </div>
          </div>

          <!-- 右側：操作按鈕，永遠佔同樣寬度保持等高 -->
          <div class="row q-gutter-sm items-center" style="min-width: 140px; justify-content: flex-end;">
            <q-btn
              flat
              dense
              icon="download"
              label="下載"
              :color="DOWNLOADABLE_STATUSES.includes(plan.status) ? 'green' : 'grey'"
              :disable="!DOWNLOADABLE_STATUSES.includes(plan.status)"
              @click.stop="onDownload(plan)"
            >
              <q-tooltip v-if="!DOWNLOADABLE_STATUSES.includes(plan.status)">
                已取消保單無法下載
              </q-tooltip>
            </q-btn>

            <q-btn
              flat
              dense
              icon="cancel"
              label="取消"
              :color="CANCELLABLE_STATUSES.includes(plan.status) ? 'red' : 'grey'"
              :disable="!CANCELLABLE_STATUSES.includes(plan.status)"
              @click.stop="CANCELLABLE_STATUSES.includes(plan.status) && onCancelClick(plan)"
            >
              <q-tooltip v-if="!CANCELLABLE_STATUSES.includes(plan.status)">
                此保單狀態無法取消
              </q-tooltip>
            </q-btn>
          </div>

        </q-card-section>
      </q-card>
    </div>

    <!-- 取消確認 Dialog -->
    <q-dialog v-model="showCancelDialog">
      <q-card style="min-width: 320px">
        <q-card-section>
          <div class="text-h6">確認取消投保</div>
        </q-card-section>
        <q-card-section>
          <div class="text-body2 text-grey q-mb-md">
            保單 {{ targetPlan?.policyNumber }} 取消後無法恢復，確定要取消嗎？
          </div>
          <q-input
            v-model="cancelReason"
            label="取消原因（選填）"
            outlined
            autogrow
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="再想想" v-close-popup />
          <q-btn
            unelevated
            color="red"
            label="確認取消"
            :loading="loading"
            @click="onConfirmCancel"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>