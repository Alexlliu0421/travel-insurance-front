<script setup lang="ts">
import { reactive } from 'vue'
import type { Profile, ProfileUpdateRequest } from '../../types/profile'
import { useProfile } from '../../composables/useProfile'

const props = defineProps<{ profile: Profile }>()
const emit = defineEmits<{
  (e: 'saved'): void
  (e: 'cancel'): void
}>()

const { loading, error, update } = useProfile()

const occupationOptions = [
  '辦公室內勤 / 行政人員 / 櫃台人員',
  '學生 / 專職家庭主婦 / 退休人員',
  '餐飲服務 / 零售門市 / 業務外勤 ',
  '勞動製造 / 技術維修 / 司機運輸',
  '航空機組員 / 船員 / 導遊領隊',
  '營建工地現場、高空電力、前線救援'
]

const form = reactive<ProfileUpdateRequest>({
  name: props.profile.name,
  phone: props.profile.phone ?? '',
  address: props.profile.address ?? '',
  nationality: props.profile.nationality ?? '',
  occupationName: props.profile.occupationName ?? ''
})

async function onSubmit() {
  await update(form)
  if (!error.value) emit('saved')
}
</script>

<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="text-subtitle1 text-weight-bold q-mb-md">編輯個人資料</div>

      <q-form @submit.prevent="onSubmit" class="column q-gutter-md">

        <q-input
          v-model="form.name"
          label="姓名"
          outlined
          :rules="[val => !!val || '姓名不得為空']"
        />
        <q-input
          v-model="form.phone"
          label="電話"
          outlined
        />
        <q-input
          v-model="form.address"
          label="地址"
          outlined
        />
        <q-input
          v-model="form.nationality"
          label="國籍"
          outlined
        />
        <q-select
          v-model="form.occupationName"
          :options="occupationOptions"
          label="被保人職業"
          outlined
          :rules="[val => !!val || '請選擇職業']"
        />

        <q-banner v-if="error" class="bg-red-1 text-red" rounded>
          {{ error }}
        </q-banner>

        <div class="row q-gutter-sm justify-end">
          <q-btn
            flat
            label="取消"
            @click="emit('cancel')"
            :disable="loading"
          />
          <q-btn
            type="submit"
            color="green"
            label="儲存"
            unelevated
            :loading="loading"
          />
        </div>

      </q-form>
    </q-card-section>
  </q-card>
</template>