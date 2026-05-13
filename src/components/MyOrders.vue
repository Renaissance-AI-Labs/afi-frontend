<template>
  <div class="my-orders w-full">
    <div class="animate-fade-in flex flex-col gap-4">
      <div v-if="!walletState.isConnected" class="text-center py-10 text-gray-500 tech-font text-[13px] bg-[#1a153a]/50 rounded-xl border-2 border-white/10">
        {{ t('common.connectWalletFirst') }}
      </div>
      <div v-else-if="loading" class="text-center py-10 text-gray-500 tech-font text-[13px] bg-[#1a153a]/50 rounded-xl border-2 border-white/10 flex justify-center items-center gap-2">
         <i class="ph ph-spinner animate-spin text-lg"></i> {{ t('orders.loading') }}
      </div>
      <div v-else-if="orders.length === 0" class="text-center py-12 text-gray-500 tech-font text-[13px] bg-[#1a153a]/50 rounded-xl border-2 border-white/10 flex flex-col items-center gap-3">
        <i class="ph ph-receipt text-3xl opacity-50"></i>
        {{ t('orders.empty') }}
      </div>
      
      <div v-else class="flex flex-col gap-4">
        <div v-for="order in orders" :key="order.id" class="bg-black/30 border border-white/10 rounded-xl p-5 relative overflow-hidden">
          
          <!-- Header -->
          <div class="flex justify-between items-start mb-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-white tech-font font-bold text-lg">{{ t('orders.orderNumber', { id: order.id !== undefined ? Number(order.id) + 1 : '?' }) }}</span>
                <span class="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider" :class="getStatusClass(status)">
                  {{ getStatusText(status) }}
                </span>
              </div>
              <p class="text-xs text-gray-400 tech-font">{{ t('orders.amount', { amount: formatUnits(order.amount) }) }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-400 tech-font">{{ t('orders.compoundCount') }}</p>
              <p class="text-sm text-white font-bold">{{ order.compoundCount !== undefined ? order.compoundCount : 0 }}</p>
            </div>
          </div>

          <!-- Progress Bars -->
          <div class="flex flex-col gap-3 mb-4">
            
            <!-- Time Progress (Only if not queued) -->
            <div v-if="!order.isQueued && status !== 3">
              <div class="flex justify-between text-[11px] text-gray-400 tech-font mb-1">
                <span>{{ t('orders.timeProgress') }}</span>
                <span>{{ getTimePercent(order) }}%</span>
              </div>
              <div class="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                <div class="bg-blue-500 h-full rounded-full" :style="{ width: `${getTimePercent(order)}%` }"></div>
              </div>
            </div>

            <!-- Out Progress -->
            <div v-if="status !== 3">
              <div class="flex justify-between text-[11px] text-gray-400 tech-font mb-1">
                <span>{{ t('orders.maxRewardProgress') }}</span>
                <span>{{ getOutPercent(order) }}%</span>
              </div>
              <div class="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                <div class="bg-pink-500 h-full rounded-full" :style="{ width: `${getOutPercent(order)}%` }"></div>
              </div>
            </div>

            <!-- Principal Refund Progress -->
            <div v-if="status !== 3">
              <div class="flex justify-between text-[11px] text-gray-400 tech-font mb-1">
                <span>{{ t('orders.principalRefundTarget') }}</span>
                <span>{{ getPrincipalPercent(order) }}%</span>
              </div>
              <div class="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                <div class="bg-purple-500 h-full rounded-full" :style="{ width: `${getPrincipalTargetPercent(order)}%` }"></div>
              </div>
            </div>

          </div>

          <!-- Final Reward for Completed -->
          <div v-if="status === 3 && !isCancelledQueue(order)" class="bg-white/5 rounded-lg p-3 mb-4 text-center">
            <p class="text-[11px] text-gray-400 tech-font uppercase tracking-wider mb-1">{{ t('orders.finalReward') }}</p>
            <p class="text-lg font-display font-bold text-app-pink">{{ formatUnits(order.finalReward) }} AFI</p>
          </div>

          <!-- Cancelled Queue Info -->
          <div v-if="status === 3 && isCancelledQueue(order)" class="bg-white/5 rounded-lg p-3 mb-4 text-center">
            <p class="text-[11px] text-gray-400 tech-font uppercase tracking-wider mb-1">{{ t('orders.queueCancelled') }}</p>
            <p class="text-sm tech-font font-bold text-gray-300">{{ t('orders.refunded', { amount: formatUnits(order.finalReward) }) }}</p>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 mt-4 pt-4 border-t border-white/5" v-if="status === 0 || status === 2">
            <button 
              v-if="status === 0" 
              @click="handleCancelQueue(order.id, order.amount)"
              :disabled="actionLoading === order.id"
              class="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 font-bold py-2 rounded-lg text-sm transition tech-font disabled:opacity-50"
            >
              {{ actionLoading === order.id ? t('orders.processingAction') : t('orders.cancelQueue') }}
            </button>
            
            <template v-if="status === 2">
              <button 
                @click="handleHarvest(order.id)"
                :disabled="actionLoading === order.id"
                class="flex-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 font-bold py-2 rounded-lg text-sm transition tech-font disabled:opacity-50"
              >
                {{ actionLoading === order.id ? t('orders.processingAction') : t('orders.claimUsdt') }}
              </button>
              <button 
                @click="handleCompound(order.id)"
                :disabled="actionLoading === order.id"
                class="flex-1 bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 border border-pink-500/30 font-bold py-2 rounded-lg text-sm transition tech-font disabled:opacity-50"
              >
                {{ actionLoading === order.id ? t('orders.processingAction') : t('orders.compound') }}
              </button>
            </template>
          </div>

        </div>
      </div>

      <!-- Load More -->
      <div v-if="hasMore" class="flex justify-center mt-4">
        <button @click="loadMore" class="text-sm text-gray-400 hover:text-white transition tech-font">
          {{ t('orders.loadMore') }}
        </button>
      </div>

    </div>

    <!-- Confirmation Modal -->
    <div v-if="confirmModal.show" class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-[#1a153a] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 class="text-xl font-display text-white mb-3 tech-font">{{ confirmModal.title }}</h3>
        <p class="text-sm text-gray-300 tech-font mb-6 leading-relaxed">{{ confirmModal.message }}</p>
        
        <div class="flex gap-3">
          <button 
            @click="closeConfirmModal" 
            :disabled="confirmModal.loading"
            class="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 transition tech-font text-sm disabled:opacity-50"
          >
            {{ t('common.cancel') }}
          </button>
          <button 
            @click="executeConfirmAction"
            :disabled="confirmModal.countdown > 0 || confirmModal.loading"
            class="flex-1 py-2.5 rounded-lg font-bold transition tech-font text-sm disabled:opacity-50 flex justify-center items-center gap-2"
            :class="confirmModal.isDestructive ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30'"
          >
            <i v-if="confirmModal.loading" class="ph ph-spinner animate-spin"></i>
            <span v-else>
              {{ confirmModal.countdown > 0 ? t('common.confirmWithCountdown', { count: confirmModal.countdown }) : t('common.confirm') }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { ethers } from 'ethers';
import { walletState } from '@/services/wallet';
import { getContractAddress } from '@/services/contracts';
import { showToast } from '@/services/notification';
import StakingABI from '@/abis/Staking.json';
import { t } from '@/i18n';

export default {
  name: 'MyOrders',
  props: {
    status: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const orders = ref([]);
    const loading = ref(false);
    const actionLoading = ref(null);
    const hasMore = ref(false);
    const nextCursor = ref(0n);
    
    const confirmModal = ref({
      show: false,
      title: '',
      message: '',
      action: null,
      countdown: 0,
      loading: false,
      isDestructive: false
    });
    let countdownInterval = null;
    
    let refreshInterval = null;
    let stakingContract = null;
    let stakeDaysMap = {};

    const fetchOrders = async (isLoadMore = false) => {
      if (!walletState.isConnected || !walletState.address) return;
      
      if (!isLoadMore) {
        loading.value = true;
        orders.value = [];
        nextCursor.value = 0n;
      }

      try {
        const stakingAddress = getContractAddress('Staking');
        if (!stakingAddress) return;

        stakingContract = new ethers.Contract(stakingAddress, StakingABI, walletState.provider);
        
        const result = await stakingContract.getUserRecords(
          walletState.address, 
          nextCursor.value, 
          10, 
          props.status
        );

        const fetchedRecords = result[0];
        nextCursor.value = result[1];
        hasMore.value = nextCursor.value > 0n;

        const enrichedRecords = await Promise.all(fetchedRecords.map(async (rec) => {
          let currentReward = 0n;
          let principalRefundPercent = 0n;
          let stakeDays = 0n;
          let finalReward = rec.finalReward || 0n;

          if (props.status !== 3) {
            try {
              currentReward = await stakingContract.rewardOfSlot(walletState.address, rec.id);
            } catch (e) {
              console.warn("Failed to fetch rewardOfSlot for id", rec.id, e);
            }
            try {
              principalRefundPercent = await stakingContract.principalRefundPercent(rec.compoundCount);
            } catch (e) {
              console.warn("Failed to fetch principalRefundPercent for cc", rec.compoundCount, e);
            }
            
            if (!stakeDaysMap[rec.stakeIndex]) {
              try {
                stakeDaysMap[rec.stakeIndex] = await stakingContract.stakeDays(rec.stakeIndex);
              } catch (e) {
                console.warn("Failed to fetch stakeDays for index", rec.stakeIndex, e);
                stakeDaysMap[rec.stakeIndex] = 0n;
              }
            }
            stakeDays = stakeDaysMap[rec.stakeIndex];
          }

          return {
            ...rec,
            id: rec.id !== undefined ? rec.id : (rec[7] !== undefined ? rec[7] : undefined),
            amount: rec.amount || rec[1] || 0n,
            compoundCount: rec.compoundCount !== undefined ? rec.compoundCount : (rec[4] !== undefined ? rec[4] : 0),
            isQueued: rec.isQueued !== undefined ? rec.isQueued : (rec[5] !== undefined ? rec[5] : false),
            stakeTime: rec.stakeTime !== undefined ? rec.stakeTime : (rec[0] !== undefined ? rec[0] : 0n),
            currentReward,
            principalRefundPercent,
            stakeDays,
            finalReward
          };
        }));

        if (isLoadMore) {
          orders.value = [...orders.value, ...enrichedRecords];
        } else {
          orders.value = enrichedRecords;
        }

      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchOrders();
      refreshInterval = setInterval(() => fetchOrders(false), 15000);
    });

    onUnmounted(() => {
      if (refreshInterval) clearInterval(refreshInterval);
    });

    watch(() => props.status, () => {
      fetchOrders();
    });

    watch(() => walletState.isConnected, (connected) => {
      if (connected) fetchOrders();
      else orders.value = [];
    });

    const loadMore = () => {
      fetchOrders(true);
    };

    const formatUnits = (val) => {
      if (val === undefined || val === null) return '0.00';
      try {
        return parseFloat(ethers.formatEther(val)).toFixed(2);
      } catch (e) {
        console.warn("formatUnits error:", e, val);
        return '0.00';
      }
    };

    const getStatusClass = (status) => {
      switch(status) {
        case 0: return 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30';
        case 1: return 'bg-green-500/20 text-green-500 border border-green-500/30';
        case 2: return 'bg-blue-500/20 text-blue-500 border border-blue-500/30';
        case 3: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
        default: return 'bg-gray-500/20 text-gray-400';
      }
    };

    const getStatusText = (status) => {
      switch(status) {
        case 0: return t('orders.status.queued');
        case 1: return t('orders.status.active');
        case 2: return t('orders.status.claimable');
        case 3: return t('orders.status.completed');
        default: return t('orders.status.unknown');
      }
    };

    const getTimePercent = (order) => {
      if (order.isQueued || order.stakeDays === 0n || !order.stakeDays) return 0;
      const now = Math.floor(Date.now() / 1000);
      const start = Number(order.stakeTime);
      const duration = Number(order.stakeDays);
      const elapsed = now - start;
      if (elapsed >= duration) return 100;
      if (elapsed <= 0) return 0;
      return Math.max(0, Math.min(100, Math.round((elapsed / duration) * 100)));
    };

    const getOutPercent = (order) => {
      if (order.amount === 0n) return 0;
      const current = Number(ethers.formatEther(order.currentReward));
      const target = Number(ethers.formatEther(order.amount)) * 3;
      return Math.min(100, Math.round((current / target) * 100));
    };

    const getPrincipalPercent = (order) => {
      return Number(order.principalRefundPercent);
    };

    const getPrincipalTargetPercent = (order) => {
      if (order.amount === 0n) return 0;
      const current = Number(ethers.formatEther(order.currentReward));
      const target = Number(ethers.formatEther(order.amount)) * (Number(order.principalRefundPercent) / 100);
      if (target === 0) return 0;
      return Math.min(100, Math.round((current / target) * 100));
    };

    const isCancelledQueue = (order) => {
      if (order.amount === undefined || order.finalReward === undefined) return false;
      try {
        const amount = BigInt(order.amount);
        const reward = BigInt(order.finalReward);
        return amount > 0n && reward === (amount * 50n) / 100n && Number(order.compoundCount) === 0;
      } catch (e) {
        return false;
      }
    };

    const getSignerContract = () => {
      const stakingAddress = getContractAddress('Staking');
      return new ethers.Contract(stakingAddress, StakingABI, walletState.signer);
    };

    const openConfirmModal = (title, message, actionFn, requireCountdown = false, isDestructive = false) => {
      confirmModal.value = {
        show: true,
        title,
        message,
        action: actionFn,
        countdown: requireCountdown ? 5 : 0,
        loading: false,
        isDestructive
      };

      if (requireCountdown) {
        countdownInterval = setInterval(() => {
          if (confirmModal.value.countdown > 0) {
            confirmModal.value.countdown--;
          } else {
            clearInterval(countdownInterval);
          }
        }, 1000);
      }
    };

    const closeConfirmModal = () => {
      confirmModal.value.show = false;
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };

    const executeConfirmAction = async () => {
      if (confirmModal.value.action) {
        confirmModal.value.loading = true;
        await confirmModal.value.action();
        closeConfirmModal();
      }
    };

    const handleCancelQueue = (id, amount) => {
      const refund = (BigInt(amount) * 50n) / 100n;
      openConfirmModal(
        t('orders.cancelConfirmTitle'),
        t('orders.cancelConfirm', { amount: ethers.formatEther(refund) }),
        async () => {
          actionLoading.value = id;
          try {
            const contract = getSignerContract();
            const tx = await contract.withdrawFromQueue(id);
            await tx.wait();
            showToast(t('orders.cancelSuccess'), 'success');
            fetchOrders();
          } catch (error) {
            console.error(error);
            if (error.code !== 4001 && error.code !== 'ACTION_REJECTED') {
              showToast(error.reason || t('orders.cancelFailed'), 'error');
            }
          } finally {
            actionLoading.value = null;
          }
        },
        true, // require 5s countdown
        true  // destructive action (red button)
      );
    };

    const handleHarvest = (id) => {
      openConfirmModal(
        t('orders.claimConfirmTitle'),
        t('orders.claimConfirmDesc'),
        async () => {
          actionLoading.value = id;
          try {
            const contract = getSignerContract();
            const tx = await contract.unstake(id, 1);
            await tx.wait();
            showToast(t('orders.claimSuccess'), 'success');
            fetchOrders();
          } catch (error) {
            console.error(error);
            if (error.code !== 4001 && error.code !== 'ACTION_REJECTED') {
              showToast(error.reason || t('orders.claimFailed'), 'error');
            }
          } finally {
            actionLoading.value = null;
          }
        }
      );
    };

    const handleCompound = (id) => {
      openConfirmModal(
        t('orders.compoundConfirmTitle'),
        t('orders.compoundConfirmDesc'),
        async () => {
          actionLoading.value = id;
          try {
            const contract = getSignerContract();
            const tx = await contract.unstake(id, 2);
            await tx.wait();
            showToast(t('orders.compoundSuccess'), 'success');
            fetchOrders();
          } catch (error) {
            console.error(error);
            if (error.code !== 4001 && error.code !== 'ACTION_REJECTED') {
              showToast(error.reason || t('orders.compoundFailed'), 'error');
            }
          } finally {
            actionLoading.value = null;
          }
        }
      );
    };

    return {
      orders,
      loading,
      actionLoading,
      hasMore,
      walletState,
      loadMore,
      formatUnits,
      getStatusClass,
      getStatusText,
      getTimePercent,
      getOutPercent,
      getPrincipalPercent,
      getPrincipalTargetPercent,
      isCancelledQueue,
      handleCancelQueue,
      handleHarvest,
      handleCompound,
      confirmModal,
      closeConfirmModal,
      executeConfirmAction,
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

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>