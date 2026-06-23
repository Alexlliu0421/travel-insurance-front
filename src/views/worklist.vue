<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { QTableColumn } from 'quasar'
import NavBar from '../components/NavBar.vue'
import LoginModal from '../components/LoginModal.vue'

// 匯入共用設定與組合式函式
import { useApproval } from '../composables/useApproval'
import { statusMap, getStatusColor } from '../constants/ApprovalMap'
import type { WorklistItem } from '../types/approval';

const router = useRouter()
const { fetchWorklist } = useApproval() // 使用 API Hook
const showLoginModal = ref(false)
const worklist = ref<WorklistItem[]>([]);
const formatDate = (isoString: string) => isoString?.replace('T', ' ').split('.')[0] || '';

// 表格欄位定義
const columns: QTableColumn[] = [
  { name: 'policy_number', label: '保單號碼', field: 'policy_number', align: 'left' },
  { name: 'status', label: '狀態', field: 'status', align: 'left' },
  { name: 'created_date', label: '申請日期', field: 'created_date', align: 'left',
    format: (val: any) => formatDate(val)},
  { name: 'actions', label: '操作', field: 'policy_id', align: 'center' }
];

function handleOpenLogin() {
  showLoginModal.value = true
}

const loadWorklist = async () => {
  try {
    worklist.value = await fetchWorklist();
  } catch (err) {
    console.error('抓取資料失敗', err);
  }
};

const goToApproval = (id: number) => {
  router.push({ name: 'ApprovalForm', params: { policyId: id } });
};

onMounted(loadWorklist);
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <NavBar @open-login="handleOpenLogin" />
    </q-header>
    <LoginModal v-model="showLoginModal" />
    <q-page-container>
      <q-page padding>
        <div class="q-pa-md">
          <div class="row items-center q-mb-md">
            <h4 class="q-my-none">待審核工作區</h4>
            <q-space />
          </div>

          <q-table
            :rows="worklist"
            :columns="columns"
            row-key="policy_id"
            flat
            bordered
          >
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-badge :color="getStatusColor(props.row.status)">
                  {{ statusMap[props.row.status] || props.row.status }}
                </q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="text-center">
                <q-btn 
                  color="primary" 
                  label="詳細簽核" 
                  size="sm" 
                  @click="goToApproval(props.row.policy_id)" 
                />
              </q-td>
            </template>
          </q-table>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>