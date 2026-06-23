<script setup lang="ts">
import { reactive } from 'vue'
import type { ApplyRequest } from '../../types/policy'
import { usePolicy } from '../../composables/usePolicy'

const emit = defineEmits<{
  (e: 'done'): void
  (e: 'back'): void
}>()

const { quoteRequest, quoteResult, loading, error, apply } = usePolicy()

const form = reactive({
  insuredName: '',
  insuredIdNumber: ''
})

async function onSubmit() {
  if (!quoteRequest.value || !quoteResult.value) return

  const payload: ApplyRequest = {
    insuredName: form.insuredName,
    insuredIdNumber: form.insuredIdNumber,
    // 從 quoteRequest 帶入試算時填的條件
    insuredBirthDate: quoteRequest.value.insuredBirthDate,
    insuredGender: quoteRequest.value.insuredGender,
    insuredOccupationCode: quoteRequest.value.insuredOccupationCode,
    departureDate: quoteRequest.value.departureDate,
    returnDate: quoteRequest.value.returnDate,
    coverageId: quoteRequest.value.coverageId
  }

  await apply(payload)
  if (!error.value) emit('done')
}
</script>

<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="text-subtitle1 text-weight-bold q-mb-md">填寫被保人資料</div>

      <!-- 試算條件摘要（唯讀） -->
      <q-banner class="bg-green-1 q-mb-md" rounded>
        <template #avatar>
          <q-icon name="info" color="green" />
        </template>
        <div class="column q-gutter-xs text-body2">
          <span>
            旅遊期間：{{ quoteRequest?.departureDate }} ～ {{ quoteRequest?.returnDate }}
            （{{ quoteResult?.insuredDays }} 天）
          </span>
          <span>
            保額：NT$ {{ quoteResult?.coverageAmount.toLocaleString('zh-TW') }}，
            實收保費：NT$ {{ quoteResult?.finalPremium.toLocaleString('zh-TW') }}
          </span>
        </div>
      </q-banner>

      <q-form @submit.prevent="onSubmit" class="column q-gutter-md">

        <q-input
          v-model="form.insuredName"
          label="被保人姓名"
          outlined
          :rules="[val => !!val || '姓名不得為空']"
        />

        <q-input
          v-model="form.insuredIdNumber"
          label="被保人身份證號"
          outlined
          :rules="[val => !!val || '身份證號不得為空']"
        />

        <q-banner v-if="error" class="bg-red-1 text-red" rounded>
          {{ error }}
        </q-banner>

        <div class="row q-gutter-sm justify-end">
          <q-btn flat label="上一步" @click="emit('back')" :disable="loading" />
          <q-btn
            type="submit"
            color="green"
            label="確認投保"
            unelevated
            :loading="loading"
          />
        </div>

      </q-form>
    </q-card-section>
  </q-card>
</template>