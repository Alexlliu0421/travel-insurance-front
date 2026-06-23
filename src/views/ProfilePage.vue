<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NavBar from '../components/NavBar.vue'
import ProfileView from '../components/profile/ProfileView.vue'
import ProfileEditForm from '../components/profile/ProfileEditForm.vue'
import { useProfile } from '../composables/useProfile'

const { profile, loading, error, getProfile } = useProfile()
const isEditing = ref(false)

onMounted(() => getProfile())

function onEditSaved() {
  isEditing.value = false
  getProfile()
}
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <NavBar @open-login="() => {}" />
    </q-header>

    <q-page-container>
      <q-page class="q-pa-lg" style="max-width: 640px; margin: 0 auto;">

        <div class="text-h5 text-weight-bold q-mb-lg">個人資料</div>

        <!-- loading -->
        <div v-if="loading" class="column items-center q-py-xl">
          <q-spinner size="40px" color="green" />
        </div>

        <!-- error -->
        <q-banner v-else-if="error" class="bg-red-1 text-red q-mb-md" rounded>
          {{ error }}
        </q-banner>

        <!-- 查看模式 -->
        <ProfileView
          v-else-if="profile && !isEditing"
          :profile="profile"
          @edit="isEditing = true"
        />

        <!-- 編輯模式 -->
        <ProfileEditForm
          v-else-if="profile && isEditing"
          :profile="profile"
          @saved="onEditSaved"
          @cancel="isEditing = false"
        />

      </q-page>
    </q-page-container>
  </q-layout>
</template>