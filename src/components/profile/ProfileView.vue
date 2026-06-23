<script setup lang="ts">
import type { Profile } from '../../types/profile'

const props = defineProps<{ profile: Profile }>()
const emit = defineEmits<{ (e: 'edit'): void }>()

const genderLabel = (g: string | null) => {
  if (g === 'M') return '男'
  if (g === 'F') return '女'
  return '未設定'
}
</script>

<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="row items-center q-mb-md">
        <q-avatar size="56px" color="green" text-color="white" icon="person" />
        <div class="q-ml-md">
          <div class="text-h6">{{ profile.name }}</div>
          <div class="text-caption text-grey">{{ profile.email }}</div>
        </div>
        <q-space />
        <q-btn
          flat
          color="green"
          icon="edit"
          label="編輯"
          @click="emit('edit')"
        />
      </div>

      <q-separator class="q-mb-md" />

      <div class="column q-gutter-sm">
        <div class="row">
          <div class="text-grey col-4">身份證號</div>
          <div class="col">{{ profile.idNumber }}</div>
        </div>
        <div class="row">
          <div class="text-grey col-4">性別</div>
          <div class="col">{{ genderLabel(profile.gender) }}</div>
        </div>
        <div class="row">
          <div class="text-grey col-4">出生日期</div>
          <div class="col">{{ profile.birthDate ?? '未設定' }}</div>
        </div>
        <div class="row">
          <div class="text-grey col-4">電話</div>
          <div class="col">{{ profile.phone ?? '未設定' }}</div>
        </div>
        <div class="row">
          <div class="text-grey col-4">地址</div>
          <div class="col">{{ profile.address ?? '未設定' }}</div>
        </div>
        <div class="row">
          <div class="text-grey col-4">國籍</div>
          <div class="col">{{ profile.nationality ?? '未設定' }}</div>
        </div>
        <div class="row">
          <div class="text-grey col-4">職業</div>
          <div class="col">{{ profile.occupationName ?? '未設定' }}</div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>