<script setup lang="ts">
import { onMounted } from 'vue'
import NavBar from '../components/NavBar.vue'
import PlanList from '../components/plans/PlanList.vue'
import PlanDetail from '../components/plans/PlanDetail.vue'
import { usePlans } from '../composables/usePlans'

const { getPlans, selectedPlan, clearSelectedPlan } = usePlans()

onMounted(() => {
  clearSelectedPlan()
  getPlans()
})

function onBack() {
  clearSelectedPlan()
}
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <NavBar @open-login="() => {}" />
    </q-header>

    <q-page-container>
      <q-page class="q-pa-lg" style="max-width: 680px; margin: 0 auto;">

        <!-- 列表視圖 -->
        <PlanList
          v-if="!selectedPlan"
        />

        <!-- 詳情視圖 -->
        <PlanDetail
          v-else
          @back="onBack"
        />

      </q-page>
    </q-page-container>
  </q-layout>
</template>