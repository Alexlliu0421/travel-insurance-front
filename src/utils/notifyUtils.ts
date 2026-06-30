// src/utils/notifyUtils.ts
import { Notify } from 'quasar';
let dismissPreviousNotify: (() => void) | null = null;

export const showNotify = (message: string, type: 'positive' | 'negative') => {
  if (dismissPreviousNotify) dismissPreviousNotify();
  dismissPreviousNotify = Notify.create({
    type: type,
    message: message,
    position: 'top',
    timeout: 3000,
    group: false
  });
};