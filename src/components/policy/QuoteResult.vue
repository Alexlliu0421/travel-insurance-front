<script setup lang="ts">
import { usePolicy } from '../../composables/usePolicy'

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'back'): void
}>()

const { quoteResult } = usePolicy()

const formatCurrency = (val: number) =>
  `NT$ ${val.toLocaleString('zh-TW')}`
</script>

<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="text-subtitle1 text-weight-bold q-mb-md">試算結果</div>

      <template v-if="quoteResult">
        <div class="column q-gutter-sm q-mb-lg">
          <div class="row">
            <div class="text-grey col-5">投保天數</div>
            <div class="col text-weight-medium">{{ quoteResult.insuredDays }} 天</div>
          </div>
          <div class="row">
            <div class="text-grey col-5">投保保額</div>
            <div class="col text-weight-medium">{{ formatCurrency(quoteResult.coverageAmount) }}</div>
          </div>
          <div class="row">
            <div class="text-grey col-5">基本保費</div>
            <div class="col">{{ formatCurrency(quoteResult.basePremium) }}</div>
          </div>

          <q-separator class="q-my-sm" />

          <div class="row items-center">
            <div class="text-grey col-5">實收保費</div>
            <div class="col text-h6 text-green text-weight-bold">
              {{ formatCurrency(quoteResult.finalPremium) }}
            </div>
          </div>
        </div>

        <div class="row q-gutter-sm justify-end">
          <q-btn flat label="重新試算" @click="emit('back')" />
          <q-btn
            unelevated
            color="green"
            label="確認，前往投保"
            @click="emit('confirm')"
          />
        </div>
      </template>

    </q-card-section>
  </q-card>
</template>