<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore.ts'
import NavBar from '../components/NavBar.vue'

const router = useRouter()
const authStore = useAuthStore()
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <NavBar @open-login="() => {}" />
    </q-header>

    <q-page-container>
      <q-page class="column items-center justify-center q-pa-xl">

        <div class="text-h4 text-weight-bold q-mb-lg">
          歡迎回來，{{ authStore.name }}
        </div>

        <div class="row q-gutter-md q-mt-md justify-center">
          <q-card
            clickable
            class="quick-entry-card row justify-center items-center"
            @click="router.push('/client/policy')"
          >
            <q-card-section class="column items-center q-pa-xl">
              <q-icon name="flight_takeoff" size="68px" color="green" />
              <div class="text-h6 q-mt-md">開始投保</div>
            </q-card-section>
          </q-card>

          <q-card
            clickable
            class="quick-entry-card row justify-center items-center"
            @click="router.push('/client/plans')"
          >
            <q-card-section class="column items-center q-pa-xl">
              <q-icon name="description" size="68px" color="blue" />
              <div class="text-h6 q-mt-md">我的保單</div>
            </q-card-section>
          </q-card>

          <q-card
            clickable
            class="quick-entry-card row justify-center items-center"
            @click="router.push('/client/profile')"
          >
            <q-card-section class="column items-center q-pa-xl">
              <q-icon name="manage_accounts" size="68px" color="orange" />
              <div class="text-h6 q-mt-md">個人資料</div>
            </q-card-section>
          </q-card>
        </div>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.quick-entry-card {
  width: 250px;
  height: 300px;
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.quick-entry-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
</style>