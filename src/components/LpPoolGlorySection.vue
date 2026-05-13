<template>
  <section
    class="animate-fade-in bg-[#1a153a]/40 backdrop-blur-md rounded-2xl border border-white/10 p-4 shadow-lg relative overflow-hidden"
    style="animation-delay: 0.12s;"
  >
    <div class="absolute right-0 bottom-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
    <div class="relative z-10 min-w-0">
      <h2 class="text-base font-display text-white mb-3 tech-font font-bold tracking-wider flex items-center gap-2">
        <i class="ph-fill ph-coins text-blue-400"></i>
        {{ t('equity.gloryPoint') }}
      </h2>

      <div v-if="loading && !pools.length" class="flex items-center justify-center gap-1.5 py-4 text-gray-400 text-xs tech-font">
        <i class="ph ph-spinner animate-spin text-base"></i>
        <span>{{ t('equity.poolsLoading') }}</span>
      </div>

      <div v-else class="grid grid-cols-3 gap-2 min-w-0">
        <div
          v-for="pool in pools"
          :key="pool.key"
          class="bg-black/20 border border-white/5 rounded-lg p-2.5 flex flex-col gap-1.5 min-w-0"
        >
          <div class="flex justify-between items-center gap-1 min-w-0">
            <span class="text-sm text-white font-bold tech-font truncate">{{ pool.shortLabel }}</span>
            <span
              v-if="pool.hasReward"
              class="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0 shadow-[0_0_6px_rgba(96,165,250,0.7)]"
              aria-hidden="true"
            ></span>
          </div>

          <div class="w-full min-h-[2.5rem] flex flex-col gap-1 min-w-0">
            <template v-if="pool.address">
              <template v-for="r in pool.rewards" :key="r.token">
                <div
                  v-if="r.amount > 0n"
                  class="flex justify-between items-center gap-1 text-[11px] text-gray-400 tech-font min-w-0"
                >
                  <span class="truncate min-w-0">{{ r.symbol }}</span>
                  <span class="text-blue-400 font-mono shrink-0 tabular-nums font-semibold">{{ formatTokenAmount(r.amount) }}</span>
                </div>
              </template>
              <p v-if="!pool.hasReward" class="text-[11px] text-gray-400 tech-font leading-snug line-clamp-2">
                {{ t('equity.noPoolReward') }}
              </p>
            </template>
            <p v-else class="text-[11px] text-gray-400 tech-font leading-snug line-clamp-2 flex items-start gap-1">
              <i class="ph ph-warning-circle text-sm shrink-0 mt-0.5"></i>
              <span>{{ t('equity.poolNotAvailable') }}</span>
            </p>
          </div>

          <button
            type="button"
            class="w-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold py-1.5 rounded hover:bg-blue-500/30 transition tech-font disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!claimEnabled(pool)"
            @click="claimPool(pool.key)"
          >
            {{ pool.claiming ? t('equity.poolClaiming') : t('equity.poolClaim') }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { ethers } from 'ethers';
import { walletState } from '@/services/wallet';
import { getContractAddress } from '@/services/contracts';
import { showToast } from '@/services/notification';
import A5PoolABI from '@/abis/A5Pool.json';
import { t } from '@/i18n';

const ERC20_SYMBOL = ['function symbol() view returns (string)'];

const POOL_DEFS = [
  { key: 'A5Pool', shortLabel: 'A5' },
  { key: 'A6Pool', shortLabel: 'A6' },
  { key: 'A7Pool', shortLabel: 'A7' }
];

function emptyPoolState(def) {
  return {
    key: def.key,
    shortLabel: def.shortLabel,
    address: '',
    rewards: [],
    hasReward: false,
    claiming: false
  };
}

export default {
  name: 'LpPoolGlorySection',
  setup() {
    const pools = ref(POOL_DEFS.map(emptyPoolState));
    const loading = ref(true);
    let refreshTimer = null;

    const formatTokenAmount = (wei) => {
      try {
        return parseFloat(ethers.formatEther(wei)).toFixed(4);
      } catch {
        return '0';
      }
    };

    const fetchSymbol = async (provider, tokenAddr) => {
      try {
        const c = new ethers.Contract(tokenAddr, ERC20_SYMBOL, provider);
        return await c.symbol();
      } catch {
        return `${String(tokenAddr).slice(0, 6)}…`;
      }
    };

    const loadPool = async (provider, def) => {
      const addr = getContractAddress(def.key);
      if (!addr) {
        return { ...emptyPoolState(def), address: '' };
      }
      const contract = new ethers.Contract(addr, A5PoolABI, provider);
      let tokens = [];
      try {
        tokens = await contract.getSupportedTokens();
      } catch (e) {
        console.warn(`getSupportedTokens failed for ${def.key}`, e);
        return { ...emptyPoolState(def), address: addr };
      }
      const rewards = await Promise.all(
        tokens.map(async (token) => {
          let amount = 0n;
          try {
            amount = await contract.getTokenRewards(walletState.address, token);
          } catch (e) {
            console.warn('getTokenRewards', def.key, token, e);
          }
          const symbol = await fetchSymbol(provider, token);
          return { token, symbol, amount };
        })
      );
      const hasReward = rewards.some((r) => r.amount > 0n);
      return {
        key: def.key,
        shortLabel: def.shortLabel,
        address: addr,
        rewards,
        hasReward,
        claiming: false
      };
    };

    const fetchAll = async () => {
      let provider = walletState.provider;
      if (!provider) {
        const rpcUrl =
          import.meta.env.VITE_APP_ENV === 'PROD'
            ? 'https://bsc-rpc.publicnode.com'
            : 'https://bsc-testnet-rpc.publicnode.com';
        provider = new ethers.JsonRpcProvider(rpcUrl);
      }
      loading.value = true;
      try {
        const next = await Promise.all(POOL_DEFS.map((d) => loadPool(provider, d)));
        pools.value = next.map((p) => ({ ...p, claiming: false }));
      } catch (e) {
        console.error('LpPoolGlorySection fetch', e);
      } finally {
        loading.value = false;
      }
    };

    const claimEnabled = (pool) =>
      walletState.isConnected &&
      !!pool.address &&
      pool.hasReward &&
      !pool.claiming;

    const claimPool = async (poolKey) => {
      if (!walletState.isConnected || !walletState.signer) {
        showToast(t('common.connectWalletFirst'), 'info');
        return;
      }
      const addr = getContractAddress(poolKey);
      if (!addr || !poolKey) return;
      const idx = pools.value.findIndex((p) => p.key === poolKey);
      if (idx < 0) return;
      const pool = pools.value[idx];
      if (!pool.hasReward) return;
      pools.value[idx] = { ...pool, claiming: true };
      try {
        const contract = new ethers.Contract(addr, A5PoolABI, walletState.signer);
        const tx = await contract.harvestAll();
        await tx.wait();
        showToast(t('equity.poolClaimSuccess'), 'success');
        await fetchAll();
      } catch (e) {
        console.error(e);
        if (e?.code !== 4001 && e?.code !== 'ACTION_REJECTED') {
          showToast(e?.reason || t('equity.poolClaimFailed'), 'error');
        }
      } finally {
        const cur = pools.value[idx];
        if (cur) pools.value[idx] = { ...cur, claiming: false };
      }
    };

    onMounted(() => {
      fetchAll();
      refreshTimer = setInterval(fetchAll, 15000);
    });

    onUnmounted(() => {
      if (refreshTimer) clearInterval(refreshTimer);
    });

    watch(
      () => walletState.isConnected,
      () => {
        fetchAll();
      }
    );

    return {
      pools,
      loading,
      t,
      formatTokenAmount,
      claimEnabled,
      claimPool,
      walletState
    };
  }
};
</script>

<style scoped>
.tech-font {
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: 0.05em;
}

.animate-fade-in {
  animation: fadeIn 0.35s ease-out backwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
