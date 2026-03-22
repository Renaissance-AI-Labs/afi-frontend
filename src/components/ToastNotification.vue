<template>
  <transition name="toast-slide">
    <div v-if="notification.visible" class="toast-notification rounded-xl flex items-center gap-2.5" :class="toastClasses">
      <i class="ph-fill text-xl" :class="[toastIcon, iconClasses]"></i>
      <span class="message tech-font text-[14px] text-white font-bold tracking-wide">{{ notification.message }}</span>
    </div>
  </transition>
</template>

<script>
import { computed } from 'vue';
import { notificationState } from '../services/notification';

export default {
  name: 'ToastNotification',
  setup() {
    const toastClasses = computed(() => {
      if (notificationState.type === 'success') {
        return 'bg-[#10261c]/95 backdrop-blur-md border border-green-400/50 shadow-[0_0_20px_rgba(74,222,128,0.28)]';
      }

      if (notificationState.type === 'error') {
        return 'bg-[#2a1018]/95 backdrop-blur-md border border-red-400/50 shadow-[0_0_20px_rgba(248,113,113,0.28)]';
      }

      return 'bg-[#1a153a]/95 backdrop-blur-md border border-app-pink/50 shadow-[0_0_20px_rgba(255,77,141,0.4)]';
    });

    const toastIcon = computed(() => {
      if (notificationState.type === 'success') return 'ph-check-circle';
      if (notificationState.type === 'error') return 'ph-warning-circle';
      return 'ph-bell-ringing';
    });

    const iconClasses = computed(() => {
      if (notificationState.type === 'success') {
        return 'text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.6)]';
      }

      if (notificationState.type === 'error') {
        return 'text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.6)]';
      }

      return 'text-app-pink drop-shadow-[0_0_5px_rgba(255,77,141,0.8)]';
    });

    return {
      notification: notificationState,
      toastClasses,
      toastIcon,
      iconClasses,
    };
  }
};
</script>

<style scoped>
.toast-notification {
  position: fixed;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  z-index: 99999;
  min-width: max-content;
  white-space: nowrap;
}

.tech-font {
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: 0.05em;
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-slide-enter-from {
  opacity: 0;
  transform: translate(-50%, -30px);
}

.toast-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, -30px);
}
</style>
