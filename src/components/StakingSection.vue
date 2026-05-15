<template>
  <section class="animate-fade-in bg-[#1a153a]/40 backdrop-blur-md rounded-2xl border border-white/10 p-4 shadow-lg relative overflow-hidden" style="animation-delay: 0.1s;">
    <div class="absolute -left-10 top-1/2 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
    <div class="relative z-10">
      <h2 class="text-base font-display text-white mb-3 tech-font font-bold tracking-wider flex items-center gap-2">
        <i class="ph-fill ph-lock-key text-purple-400"></i> {{ t('home.staking.title') }}
      </h2>
      
      <div class="bg-black/20 border border-white/5 rounded-xl p-4 flex flex-col gap-3">
        
        <!-- Product Selection -->
        <div class="flex justify-between items-center">
          <label class="text-xs text-gray-300 tech-font uppercase tracking-wider">{{ t('home.staking.stakeProduct') }}</label>
          <div class="flex gap-2 overflow-x-auto no-scrollbar">
            <button 
              v-for="(prod, index) in products" 
              :key="index"
              @click="selectedProductIndex = index"
              class="flex-shrink-0 px-3 py-1.5 rounded-lg border transition-all tech-font text-xs"
              :class="selectedProductIndex === index ? 'bg-purple-500/20 border-purple-500 text-white' : 'bg-black/40 border-white/10 text-gray-300 hover:border-white/30'"
            >
              {{ prod.value }} {{ t(prod.unitKey) }}
            </button>
          </div>
        </div>

        <!-- Amount Input -->
        <div class="flex flex-col gap-1.5 mt-1">
          <div class="flex justify-between items-center">
            <label class="text-xs text-gray-300 tech-font uppercase tracking-wider">{{ t('home.staking.stakeAmount') }}</label>
            <span class="text-xs text-gray-400 tech-font">{{ t('home.staking.balance', { amount: formattedBalance }) }}</span>
          </div>
          <div class="relative">
            <input 
              v-model="stakeAmount" 
              type="number" 
              class="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-white font-display text-lg focus:outline-none focus:border-purple-500 transition-colors"
              :placeholder="maxAmount > 0 ? t('home.staking.minMax', { min: minAmount, max: maxAmount }) : t('common.loading')"
            />
            <button @click="setMaxAmount" class="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded transition-colors tech-font">
              {{ t('home.staking.max') }}
            </button>
          </div>
        </div>

        <!-- Action Button -->
        <button 
          @click="handleStake" 
          :disabled="isStaking || !walletState.isConnected"
          class="mt-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-2 px-8 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all tech-font w-full disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-sm"
        >
          <i v-if="isStaking" class="ph ph-spinner animate-spin"></i>
          {{ buttonText }}
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import { ethers } from 'ethers';
import { walletState } from '@/services/wallet';
import { getContractAddress } from '@/services/contracts';
import { getDefaultRpcUrl, IS_PROD } from '@/services/environment';
import { showToast } from '@/services/notification';
import StakingABI from '@/abis/Staking.json';
import ReferralABI from '@/abis/referral.json';
import ERC20ABI from '@/abis/usdt.json';
import { t } from '@/i18n';

