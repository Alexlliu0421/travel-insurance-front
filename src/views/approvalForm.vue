<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import NavBar from '../components/NavBar.vue';
import LoginModal from '../components/LoginModal.vue';
import { useApproval } from '../composables/useApproval';
import { statusMap, actionMap, getStatusColor } from '../constants/approvalMap';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { fetchPolicyDetail, submitAction } = useApproval();
const formatDate = (isoString: string) => isoString?.replace('T', ' ').split('.')[0] || '';
// 正確處理 router.params.policyId 的型別
const rawPolicyId = route.params.policyId;
const policyId = Array.isArray(rawPolicyId) ? rawPolicyId[0] : (rawPolicyId as string);

const policyDetail = ref<any>({});
const remark = ref('');
const errorMessage = ref('');
const showLoginModal = ref(false);
const showConfirmDialog = ref(false);
const pendingAction = ref('');
const confirmMessage = ref('');

const handleOpenLogin = () => { showLoginModal.value = true; };
const goBack = () => router.push('/approval/worklist');

const confirmSubmit = (action: string) => {
  pendingAction.value = action;
  const label = actionMap[action] || action;
  confirmMessage.value = `確定要執行「${label}」此保單嗎？`;
  showConfirmDialog.value = true;
};

const executeSubmit = async () => {
  if (!policyId) return;
  try {
    await submitAction({
      policyId: policyId,
      action: pendingAction.value,
      remark: remark.value
    });
    router.push('/approval/worklist');
  } catch (err: any) {
    errorMessage.value = '操作失敗: ' + (err.response?.data?.message || '系統錯誤');
  }
};

onMounted(async () => {
  if (!policyId) {
    errorMessage.value = '參數錯誤：找不到保單編號';
    return;
  }
  try {
    policyDetail.value = await fetchPolicyDetail(policyId);
  } catch (err) {
    errorMessage.value = '無法取得保單資料';
  }
});
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <NavBar @open-login="handleOpenLogin" />
    </q-header>

    <q-page-container>
      <q-page padding>
        <div class="q-pa-md" style="max-width: 800px; margin: 0 auto;">
          <q-btn flat icon="arrow_back" label="返回工作清單" @click="goBack" class="q-mb-md" />

          <q-banner v-if="errorMessage" inline-actions rounded class="bg-red text-white q-mb-md">
            {{ errorMessage }}
            <template v-slot:action>
              <q-btn flat label="關閉" @click="errorMessage = ''" />
            </template>
          </q-banner>

          <q-card flat bordered>
            <q-card-section class="bg-primary text-white">
              <div class="text-h6">保單簽核 - {{ policyDetail.policy_number || '載入中...' }}</div>
            </q-card-section>

            <q-card-section>
              <div class="text-subtitle1 text-weight-bold q-mb-sm">被保險人資訊</div>
              <div class="row q-col-gutter-md q-mb-lg">
                <div class="col-6 col-sm-3">姓名: {{ policyDetail.insured_name }}</div>
                <div class="col-6 col-sm-3">身分證: {{ policyDetail.insured_id_number }}</div>
                <div class="col-6 col-sm-3">生日: {{ policyDetail.insured_birth_date }}</div>
                <div class="col-6 col-sm-3">性別: {{ policyDetail.insured_gender === 1 ? '男' : '女' }}</div>
                <div class="col-6 col-sm-3">申請人: {{ policyDetail.applicant_name || '無' }}</div>
              </div>

              <div class="text-subtitle1 text-weight-bold q-mb-sm">保單細節</div>
              <q-list bordered separator>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>保險期間</q-item-label>
                    <q-item-label>{{ policyDetail.departure_date }} ~ {{ policyDetail.return_date }} ({{ policyDetail.insured_days }} 天)</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>相關人員</q-item-label>
                    <q-item-label>
                      業務員: {{ policyDetail.agent_name || '無' }} / 
                      最後審核者: {{ policyDetail.reviewer_name || '無' }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>保費資訊</q-item-label>
                    <q-item-label>基本: {{ policyDetail.base_premium }} / 實收: <strong class="text-primary">{{ policyDetail.final_premium }}</strong></q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>

              <div class="q-mt-lg">
                <div class="q-mb-sm">
                  目前狀態: 
                  <q-badge :color="getStatusColor(policyDetail.status)">
                    {{ statusMap[policyDetail.status] || policyDetail.status }}
                  </q-badge>
                  <span class="q-ml-sm text-caption text-grey">最後異動: {{ formatDate(policyDetail.last_reviewed_date) || '無' }}</span>
                </div>
                <q-input v-model="remark" outlined type="textarea" label="簽核備註" rows="3" />
              </div>
            </q-card-section>

            <q-card-actions align="right" class="q-pa-md">
              <template v-if="authStore.role === 'MANAGER'">
                <q-btn color="positive" label="核准" @click="confirmSubmit('APPROVE')" class="q-mr-sm" />
                <q-btn color="negative" label="駁回" @click="confirmSubmit('REJECT')" />
              </template>
              <template v-else-if="authStore.role === 'SALESMAN'">
                <q-btn color="primary" label="送審" @click="confirmSubmit('SUBMIT')" />
              </template>
            </q-card-actions>
          </q-card>
        </div>
      </q-page>
    </q-page-container>

    <q-dialog v-model="showConfirmDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="warning" text-color="white" />
          <span class="q-ml-sm">{{ confirmMessage }}</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="取消" color="grey" v-close-popup />
          <q-btn flat label="確認執行" color="primary" @click="executeSubmit" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <LoginModal v-model="showLoginModal" />
  </q-layout>
</template>