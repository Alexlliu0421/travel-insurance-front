<script setup lang="ts">
import { useForgotPassword } from '../composables/useForgotPassword'

// 用 v-model 控制 Modal 開關，跟 LoginModal 的寫法一致
const visible = defineModel<boolean>()

const { email, loading, errorMsg, submitted, submitForgotPassword } = useForgotPassword()

async function onSubmit() {
  await submitForgotPassword()
}

function onClose() {
  visible.value = false
  // 關閉時重置狀態，下次打開不會殘留上次的結果
  email.value = ''
  errorMsg.value = ''
  submitted.value = false
}
</script>

<template>
  <q-dialog v-model="visible" @hide="onClose">
    <q-card style="width: 360px">
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">忘記密碼</div>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <!-- 還沒送出：顯示輸入表單 -->
        <template v-if="!submitted">
          <div class="text-caption text-grey-7 q-mb-md">
            請輸入您註冊時使用的 Email，我們將寄送重設密碼連結給您。
          </div>

          <q-input v-model="email" label="Email" outlined class="q-mb-md" />

          <div v-if="errorMsg" class="text-negative text-caption q-mb-sm">{{ errorMsg }}</div>

          <q-btn color="primary" label="發送重設密碼信" class="full-width" :loading="loading" @click="onSubmit" />
        </template>

        <!-- 已送出：顯示提示訊息 -->
        <template v-else>
          <div class="text-center q-py-md">
            <q-icon name="mark_email_read" size="48px" color="primary" class="q-mb-md" />
            <div class="text-subtitle1 q-mb-sm">信件已送出</div>
            <div class="text-caption text-grey-7">
              如果該 Email 已註冊，您將收到一封重設密碼信，請至信箱查看。
            </div>
          </div>
        </template>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>