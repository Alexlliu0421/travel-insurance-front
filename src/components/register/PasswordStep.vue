<script setup lang="ts">
import { computed, ref } from 'vue'

const password = defineModel<string>('password', { default: '' })
const confirmPassword = defineModel<string>('confirmPassword', { default: '' })

const showPassword = ref(false)
const showConfirmPassword = ref(false)

// --- 密碼強度檢查（純展示用，即時反映在畫面上） ---
const hasMinLength = computed(() => password.value.length >= 8)
const hasLetter = computed(() => /[a-zA-Z]/.test(password.value))
const hasNumber = computed(() => /\d/.test(password.value))

// 兩次密碼是否一致（確認密碼欄位有填，且跟密碼相同）
const isMatching = computed(
  () => password.value === confirmPassword.value && confirmPassword.value.length > 0
)
</script>

<template>
  <div>
    <q-input
      v-model="password"
      label="密碼"
      :type="showPassword ? 'text' : 'password'"
      outlined
      class="q-mb-sm"
    >
      <template #append>
        <q-icon
          :name="showPassword ? 'visibility' : 'visibility_off'"
          class="cursor-pointer"
          @click="showPassword = !showPassword"
        />
      </template>
    </q-input>

    <!-- 即時強度檢查清單 -->
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

    <q-input
      v-model="confirmPassword"
      label="確認密碼"
      :type="showConfirmPassword ? 'text' : 'password'"
      outlined
      class="q-mb-sm"
      :error="confirmPassword.length > 0 && !isMatching"
      error-message="密碼不一致"
    >
      <template #append>
        <q-icon
          :name="showConfirmPassword ? 'visibility' : 'visibility_off'"
          class="cursor-pointer"
          @click="showConfirmPassword = !showConfirmPassword"
        />
      </template>
    </q-input>
  </div>
</template>