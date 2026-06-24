<script setup lang="ts">
import { ref } from 'vue'
import { usePlans } from '../../composables/usePlans'

const emit = defineEmits<{ (e: 'back'): void }>()
const { selectedPlan, loading, error, cancel, download } = usePlans()

const CANCELLABLE_STATUSES = ['DRAFT', 'SIGNING']
const DOWNLOADABLE_STATUSES = ['DRAFT', 'SIGNING', 'FINISH']

const showCancelDialog = ref(false)
const cancelReason = ref('')

const statusConfig: Record<string, { label: string; color: string }> = {
  DRAFT:    { label: '待審核', color: 'orange' },
  SIGNING:  { label: '審核中', color: 'blue' },
  FINISH:   { label: '已生效', color: 'green' },
  REJECTED: { label: '審核駁回', color: 'red' },
  VOID: { label: '已取消', color: 'grey' }
}

const formatCurrency = (val: number) =>
  `NT$ ${val.toLocaleString('zh-TW')}`

async function onConfirmCancel() {
  if (!selectedPlan.value) return
  await cancel({
    policyId: selectedPlan.value.policyId,
    reason: cancelReason.value
  })
  if (!error.value) {
    showCancelDialog.value = false
    emit('back')
  }
}

function onDownload() {
  if (!selectedPlan.value) return
  download(selectedPlan.value.policyId, selectedPlan.value.policyNumber)
}
</script>

<template>
  <div v-if="selectedPlan">

    <div class="row items-center q-mb-lg">
      <q-btn flat round icon="arrow_back" @click="emit('back')" />
      <div class="text-h5 text-weight-bold q-ml-sm">保單詳情</div>
      <q-space />
      <q-badge
        :color="statusConfig[selectedPlan.status]?.color ?? 'grey'"
        :label="statusConfig[selectedPlan.status]?.label ?? selectedPlan.status"
        class="text-body2 q-px-md q-py-xs"
      />
    </div>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle2 text-weight-bold text-grey q-mb-sm">保單資訊</div>
        <div class="column q-gutter-sm">
          <div class="row">
            <div class="text-grey col-5">保單號碼</div>
            <div class="col">{{ selectedPlan.policyNumber }}</div>
          </div>
          <!-- <div class="row">
            <div class="text-grey col-5">狀態</div>
            <div class="col">
              <q-badge
                :color="statusConfig[selectedPlan.status]?.color ?? 'grey'"
                :label="statusConfig[selectedPlan.status]?.label ?? selectedPlan.status"
              />
            </div>
          </div> -->
          <div class="row">
            <div class="text-grey col-5">投保日期</div>
            <div class="col">{{ selectedPlan.createdDate }}</div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle2 text-weight-bold text-grey q-mb-sm">被保人資料</div>
        <div class="column q-gutter-sm">
          <div class="row">
            <div class="text-grey col-5">姓名</div>
            <div class="col">{{ selectedPlan.insuredName }}</div>
          </div>
          <div class="row">
            <div class="text-grey col-5">旅遊期間</div>
            <div class="col">{{ selectedPlan.departureDate }} ～ {{ selectedPlan.returnDate }}</div>
          </div>
          <div class="row">
            <div class="text-grey col-5">投保天數</div>
            <div class="col">{{ selectedPlan.insuredDays }} 天</div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="text-subtitle2 text-weight-bold text-grey q-mb-sm">保費資訊</div>
        <div class="column q-gutter-sm">
          <div class="row">
            <div class="text-grey col-5">投保保額</div>
            <div class="col">{{ formatCurrency(selectedPlan.coverageAmount) }}</div>
          </div>
          <div class="row">
            <div class="text-grey col-5">實收保費</div>
            <div class="col text-green text-weight-bold">
              {{ formatCurrency(selectedPlan.finalPremium) }}
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-banner v-if="error" class="bg-red-1 text-red q-mb-md" rounded>
      {{ error }}
    </q-banner>

    <div class="row q-gutter-sm justify-end">
      <!-- <q-btn
        flat
        label="回到保單列表"
        icon="arrow_back"
        @click="emit('back')"
      /> -->

      <q-btn
        flat
        icon="download"
        label="下載保單"
        :color="DOWNLOADABLE_STATUSES.includes(selectedPlan.status) ? 'green' : 'grey'"
        :disable="!DOWNLOADABLE_STATUSES.includes(selectedPlan.status)"
        @click="onDownload"
      >
        <q-tooltip v-if="!DOWNLOADABLE_STATUSES.includes(selectedPlan.status)">
          已取消保單無法下載
        </q-tooltip>
      </q-btn>

      <q-btn
        v-if="CANCELLABLE_STATUSES.includes(selectedPlan.status)"
        unelevated
        color="red"
        icon="cancel"
        label="取消投保"
        @click="showCancelDialog = true"
      />
    </div>

    <q-dialog v-model="showCancelDialog">
      <q-card style="min-width: 320px">
        <q-card-section>
          <div class="text-h6">確認取消投保</div>
        </q-card-section>
        <q-card-section>
          <div class="text-body2 text-grey q-mb-md">
            取消後無法恢復，確定要取消此保單嗎？
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