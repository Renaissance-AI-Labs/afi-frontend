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

          <!-- Queued Info -->
          <div v-if="order.isQueued && status === 0" class="flex flex-col gap-3 mb-4">
            <div class="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/5">
              <div class="flex flex-col items-center flex-1">
                <span class="text-[10px] text-gray-400 tech-font uppercase tracking-wider mb-1">{{ t('orders.queuePosition') }}</span>
                <span class="text-white font-display font-bold">{{ order.queuePosition !== undefined ? order.queuePosition : '-' }}</span>
              </div>
              <div class="w-px h-8 bg-gradient-to-b from-transparent via-white/15 to-transparent"></div>
              <div class="flex flex-col items-center flex-1">
                <span class="text-[10px] text-gray-400 tech-font uppercase tracking-wider mb-1">{{ t('orders.queueAmountAhead') }}</span>
                <span class="text-cyan-400 font-display font-bold" style="filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));">{{ order.queueAmountAhead || '-' }}</span>
              </div>
              <div class="w-px h-8 bg-gradient-to-b from-transparent via-white/15 to-transparent"></div>
              <div class="flex flex-col items-center flex-1">
                <span class="text-[10px] text-gray-400 tech-font uppercase tracking-wider mb-1">{{ t('orders.queueWait') }}</span>
                <span class="text-cyan-400 font-display font-bold" style="filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));">{{ order.queueWait !== undefined ? order.queueWait : '-' }}</span>
              </div>
            </div>
          </div>

          <!-- Order Details -->
          <div class="flex flex-col gap-3 mb-4" v-if="!order.isQueued && status !== 3">
            
            <!-- Times -->
            <div class="flex justify-between items-center text-[11px] text-gray-400 tech-font bg-white/5 rounded-lg p-3 border border-white/5">
              <div class="flex flex-col">
                <span class="uppercase tracking-wider mb-0.5">{{ t('orders.startTime') }}</span>
                <span class="text-white font-display">{{ formatDateTime(order.stakeTime) }}</span>
              </div>
              <div class="w-px h-6 bg-white/10"></div>
              <div class="flex flex-col text-right">
                <span class="uppercase tracking-wider mb-0.5">{{ t('orders.endTime') }}</span>
                <span class="text-white font-display">{{ formatDateTime(Number(order.stakeTime) + Number(order.stakeDays)) }}</span>
              </div>
            </div>

            <!-- Current Reward -->
            <div class="flex justify-between items-center bg-white/5 rounded-lg p-3 border border-white/5">
              <span class="text-[11px] text-gray-400 tech-font uppercase tracking-wider">{{ t('orders.currentReward') }}</span>
              <div class="text-right">
                <span :key="order.currentReward" class="text-lg tech-font font-bold text-app-pink animate-number-jump inline-block">{{ formatUnits(order.currentReward) }}</span>
                <span class="text-xs text-pink-400/70 ml-1">USDT</span>
              </div>
            </div>

          </div>

          <!-- Final Reward for Completed -->
          <div v-if="status === 3 && !isCancelledQueue(order)" class="bg-white/5 rounded-lg p-3 mb-4 text-center">
            <p class="text-[11px] text-gray-400 tech-font uppercase tracking-wider mb-1">{{ t('orders.finalReward') }}</p>
            <p class="text-lg tech-font font-bold text-app-pink">{{ formatUnits(order.finalReward) }} USDT</p>
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
                @click="handleRedeem(order)"
                :disabled="actionLoading === order.id"
                class="flex-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 font-bold py-2 rounded-lg text-sm transition tech-font disabled:opacity-50"
              >
                {{ actionLoading === order.id ? t('orders.processingAction') : t('orders.redeem') }}
              </button>
              <button 
                @click="handleCompound(order)"
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
      <div v-if="hasMore" class="flex justify-center mt-2 mb-6">
        <button @click="loadMore" class="bg-white/5 border border-white/10 px-8 py-2.5 rounded-full text-sm text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition tech-font font-bold flex items-center gap-2">
          {{ t('orders.loadMore') }} <i class="ph ph-caret-down"></i>
        </button>
      </div>

    </div>

    <!-- Confirmation Modal -->
    <div v-if="confirmModal.show" class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-[#1a153a] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 class="text-xl tech-font font-bold text-white mb-3">{{ confirmModal.title }}</h3>
        <div v-if="confirmModal.modalType === 'redeem' && confirmModal.redeemMeta" class="space-y-3 mb-6">
          <p class="text-sm text-gray-300 tech-font leading-relaxed">
            {{ t('orders.redeemCompoundLine', { count: confirmModal.redeemMeta.compoundCount }) }}
          </p>
          <div class="rounded-lg border border-cyan-500/25 bg-cyan-500/10 p-3">
            <p class="text-[10px] text-cyan-200/80 tech-font uppercase tracking-wider mb-1">{{ t('orders.redeemPrincipalLead') }}</p>
            <p class="text-base tech-font font-bold text-cyan-300 leading-snug">
              {{ t('orders.redeemPrincipalDetail', { pct: confirmModal.redeemMeta.principalPct, amount: confirmModal.redeemMeta.principalUsdt }) }}
            </p>
          </div>
          <div class="rounded-lg border border-pink-500/25 bg-pink-500/10 p-3">
            <p class="text-[10px] text-pink-200/80 tech-font uppercase tracking-wider mb-1">{{ t('orders.redeemInterestLead') }}</p>
            <p class="text-base tech-font font-bold text-app-pink leading-snug">
              {{ t('orders.redeemInterestDetail', { amount: confirmModal.redeemMeta.interestAfi }) }}
            </p>
          </div>
          <p class="text-[11px] text-gray-500 tech-font">{{ t('orders.redeemNote') }}</p>
        </div>
        <div v-else-if="confirmModal.modalType === 'compound' && confirmModal.compoundMeta" class="mb-6">
          <p class="text-sm text-gray-300 tech-font leading-relaxed mb-2" v-html="t('orders.compoundConfirmDesc', { amount: `<span class='text-cyan-300 font-bold'>${confirmModal.compoundMeta.interestUsdt} USDT</span>` })"></p>
        </div>
        <p v-else class="text-sm text-gray-300 tech-font mb-6 leading-relaxed">{{ confirmModal.message }}</p>
        
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
import StakingViewABI from '@/abis/StakingView.json';
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
      isDestructive: false,
      modalType: null,
      redeemMeta: null,
      compoundMeta: null
    });
    let countdownInterval = null;
    
    let refreshInterval = null;
    let rewardInterval = null;
    let stakingContract = null;
    let stakeDaysMap = {};

    const formatDateTime = (timestamp) => {
      if (!timestamp) return '-';
      const date = new Date(Number(timestamp) * 1000);
      const y = date.getFullYear();
      const m = (date.getMonth() + 1).toString().padStart(2, '0');
      const d = date.getDate().toString().padStart(2, '0');
      const h = date.getHours().toString().padStart(2, '0');
      const min = date.getMinutes().toString().padStart(2, '0');
      return `${y}/${m}/${d} ${h}:${min}`;
    };

    const fetchOrders = async (isLoadMore = false, isSilent = false) => {
      if (!walletState.isConnected || !walletState.address) return;
      
      if (!isLoadMore && !isSilent) {
        loading.value = true;
        orders.value = [];
        nextCursor.value = 0n;
      }

      if (isSilent && nextCursor.value > 0n) {
        // If we are paginating, don't silent refresh the whole list to avoid jumping
        return;
      }

      try {
        const stakingAddress = getContractAddress('Staking');
        const stakingViewAddress = getContractAddress('StakingView');
        if (!stakingAddress || !stakingViewAddress) return;

        stakingContract = new ethers.Contract(stakingAddress, StakingABI, walletState.provider);
        const stakingViewContract = new ethers.Contract(stakingViewAddress, StakingViewABI, walletState.provider);
        
        const result = await stakingContract.getUserRecords(
          walletState.address, 
          nextCursor.value, 
          10, 
          props.status
        );

        const fetchedRecords = result[0];
        nextCursor.value = result[1];
        hasMore.value = fetchedRecords.length === 10 && nextCursor.value > 0n;

        const enrichedRecords = await Promise.all(fetchedRecords.map(async (rec) => {
          let currentReward = 0n;
          let principalRefundPercent = 0n;
          let stakeDays = 0n;
          let finalReward = rec.finalReward || 0n;
          let queuePosition = undefined;
          let queueAmountAhead = undefined;
          let queueWait = undefined;

          const isQueued = rec.isQueued !== undefined ? rec.isQueued : (rec[5] !== undefined ? rec[5] : false);

          if (props.status === 0 && isQueued) {
            try {
              const orderId = rec.id !== undefined ? rec.id : (rec[7] !== undefined ? rec[7] : undefined);
              if (orderId !== undefined) {
                const qInfo = await stakingViewContract.getQueuePositionInfo(walletState.address, orderId);
                if (qInfo[0]) {
                  queuePosition = Number(qInfo[1]);
                  queueAmountAhead = formatUnits(qInfo[2]);
                  queueWait = Number(qInfo[3]);
                }
              }
            } catch (e) {
              console.warn("Failed to get queue info for order", rec.id, e);
            }
          }

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
            isQueued,
            stakeTime: rec.stakeTime !== undefined ? rec.stakeTime : (rec[0] !== undefined ? rec[0] : 0n),
            currentReward,
            principalRefundPercent,
            stakeDays,
            finalReward,
            queuePosition,
            queueAmountAhead,
            queueWait
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
        if (!isSilent) loading.value = false;
      }
    };

    const updateRewards = async () => {
      if (!walletState.isConnected || !walletState.address || !stakingContract) return;
      if (props.status === 3 || props.status === 0) return; // Only active/claimable have changing rewards

      for (let i = 0; i < orders.value.length; i++) {
        const order = orders.value[i];
        if (!order.isQueued) {
          try {
            const newReward = await stakingContract.rewardOfSlot(walletState.address, order.id);
            if (newReward !== order.currentReward) {
              order.currentReward = newReward;
            }
          } catch (e) {
            // ignore
          }
        }
      }
    };

    onMounted(() => {
      fetchOrders();
      refreshInterval = setInterval(() => fetchOrders(false, true), 15000);
      rewardInterval = setInterval(updateRewards, 6000);
    });

    onUnmounted(() => {
      if (refreshInterval) clearInterval(refreshInterval);
      if (rewardInterval) clearInterval(rewardInterval);
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

    const openConfirmModal = ({
      title,
      message = '',
      action,
      requireCountdown = false,
      isDestructive = false,
      modalType = null,
      redeemMeta = null,
      compoundMeta = null
    }) => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }
      confirmModal.value = {
        show: true,
        title,
        message,
        action,
        countdown: requireCountdown ? 5 : 0,
        loading: false,
        isDestructive,
        modalType,
        redeemMeta,
        compoundMeta
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
      openConfirmModal({
        title: t('orders.cancelConfirmTitle'),
        message: t('orders.cancelConfirm', { amount: ethers.formatEther(refund) }),
        action: async () => {
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
        requireCountdown: true,
        isDestructive: true
      });
    };

    const handleRedeem = async (order) => {
      const id = order.id;
      let rewardWei = order.currentReward ?? 0n;
      let pctBn = order.principalRefundPercent ?? 0n;
      try {
        if (stakingContract && id !== undefined) {
          const [r, p] = await Promise.all([
            stakingContract.rewardOfSlot(walletState.address, id),
            stakingContract.principalRefundPercent(order.compoundCount ?? 0)
          ]);
          rewardWei = r;
          pctBn = p;
        }
      } catch (e) {
        console.warn('Failed to refresh redeem preview', e);
      }
      try {
        const amt = BigInt(order.amount ?? 0n);
        const pct = BigInt(pctBn);
        const principalWei = (amt * pct) / 100n;
        const principalPct = Number(pct);
        const interestWei = rewardWei > amt ? rewardWei - amt : 0n;
        const redeemMeta = {
          compoundCount: Number(order.compoundCount ?? 0),
          principalPct: Number.isFinite(principalPct) ? principalPct : 0,
          principalUsdt: formatUnits(principalWei),
          interestAfi: formatUnits(interestWei)
        };
        openConfirmModal({
          title: t('orders.redeemConfirmTitle'),
          message: '',
          modalType: 'redeem',
          redeemMeta,
          action: async () => {
            actionLoading.value = id;
            try {
              const contract = getSignerContract();
              const tx = await contract.unstake(id, 1);
              await tx.wait();
              showToast(t('orders.redeemSuccess'), 'success');
              fetchOrders();
            } catch (error) {
              console.error(error);
              if (error.code !== 4001 && error.code !== 'ACTION_REJECTED') {
                showToast(error.reason || t('orders.redeemFailed'), 'error');
              }
            } finally {
              actionLoading.value = null;
            }
          }
        });
      } catch (e) {
        console.error(e);
        showToast(t('orders.redeemFailed'), 'error');
      }
    };

    const handleCompound = (order) => {
      const id = order.id;
      const amt = BigInt(order.amount ?? 0n);
      const totalReward = BigInt(order.currentReward ?? 0n);
      const interestWei = totalReward > amt ? totalReward - amt : 0n;
      const interestUsdt = formatUnits(interestWei);

      openConfirmModal({
        title: t('orders.compoundConfirmTitle'),
        message: t('orders.compoundConfirmDesc'),
        modalType: 'compound',
        compoundMeta: {
          interestUsdt
        },
        action: async () => {
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
      });
    };

    return {
      orders,
      loading,
      actionLoading,
      hasMore,
      walletState,
      loadMore,
      formatUnits,
      formatDateTime,
      getStatusClass,
      getStatusText,
      isCancelledQueue,
      handleCancelQueue,
      handleRedeem,
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

.animate-number-jump {
  animation: numberJump 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes numberJump {
  0% { transform: translateY(0) scale(1); color: #ec4899; }
  50% { transform: translateY(-3px) scale(1.1); color: #fdf2f8; text-shadow: 0 0 8px rgba(236, 72, 153, 0.8); }
  100% { transform: translateY(0) scale(1); color: #ec4899; }
}
</style>