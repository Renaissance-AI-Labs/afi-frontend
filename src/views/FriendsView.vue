<template>
  <div class="nft-view relative pb-20 min-h-[calc(100vh-140px)]">
    <div class="bg-gradient-to-b from-[#1a153a] to-[#0b0914]">
      <Header @open-get-started-modal="$emit('open-get-started-modal')" @open-language-modal="$emit('open-language-modal')" />
    </div>

    <main class="px-4 pt-6 relative z-20">
      <!-- Tabs -->
      <div class="flex gap-4 mb-6 border-b border-white/10 pb-2">
        <button 
          class="text-[15px] font-bold tracking-wider transition-all relative font-display tech-font"
          :class="activeTab === 'friends' ? 'text-app-pink' : 'text-gray-500'"
          @click="activeTab = 'friends'"
        >
          {{ t('friends.tabs.myFriends') }}
          <div v-if="activeTab === 'friends'" class="absolute -bottom-[9px] left-0 w-full h-[2px] bg-app-pink shadow-[0_0_8px_rgba(255,77,141,0.8)]"></div>
        </button>
        <button 
          class="text-[15px] font-bold tracking-wider transition-all relative font-display tech-font"
          :class="activeTab === 'team' ? 'text-app-pink' : 'text-gray-500'"
          @click="activeTab = 'team'"
        >
          {{ t('friends.tabs.inviteReferral') }}
          <div v-if="activeTab === 'team'" class="absolute -bottom-[9px] left-0 w-full h-[2px] bg-app-pink shadow-[0_0_8px_rgba(255,77,141,0.8)]"></div>
        </button>
      </div>

      <!-- Tab Content: Friends -->
      <div v-if="activeTab === 'friends'" class="animate-fade-in">
        <!-- Stats Card -->
        <div class="bg-[#1a153a]/80 backdrop-blur-md rounded-xl border border-white/10 p-4 mb-5 shadow-lg relative overflow-hidden">
          <div class="absolute -right-10 -top-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl"></div>
          
          <div class="flex justify-between items-center relative z-10">
            <div class="flex flex-col items-center flex-1">
              <span class="text-[11px] text-gray-400 tech-font mb-1">{{ t('friends.stats.myLevel') }}</span>
              <div class="flex items-center gap-1">
                <i class="ph-fill ph-star text-app-pink text-sm"></i>
                <span class="text-[16px] font-bold text-white font-display">A{{ myLevel }}</span>
              </div>
            </div>
            <div class="h-8 w-px bg-white/10"></div>
            <div class="flex flex-col items-center flex-1">
              <span class="text-[11px] text-gray-400 tech-font mb-1">{{ t('friends.stats.friendCount') }}</span>
              <span class="text-[16px] font-bold text-white font-display">{{ referralCount }} <span class="text-[10px] text-gray-500 font-normal tech-font">{{ t('common.people') }}</span></span>
            </div>
            <div class="h-8 w-px bg-white/10"></div>
            <div class="flex flex-col items-center flex-1">
              <span class="text-[11px] text-gray-400 tech-font mb-1">{{ t('friends.stats.activeFriends') }}</span>
              <span class="text-[16px] font-bold text-app-pink font-display">{{ activatedDirects }} <span class="text-[10px] text-gray-500 font-normal tech-font">{{ t('common.people') }}</span></span>
            </div>
            <div class="h-8 w-px bg-white/10"></div>
            <div class="flex flex-col items-center flex-1">
              <span class="text-[11px] text-gray-400 tech-font mb-1">{{ t('friends.stats.teamCount') }}</span>
              <span class="text-[16px] font-bold text-white font-display">{{ teamCount }} <span class="text-[10px] text-gray-500 font-normal tech-font">{{ t('common.people') }}</span></span>
            </div>
          </div>
        </div>

        <!-- Friends List -->
        <h3 class="text-[13px] font-display text-white tracking-wider mb-3 flex items-center gap-2 tech-font font-bold">
            <i class="ph-fill ph-users text-app-pink"></i>
            {{ t('friends.list.title') }}
        </h3>
        
        <div v-if="!walletState.isConnected" class="text-center py-8 text-gray-500 tech-font text-[12px] bg-[#1a153a]/50 rounded-xl border border-white/5">
          {{ t('common.connectWalletFirst') }}
        </div>
        <div v-else-if="loadingChildren && childrenList.length === 0" class="text-center py-8 text-gray-500 tech-font text-[12px]">
          {{ t('common.loading') }}
        </div>
        <div v-else-if="childrenList.length === 0" class="text-center py-8 text-gray-500 tech-font text-[12px] bg-[#1a153a]/50 rounded-xl border border-white/5">
          {{ t('friends.list.empty') }}
        </div>
        <div v-else-if="currentChild" class="flex flex-col gap-3">
          <!-- Carousel Card -->
          <transition name="fade" mode="out-in">
            <div :key="currentCardIndex" class="bg-[#1a153a] p-4 rounded-xl border border-white/5 shadow-md relative overflow-hidden">
              <div class="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl"></div>
              <div class="flex justify-between items-center mb-4">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400 shadow-[0_0_8px_rgba(255,77,141,0.2)]">
                    <i class="ph-fill ph-user text-base"></i>
                  </div>
                  <span class="text-[15px] font-bold text-white font-display tracking-wider">
                    {{ formatAddress(currentChild.address) }}
                  </span>
                </div>
              </div>
              
              <div class="flex justify-between items-center bg-black/20 rounded-lg p-3 border border-white/5">
                <div class="flex flex-col items-center flex-1">
                  <span class="text-[10px] text-gray-400 tech-font mb-1">{{ t('friends.list.friendLevel') }}</span>
                  <div class="flex items-center gap-1">
                    <i class="ph-fill ph-star text-pink-400 text-xs"></i>
                    <span class="text-[14px] font-bold text-white font-display">A{{ currentChild.level !== null ? currentChild.level : '...' }}</span>
                  </div>
                </div>
                <div class="h-8 w-px bg-white/10"></div>
                <div class="flex flex-col items-center flex-1">
                  <span class="text-[10px] text-gray-400 tech-font mb-1">{{ t('friends.list.isActivated') }}</span>
                  <span class="text-[14px] font-bold tech-font" :class="currentChild.userHasActivated ? 'text-green-400' : 'text-gray-500'">
                    {{ currentChild.userHasActivated ? t('friends.list.activated') : t('friends.list.notActivated') }}
                  </span>
                </div>
                <div class="h-8 w-px bg-white/10"></div>
                <div class="flex flex-col items-center flex-1">
                  <span class="text-[10px] text-gray-400 tech-font mb-1">{{ t('friends.list.teamCount') }}</span>
                  <span class="text-[14px] font-bold text-white font-display">{{ currentChild.teamCount }}</span>
                </div>
              </div>
            </div>
          </transition>
          
          <!-- Pagination Controls -->
          <div class="flex justify-between items-center mt-2 px-2">
            <button 
              @click="prevCard" 
              :disabled="currentCardIndex === 0"
              class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition active:scale-95"
            >
              <i class="ph-bold ph-caret-left"></i>
            </button>
            
            <span class="text-[13px] text-gray-400 font-display font-bold tracking-widest">
              {{ currentCardIndex + 1 }} / <span class="text-white">{{ referralCount }}</span>
            </span>
            
            <button 
              @click="nextCard" 
              :disabled="!hasMoreChildren && currentCardIndex >= childrenList.length - 1"
              class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition active:scale-95"
            >
              <i class="ph-bold ph-caret-right"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Content: Referrals -->
      <div v-if="activeTab === 'team'" class="animate-fade-in">
        
        <!-- My Referral Link -->
        <div class="bg-[#1a153a] rounded-xl p-4 border border-white/10 relative overflow-hidden shadow-lg mb-5">
          <div class="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl"></div>
          <h3 class="text-[13px] font-display text-white tracking-wider mb-1.5 relative z-10 flex items-center gap-2 tech-font font-bold">
            <i class="ph-fill ph-share-network text-app-pink"></i>
            {{ t('friends.referral.myLink') }}
          </h3>
          <p class="text-[11px] text-gray-400 mb-3 relative z-10 tech-font">{{ t('friends.referral.shareDesc') }}</p>
          
          <div class="flex flex-col gap-3 relative z-10">
            <div class="bg-black/30 border border-white/10 rounded-lg px-3 py-2 break-all text-[13px] text-white text-center min-h-[60px] flex items-center justify-center tech-font leading-5" :class="{ 'opacity-60': !isBound || !hasPurchasedNFT }">
              <span v-if="!walletState.isConnected">{{ t('common.connectWalletFirst') }}</span>
              <span v-else-if="!isBound">{{ t('nft.messages.bindReferrerFirst') }}</span>
              <span v-else-if="!hasPurchasedNFT" class="text-app-pink">{{ t('friends.referral.buyNftFirst') }}</span>
              <span v-else>{{ myReferralLink }}</span>
            </div>
            <button 
              @click="copyText(myReferralLink)"
              :disabled="!walletState.isConnected || !isBound || !hasPurchasedNFT"
              class="w-full bg-white/5 text-white border border-white/10 text-[13px] font-bold py-3 rounded-lg hover:bg-white/10 hover:border-pink-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 tech-font active:scale-95"
            >
              <i class="ph ph-copy text-lg"></i>
              {{ t('friends.referral.copyLink') }}
            </button>
          </div>
          
          <div class="mt-4 flex items-start gap-1.5 text-[10px] text-gray-500 bg-black/20 p-2.5 rounded-lg border border-white/5 tech-font leading-relaxed">
            <i class="ph-fill ph-info text-app-pink mt-0.5 shrink-0"></i>
            <span>{{ t('friends.referral.tip') }}</span>
          </div>
        </div>

        <!-- Bind Referrer -->
        <div class="bg-[#1a153a] rounded-xl p-4 border border-white/10 relative overflow-hidden shadow-lg">
          <div class="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl"></div>
          <h3 class="text-[13px] font-display text-white tracking-wider mb-1.5 relative z-10 flex items-center gap-2 tech-font font-bold">
            <i class="ph-fill ph-link text-app-pink"></i>
            {{ t('friends.referral.myReferrer') }}
          </h3>
          <p class="text-[11px] text-gray-400 mb-3 relative z-10 tech-font" v-if="!isBound">{{ t('friends.referral.bindDesc') }}</p>
          <p class="text-[11px] text-app-pink mb-3 relative z-10 tech-font" v-else>
            <i class="ph-fill ph-check-circle mr-1"></i>{{ t('friends.referral.boundSuccess') }}
          </p>
          
          <div class="flex gap-2 relative z-10 items-start">
            <input
              v-if="!isBound"
              type="text"
              :value="referrerInput"
              readonly
              :placeholder="walletState.isConnected ? t('friends.referral.placeholderBindByLink') : t('common.connectWalletFirst')"
              class="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-[13px] text-white outline-none focus:border-app-pink/50 transition-colors tech-font placeholder:text-gray-600"
              :class="{ 'opacity-60 cursor-not-allowed': !referrerInput }"
            />
            <textarea
              v-else
              :value="referrerInput"
              readonly
              rows="2"
              class="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-[13px] text-white outline-none transition-colors tech-font resize-none leading-5"
            ></textarea>
            <button 
              v-if="!isBound"
              @click="handleBindReferral"
              :disabled="bindingReferrer || !walletState.isConnected || !referrerInput"
              class="bg-app-pink text-white text-[13px] font-bold px-5 py-2.5 rounded-lg hover:bg-pink-600 transition shadow-[0_0_10px_rgba(255,77,141,0.3)] disabled:opacity-50 disabled:cursor-not-allowed shrink-0 tech-font active:scale-95"
            >
              {{ bindingReferrer ? t('friends.referral.bindLoading') : t('friends.referral.bind') }}
            </button>
          </div>
        </div>

      </div>

    </main>

    <!-- Confirm Modal -->
    <div v-if="isConfirmModalVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 animate-fade-in">
      <div class="bg-[#1a153a] border border-app-pink/30 rounded-2xl p-5 w-full max-w-sm shadow-[0_0_30px_rgba(255,77,141,0.2)]">
        <h3 class="text-lg font-display text-white mb-3 text-center tech-font font-bold">{{ t('friends.modal.confirmBindTitle') }}</h3>
        <p class="text-[13px] text-gray-300 text-center mb-4 tech-font">{{ t('friends.modal.confirmBindDesc') }}</p>
        <div class="bg-black/40 border border-white/10 rounded-lg p-3 text-[12px] text-app-pink break-all text-center mb-6 font-mono">
          {{ confirmAddress }}
        </div>
        <div class="flex gap-3">
          <button @click="closeConfirmModal" class="flex-1 py-2.5 rounded-lg border border-white/20 text-white text-[13px] font-bold hover:bg-white/10 transition tech-font active:scale-95">
            {{ t('common.cancel') }}
          </button>
          <button 
            @click="executeBind"
            :disabled="confirmCountdown > 0"
            class="flex-1 py-2.5 rounded-lg bg-app-pink text-white text-[13px] font-bold hover:bg-pink-600 transition shadow-[0_0_10px_rgba(255,77,141,0.4)] disabled:opacity-50 disabled:cursor-not-allowed tech-font active:scale-95"
          >
            {{ confirmCountdown > 0 ? t('common.confirmWithCountdown', { count: confirmCountdown }) : t('common.confirm') }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import Header from '@/components/Header.vue';
import { walletState, formatAddress } from '@/services/wallet.js';
import { showToast } from '@/services/notification.js';
import { getContractAddress } from '@/services/contracts.js';
import { t } from '@/i18n';
import { ethers } from 'ethers';
import referralAbi from '@/abis/referral.json';
import nodeAbi from '@/abis/node.json';

export default {
  name: 'FriendsView',
  components: {
    Header
  },
  setup() {
    const activeTab = ref('friends');
    
    // Data State
    const myLevel = ref(0);
    const referralCount = ref(0);
    const teamCount = ref(0);
    const activatedDirects = ref(0);
    const hasPurchasedNFT = ref(false);
    
    // Carousel & List State
    const childrenList = ref([]);
    const currentCardIndex = ref(0);
    const loadingChildren = ref(false);
    const hasMoreChildren = ref(false);
    const childrenCursor = ref(0);
    const pageSize = 10;
    
    const currentChild = computed(() => {
      if (childrenList.value.length === 0) return null;
      return childrenList.value[currentCardIndex.value];
    });
    
    // Referral State
    const referrerInput = ref('');
    const isBound = ref(false);
    const bindingReferrer = ref(false);
    
    // Confirm Modal
    const isConfirmModalVisible = ref(false);
    const confirmCountdown = ref(5);
    const confirmTimer = ref(null);
    const confirmAddress = ref('');

    const myReferralLink = computed(() => {
      if (!walletState.isConnected || !isBound.value || !hasPurchasedNFT.value) return '';
      const baseUrl = window.location.origin + window.location.pathname;
      return `${baseUrl}?ref=${walletState.address}`;
    });

    const getProvider = () => {
      if (walletState.provider) return walletState.provider;
      if (window.ethereum) return new ethers.BrowserProvider(window.ethereum);
      return null;
    };

    const getReferralContract = (withSigner = false) => {
      const address = getContractAddress('Referral');
      if (!address) return null;
      if (withSigner && walletState.signer) {
        return new ethers.Contract(address, referralAbi, walletState.signer);
      }
      const provider = getProvider();
      if (!provider) return null;
      return new ethers.Contract(address, referralAbi, provider);
    };

    const getNodeContract = () => {
      const address = getContractAddress('node');
      if (!address) return null;
      const provider = getProvider();
      if (!provider) return null;
      return new ethers.Contract(address, nodeAbi, provider);
    };

    const fetchReferralData = async () => {
      if (!walletState.isConnected || !walletState.address) return;
      
      try {
        const referralContract = getReferralContract();
        const nodeContract = getNodeContract();
        
        if (referralContract) {
          const bound = await referralContract.isBindReferral(walletState.address);
          isBound.value = bound;
          
          if (bound) {
            const referrer = await referralContract.getReferral(walletState.address);
            if (referrer && referrer !== ethers.ZeroAddress) {
              referrerInput.value = referrer;
            }
          } else {
            checkUrlParam();
          }

          const rCount = await referralContract.getReferralCount(walletState.address);
          referralCount.value = Number(rCount);
          
          const tCount = await referralContract.getTeamCount(walletState.address);
          teamCount.value = Number(tCount);
        }

        if (nodeContract) {
          const balance = await nodeContract.balanceOf(walletState.address);
          hasPurchasedNFT.value = Number(balance) > 0;
          
          const directs = await nodeContract.activatedDirects(walletState.address);
          activatedDirects.value = Number(directs);
          
          const level = await nodeContract.userLevel(walletState.address);
          myLevel.value = Number(level);
        }
        
        loadChildren(true);
      } catch (error) {
        console.error("Error fetching referral data:", error);
      }
    };

    const checkUrlParam = () => {
      if (isBound.value) return;
      const urlParams = new URLSearchParams(window.location.search);
      const refParam = urlParams.get('ref');
      
      if (refParam && ethers.isAddress(refParam)) {
        if (walletState.address && refParam.toLowerCase() === walletState.address.toLowerCase()) {
          referrerInput.value = '';
          return;
        }
        referrerInput.value = refParam;
      }
    };

    const loadChildren = async (reset = false) => {
      if (!walletState.address) return;
      
      const referralContract = getReferralContract();
      const nodeContract = getNodeContract();
      if (!referralContract) return;

      if (reset) {
        childrenCursor.value = 0;
        childrenList.value = [];
        currentCardIndex.value = 0;
        hasMoreChildren.value = true;
      }
      
      if (!hasMoreChildren.value && !reset) return;
      
      loadingChildren.value = true;
      
      try {
        const result = await referralContract.getChildren(
          walletState.address,
          childrenCursor.value,
          pageSize
        );
        
        const newChildren = result[0];
        const newCursor = result[1];
        
        if (newChildren && newChildren.length > 0) {
          const validChildren = newChildren.filter(addr => addr !== ethers.ZeroAddress);
          
          const childObjects = await Promise.all(validChildren.map(async (addr) => {
            let level = 0;
            let userHasActivated = false;
            let teamCount = 0;
            
            if (nodeContract) {
              try {
                level = await nodeContract.userLevel(addr);
                userHasActivated = await nodeContract.userHasActivated(addr);
              } catch (e) {
                console.error("Error fetching child node data", e);
              }
            }

            try {
              teamCount = await referralContract.getTeamCount(addr);
            } catch (e) {
              console.error("Error fetching child team count", e);
            }
            
            return {
              address: addr,
              level: Number(level),
              userHasActivated,
              teamCount: Number(teamCount)
            };
          }));
          
          childrenList.value = [...childrenList.value, ...childObjects];
          childrenCursor.value = Number(newCursor);
          
          if (newChildren.length < pageSize) {
            hasMoreChildren.value = false;
          }
        } else {
          hasMoreChildren.value = false;
        }
      } catch (error) {
        console.error("Error loading children:", error);
        hasMoreChildren.value = false;
      } finally {
        loadingChildren.value = false;
      }
    };

    const prevCard = () => {
      if (currentCardIndex.value > 0) {
        currentCardIndex.value--;
      }
    };

    const nextCard = async () => {
      if (currentCardIndex.value < childrenList.value.length - 1) {
        currentCardIndex.value++;
      } else if (hasMoreChildren.value && !loadingChildren.value) {
        await loadChildren(false);
        if (currentCardIndex.value < childrenList.value.length - 1) {
          currentCardIndex.value++;
        }
      }
    };

    const handleBindReferral = async () => {
      if (!walletState.isConnected) {
        showToast(t('common.connectWalletFirst'), 'error');
        return;
      }
      if (!referrerInput.value || !ethers.isAddress(referrerInput.value)) {
        showToast(t('friends.messages.enterValidAddress'), 'error');
        return;
      }
      if (referrerInput.value.toLowerCase() === walletState.address?.toLowerCase()) {
        showToast(t('friends.messages.cannotBindSelf'), 'error');
        return;
      }
      
      try {
        const contract = getReferralContract();
        if (contract) {
          const isValidReferrer = await contract.isBindReferral(referrerInput.value);
          if (!isValidReferrer) {
            showToast(t('friends.messages.invalidReferrer'), 'error');
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
      
      confirmAddress.value = referrerInput.value;
      isConfirmModalVisible.value = true;
      
      confirmCountdown.value = 5;
      if (confirmTimer.value) clearInterval(confirmTimer.value);
      confirmTimer.value = setInterval(() => {
        if (confirmCountdown.value > 0) {
          confirmCountdown.value--;
        } else {
          clearInterval(confirmTimer.value);
        }
      }, 1000);
    };

    const closeConfirmModal = () => {
      isConfirmModalVisible.value = false;
      if (confirmTimer.value) clearInterval(confirmTimer.value);
    };

    const executeBind = async () => {
      closeConfirmModal();
      bindingReferrer.value = true;
      
      try {
        const contract = getReferralContract(true);
        if (!contract) throw new Error("Contract not initialized");
        
        const tx = await contract.bindReferral(confirmAddress.value);
        showToast(t('friends.messages.txSubmitted'), 'success');
        
        await tx.wait();
        
        showToast(t('friends.messages.bindSuccess'), 'success');
        isBound.value = true;
        fetchReferralData();
      } catch (error) {
        console.error("Binding failed:", error);
        if (error.code === 4001 || error.code === 'ACTION_REJECTED' || (error.reason && error.reason.includes('rejected'))) {
          return;
        }
        if (error.reason) {
          showToast(t('friends.messages.bindFailedReason', { reason: error.reason }), 'error');
        } else {
          showToast(t('friends.messages.bindFailed'), 'error');
        }
      } finally {
        bindingReferrer.value = false;
      }
    };

    // Robust copy function for older iOS devices
    const copyText = (text) => {
      if (!text) return;
      
      const fallbackCopy = (textToCopy) => {
        try {
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          
          // Prevent keyboard from showing on iOS
          textArea.setAttribute('readonly', '');
          textArea.style.position = 'absolute';
          textArea.style.left = '-9999px';
          textArea.style.top = '0';
          
          document.body.appendChild(textArea);
          
          // iOS specific selection
          if (navigator.userAgent.match(/ipad|iphone/i)) {
            const range = document.createRange();
            range.selectNodeContents(textArea);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            textArea.setSelectionRange(0, 999999);
          } else {
            textArea.select();
          }
          
          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);
          
          if (successful) {
            showToast(t('friends.messages.copySuccess'), 'success');
          } else {
            showToast(t('friends.messages.copyFailed'), 'error');
          }
        } catch (err) {
          console.error('Fallback copy failed:', err);
          showToast(t('friends.messages.copyFailed'), 'error');
        }
      };

      // Try modern API first if available and in secure context
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(t('friends.messages.copySuccess'), 'success');
        }).catch((err) => {
          console.error('Clipboard API failed:', err);
          fallbackCopy(text);
        });
      } else {
        fallbackCopy(text);
      }
    };

    watch(() => walletState.isConnected, (newVal) => {
      if (newVal) {
        fetchReferralData();
      } else {
        myLevel.value = 0;
        referralCount.value = 0;
        teamCount.value = 0;
        activatedDirects.value = 0;
        hasPurchasedNFT.value = false;
        childrenList.value = [];
        currentCardIndex.value = 0;
        isBound.value = false;
        referrerInput.value = '';
        checkUrlParam();
      }
    });

    onMounted(() => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('ref') || urlParams.get('tab') === 'team') {
        activeTab.value = 'team';
      }
      
      if (walletState.isConnected) {
        fetchReferralData();
      } else {
        checkUrlParam();
      }
    });

    return {
      activeTab,
      walletState,
      formatAddress,
      myLevel,
      referralCount,
      teamCount,
      activatedDirects,
      hasPurchasedNFT,
      childrenList,
      loadingChildren,
      hasMoreChildren,
      loadChildren,
      currentCardIndex,
      currentChild,
      prevCard,
      nextCard,
      referrerInput,
      isBound,
      bindingReferrer,
      myReferralLink,
      handleBindReferral,
      isConfirmModalVisible,
      confirmCountdown,
      confirmAddress,
      closeConfirmModal,
      executeBind,
      copyText,
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

/* Carousel Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateX(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
