import { reactive } from 'vue';

export const notificationState = reactive({
  visible: false,
  message: '',
  type: 'info',
  timeoutId: null,
});

export function showToast(message, typeOrDuration = 'info', duration = 3000) {
  if (notificationState.timeoutId) {
    clearTimeout(notificationState.timeoutId);
  }

  const type = typeof typeOrDuration === 'string' ? typeOrDuration : 'info';
  const timeout = typeof typeOrDuration === 'number' ? typeOrDuration : duration;

  notificationState.message = message;
  notificationState.type = type;
  notificationState.visible = true;

  notificationState.timeoutId = setTimeout(() => {
    notificationState.visible = false;
  }, timeout);
}
