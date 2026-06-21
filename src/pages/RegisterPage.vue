<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRegister } from '../composables/useRegister'
import TermsStep from '../components/register/TermsStep.vue'
import BasicInfoStep from '../components/register/BasicInfoStep.vue'
import PasswordStep from '../components/register/PasswordStep.vue'

const router = useRouter()
const {
  step, nextStep, prevStep,
  termsAgreed,
  name, idNumber, birthDate, gender, occupationName, email, phone, address, nationality,
  password, confirmPassword,
  errorMsg, loading,
  submitRegister, isPasswordValid, isPasswordMatching,
} = useRegister()

// 註冊成功後顯示「請去信箱驗證」的提示畫面，不是直接跳轉
const registerSuccess = ref(false)

async function onSubmit() {
  const success = await submitRegister()
  if (success) {
    registerSuccess.value = true
  }
}
</script>

<template>
  <div class="q-pa-lg" style="max-width: 480px; margin: 0 auto">
    <!-- 註冊成功後的提示畫面 -->
    <div v-if="registerSuccess" class="text-center q-mt-xl">
      <q-icon name="mark_email_read" size="64px" color="primary" />
      <div class="text-h6 q-mt-md">註冊成功！</div>
      <div class="text-body2 text-grey-7 q-mt-sm">
        請至您的信箱 <strong>{{ email }}</strong> 點擊驗證連結完成帳號啟用
      </div>
      <q-btn flat color="primary" label="返回首頁" class="q-mt-md" @click="router.push('/')" />
    </div>

    <!-- 註冊表單（3 步驟） -->
    <q-stepper v-else v-model="step" ref="stepper" color="primary" animated flat>
      <q-step :name="1" title="閱讀條款" icon="description" :done="step > 1">
        <TermsStep v-model="termsAgreed" />
        <q-stepper-navigation>
          <q-btn color="primary" label="下一步" :disable="!termsAgreed" @click="nextStep" />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="2" title="基本資料" icon="badge" :done="step > 2">
        <BasicInfoStep
          v-model:name="name"
          v-model:idNumber="idNumber"
          v-model:birthDate="birthDate"
          v-model:gender="gender"
          v-model:occupationName="occupationName"
          v-model:email="email"
          v-model:phone="phone"
          v-model:address="address"
          v-model:nationality="nationality"
        />
        <q-stepper-navigation>
          <q-btn flat label="返回" @click="prevStep" class="q-mr-sm" />
          <q-btn color="primary" label="下一步" @click="nextStep" />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="3" title="設定密碼" icon="lock">
        <PasswordStep v-model:password="password" v-model:confirmPassword="confirmPassword" />

        <div v-if="errorMsg" class="text-negative text-caption q-mb-sm">{{ errorMsg }}</div>

        <q-stepper-navigation>
          <q-btn flat label="返回" @click="prevStep" class="q-mr-sm" />
          <q-btn
            color="primary"
            label="完成註冊"
            :disable="!isPasswordValid || !isPasswordMatching"
            :loading="loading"
            @click="onSubmit"
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>