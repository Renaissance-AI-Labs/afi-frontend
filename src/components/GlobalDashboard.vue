<template>
  <section class="animate-fade-in bg-[#1a153a]/40 backdrop-blur-md rounded-2xl border border-white/10 p-4 shadow-lg relative overflow-hidden">
    <div class="absolute -right-10 -top-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl"></div>
    <div class="relative z-10">
      <h2 class="text-base font-display text-white mb-3 tech-font font-bold tracking-wider flex items-center gap-2">
        <i class="ph-fill ph-chart-line-up text-app-pink"></i> {{ t('home.dashboard.title') }}
      </h2>
      
      <div class="bg-black/30 border border-white/5 rounded-lg p-3 mb-3 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="text-center">
          <p class="text-[11px] text-gray-300 tech-font uppercase tracking-wider mb-1">{{ t('home.dashboard.todaysQuota') }}</p>
          <p class="text-base font-display font-bold text-white truncate" :title="formattedQuota">{{ formattedQuota }}</p>
        </div>
        <div class="text-center">
          <p class="text-[11px] text-gray-300 tech-font uppercase tracking-wider mb-1">{{ t('home.dashboard.todaysUsed') }}</p>
          <p class="text-base font-display font-bold text-app-pink truncate" :title="formattedUsed">{{ formattedUsed }}</p>
        </div>
        <div class="text-center">
          <p class="text-[11px] text-gray-300 tech-font uppercase tracking-wider mb-1">{{ t('home.dashboard.queuedOrders') }}</p>
          <p class="text-base font-display font-bold text-white truncate" :title="queuedOrders">{{ queuedOrders }}</p>
        </div>
        <div class="text-center">
          <p class="text-[11px] text-gray-300 tech-font uppercase tracking-wider mb-1">{{ t('home.dashboard.reservedUsdt') }}</p>
          <p class="text-base font-display font-bold text-app-pink truncate" :title="formattedReserved">{{ formattedReserved }}</p>
        </div>
      </div>

      <!-- Progress Bars -->
      <div class="flex flex-col gap-2">
        <div>
          <div class="flex justify-between text-[11px] text-gray-300 tech-font mb-1">
            <span>{{ t('home.dashboard.quotaUsage') }}</span>
            <span>{{ quotaPercent }}%</span>
          </div>
          <div class="w-full bg-black/40 rounded-full h-1.5 overflow-hidden border border-white/5">
            <div class="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full transition-all duration-500" :style="{ width: `${quotaPercent}%` }"></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between text-[11px] text-gray-300 tech-font mb-1">
            <span>{{ t('home.dashboard.queueProgress') }}</span>
            <span>{{ queuePercent }}%</span>
          </div>
          <div class="w-full bg-black/40 rounded-full h-1.5 overflow-hidden border border-white/5 flex">
            <div class="bg-purple-500 h-full transition-all duration-500" :style="{ width: `${queuePercent}%` }" title="Processed"></div>
            <div class="bg-pink-500/50 h-full transition-all duration-500" :style="{ width: `${100 - queuePercent}%` }" title="Waiting"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { ethers } from 'ethers';
import { walletState } from '@/services/wallet';
import { getContractAddress } from '@/services/contracts';
import StakingViewABI from '@/abis/StakingView.json';
import { t } from '@/i18n';

export default {
  name: 'GlobalDashboard',
  setup() {
    const queueInfo = ref({
      currentDailyQuota: 0n,
      todayUsedQuota: 0n,
      totalQueuedCount: 0n,
      headIndex: 0n,
      tailIndex: 0n,
      batchSize: 0n,
      reservedUsdt: 0n
    });

    let refreshInterval = null;

    const fetchQueueInfo = async () => {
      try {
        let provider = walletState.provider;
        if (!provider) {
          // Use public RPC if wallet not connected
          const rpcUrl = import.meta.env.VITE_APP_ENV === 'PROD' 
            ? 'https://bsc-rpc.publicnode.com' 
            : 'https://bsc-testnet-rpc.publicnode.com';
          provider = new ethers.JsonRpcProvider(rpcUrl);
        }
        
        const stakingViewAddress = getContractAddress('StakingView');
        if (!stakingViewAddress) return;

        const stakingView = new ethers.Contract(stakingViewAddress, StakingViewABI, provider);
        const info = await stakingView.getQueueInfo();
        
        queueInfo.value = {
          currentDailyQuota: info[0],
          todayUsedQuota: info[1],
          totalQueuedCount: info[2],
          headIndex: info[3],
          tailIndex: info[4],
          batchSize: info[5],
          reservedUsdt: info[6]
        };
      } catch (error) {
        console.error("Failed to fetch queue info:", error);
      }
    };

    onMounted(() => {
      fetchQueueInfo();
      refreshInterval = setInterval(fetchQueueInfo, 10000); // refresh every 10s
    });

    onUnmounted(() => {
      if (refreshInterval) clearInterval(refreshInterval);
    });

    const isUnlimited = computed(() => {
      return queueInfo.value.currentDailyQuota === ethers.MaxUint256;
    });

    const formattedQuota = computed(() => {
      if (isUnlimited.value) return t('home.dashboard.unlimited');
      if (queueInfo.value.currentDailyQuota === 0n) return t('home.dashboard.closed');
      return parseFloat(ethers.formatEther(queueInfo.value.currentDailyQuota)).toFixed(2);
    });

    const formattedUsed = computed(() => {
      return parseFloat(ethers.formatEther(queueInfo.value.todayUsedQuota)).toFixed(2);
    });

    const queuedOrders = computed(() => {
      const diff = Number(queueInfo.value.tailIndex - queueInfo.value.headIndex);
      return diff > 0 ? diff : 0;
    });

    const formattedReserved = computed(() => {
      return parseFloat(ethers.formatEther(queueInfo.value.reservedUsdt)).toFixed(2);
    });

    const quotaPercent = computed(() => {
      if (isUnlimited.value || queueInfo.value.currentDailyQuota === 0n) return 0;
      const used = Number(ethers.formatEther(queueInfo.value.todayUsedQuota));
      const total = Number(ethers.formatEther(queueInfo.value.currentDailyQuota));
      return Math.min(100, Math.round((used / total) * 100));
    });

    const queuePercent = computed(() => {
      const tail = Number(queueInfo.value.tailIndex);
      const head = Number(queueInfo.value.headIndex);
      if (tail === 0) return 0;
      return Math.min(100, Math.round((head / tail) * 100));
    });

    return {
      queueInfo,
      formattedQuota,
      formattedUsed,
      queuedOrders,
      formattedReserved,
      quotaPercent,
      queuePercent,
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
</style>