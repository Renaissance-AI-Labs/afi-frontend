<template>
  <section class="animate-fade-in bg-[#1a153a]/40 backdrop-blur-md rounded-2xl border border-white/10 p-4 shadow-lg relative overflow-hidden" style="animation-delay: 0.2s;">
    <div class="absolute right-0 bottom-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
    <div class="relative z-10">
      <h2 class="text-base font-display text-white mb-3 tech-font font-bold tracking-wider flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="ph-fill ph-drop text-blue-400"></i> {{ t('home.stock.title') }}
        </div>
        <button 
          @click="handleClaimAll" 
          :disabled="isClaiming || claimableIds.length === 0"
          class="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold py-1 px-3 rounded hover:bg-blue-500/30 transition tech-font disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isClaiming ? t('home.stock.claiming') : t('home.stock.claimAll') }}
        </button>
      </h2>

      <div class="flex items-center justify-between bg-black/30 border border-white/5 rounded-lg p-3 mb-3">
        <div>
          <p class="text-[11px] text-gray-300 tech-font uppercase tracking-wider mb-1">{{ t('home.stock.totalBalance') }}</p>
          <p class="text-xl font-display font-bold text-white">{{ formattedBalance }}</p>
        </div>
        <div class="text-right">
          <p class="text-[11px] text-gray-300 tech-font uppercase tracking-wider mb-1">{{ t('home.stock.totalPending') }}</p>
          <p class="text-xl font-display font-bold text-blue-400">{{ formattedTotalPending }}</p>
        </div>
      </div>

      <!-- Orders List -->
      <div v-if="orders.length > 0" class="flex flex-col gap-2 overflow-y-auto pr-1 custom-scrollbar" :class="expanded ? 'max-h-[28rem]' : 'max-h-48'">
        <div v-for="order in orders" :key="order.index" class="bg-black/20 border border-white/5 rounded-lg p-2.5 flex flex-col gap-1.5">
          <div class="flex justify-between items-center">
            <span class="text-sm text-white font-bold tech-font">#{{ order.index }} <span class="text-xs text-gray-300 font-normal">({{ formatUnits(order.amount) }}U)</span></span>
            <span class="text-xs text-blue-400">{{ t('home.stock.pending', { amount: formatUnits(order.pending) }) }}</span>
          </div>
          
          <div class="w-full bg-black/40 rounded-full h-1.5 overflow-hidden mt-0.5">
            <div class="bg-blue-500 h-full rounded-full" :style="{ width: `${getProgressPercent(order)}%` }"></div>
          </div>

          <div class="flex justify-between text-[11px] text-gray-400 tech-font">
            <span>{{ getProgressPercent(order) }}% ({{ formatUnits(order.vested) }}/{{ formatUnits(order.totalShare) }})</span>
            <span>{{ formatRate(order.ratePerSecond) }}/{{ t('home.stock.day') }}</span>
          </div>
        </div>
      </div>
      <div v-else class="flex items-center justify-center gap-1.5 py-4 text-gray-400 text-xs tech-font">
        <i class="ph ph-warning-circle text-base"></i>
        <span>{{ t('home.stock.empty') }}</span>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import { ethers } from 'ethers';
import { walletState } from '@/services/wallet';
import { getContractAddress } from '@/services/contracts';
import { showToast } from '@/services/notification';
import StockABI from '@/abis/Stock.json';
import { t } from '@/i18n';

export default {
  name: 'StockDividendSection',
  props: {
    expanded: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const balance = ref(0n);
    const orders = ref([]);
    const isClaiming = ref(false);
    let refreshInterval = null;

    const fetchData = async () => {
      if (!walletState.isConnected || !walletState.address) return;
      
      try {
        const stockAddress = getContractAddress('Stock');
        if (!stockAddress) return;

        const stock = new ethers.Contract(stockAddress, StockABI, walletState.provider);
        
        // Fetch balance
        balance.value = await stock.balanceOf(walletState.address);

        // Fetch orders (minCompoundCount = 5 to show only eligible orders)
        const result = await stock.getUserOrderInfos(walletState.address, 5, 0, 100);
        orders.value = result[0].filter(o => o.amount > 0n);
      } catch (error) {
        console.error("Failed to fetch stock data:", error);
      }
    };

    onMounted(() => {
      fetchData();
      refreshInterval = setInterval(fetchData, 10000);
    });

    onUnmounted(() => {
      if (refreshInterval) clearInterval(refreshInterval);
    });

    watch(() => walletState.isConnected, (connected) => {
      if (connected) fetchData();
      else {
        balance.value = 0n;
        orders.value = [];
      }
    });

    const formattedBalance = computed(() => {
      return parseFloat(ethers.formatEther(balance.value)).toFixed(4);
    });

    const totalPending = computed(() => {
      return orders.value.reduce((sum, order) => sum + order.pending, 0n);
    });

    const formattedTotalPending = computed(() => {
      return parseFloat(ethers.formatEther(totalPending.value)).toFixed(4);
    });

    const claimableIds = computed(() => {
      return orders.value.filter(o => o.pending > 0n).map(o => o.index);
    });

    const formatUnits = (val) => {
      return parseFloat(ethers.formatEther(val)).toFixed(2);
    };

    const formatRate = (ratePerSec) => {
      // rate per day = ratePerSec * 86400
      const ratePerDay = ratePerSec * 86400n;
      return parseFloat(ethers.formatEther(ratePerDay)).toFixed(4);
    };

    const getProgressPercent = (order) => {
      if (order.totalShare === 0n) return 0;
      const vested = Number(ethers.formatEther(order.vested));
      const total = Number(ethers.formatEther(order.totalShare));
      return Math.min(100, Math.round((vested / total) * 100));
    };

    const handleClaimAll = async () => {
      if (claimableIds.value.length === 0) return;
      
      isClaiming.value = true;
      try {
        const stockAddress = getContractAddress('Stock');
        const stock = new ethers.Contract(stockAddress, StockABI, walletState.signer);
        
        const tx = await stock.claimBatch(claimableIds.value);
        await tx.wait();
        
        showToast(t('home.stock.claimSuccess'), 'success');
        fetchData();
      } catch (error) {
        console.error(error);
        if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
          showToast(t('home.staking.cancelled'), 'info');
        } else {
          showToast(t('home.stock.claimFailed'), 'error');
        }
      } finally {
        isClaiming.value = false;
      }
    };

    return {
      balance,
      orders,
      isClaiming,
      formattedBalance,
      formattedTotalPending,
      claimableIds,
      formatUnits,
      formatRate,
      getProgressPercent,
      handleClaimAll,
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
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
</style>