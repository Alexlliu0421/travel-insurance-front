<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import axios from 'axios'
import NavBar from '../components/NavBar.vue'
import LoginModal from '../components/LoginModal.vue'

const router = useRouter()
const authStore = useAuthStore() // 2. 初始化 store
const showLoginModal = ref(false)

function handleOpenLogin() {
  showLoginModal.value = true
}

interface WorklistItem {
  policy_id: number;
  policy_number: string;
  status: string;
  created_date: string;
}

const worklist = ref<WorklistItem[]>([]);

const fetchWorklist = async () => {
  // 3. 從 Pinia 取得 token
  const token = authStore.token 
  
  if (!token) {
    console.warn('未登入，無法取得工作列表');
    return;
  }

  try {
    const res = await axios.get('http://localhost:8080/api/approval/worklist', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    worklist.value = res.data;
  } catch (err) {
    console.error('抓取資料失敗', err);
  }
};

const goToApproval = (id: number) => {
  router.push({ name: 'ApprovalForm', params: { policyId: id } });
};

onMounted(fetchWorklist);
</script>

<template>
  <NavBar @open-login="handleOpenLogin" />
  <LoginModal v-model="showLoginModal" />
  
  <nav style="margin-bottom: 20px;">
    <router-link to="/approval/history">查詢歷程記錄</router-link>
  </nav>
  
  <div style="padding: 20px;">
    <h2>待審核工作區</h2>
    <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
      <thead>
        <tr>
          <th>保單號碼</th>
          <th>狀態</th>
          <th>申請日期</th>
          <th>操作</th> 
        </tr>
      </thead>
      <tbody>
        <tr v-if="worklist.length === 0">
          <td colspan="4" style="text-align: center;">暫無待處理紀錄</td>
        </tr>
        <tr v-for="item in worklist" :key="item.policy_id">
          <td>{{ item.policy_number }}</td>
          <td>{{ item.status }}</td>
          <td>{{ item.created_date }}</td>
          <td>
            <button @click="goToApproval(item.policy_id)">詳細簽核</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>