export default {
  name: 'StakingSection',
  setup() {
    const stakeAmount = ref('');
    const selectedProductIndex = ref(0);
    const products = ref([]);
    const isStaking = ref(false);
    
    const minAmount = ref(0);
    const maxAmount = ref(0);
    const usdtBalance = ref(0n);

    const fetchStakingData = async () => {
      try {
        let provider = walletState.provider;
        if (!provider) {
          provider = new ethers.JsonRpcProvider(getDefaultRpcUrl());
        }
        
        const stakingAddress = getContractAddress('Staking');
        if (!stakingAddress) return;

        const staking = new ethers.Contract(stakingAddress, StakingABI, provider);
        
        const [min, max, count] = await Promise.all([
          staking.MIN_STAKE_AMOUNT(),
          staking.MAX_STAKE_AMOUNT(),
          staking.stakeProductCount()
        ]);

        minAmount.value = Number(ethers.formatEther(min));
        maxAmount.value = Number(ethers.formatEther(max));

        const prods = [];
        for (let i = 0; i < Number(count); i++) {
          const seconds = Number(await staking.stakeDays(i));
          if (seconds < 86400) {
            prods.push({ index: i, value: Math.floor(seconds / 60), unitKey: 'home.staking.minutes' });
          } else {
            prods.push({ index: i, value: Math.floor(seconds / 86400), unitKey: 'home.staking.days' });
          }
        }
        products.value = prods;

      } catch (error) {
        console.error("Failed to fetch staking data:", error);
      }
    };

    const fetchUserBalance = async () => {
      if (!walletState.isConnected || !walletState.address) return;
      try {
        const usdtAddress = getContractAddress('USDT');
        const usdt = new ethers.Contract(usdtAddress, ERC20ABI, walletState.provider);
        usdtBalance.value = await usdt.balanceOf(walletState.address);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    };

    onMounted(() => {
      fetchStakingData();
      fetchUserBalance();
    });

    watch(() => walletState.isConnected, (connected) => {
      if (connected) {
        fetchUserBalance();
      } else {
        usdtBalance.value = 0n;
      }
    });

    const formattedBalance = computed(() => {
      return parseFloat(ethers.formatEther(usdtBalance.value)).toFixed(2);
    });

    const setMaxAmount = () => {
      const bal = Number(ethers.formatEther(usdtBalance.value));
      stakeAmount.value = Math.min(bal, maxAmount.value).toString();
    };

    const buttonText = computed(() => {
      if (!walletState.isConnected) return t('home.staking.connectWallet');
      if (isStaking.value) return t('home.staking.processing');
      return t('home.staking.stakeNow');
    });

    const handleStake = async () => {
      if (!walletState.isConnected) {
        showToast(t('common.connectWalletFirst'), 'warn');
        return;
      }

      const amountNum = Number(stakeAmount.value);
      if (isNaN(amountNum) || amountNum < minAmount.value || amountNum > maxAmount.value) {
        showToast(t('home.staking.invalidAmount', { min: minAmount.value, max: maxAmount.value }), 'error');
        return;
      }

      isStaking.value = true;
      try {
        const signer = walletState.signer;
        const userAddress = walletState.address;
        
        const stakingAddress = getContractAddress('Staking');
        const referralAddress = getContractAddress('Referral');
        const usdtAddress = getContractAddress('USDT');
        const routerAddress = getContractAddress('Router');
        const afiAddress = getContractAddress('AFI');

        const staking = new ethers.Contract(stakingAddress, StakingABI, signer);
        const referral = new ethers.Contract(referralAddress, ReferralABI, signer);
        const usdt = new ethers.Contract(usdtAddress, ERC20ABI, signer);

        // 1. Check Referral
        const isBound = await referral.isBindReferral(userAddress);
        if (!isBound) {
          showToast(t('home.staking.bindReferrer'), 'error');
          isStaking.value = false;
          return;
        }

        // 2. Check Whitelist
        const whitelistEnabled = await staking.whitelistEnabled();
        if (whitelistEnabled) {
          const isAllowed = await staking.whitelist(userAddress);
          if (!isAllowed) {
            showToast(t('home.staking.notOpen'), 'warn');
            isStaking.value = false;
            return;
          }
        }

        const stakeRaw = ethers.parseEther(stakeAmount.value.toString());

        // 3. Check Balance
        if (usdtBalance.value < stakeRaw) {
          showToast(t('home.staking.insufficientBalance'), 'error');
          isStaking.value = false;
          return;
        }

        // 4. Check Allowance
        const allowance = await usdt.allowance(userAddress, stakingAddress);
        if (allowance < stakeRaw) {
          showToast(t('home.staking.approving'), 'info');
          const txApprove = await usdt.approve(stakingAddress, ethers.MaxUint256);
          await txApprove.wait();
          showToast(t('home.staking.approved'), 'success');
        }

        // 5. Estimate amountOutMin
        const router = new ethers.Contract(routerAddress, [
          'function getAmountsOut(uint256, address[]) view returns (uint256[])'
        ], signer);
        
        let amountOutMin = 0n;
        try {
          const out = await router.getAmountsOut(stakeRaw / 2n, [usdtAddress, afiAddress]);
          const slippageMultiplier = IS_PROD ? 9n : 7n; // 10% slippage for PROD, 30% for Testnet
          amountOutMin = (out[1] * slippageMultiplier) / 10n;
        } catch (e) {
          console.warn("Failed to estimate amountOutMin, defaulting to 0", e);
        }

        // 6. Stake
        showToast(t('home.staking.confirming'), 'info');
        const txStake = await staking.stake(stakeRaw, amountOutMin, selectedProductIndex.value);
        await txStake.wait();
        
        showToast(t('home.staking.success'), 'success');
        fetchUserBalance();
        stakeAmount.value = '';
      } catch (error) {
        console.error(error);
        if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
          showToast(t('home.staking.cancelled'), 'info');
        } else {
          const msg = error.reason || error.message || t('home.staking.failed');
          showToast(msg, 'error');
        }
      } finally {
        isStaking.value = false;
      }
    };

    return {
      stakeAmount,
      selectedProductIndex,
      products,
      minAmount,
      maxAmount,
      formattedBalance,
      isStaking,
      buttonText,
      setMaxAmount,
      handleStake,
      walletState,
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