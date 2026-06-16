<template>
  <section :class="sectionClass" style="animation-delay: 0.18s;">
    <div :class="glowClass"></div>
    <div class="relative z-10">
      <div class="flex items-start justify-between gap-3 mb-3">
        <div>
          <h2 class="text-base font-display text-white tech-font font-bold tracking-wider flex items-center gap-2">
            <i :class="titleIconClass"></i> {{ t('home.airdrop.title') }}
          </h2>
          <p class="text-[11px] text-gray-300 tech-font mt-1 leading-relaxed">{{ t('home.airdrop.intro') }}</p>
        </div>
        <div v-if="walletState.isConnected && isAdmin" class="shrink-0 flex items-center gap-2">
          <router-link
            to="/admin/airdrop"
            :class="adminLinkClass"
            :aria-label="t('home.airdrop.admin')"
          >
            <i class="ph ph-gear-six text-base"></i>
          </router-link>
        </div>
      </div>

      <div :class="contentClass">
        <div v-if="!walletState.isConnected" class="flex flex-col gap-3 text-center">
          <p class="text-sm text-gray-300 tech-font">{{ t('home.airdrop.connectHint') }}</p>
          <button
            @click="$emit('open-get-started-modal')"
            :class="connectButtonClass"
          >
            {{ t('header.connectWallet') }}
          </button>
        </div>

        <div v-else-if="!isConfigured" class="text-center py-5 text-gray-500 tech-font text-[13px]">
          {{ t('home.airdrop.notConfigured') }}
        </div>

        <div v-else-if="loading" class="text-center py-5 text-gray-500 tech-font text-[13px] flex justify-center items-center gap-2">
          <i class="ph ph-spinner animate-spin text-lg"></i> {{ t('common.loading') }}
        </div>

        <div v-else-if="orders.length === 0" class="text-center py-5 text-gray-500 tech-font text-[13px] flex flex-col items-center gap-2">
          <i class="ph ph-gift text-3xl opacity-50"></i>
          {{ t('home.airdrop.empty') }}
        </div>

        <template v-else>
          <div class="flex flex-col gap-2">
            <div
              v-for="order in orders"
              :key="order.recordId"
              class="bg-black/30 border border-white/10 rounded-xl p-3 relative overflow-hidden"
            >
              <div class="flex justify-between items-start gap-3 mb-2">
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-white tech-font font-bold text-sm">{{ t('home.airdrop.order', { id: order.recordId + 1 }) }}</span>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border" :class="getStatusClass(order)">
                      {{ getStatusText(order) }}
                    </span>
                  </div>
                  <p class="text-[10px] text-gray-500 tech-font mt-1">{{ t('home.airdrop.remaining', { time: formatRemain(order) }) }}</p>
                </div>
                <button
                  @click="handleClaim(order)"
                  :disabled="!canClaim(order) || actionLoading === order.recordId"
                  class="shrink-0 px-3 py-1.5 rounded-lg font-bold transition tech-font text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  :class="getClaimButtonClass(order)"
                >
                  <i v-if="actionLoading === order.recordId" class="ph ph-spinner animate-spin"></i>
                  {{ getClaimButtonText(order) }}
                </button>
              </div>

              <div class="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <p class="text-[10px] text-gray-500 tech-font">{{ t('home.airdrop.pending') }}</p>
                  <p
                    :key="formatToken(computePending(order), 4)"
                    class="text-sm tech-font font-bold text-app-pink animate-number-jump inline-block"
                  >
                    {{ formatToken(computePending(order), 4) }}
                  </p>
                </div>
                <div>
                  <p class="text-[10px] text-gray-500 tech-font">{{ t('home.airdrop.total') }}</p>
                  <p class="text-sm text-white font-bold">{{ formatToken(order.totalAmount) }}</p>
                </div>
                <div>
                  <p class="text-[10px] text-gray-500 tech-font">{{ t('home.airdrop.claimed') }}</p>
                  <p class="text-sm text-white font-bold">{{ formatToken(order.claimed) }}</p>
                </div>
              </div>

              <div class="h-1.5 rounded-full bg-white/10 overflow-hidden mb-2">
                <div class="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all" :style="{ width: `${getProgress(order)}%` }"></div>
              </div>

              <p class="text-[11px] tech-font leading-relaxed" :class="getHintClass(order)">
                {{ getHintText(order) }}
              </p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { ethers } from 'ethers';
