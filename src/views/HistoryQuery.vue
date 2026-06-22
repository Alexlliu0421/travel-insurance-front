<template>
  <div class="history-query-container" style="padding: 20px;">
    <div style="margin-bottom: 20px; display: flex; gap: 10px;">
      <button @click="goBack" style="padding: 8px 16px;">&lt; 返回工作清單</button>
      <input 
        v-model="searchQuery" 
        placeholder="搜尋保單號碼..." 
        style="padding: 8px; width: 250px;" 
      />
    </div>

    <h2>保單歷程查詢</h2>

    <table border="1" style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 10px;">保單號碼</th>
          <th>被保險人</th>
          <th>狀態</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="policy in filteredPolicies" :key="policy.policy_id">
          <tr>
            <td style="padding: 10px;">{{ policy.policy_number }}</td>
            <td>{{ policy.insured_name }}</td>
            <td>{{ policy.status }}</td>
            <td>
              <button @click="toggleLogs(policy)">
                {{ selectedPolicyId === policy.policy_id ? '收回歷程' : '查看歷程' }}
              </button>
            </td>
          </tr>
          
          <tr v-if="selectedPolicyId === policy.policy_id">
            <td colspan="4" style="padding: 15px; background: #fafafa;">
              <div v-if="loading">載入中...</div>
              <div v-else-if="historyLogs.length === 0" style="text-align: center; color: #888;">暫無歷程紀錄</div>
              <table v-else border="1" style="width: 100%; border-collapse: collapse;">
                <tr style="background-color: #eee;">
                  <th style="padding: 8px;">時間</th>
                  <th>操作員</th>
                  <th>動作</th>
                  <th>備註</th>
                </tr>
                <tr v-for="log in historyLogs" :key="log.log_id">
                  <td style="padding: 8px;">{{ formatDate(log.created_date) }}</td>
                  <td>{{ log.operator_name }}</td>
                  <td>{{ log.action }}</td>
                  <td>{{ log.remark }}</td>
                </tr>
              </table>
            </td>
          </tr>
        </template>
        <tr v-if="filteredPolicies.length === 0">
          <td colspan="4" style="text-align: center; padding: 20px;">找不到相符的保單</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const policyList = ref<any[]>([]);
const historyLogs = ref<any[]>([]);
const selectedPolicyId = ref<number | null>(null);
const loading = ref(false);
const searchQuery = ref(''); // 新增搜尋字串

const filteredPolicies = computed(() => {
  if (!searchQuery.value) return policyList.value;
  
  const query = searchQuery.value.toLowerCase();
  
  return policyList.value.filter(p => 
    (p.policy_number && p.policy_number.toLowerCase().includes(query)) ||
    (p.insured_name && p.insured_name.toLowerCase().includes(query))
  );
});

const goBack = () => router.push('/approval/worklist');

const formatDate = (isoString: string) => {
  if (!isoString) return '';
  return isoString.replace('T', ' ').split('.')[0];
};

onMounted(async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get('http://localhost:8080/api/approval/policies', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  policyList.value = res.data;
});

const toggleLogs = async (policy: any) => {
  if (selectedPolicyId.value === policy.policy_id) {
    selectedPolicyId.value = null;
  } else {
    selectedPolicyId.value = policy.policy_id;
    loading.value = true;
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`http://localhost:8080/api/approval/history/${policy.policy_id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      historyLogs.value = res.data;
    } catch (err) {
      console.error('歷程查詢失敗', err);
      historyLogs.value = [];
    }
    loading.value = false;
  }
};
</script>