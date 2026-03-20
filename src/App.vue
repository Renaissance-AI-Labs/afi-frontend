<template>
  <div class="app-container">
    <ToastNotification />
    
    <div class="scroll-content hide-scrollbar relative">
      <router-view @open-get-started-modal="openModal" @open-language-modal="openLanguageModal" />
      <Footer />
    </div>
    
    <BottomNav />
    
    <transition name="modal">
      <ConnectWalletModal v-if="isModalVisible" @close="closeModal" />
    </transition>

    <transition name="modal">
      <LanguageModal v-if="isLanguageModalVisible" @close="closeLanguageModal" />
    </transition>
  </div>
</template>

<script>
import Footer from './components/Footer.vue';
import BottomNav from './components/BottomNav.vue';
import ConnectWalletModal from './components/ConnectWalletModal.vue';
import LanguageModal from './components/LanguageModal.vue';
import ToastNotification from './components/ToastNotification.vue';
import { autoConnectWallet } from './services/wallet.js';
import { initializeLanguage } from './i18n';

export default {
  name: 'App',
  components: {
    Footer,
    BottomNav,
    ConnectWalletModal,
    LanguageModal,
    ToastNotification
  },
  data() {
    return {
      isModalVisible: false,
      isLanguageModalVisible: false,
    };
  },
  methods: {
    openModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    openLanguageModal() {
      this.isLanguageModalVisible = true;
    },
    closeLanguageModal() {
      this.isLanguageModalVisible = false;
    }
  },
  mounted() {
    initializeLanguage();
    autoConnectWallet();
  }
}
</script>

<style scoped>
/* Modal transition */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
