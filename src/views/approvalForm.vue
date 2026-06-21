<template>
  <div class="form-container" style="padding: 20px;">
    <button @click="goBack" style="margin-bottom: 20px;">&lt; 返回工作清單</button>
    
    <h2>保單簽核 - {{ policyDetail.policy_number || '載入中...' }}</h2>

    <table border="1" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr style="background-color: #f8f8f8;">
        <th colspan="4" style="text-align: left; padding: 10px;">被保險人資訊</th>
      </tr>
      <tr>
        <td style="padding: 8px; width: 20%;">姓名: {{ policyDetail.insured_name }}</td>
        <td style="padding: 8px; width: 20%;">身分證: {{ policyDetail.insured_id_number }}</td>
        <td style="padding: 8px; width: 20%;">生日: {{ policyDetail.insured_birth_date }}</td>
        <td style="padding: 8px; width: 20%;">性別: {{ policyDetail.insured_gender === 1 ? '男' : '女' }}</td>
      </tr>
      <tr style="background-color: #f8f8f8;">
        <th colspan="4" style="text-align: left; padding: 10px;">保單細節</th>
      </tr>
      <tr>
        <td colspan="2">出發日: {{ policyDetail.departure_date }} ~ 結束日: {{ policyDetail.return_date }}</td>
        <td colspan="2">投保天數: {{ policyDetail.insured_days }} 天</td>
      </tr>
      <tr>
        <td colspan="2">基本保費: {{ policyDetail.base_premium }}</td>
        <td colspan="2">實收保費: <strong>{{ policyDetail.final_premium }}</strong></td>
      </tr>
    </table>

    <div>目前狀態: <strong>{{ policyDetail.status }}</strong></div>
    
    <textarea v-model="remark" placeholder="請輸入備註" style="width: 100%; height: 80px; margin: 10px 0;"></textarea>
    
    <div style="margin-top: 15px;">
      <template v-if="userRole === 'MANAGER'">
        <button @click="submitAction('APPROVE')" style="margin-right: 10px;">核准</button>
        <button @click="submitAction('REJECT')" style="background-color: #ffcccc;">駁回</button>
      </template>
      <template v-else-if="userRole === 'SALESMAN'">
        <button @click="submitAction('SUBMIT')">送審</button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const policyId = route.params.policyId;

// 狀態變數
const policyDetail = ref<any>({});
const remark = ref('');
const userRole = ref(localStorage.getItem('role')); // 直接讀取 F12 裡的 role

const goBack = () => {
  router.push('/approval/worklist'); 
};
// 載入資料
onMounted(async () => {
  const token = localStorage.getItem('token');
  try {
    // 呼叫單筆查詢 API (請確保後端已補上 /policies/{policyId})
    const res = await axios.get(`http://localhost:8080/api/approval/policies/${policyId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    policyDetail.value = res.data;
  } catch (err) {
    console.error('資料載入失敗', err);
    alert('無法取得保單資料');
  }
});

// 提交動作
const submitAction = async (action: string) => {
  const token = localStorage.getItem('token');
  try {
    await axios.post('http://localhost:8080/api/approval/submit', {
      policyId: policyId,
      action: action,
      remark: remark.value
    }, { headers: { 'Authorization': `Bearer ${token}` } });
    
    alert('操作成功！');
    router.push('/approval/worklist');
  } catch (err: any) {
    alert('操作失敗: ' + (err.response?.data?.message || '權限不足或系統錯誤'));
  }
};
</script>