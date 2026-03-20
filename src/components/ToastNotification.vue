<template>
  <transition name="toast-slide">
    <div v-if="notification.visible" class="toast-notification bg-[#1a153a]/95 backdrop-blur-md border border-app-pink/50 shadow-[0_0_20px_rgba(255,77,141,0.4)] rounded-xl flex items-center gap-2.5">
      <i class="ph-fill ph-bell-ringing text-app-pink text-xl drop-shadow-[0_0_5px_rgba(255,77,141,0.8)]"></i>
      <span class="message tech-font text-[14px] text-white font-bold tracking-wide">{{ notification.message }}</span>
    </div>
  </transition>
</template>

<script>
import { notificationState } from '../services/notification';

export default {
  name: 'ToastNotification',
  setup() {
    return {
      notification: notificationState,
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
