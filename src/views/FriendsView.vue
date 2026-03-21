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
          我的好友
          <div v-if="activeTab === 'friends'" class="absolute -bottom-[9px] left-0 w-full h-[2px] bg-app-pink shadow-[0_0_8px_rgba(255,77,141,0.8)]"></div>
        </button>
        <button 
          class="text-[15px] font-bold tracking-wider transition-all relative font-display tech-font"
          :class="activeTab === 'team' ? 'text-app-pink' : 'text-gray-500'"
          @click="activeTab = 'team'"
        >
          邀请推荐
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
              <span class="text-[11px] text-gray-400 tech-font mb-1">我的等级</span>
              <div class="flex items-center gap-1">
                <i class="ph-fill ph-star text-app-pink text-sm"></i>
                <span class="text-[16px] font-bold text-white font-display">V{{ myLevel }}</span>
              </div>
            </div>
            <div class="h-8 w-px bg-white/10"></div>
            <div class="flex flex-col items-center flex-1">
              <span class="text-[11px] text-gray-400 tech-font mb-1">好友人数</span>
              <span class="text-[16px] font-bold text-white font-display">{{ referralCount }} <span class="text-[10px] text-gray-500 font-normal tech-font">人</span></span>
            </div>
            <div class="h-8 w-px bg-white/10"></div>
            <div class="flex flex-col items-center flex-1">
              <span class="text-[11px] text-gray-400 tech-font mb-1">团队人数</span>
              <span class="text-[16px] font-bold text-white font-display">{{ teamCount }} <span class="text-[10px] text-gray-500 font-normal tech-font">人</span></span>
            </div>
          </div>
        </div>

        <!-- Friends List -->
        <h3 class="text-[13px] font-display text-white tracking-wider mb-3 flex items-center gap-2 tech-font font-bold">
            <i class="ph-fill ph-users text-app-pink"></i>
            好友列表
        </h3>
        
        <div v-if="!walletState.isConnected" class="text-center py-8 text-gray-500 tech-font text-[12px] bg-[#1a153a]/50 rounded-xl border border-white/5">
          请先连接钱包
        </div>
        <div v-else-if="loadingChildren && childrenList.length === 0" class="text-center py-8 text-gray-500 tech-font text-[12px]">
          加载中...
        </div>
        <div v-else-if="childrenList.length === 0" class="text-center py-8 text-gray-500 tech-font text-[12px] bg-[#1a153a]/50 rounded-xl border border-white/5">
          暂无好友
        </div>
        <div v-else-if="currentChild" class="flex flex-col gap-3">
          <!-- Carousel Card -->
          <transition name="fade" mode="out-in">
            <div :key="currentCardIndex" class="bg-[#1a153a] p-4 rounded-xl border border-white/5 shadow-md relative overflow-hidden">
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
                  <span class="text-[10px] text-gray-400 tech-font mb-1">好友等级</span>
                  <div class="flex items-center gap-1">
                    <i class="ph-fill ph-star text-pink-400 text-xs"></i>
                    <span class="text-[14px] font-bold text-white font-display">V{{ currentChild.level !== null ? currentChild.level : '...' }}</span>
                  </div>
                </div>
                <div class="h-8 w-px bg-white/10"></div>
                <div class="flex flex-col items-center flex-1">
                  <span class="text-[10px] text-gray-400 tech-font mb-1">团队人数</span>
                  <span class="text-[14px] font-bold text-white font-display">{{ currentChild.teamCount !== null ? currentChild.teamCount : '...' }} <span class="text-[10px] font-normal text-gray-500 tech-font">人</span></span>
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
            我的邀请链接
          </h3>
          <p class="text-[11px] text-gray-400 mb-3 relative z-10 tech-font">分享链接邀请好友加入，获取团队收益</p>
          
          <div class="flex flex-col gap-3 relative z-10">
            <div class="bg-black/30 border border-white/10 rounded-lg p-3 break-all text-[12px] text-gray-300 min-h-[60px] flex items-center tech-font" :class="{ 'opacity-60': !isBound || !walletState.isConnected }">
              {{ myReferralLink }}
            </div>
            <button 
              @click="copyText(myReferralLink)"
              :disabled="!walletState.isConnected || !isBound"
              class="w-full bg-white/5 text-white border border-white/10 text-[13px] font-bold py-3 rounded-lg hover:bg-white/10 hover:border-pink-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 tech-font active:scale-95"
            >
              <i class="ph ph-copy text-lg"></i>
              复制专属链接
            </button>
          </div>
          
          <div class="mt-4 flex items-start gap-1.5 text-[10px] text-gray-500 bg-black/20 p-2.5 rounded-lg border border-white/5 tech-font leading-relaxed">
            <i class="ph-fill ph-info text-app-pink mt-0.5 shrink-0"></i>
            <span>提示：您需要先绑定邀请人，才能生成自己的邀请链接。邀请好友参与质押，您将获得额外的团队收益加成。</span>
          </div>
        </div>

        <!-- Bind Referrer -->
        <div class="bg-[#1a153a] rounded-xl p-4 border border-white/10 relative overflow-hidden shadow-lg">
          <div class="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl"></div>
          <h3 class="text-[13px] font-display text-white tracking-wider mb-1.5 relative z-10 flex items-center gap-2 tech-font font-bold">
            <i class="ph-fill ph-link text-app-pink"></i>
            我的邀请人
          </h3>
          <p class="text-[11px] text-gray-400 mb-3 relative z-10 tech-font" v-if="!isBound">请绑定您的邀请人地址，绑定后不可修改</p>
          <p class="text-[11px] text-app-pink mb-3 relative z-10 tech-font" v-else>
            <i class="ph-fill ph-check-circle mr-1"></i>已成功绑定邀请人
          </p>
          
          <div class="flex gap-2 relative z-10">
            <input 
              type="text" 
              v-model="referrerInput"
              :readonly="isBound"
              :placeholder="walletState.isConnected ? '请输入邀请人地址' : '请先连接钱包'"
              class="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-[13px] text-white outline-none focus:border-app-pink/50 transition-colors tech-font placeholder:text-gray-600"
              :class="{ 'opacity-60 cursor-not-allowed': isBound }"
            />
            <button 
              v-if="!isBound"
              @click="handleBindReferral"
              :disabled="bindingReferrer || !walletState.isConnected || !referrerInput"
              class="bg-app-pink text-white text-[13px] font-bold px-5 py-2.5 rounded-lg hover:bg-pink-600 transition shadow-[0_0_10px_rgba(255,77,141,0.3)] disabled:opacity-50 disabled:cursor-not-allowed shrink-0 tech-font active:scale-95"
            >
              {{ bindingReferrer ? '绑定中...' : '绑 定' }}
            </button>
          </div>
        </div>

      </div>

    </main>

    <!-- Confirm Modal -->
    <div v-if="isConfirmModalVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 animate-fade-in">
      <div class="bg-[#1a153a] border border-app-pink/30 rounded-2xl p-5 w-full max-w-sm shadow-[0_0_30px_rgba(255,77,141,0.2)]">
        <h3 class="text-lg font-display text-white mb-3 text-center tech-font font-bold">确认绑定</h3>
        <p class="text-[13px] text-gray-300 text-center mb-4 tech-font">绑定后将无法修改，请确认邀请人地址：</p>
        <div class="bg-black/40 border border-white/10 rounded-lg p-3 text-[12px] text-app-pink break-all text-center mb-6 font-mono">
          {{ confirmAddress }}
        </div>
        <div class="flex gap-3">
          <button @click="closeConfirmModal" class="flex-1 py-2.5 rounded-lg border border-white/20 text-white text-[13px] font-bold hover:bg-white/10 transition tech-font active:scale-95">
            取 消
          </button>
          <button 
            @click="executeBind"
            :disabled="confirmCountdown > 0"
            class="flex-1 py-2.5 rounded-lg bg-app-pink text-white text-[13px] font-bold hover:bg-pink-600 transition shadow-[0_0_10px_rgba(255,77,141,0.4)] disabled:opacity-50 disabled:cursor-not-allowed tech-font active:scale-95"
          >
            {{ confirmCountdown > 0 ? `确 认 (${confirmCountdown}s)` : '确 认' }}
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
import { ethers } from 'ethers';

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
    
    // Carousel & List State
    const childrenList = ref([]);
    const currentCardIndex = ref(0);
    const loadingChildren = ref(false);
    const hasMoreChildren = ref(false);
    
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
      if (!walletState.isConnected) return '请先连接钱包';
      if (!isBound.value) return '请先绑定邀请人';
      const baseUrl = window.location.origin + window.location.pathname;
      return `${baseUrl}?ref=${walletState.address}`;
    });

    // Mock data fetching for UI demonstration
    const fetchReferralData = async () => {
      if (!walletState.isConnected) return;
      
      // Mocking data since Staking contract is not available
      myLevel.value = 2;
      referralCount.value = 12;
      teamCount.value = 45;
      
      isBound.value = true;
      referrerInput.value = '0x1234567890123456789012345678901234567890';
      
      loadChildren(true);
    };

    const loadChildren = async (reset = false) => {
      if (reset) {
        childrenList.value = [];
        hasMoreChildren.value = true;
        currentCardIndex.value = 0;
      }
      
      if (!hasMoreChildren.value && !reset) return;
      
      loadingChildren.value = true;
      
      // Simulate API call
      setTimeout(() => {
        const remaining = referralCount.value - childrenList.value.length;
        const toLoad = Math.min(5, remaining); // Load 5 at a time
        
        if (toLoad > 0) {
          const newItems = Array.from({ length: toLoad }, (_, i) => ({
            address: `0x${Math.random().toString(16).slice(2, 42).padEnd(40, '0')}`,
            level: Math.floor(Math.random() * 5),
            teamCount: Math.floor(Math.random() * 20)
          }));
          
          childrenList.value = [...childrenList.value, ...newItems];
        }
        
        loadingChildren.value = false;
        
        if (childrenList.value.length >= referralCount.value) {
          hasMoreChildren.value = false;
        }
      }, 500);
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
        // After loading, if new items were added, advance
        if (currentCardIndex.value < childrenList.value.length - 1) {
          currentCardIndex.value++;
        }
      }
    };

    const handleBindReferral = () => {
      if (!walletState.isConnected) {
        showToast('请先连接钱包', 'error');
        return;
      }
      if (!referrerInput.value || !ethers.isAddress(referrerInput.value)) {
        showToast('请输入有效的钱包地址', 'error');
        return;
      }
      if (referrerInput.value.toLowerCase() === walletState.address?.toLowerCase()) {
        showToast('不能绑定自己为邀请人', 'error');
        return;
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

    const executeBind = () => {
      closeConfirmModal();
      bindingReferrer.value = true;
      
      // Simulate binding
      setTimeout(() => {
        bindingReferrer.value = false;
        isBound.value = true;
        showToast('绑定成功', 'success');
      }, 1500);
    };

    // Robust copy function for older iOS devices
    const copyText = (text) => {
      if (!text || text === '请先连接钱包' || text === '请先绑定邀请人') return;
      
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
            showToast('复制成功', 'success');
          } else {
            showToast('复制失败，请手动复制', 'error');
          }
        } catch (err) {
          console.error('Fallback copy failed:', err);
          showToast('复制失败，请手动复制', 'error');
        }
      };

      // Try modern API first if available and in secure context
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
          showToast('复制成功', 'success');
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
        childrenList.value = [];
        currentCardIndex.value = 0;
        isBound.value = false;
        referrerInput.value = '';
      }
    });

    onMounted(() => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('ref') || urlParams.get('tab') === 'team') {
        activeTab.value = 'team';
        if (urlParams.get('ref') && ethers.isAddress(urlParams.get('ref'))) {
          referrerInput.value = urlParams.get('ref');
        }
      }

      if (walletState.isConnected) {
        fetchReferralData();
      }
    });

    return {
      activeTab,
      walletState,
      formatAddress,
      myLevel,
      referralCount,
      teamCount,
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
      copyText
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
