<template>
  <div class="orders-view relative pb-20 min-h-[calc(100vh-140px)]">
    <!-- Fixed Background Glows -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/80 rounded-full blur-[80px] mix-blend-screen animate-glow-float-slow"></div>
      <div class="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] bg-purple-500/80 rounded-full blur-[100px] mix-blend-screen animate-glow-float-delayed"></div>
    </div>

    <div class="fixed inset-0 bg-gradient-to-b from-[#1a153a]/20 to-[#0b0914]/40 z-10 backdrop-blur-sm pointer-events-none"></div>

    <div class="relative z-20">
      <Header @open-get-started-modal="$emit('open-get-started-modal')" @open-language-modal="$emit('open-language-modal')" />
    </div>

    <main class="px-4 pt-6 relative z-20 max-w-2xl mx-auto">
      <h2 class="text-2xl font-display text-white mb-2 tech-font tracking-widest text-center">{{ t('orders.title') }}</h2>
      <p class="text-sm text-gray-400 text-center mb-8 tech-font">{{ t('orders.intro') }}</p>

      <!-- Tabs -->
      <div class="flex gap-4 mb-6 border-b border-white/10 pb-2 overflow-x-auto no-scrollbar justify-center">
        <button 
          v-for="tab in tabs"
          :key="tab.id"
          class="text-[14px] font-bold tracking-wider transition-all relative font-display tech-font whitespace-nowrap px-2"
          :class="activeTab === tab.id ? 'text-app-pink' : 'text-gray-300 hover:text-white'"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
          <div v-if="activeTab === tab.id" class="absolute -bottom-[9px] left-0 w-full h-[2px] bg-app-pink shadow-[0_0_8px_rgba(255,77,141,0.8)]"></div>
        </button>
      </div>

      <!-- Content -->
      <MyOrders :status="activeTab" />
    </main>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import Header from '@/components/Header.vue';
import MyOrders from '@/components/MyOrders.vue';
import { walletState } from '@/services/wallet.js';
import { t } from '@/i18n';

export default {
  name: 'OrdersView',
  components: {
    Header,
    MyOrders
  },
  setup() {
    const activeTab = ref(1); // Default to Processing

    const tabs = computed(() => [
      { id: 1, label: t('orders.tab.processing') },
      { id: 0, label: t('orders.tab.queued') },
      { id: 2, label: t('orders.tab.claimable') },
      { id: 3, label: t('orders.tab.completed') }
    ]);

    return {
      activeTab,
      walletState,
      tabs,
      t
    };
  }
}
</script>

<style scoped>
.tech-font {
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: 0.05em;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>