import { walletState } from '@/services/wallet';
import { getContractAddress } from '@/services/contracts';
import { getDefaultRpcUrl } from '@/services/environment';
import { showToast } from '@/services/notification';
import AirdropABI from '@/abis/Airdrop.json';
import { t } from '@/i18n';

const STAKING_BALANCE_ABI = ['function balances(address) view returns (uint256)'];

export default {
  name: 'AirdropSection',
  props: {
    variant: {
      type: String,
      default: 'default',
    },
  },
  emits: ['open-get-started-modal'],
  setup(props) {
    const orders = ref([]);
    const loading = ref(false);
    const isConfigured = ref(Boolean(getContractAddress('Airdrop')));
    const isAdmin = ref(false);
    const actionLoading = ref(null);
    const now = ref(Math.floor(Date.now() / 1000));
    let fallbackProvider = null;
    let tickTimer = null;
    let refreshTimer = null;
    const isNftVariant = computed(() => props.variant === 'nft');
    const sectionClass = computed(() => (
      isNftVariant.value
        ? 'animate-fade-in bg-[#1a153a]/80 backdrop-blur-md rounded-xl border-2 border-white/10 p-3 shadow-lg relative overflow-hidden mb-2'
        : 'animate-fade-in bg-[#1a153a]/40 backdrop-blur-md rounded-2xl border border-white/10 p-4 shadow-lg relative overflow-hidden'
    ));
    const glowClass = computed(() => (
      isNftVariant.value
        ? 'absolute -left-10 -top-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl'
        : 'absolute -right-10 top-0 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl'
    ));
    const titleIconClass = computed(() => (
      isNftVariant.value ? 'ph-fill ph-gift text-app-pink' : 'ph-fill ph-gift text-purple-400'
    ));
    const adminLinkClass = computed(() => (
      isNftVariant.value
        ? 'w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-300 hover:text-white hover:bg-pink-500/20 transition flex items-center justify-center'
        : 'w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-400/30 text-purple-200 hover:text-white hover:bg-purple-500/25 transition flex items-center justify-center'
    ));
    const contentClass = computed(() => (
      isNftVariant.value
        ? 'bg-black/20 border border-pink-500/20 rounded-xl p-3 flex flex-col gap-3'
        : 'bg-black/20 border border-white/5 rounded-xl p-4 flex flex-col gap-3'
    ));
    const connectButtonClass = computed(() => (
      isNftVariant.value
        ? 'bg-app-pink text-white font-bold py-2 px-8 rounded-lg border border-pink-300 hover:bg-pink-600 transition-all tech-font w-full text-sm shadow-[0_0_12px_rgba(255,77,141,0.4)]'
        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-2 px-8 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all tech-font w-full text-sm'
    ));

    const getReadProvider = () => {
      if (walletState.provider) return walletState.provider;
      if (!fallbackProvider) {
        fallbackProvider = new ethers.JsonRpcProvider(getDefaultRpcUrl());
      }
      return fallbackProvider;
    };

    const normalizeRecord = (record, recordId, stakingBalance, isBlacklisted) => ({
      recordId: Number(recordId),
      user: record.user,
      startTime: Number(record.startTime),
      duration: Number(record.duration),
      endTime: Number(record.startTime) + Number(record.duration),
      totalAmount: record.totalAmount,
      claimed: record.claimed,
      claimThreshold: record.claimThreshold,
      stakingBalance,
      isBlacklisted,
    });

    const refreshAirdrops = async (silent = false) => {
      const airdropAddress = getContractAddress('Airdrop');
      isConfigured.value = Boolean(airdropAddress);

      if (!walletState.isConnected || !walletState.address || !airdropAddress) {
        orders.value = [];
        return;
      }

      if (!silent) loading.value = true;

      try {
        const provider = getReadProvider();
        const airdrop = new ethers.Contract(airdropAddress, AirdropABI, provider);
        const [recordsResult, stakingAddress, isBlacklisted] = await Promise.all([
          airdrop.getUserRecords(walletState.address),
          airdrop.stakingContract().catch(() => ethers.ZeroAddress),
          airdrop.blacklist(walletState.address).catch(() => false),
        ]);

        let stakingBalance = 0n;
        if (stakingAddress && stakingAddress !== ethers.ZeroAddress) {
          try {
            const staking = new ethers.Contract(stakingAddress, STAKING_BALANCE_ABI, provider);
            stakingBalance = await staking.balances(walletState.address);
          } catch (error) {
            console.warn('Failed to fetch staking balance for airdrop', error);
          }
        }

        const [list, ids] = recordsResult;
        orders.value = list
          .map((record, index) => normalizeRecord(record, ids[index], stakingBalance, isBlacklisted))
          .sort((a, b) => b.recordId - a.recordId);
      } catch (error) {
        console.error('Failed to fetch airdrops:', error);
        showToast(t('home.airdrop.loadFailed'), 'error');
      } finally {
        loading.value = false;
      }
    };

    const checkAdminAccess = async () => {
      const airdropAddress = getContractAddress('Airdrop');
      isAdmin.value = false;

      if (!walletState.isConnected || !walletState.address || !airdropAddress) {
        return;
      }

      try {
        const provider = getReadProvider();
        const airdrop = new ethers.Contract(airdropAddress, AirdropABI, provider);
        const [defaultRole, managerRole] = await Promise.all([
          airdrop.DEFAULT_ADMIN_ROLE(),
          airdrop.MANAGER_ROLE(),
        ]);
        const [hasDefaultAdmin, hasManagerRole] = await Promise.all([
          airdrop.hasRole(defaultRole, walletState.address),
          airdrop.hasRole(managerRole, walletState.address),
        ]);
        isAdmin.value = hasDefaultAdmin || hasManagerRole;
      } catch (error) {
        console.warn('Failed to check airdrop admin access', error);
      }
    };

    const computeReleased = (order) => {
      if (!order.duration || now.value <= order.startTime) return 0n;
      const passed = BigInt(now.value - order.startTime);
      const duration = BigInt(order.duration);
      if (passed >= duration) return order.totalAmount;
      return (order.totalAmount * passed) / duration;
    };

    const computePending = (order) => {
      const released = computeReleased(order);
      return released > order.claimed ? released - order.claimed : 0n;
    };

    const canClaim = (order) => {
      if (computePending(order) <= 0n) return false;
      return order.stakingBalance >= order.claimThreshold;
    };

    const formatToken = (value, precision = 2) => {
      try {
        const formatted = ethers.formatEther(value || 0n);
        const [integerPart, decimalPart = ''] = formatted.split('.');
        const safeInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        if (precision <= 0) return safeInteger;
        return `${safeInteger}.${decimalPart.slice(0, precision).padEnd(precision, '0')}`;
      } catch (error) {
        return precision > 0 ? `0.${'0'.repeat(precision)}` : '0';
      }
    };

    const formatRemain = (order) => {
      const seconds = Math.max(0, order.endTime - now.value);
      if (seconds <= 0) return t('home.airdrop.completed');

      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);

      if (days > 0) return `${days}${t('home.airdrop.day')} ${hours}${t('home.airdrop.hour')}`;
      if (hours > 0) return `${hours}${t('home.airdrop.hour')} ${minutes}${t('home.airdrop.minute')}`;
      return `${Math.max(1, minutes)}${t('home.airdrop.minute')}`;
    };

    const getProgress = (order) => {
      if (!order.totalAmount || order.totalAmount <= 0n) return 0;
      return Number((computeReleased(order) * 100n) / order.totalAmount);
    };

    const getStatusText = (order) => {
      if (canClaim(order)) return t('home.airdrop.statusClaimable');
      if (computePending(order) <= 0n) {
        return now.value >= order.endTime ? t('home.airdrop.completed') : t('home.airdrop.statusReleasing');
      }
      if (order.stakingBalance < order.claimThreshold) return t('home.airdrop.statusLocked');
      return t('home.airdrop.statusReleasing');
    };

    const getStatusClass = (order) => {
      if (canClaim(order)) return 'bg-green-500/20 text-green-400 border-green-500/30';
      if (computePending(order) <= 0n && now.value >= order.endTime) return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      if (computePending(order) <= 0n) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      if (order.stakingBalance < order.claimThreshold) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    };

    const getHintText = (order) => {
      if (order.claimThreshold <= 0n) return t('home.airdrop.noThreshold');
      if (order.stakingBalance >= order.claimThreshold) {
        return t('home.airdrop.thresholdMet', { amount: formatToken(order.claimThreshold) });
      }

      return t('home.airdrop.thresholdShort', {
        amount: formatToken(order.claimThreshold - order.stakingBalance),
      });
    };

    const getHintClass = (order) => {
      if (order.claimThreshold > order.stakingBalance) return 'text-yellow-300';
      return 'text-gray-400';
    };

    const getClaimButtonText = (order) => {
      if (actionLoading.value === order.recordId) return t('home.airdrop.claiming');
      if (canClaim(order)) return t('home.airdrop.claim');
      if (computePending(order) <= 0n) return t('home.airdrop.noPending');
      return t('home.airdrop.locked');
    };

    const getClaimButtonClass = (order) => {
      if (!canClaim(order)) return 'bg-white/5 text-gray-400 border border-white/10';
      return isNftVariant.value
        ? 'bg-app-pink text-white border border-pink-300 hover:bg-pink-600 shadow-[0_0_12px_rgba(255,77,141,0.4)]'
        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500';
    };

    const parseRevert = (error) => {
      if (error?.reason) return error.reason;
      if (error?.shortMessage) return error.shortMessage;
      const data = error?.data?.data || error?.data;
      if (typeof data === 'string' && data.startsWith('0x08c379a0')) {
        try {
          return ethers.AbiCoder.defaultAbiCoder()
            .decode(['string'], `0x${data.slice(10)}`)[0];
        } catch (decodeError) {
          return '';
        }
      }
      return '';
    };

    const handleClaim = async (order) => {
      if (!canClaim(order) || actionLoading.value !== null) return;
      if (order.isBlacklisted) {
        showToast(t('home.airdrop.tryLater'), 'warn');
        return;
      }
      if (!walletState.signer) {
        showToast(t('common.connectWalletFirst'), 'warn');
        return;
      }

      actionLoading.value = order.recordId;
      try {
        const airdrop = new ethers.Contract(getContractAddress('Airdrop'), AirdropABI, walletState.signer);
        const tx = await airdrop.claim(order.recordId);
        showToast(t('home.airdrop.txSubmitted'), 'info');
        await tx.wait();
        showToast(t('home.airdrop.claimSuccess'), 'success');
        await refreshAirdrops(true);
      } catch (error) {
        console.error('Failed to claim airdrop:', error);
        showToast(parseRevert(error) || t('home.airdrop.claimFailed'), 'error');
      } finally {
        actionLoading.value = null;
      }
    };

    onMounted(() => {
      refreshAirdrops();
      checkAdminAccess();
      tickTimer = setInterval(() => {
        now.value = Math.floor(Date.now() / 1000);
      }, 6000);
      refreshTimer = setInterval(() => refreshAirdrops(true), 6000);
    });

    onUnmounted(() => {
      if (tickTimer) clearInterval(tickTimer);
      if (refreshTimer) clearInterval(refreshTimer);
    });

    watch(() => [walletState.isConnected, walletState.address], () => {
      refreshAirdrops();
      checkAdminAccess();
    });

    return {
      orders,
      loading,
      isConfigured,
      isAdmin,
      actionLoading,
      walletState,
      sectionClass,
      glowClass,
      titleIconClass,
      adminLinkClass,
      contentClass,
      connectButtonClass,
      refreshAirdrops,
      computePending,
      canClaim,
      formatToken,
      formatRemain,
      getProgress,
      getStatusText,
      getStatusClass,
      getHintText,
      getHintClass,
      getClaimButtonText,
      getClaimButtonClass,
      handleClaim,
      t,
    };
  },
};
</script>

<style scoped>
.tech-font {
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: 0.05em;
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
