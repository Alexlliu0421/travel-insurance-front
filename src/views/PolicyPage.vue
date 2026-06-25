<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import QuoteForm from '../components/policy/QuoteForm.vue'
import QuoteResult from '../components/policy/QuoteResult.vue'
import ApplyForm from '../components/policy/ApplyForm.vue'
import { usePolicy } from '../composables/usePolicy'

type Step = 'quote' | 'result' | 'apply' | 'done'
const stepOrder: Step[] = ['quote', 'result', 'apply', 'done']

const step = ref<Step>('quote')
const router = useRouter()
const completedSteps = ref<Set<Step>>(new Set())
const { policyDetail, resetQuote } = usePolicy()

function onStepperUpdate(target: string | number) {
  if (!stepOrder.includes(target as Step)) return

  const targetStep = target as Step

  // 只要目標步驟在 completedSteps 裡就允許跳，不管目前在哪一步
  if (completedSteps.value.has(targetStep)) {
    step.value = targetStep
  }
}

function onQuoteDone() {
  completedSteps.value.add('quote')
  step.value = 'result'
}

function onConfirmQuote() {
  completedSteps.value.add('result')
  step.value = 'apply'
}

function onApplyDone() {
  completedSteps.value.add('apply')
  step.value = 'done'
}

function onRestart() {
  resetQuote()
  completedSteps.value.clear()
  step.value = 'quote'
}
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <NavBar @open-login="() => {}" />
    </q-header>

    <q-page-container>
      <q-page class="q-pa-lg" style="max-width: 680px; margin: 0 auto;">

        <q-stepper
          :model-value="step"
          @update:model-value="onStepperUpdate"
          flat
          color="green"
          header-nav
        >
          <q-step
            name="quote"
            title="試算保費"
            icon="calculate"
            :done="completedSteps.has('quote')"
          />
          <q-step
            name="result"
            title="確認方案"
            icon="check_circle"
            :done="completedSteps.has('result')"
          />
          <q-step
            name="apply"
            title="填寫資料"
            icon="edit"
            :done="completedSteps.has('apply')"
          />
          <q-step
            name="done"
            title="投保完成"
            icon="task_alt"
            :done="completedSteps.has('apply')"
          />
        </q-stepper>

        <QuoteForm v-show="step === 'quote'" @done="onQuoteDone" />
        <QuoteResult v-show="step === 'result'" @confirm="onConfirmQuote" @back="step = 'quote'" />
        <ApplyForm v-show="step === 'apply'" @done="onApplyDone" @back="step = 'result'" />
        <q-btn
          flat
          label="取消投保"
          icon="arrow_back"
          class="q-mt-lg"
          @click="router.push('/client')"
        />

        <div v-if="step === 'done'" class="column items-center q-py-xl">
          <q-icon name="task_alt" size="72px" color="green" />
          <div class="text-h6 q-mt-md q-mb-xs">投保申請已送出</div>
          <div class="text-grey q-mb-xs">保單號碼：{{ policyDetail?.policyNumber }}</div>
          <div class="text-grey q-mb-xl">目前狀態：{{ policyDetail?.status }}</div>
          <div class="row q-gutter-md">
            <q-btn flat color="green" label="查看我的保單" to="/client/plans" />
            <q-btn unelevated color="green" label="再投一張" @click="onRestart" />
          </div>
        </div>

      </q-page>
    </q-page-container>
  </q-layout>
</template>