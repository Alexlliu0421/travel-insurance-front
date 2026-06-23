export interface Policy {
  policy_id: number;
  policy_number: string;
  insured_name: string;
  insured_id_number?: string; // 補上可能在表單頁會用到的欄位
  status: string;
  agent_name: string;
  reviewer_name: string;
  last_reviewed_date: string;
  // 視情況補上其他詳細欄位
  departure_date?: string;
  return_date?: string;
  insured_days?: number;
  base_premium?: number;
  final_premium?: number;
}

export interface HistoryLog {
  log_id: number;
  created_date: string;
  action: string;
  remark: string;
  operator_name: string;
}

export interface WorklistItem {
  policy_id: number;
  policy_number: string;
  status: string;
  created_date: string;
}