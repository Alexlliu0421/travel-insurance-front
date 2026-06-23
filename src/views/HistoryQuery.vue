<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import type { QTableColumn } from 'quasar';
import NavBar from '../components/NavBar.vue';
import LoginModal from '../components/LoginModal.vue';
import type { Policy, HistoryLog } from '../types/approval';
import { statusMap, actionMap, getStatusColor } from '../constants/approvalMap';
import { useApproval } from '../composables/useApproval'; 

const router = useRouter();
const { fetchPolicies, fetchHistory } = useApproval();
const showLoginModal = ref(false);
const policyList = ref<Policy[]>([]);
const historyLogs = ref<HistoryLog[]>([]);
const showDialog = ref(false);
const selectedPolicyNumber = ref('');
const loading = ref(false);
const searchQuery = ref('');
const handleOpenLogin = () => showLoginModal.value = true;
const goBack = () => router.push('/approval/worklist');
const formatDate = (isoString: string) => isoString?.replace('T', ' ').split('.')[0] || '';
// 表格定義
const columns: QTableColumn[] = [
  { name: 'policy_number', label: '保單號碼', field: 'policy_number', align: 'left', required: true },
  { name: 'agent_name', label: '業務員', field: 'agent_name', align: 'left' },
  { name: 'status', label: '狀態', field: 'status', align: 'left' },
  { name: 'reviewer_name', label: '最後審核人', field: 'reviewer_name', align: 'left' },
  { name: 'last_reviewed_date',label: '審核時間',field: 'last_reviewed_date',align: 'left',
    format: (val: any) => formatDate(val)
  }
];

const filteredPolicies = computed(() => {
  if (!searchQuery.value) return policyList.value;
  const query = searchQuery.value.toLowerCase();
  return policyList.value.filter(p => 
    (p.policy_number?.toLowerCase().includes(query)) ||
    (p.insured_name?.toLowerCase().includes(query))
  );
});



// 點擊事件
const onRowClick = async (_evt: any, row: any) => {
  const policy = row as Policy;
  selectedPolicyNumber.value = policy.policy_number;
  showDialog.value = true;
  loading.value = true;
  historyLogs.value = [];
  
  try {
    historyLogs.value = await fetchHistory(policy.policy_id);
  } catch (err) {
    Notify.create({ type: 'negative', message: '讀取歷程失敗' });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    policyList.value = await fetchPolicies();
  } catch (err) {
    Notify.create({ type: 'negative', message: '無法載入保單列表' });
  }
});
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
          <div class="row q-gutter-md q-mb-md">
            <q-btn flat icon="arrow_back" label="返回工作清單" @click="goBack" />
            <q-space />
            <q-input 
              v-model="searchQuery" 
              outlined 
              dense 
              placeholder="搜尋保單號碼..." 
              style="width: 300px;"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <q-table
            title="保單歷程查詢"
            :rows="filteredPolicies"
            :columns="columns"
            row-key="policy_id"
            @row-click="onRowClick"
            class="cursor-pointer"
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
          </q-table>
        </div>

        <q-dialog v-model="showDialog">
          <q-card style="width: 700px; max-width: 90vw;">
            <q-card-section class="bg-primary text-white row items-center">
              <div class="text-h6">歷程紀錄 - {{ selectedPolicyNumber }}</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>
            <q-card-section class="q-pa-lg">
              <q-spinner v-if="loading" color="primary" size="2em" class="q-ma-md" />
              <div v-else-if="historyLogs.length === 0" class="text-center text-grey">暫無歷程紀錄</div>
              <q-list v-else bordered separator>
                <q-item v-for="log in historyLogs" :key="log.log_id">
                  <q-item-section>
                    <q-item-label caption>{{ formatDate(log.created_date) }}</q-item-label>
                    <q-item-label class="text-weight-bold">
                      {{ actionMap[log.action] || log.action }}
                    </q-item-label>
                    <q-item-label>{{ log.remark }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-badge color="grey-8">{{ log.operator_name }}</q-badge>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>