// 狀態中文對應表
export const statusMap: Record<string, string> = {
  'DRAFT': '待審核',
  'FINISH': '已核准',
  'REJECTED': '已退件',
  'SIGNING': '審核中'
};

// 動作中文對應表
export const actionMap: Record<string, string> = {
  'SUBMIT': '提交申請',
  'APPROVE': '審核通過',
  'REJECT': '退件'
};

// 狀態顏色對應
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'FINISH': 'positive',
    'REJECTED': 'negative',
    'SIGNING': 'warning',
    'DRAFT': 'info'
  };
  return colors[status] || 'grey';
};