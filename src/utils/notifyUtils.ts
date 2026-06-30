// src/utils/notifyUtils.ts
import { Notify } from 'quasar';

let dismissPreviousNotify: (() => void) | null = null;

export const showNotify = (message: string, type: 'positive' | 'negative') => {
  // 如果有舊通知，先關閉它
  if (dismissPreviousNotify) {
    dismissPreviousNotify();
  }

  // 顯示新通知，並存下關閉函式
  dismissPreviousNotify = Notify.create({
    type: type,
    message: message,
    position: 'top',
    timeout: 3000,
    group: false, // 確保不群組化，方便我們精確控制
  });
};