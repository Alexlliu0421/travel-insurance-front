import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import type { Policy, HistoryLog } from '../types/approval';

export interface WorklistItem {
  policy_id: number;
  policy_number: string;
  status: string;
  created_date: string;
}

export function useApproval() {
  const authStore = useAuthStore();
  
  // 統一封裝 headers
  const getHeaders = () => ({
    headers: { 'Authorization': `Bearer ${authStore.token}` }
  });

  // 統一處理錯誤的輔助函式 (選用)
  const handleError = (error: any) => {
    console.error('API Error:', error);
    throw error;
  };

  // 1. 取得所有保單列表
  const fetchPolicies = async (): Promise<Policy[]> => {
    try {
      const res = await axios.get('http://localhost:8080/api/approval/policies', getHeaders());
      return res.data;
    } catch (err) { return handleError(err); }
  };

  // 2. 取得保單歷程紀錄
  const fetchHistory = async (policyId: number): Promise<HistoryLog[]> => {
    try {
      const res = await axios.get(`http://localhost:8080/api/approval/history/${policyId}`, getHeaders());
      return res.data;
    } catch (err) { return handleError(err); }
  };

  // 3. 取得待審核工作清單
  const fetchWorklist = async (): Promise<WorklistItem[]> => {
    try {
      const res = await axios.get('http://localhost:8080/api/approval/worklist', getHeaders());
      return res.data;
    } catch (err) { return handleError(err); }
  };

  // 4. 取得單一保單詳情 (新增：供 ApprovalForm 使用)
  const fetchPolicyDetail = async (policyId: string | string[]): Promise<any> => {
    try {
      const res = await axios.get(`http://localhost:8080/api/approval/policies/${policyId}`, getHeaders());
      return res.data;
    } catch (err) { return handleError(err); }
  };

  // 5. 提交審核操作
  const submitAction = async (payload: { policyId: number | string, action: string, remark: string }) => {
    try {
      return await axios.post('http://localhost:8080/api/approval/submit', payload, getHeaders());
    } catch (err) { return handleError(err); }
  };

  return { 
    fetchPolicies, 
    fetchHistory, 
    fetchWorklist, 
    fetchPolicyDetail,
    submitAction 
  };
}