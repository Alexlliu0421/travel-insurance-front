<script setup lang="ts">
import { ref } from 'vue'
import { useResetPassword } from '../composables/useResetPassword'

const { newPassword, confirmPassword, loading, errorMsg, success, submitResetPassword, hasMinLength, hasLetter, hasNumber } = useResetPassword()

const showPassword = ref(false)
const showConfirmPassword = ref(false)
</script>

<template>
  <div class="row justify-center items-center" style="min-height: 100vh; background-color: #fafafa;">
    <q-card style="width: 360px" class="q-pa-md">
      <q-card-section>
        <div class="text-h6 text-center q-mb-md">設定新密碼</div>

        <!-- 還沒成功：顯示輸入表單 -->
        <template v-if="!success">
          <q-input v-model="newPassword" label="新密碼" :type="showPassword ? 'text' : 'password'" outlined
            class="q-mb-sm">
            <template #append>
              <q-icon :name="showPassword ? 'visibility' : 'visibility_off'" class="cursor-pointer"
                @click="showPassword = !showPassword" />
            </template>
          </q-input>

          <!-- 密碼強度檢查清單：跟註冊頁同一套風格 -->
          <div class="q-mb-md text-caption">
            <div :class="hasMinLength ? 'text-positive' : 'text-grey'">
              <q-icon :name="hasMinLength ? 'check_circle' : 'radio_button_unchecked'" size="16px" />
              至少 8 個字元
            </div>
            <div :class="hasLetter ? 'text-positive' : 'text-grey'">
              <q-icon :name="hasLetter ? 'check_circle' : 'radio_button_unchecked'" size="16px" />
              包含英文字母
            </div>
            <div :class="hasNumber ? 'text-positive' : 'text-grey'">
              <q-icon :name="hasNumber ? 'check_circle' : 'radio_button_unchecked'" size="16px" />
              包含數字
            </div>
          </div>

          <q-input v-model="confirmPassword" label="確認新密碼" :type="showConfirmPassword ? 'text' : 'password'" outlined
            class="q-mb-md">
            <template #append>
              <q-icon :name="showConfirmPassword ? 'visibility' : 'visibility_off'" class="cursor-pointer"
                @click="showConfirmPassword = !showConfirmPassword" />
            </template>
          </q-input>

          <div v-if="errorMsg" class="text-negative text-caption q-mb-sm">{{ errorMsg }}</div>

          <q-btn color="primary" label="確認重設密碼" class="full-width" :loading="loading" @click="submitResetPassword" />
        </template>

        <!-- 成功：顯示提示，並自動導回首頁 -->
        <template v-else>
          <div class="text-center q-py-md">
            <q-icon name="check_circle" size="48px" color="positive" class="q-mb-md" />
            <div class="text-subtitle1 q-mb-sm">密碼重設成功！</div>
            <div class="text-caption text-grey-7">即將為您導回首頁...</div>
          </div>
        </template>
      </q-card-section>
    </q-card>
  </div>
</template>