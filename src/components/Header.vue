<template>
  <header class="flex justify-between items-center px-4 py-2 z-10 bg-gradient-to-b from-black/60 to-transparent h-14">
      <div class="flex items-center gap-2">
          <img src="/asset/images/logo/Logo_simple.png" alt="AgentFi Logo" class="w-6 h-6 object-contain" />
          <router-link to="/" class="font-display text-lg tracking-widest text-white shadow-black drop-shadow-md">
            AGENT.FI
          </router-link>
      </div>
      <div class="flex items-center gap-4 text-white">
          <div class="flex items-center gap-1 cursor-pointer text-gray-300 hover:text-white transition" @click="openLanguageModal">
              <i class="ph ph-globe text-xl"></i>
              <span class="text-[10px] font-bold uppercase">{{ currentLangLabel }}</span>
          </div>
          
          <div v-if="!walletState.isConnected" @click.prevent="openModal" class="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center border-2 border-white/50 cursor-pointer shadow-lg">
              <i class="ph ph-wallet text-white"></i>
          </div>
          <div v-else @click.prevent="openModal" class="px-3 h-8 rounded-full bg-gradient-to-tr from-green-500 to-teal-500 flex items-center justify-center border-2 border-white/50 cursor-pointer shadow-lg text-xs font-bold">
              {{ formattedAddress }}
          </div>
      </div>
  </header>
</template>

<script>
import { walletState, formatAddress } from '@/services/wallet.js';
import { computed } from 'vue';
import { t, i18nState, currentLanguage } from '@/i18n';

export default {
  name: 'Header',
  setup() {
    const formattedAddress = computed(() => formatAddress(walletState.address));
    const currentLangLabel = computed(() => {
        const lang = i18nState.languages[currentLanguage.value];
        return lang ? lang.label : 'EN';
    });

    return {
      walletState,
      formattedAddress,
      currentLangLabel,
      t,
    };
  },
  methods: {
    openModal() {
      this.$emit('open-get-started-modal');
    },
    openLanguageModal() {
      this.$emit('open-language-modal');
    }
  }
}
</script>

<style scoped>
</style>
