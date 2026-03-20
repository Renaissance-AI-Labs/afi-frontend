<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content bg-[#1a153a] rounded-xl p-5 panel-border relative overflow-hidden text-white w-[90%] max-w-[360px]">
      <div class="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl"></div>
      
      <div class="modal-header flex justify-between items-center mb-4 relative z-10">
        <h3 class="font-display text-lg tracking-wider text-app-pink drop-shadow-md">
          {{ !walletState.isConnected ? (t('wallet.connectTitle') || 'CONNECT WALLET') : (t('wallet.connectedTitle') || 'CONNECTED') }}
        </h3>
        <button @click="close" class="text-gray-400 hover:text-white transition">
          <i class="ph ph-x text-xl"></i>
        </button>
      </div>

      <div class="modal-body relative z-10">
        <!-- Not Connected View -->
        <div v-if="!walletState.isConnected">
          <p class="text-[11px] text-gray-400 mb-4">{{ t('wallet.connectSubtitle') || 'Select your wallet provider' }}</p>
          
          <div class="wallet-list" v-if="availableWallets.length > 0">
            <ul class="flex flex-col gap-3">
              <li v-for="wallet in availableWallets" :key="wallet.id">
                <button class="w-full flex items-center gap-3 p-3 bg-[#221b44] rounded-lg border border-purple-500/30 hover:border-app-pink/60 hover:bg-[#2a2255] transition-all group" @click.prevent="handleConnect(wallet.id)">
                  <div class="w-8 h-8 rounded bg-white/10 flex items-center justify-center p-1">
                    <img :src="getWalletIcon(wallet.id)" :alt="wallet.name" class="w-full h-full object-contain">
                  </div>
                  <span class="font-bold text-sm tracking-wide group-hover:text-app-pink transition-colors">{{ wallet.name }}</span>
                  <i class="ph ph-caret-right ml-auto text-gray-500 group-hover:text-app-pink"></i>
                </button>
              </li>
            </ul>
          </div>
          <div v-else class="text-center p-6 bg-[#221b44] rounded-lg border border-red-500/30">
            <i class="ph ph-warning-circle text-3xl text-red-400 mb-2"></i>
            <p class="text-xs text-gray-300">{{ t('wallet.noWalletDetected') || 'No wallet detected' }}</p>
          </div>
        </div>

        <!-- Connected View -->
        <div v-else class="connected-view">
          
          <div class="bg-[#221b44] rounded-lg p-4 border border-green-500/30 mb-4">
            <div class="flex justify-between items-center mb-3">
              <span class="text-[10px] text-gray-400 uppercase tracking-wider">{{ t('wallet.address') || 'Address' }}</span>
              <span class="text-xs font-mono text-green-400 bg-green-400/10 px-2 py-0.5 rounded">{{ formattedAddress }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[10px] text-gray-400 uppercase tracking-wider">{{ t('wallet.network') || 'Network' }}</span>
              <span class="text-xs font-bold text-white">{{ uppercaseNetwork }}</span>
            </div>
          </div>
          
          <button @click.prevent="handleDisconnect" class="w-full bg-red-500/20 text-red-400 font-display text-[12px] py-3 rounded-lg border border-red-500/50 hover:bg-red-500 hover:text-white transition-all tracking-widest">
              [DISCONNECT]
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { walletState, connectWallet, disconnectWallet, detectWallets } from '@/services/wallet.js';
import { t } from '@/i18n';

export default {
  name: 'ConnectWalletModal',
  setup(props, { emit }) {
    const availableWallets = ref([]);

    const getWalletIcon = (walletId) => {
        const icons = {
            metamask: '/asset/images/wallet/MetaMask-icon-fox-with-margins.svg',
            tokenpocket: '/asset/images/wallet/tp-logo.png',
            okx: '/asset/images/wallet/okx-logo.png',
            binance: '/asset/images/wallet/binance-logo.png',
        };
        return icons[walletId] || '/asset/images/wallet/default-icon.png';
    };

    const close = () => {
      emit('close');
    };

    const handleConnect = async (walletType) => {
      const success = await connectWallet(walletType);
      if (success) {
        close();
      }
    };

    const handleDisconnect = () => {
      disconnectWallet();
      close();
    };
    
    onMounted(() => {
      availableWallets.value = detectWallets();
    });

    return {
      walletState,
      availableWallets,
      getWalletIcon,
      handleConnect,
      handleDisconnect,
      close,
      t,
    };
  },
  computed: {
    formattedAddress() {
      if (!this.walletState.address) return '';
      return `${this.walletState.address.substring(0, 6)}...${this.walletState.address.substring(this.walletState.address.length - 4)}`;
    },
    uppercaseNetwork() {
      return this.walletState.network ? this.walletState.network.toUpperCase() : '';
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.panel-border {
    border: 1px solid rgba(255, 77, 141, 0.4);
    box-shadow: inset 0 0 15px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.8);
}
</style>
