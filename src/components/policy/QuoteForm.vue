<script setup lang="ts">
import { reactive } from 'vue'
import type { QuoteRequest } from '../../types/policy'
import { usePolicy } from '../../composables/usePolicy'

const emit = defineEmits<{ (e: 'done'): void }>()
const { loading, error, quote } = usePolicy()

const form = reactive<QuoteRequest>({
  departureDate: '',
  returnDate: '',
  insuredBirthDate: '',
  insuredGender: 1,
  insuredOccupationCode: '',
  coverageId: 0
})

// 職業選項對應 occupation_rates 種子資料
const occupationOptions = [
  { label: '一般觀光旅遊 / 度假 / 探親', value: 'TOURIST' },
  { label: '辦公室內勤 / 一般商務出差 (參加會議、內勤辦公、拜訪客戶)', value: 'OFFICE' },
  { label: '學生 / 專職家庭主婦 / 退休人員', value: 'STUDENT' },
  { label: '餐飲服務 / 零售門市 / 業務外勤 (餐廳、商店、業務跑客戶)', value: 'SERVICE' },
  { label: '勞動製造 / 技術維修 / 司機運輸 (工廠、水電維修、貨運計程車)', value: 'LABOR' },
  { label: '航空機組員 / 船員 / 導遊領隊 (本次行程為執行上述職務)', value: 'CREW' },
  { label: '其他高風險作業 (如營建工地現場、高空電力、前線救援)', value: 'HIGHRISK' }
]

// 保額選項對應 coverage_amounts 種子資料（is_active = 1）
const coverageOptions = [
  { label: '100 萬', value: 1 },
  { label: '300 萬', value: 2 },
  { label: '500 萬', value: 3 },
  { label: '1,000 萬', value: 4 }
]

const genderOptions = [
  { label: '男', value: 1 },
  { label: '女', value: 0 }
]

async function onSubmit() {
  await quote(form)
  if (!error.value) emit('done')
}
</script>

<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="text-subtitle1 text-weight-bold q-mb-md">保費試算</div>

      <q-form @submit.prevent="onSubmit" class="column q-gutter-md">

        <div class="row q-gutter-md">
          <q-input
            v-model="form.departureDate"
            label="出發日期"
            outlined
            class="col"
            :rules="[val => !!val || '請選擇出發日期']"
          >
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy>
                  <q-date v-model="form.departureDate" mask="YYYY-MM-DD" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input
            v-model="form.returnDate"
            label="回程日期"
            outlined
            class="col"
            :rules="[val => !!val || '請選擇回程日期']"
          >
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy>
                  <q-date v-model="form.returnDate" mask="YYYY-MM-DD" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <q-input
          v-model="form.insuredBirthDate"
          label="被保人生日"
          outlined
          :rules="[val => !!val || '請選擇被保人生日']"
        >
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy>
                <q-date v-model="form.insuredBirthDate" mask="YYYY-MM-DD" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-select
          v-model="form.insuredGender"
          :options="genderOptions"
          label="被保人性別"
          outlined
          emit-value
          map-options
          :rules="[val => val !== null || '請選擇性別']"
        />

        <q-select
          v-model="form.insuredOccupationCode"
          :options="occupationOptions"
          label="被保人職業"
          outlined
          emit-value
          map-options
          :rules="[val => !!val || '請選擇職業']"
        />

        <q-select
          v-model="form.coverageId"
          :options="coverageOptions"
          label="投保保額"
          outlined
          emit-value
          map-options
          :rules="[val => !!val || '請選擇保額']"
        />

        <q-banner v-if="error" class="bg-red-1 text-red" rounded>
          {{ error }}
        </q-banner>

        <q-btn
          type="submit"
          color="green"
          label="立即試算"
          unelevated
          :loading="loading"
        />

      </q-form>
    </q-card-section>
  </q-card>
</template>