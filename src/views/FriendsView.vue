<template>
  <div class="nft-view relative pb-20 min-h-[calc(100vh-140px)]">
    <!-- Fixed Background Glows -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/80 rounded-full blur-[80px] mix-blend-screen animate-glow-float-slow"></div>
      <div class="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] bg-purple-500/80 rounded-full blur-[100px] mix-blend-screen animate-glow-float-delayed"></div>
    </div>

    <div class="fixed inset-0 bg-gradient-to-b from-[#1a153a]/20 to-[#0b0914]/40 z-10 backdrop-blur-sm pointer-events-none"></div>

    <div class="relative z-20">
      <Header @open-get-started-modal="$emit('open-get-started-modal')" @open-language-modal="$emit('open-language-modal')" />
    </div>

    <main class="px-4 pt-6 relative z-20">
      <!-- Tabs -->
      <div class="flex gap-4 mb-6 border-b border-white/10 pb-2">
        <button 
          class="text-[15px] font-bold tracking-wider transition-all relative font-display tech-font"
          :class="activeTab === 'friends' ? 'text-app-pink' : 'text-gray-300 hover:text-white'"
          @click="activeTab = 'friends'"
        >
          {{ t('friends.tabs.myFriends') }}
          <div v-if="activeTab === 'friends'" class="absolute -bottom-[9px] left-0 w-full h-[2px] bg-app-pink shadow-[0_0_8px_rgba(255,77,141,0.8)]"></div>
        </button>
        <button 
          class="text-[15px] font-bold tracking-wider transition-all relative font-display tech-font"
          :class="activeTab === 'team' ? 'text-app-pink' : 'text-gray-300 hover:text-white'"
          @click="activeTab = 'team'"
        >
          {{ t('friends.tabs.inviteReferral') }}
          <div v-if="activeTab === 'team'" class="absolute -bottom-[9px] left-0 w-full h-[2px] bg-app-pink shadow-[0_0_8px_rgba(255,77,141,0.8)]"></div>
        </button>
      </div>

      <!-- Tab Content: Friends -->
      <div v-if="activeTab === 'friends'" class="animate-fade-in">
        <!-- Stats Card -->
        <div class="bg-[#1a153a]/80 backdrop-blur-md rounded-xl border-2 border-white/10 p-4 mb-5 shadow-lg relative overflow-hidden">
          <div class="absolute -right-10 -top-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl"></div>
          
          <div class="relative z-10 flex flex-col gap-4">
            <div class="flex justify-between items-center">
              <div class="flex flex-col items-center flex-1">
                <span class="text-[12px] text-gray-300 tech-font mb-1">{{ t('friends.stats.friendCount') }}</span>
                <span class="text-[17px] font-bold text-white font-display">{{ referralCount }} <span class="text-[11px] text-gray-400 font-normal tech-font">{{ t('common.people') }}</span></span>
              </div>
              <div class="h-8 w-px bg-white/10"></div>
              <div class="flex flex-col items-center flex-1">
                <span class="text-[12px] text-gray-300 tech-font mb-1">{{ t('friends.stats.activeFriends') }}</span>
                <span class="text-[17px] font-bold text-app-pink font-display">{{ activatedDirects }} <span class="text-[11px] text-gray-400 font-normal tech-font">{{ t('common.people') }}</span></span>
              </div>
              <div class="h-8 w-px bg-white/10"></div>
              <div class="flex flex-col items-center flex-1">
                <span class="text-[12px] text-gray-300 tech-font mb-1">{{ t('friends.stats.teamCount') }}</span>
                <span class="text-[17px] font-bold text-white font-display">{{ teamCount }} <span class="text-[11px] text-gray-400 font-normal tech-font">{{ t('common.people') }}</span></span>
              </div>
            </div>

            <div class="h-px w-full bg-white/10"></div>

            <div class="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2.5">
              <span class="text-[12px] text-gray-300 tech-font">{{ t('friends.stats.myLevel') }}</span>
              <div class="flex items-center gap-2">
                <span class="text-[17px] font-bold text-white font-display">A{{ myLevel }}</span>
                <div
                  v-if="myLevelIconSvg"
                  class="level-icon-badge"
                  v-html="myLevelIconSvg"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Friends List -->
        <h3 class="text-[13px] font-display text-white tracking-wider mb-3 flex items-center gap-2 tech-font font-bold">
            <i class="ph-fill ph-users text-app-pink"></i>
            {{ t('friends.list.title') }}
        </h3>
        
        <div v-if="!walletState.isConnected" class="text-center py-8 text-gray-500 tech-font text-[12px] bg-[#1a153a]/50 rounded-xl border-2 border-white/10">
          {{ t('common.connectWalletFirst') }}
        </div>
        <div v-else-if="loadingChildren && childrenList.length === 0" class="text-center py-8 text-gray-500 tech-font text-[12px]">
          {{ t('common.loading') }}
        </div>
        <div v-else-if="childrenList.length === 0" class="text-center py-8 text-gray-500 tech-font text-[12px] bg-[#1a153a]/50 rounded-xl border-2 border-white/10">
          {{ t('friends.list.empty') }}
        </div>
        <div v-else-if="currentChild" class="flex flex-col gap-3">
          <!-- Carousel Card -->
          <transition name="fade" mode="out-in">
            <div :key="currentCardIndex" class="bg-[#1a153a] p-4 rounded-xl border-2 border-white/10 shadow-md relative overflow-hidden">
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
              
              <div class="flex justify-between items-center bg-black/20 rounded-lg p-3 border border-white/10">
                <div class="flex flex-col items-center flex-1">
                  <span class="text-[11px] text-gray-300 tech-font mb-1">{{ t('friends.list.friendLevel') }}</span>
                  <div class="flex items-center gap-1">
                    <span class="text-[15px] font-bold text-white font-display">A{{ currentChild.level !== null ? currentChild.level : '...' }}</span>
                  </div>
                </div>
                <div class="h-8 w-px bg-white/10"></div>
                <div class="flex flex-col items-center flex-1">
                  <span class="text-[11px] text-gray-300 tech-font mb-1">{{ t('friends.list.isActivated') }}</span>
                  <span class="text-[15px] font-bold tech-font" :class="currentChild.userHasActivated ? 'text-green-400' : 'text-gray-300'">
                    {{ currentChild.userHasActivated ? t('friends.list.activated') : t('friends.list.notActivated') }}
                  </span>
                </div>
                <div class="h-8 w-px bg-white/10"></div>
                <div class="flex flex-col items-center flex-1">
                  <span class="text-[11px] text-gray-300 tech-font mb-1">{{ t('friends.list.teamCount') }}</span>
                  <span class="text-[15px] font-bold text-white font-display">{{ currentChild.teamCount }}</span>
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
        <div class="bg-[#1a153a] rounded-xl p-4 border-2 border-white/10 relative overflow-hidden shadow-lg mb-5">
          <div class="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl"></div>
          <h3 class="text-[13px] font-display text-white tracking-wider mb-1.5 relative z-10 flex items-center gap-2 tech-font font-bold">
            <i class="ph-fill ph-share-network text-app-pink"></i>
            {{ t('friends.referral.myLink') }}
          </h3>
          <p class="text-[12px] text-gray-300 mb-3 relative z-10 tech-font">{{ t('friends.referral.shareDesc') }}</p>
          
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
          
          <div class="mt-4 flex items-start gap-1.5 text-[11px] text-gray-300 bg-black/20 p-2.5 rounded-lg border border-white/5 tech-font leading-relaxed">
            <i class="ph-fill ph-info text-app-pink mt-0.5 shrink-0"></i>
            <span>{{ t('friends.referral.tip') }}</span>
          </div>
        </div>

        <!-- Bind Referrer -->
        <div class="bg-[#1a153a] rounded-xl p-4 border-2 border-white/10 relative overflow-hidden shadow-lg">
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

    const polarToCartesian = (cx, cy, radius, angle) => {
      const radians = (angle - 90) * (Math.PI / 180);
      return {
        x: cx + radius * Math.cos(radians),
        y: cy + radius * Math.sin(radians),
      };
    };

    const buildPolygonPoints = (cx, cy, radius, sides, rotation = 0) => {
      return Array.from({ length: sides }, (_, i) => {
        const pt = polarToCartesian(cx, cy, radius, rotation + (360 / sides) * i);
        return `${pt.x.toFixed(2)},${pt.y.toFixed(2)}`;
      }).join(' ');
    };

    const buildStarPoints = (cx, cy, outerRadius, innerRadius, points, rotation = 0) => {
      return Array.from({ length: points * 2 }, (_, i) => {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const pt = polarToCartesian(cx, cy, radius, rotation + (360 / (points * 2)) * i);
        return `${pt.x.toFixed(2)},${pt.y.toFixed(2)}`;
      }).join(' ');
    };

    const getLevelBadgeSvg = (level) => {
      const l = Math.max(1, Math.min(Number(level) || 1, 7));
      const cx = 24, cy = 24;

      // Palette matching UI: Gray -> Emerald -> Blue -> Purple -> Pink -> Orange -> Red/Gold
      const palettes = [
        { main: '#64748b', accent: '#e2e8f0', dark: '#0f172a', glow: '#94a3b8' }, // 1
        { main: '#10b981', accent: '#a7f3d0', dark: '#022c22', glow: '#34d399' }, // 2
        { main: '#3b82f6', accent: '#bfdbfe', dark: '#172554', glow: '#60a5fa' }, // 3
        { main: '#8b5cf6', accent: '#ddd6fe', dark: '#2e1065', glow: '#a78bfa' }, // 4
        { main: '#ec4899', accent: '#fbcfe8', dark: '#500724', glow: '#f472b6' }, // 5
        { main: '#f59e0b', accent: '#fef08a', dark: '#451a03', glow: '#fbbf24' }, // 6
        { main: '#ef4444', accent: '#fef08a', dark: '#450a0a', glow: '#facc15' }, // 7
      ];
      const p = palettes[l - 1];

      let svg = `<svg viewBox="0 0 48 48" width="36" height="36" xmlns="http://www.w3.org/2000/svg">`;
      svg += `<defs>
        <linearGradient id="grad-main-${l}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${p.accent}" />
          <stop offset="100%" stop-color="${p.main}" />
        </linearGradient>
        <linearGradient id="grad-dark-${l}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${p.main}" />
          <stop offset="100%" stop-color="${p.dark}" />
        </linearGradient>
        <filter id="glow-${l}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="${1.5 + l * 0.5}" flood-color="${p.glow}" flood-opacity="${0.4 + l * 0.1}"/>
        </filter>
      </defs>`;

      // Background wings/ribbons
      if (l >= 5) {
        svg += `<path d="M24 24 L4 14 L10 24 L4 34 Z" fill="url(#grad-dark-${l})" stroke="${p.main}" stroke-width="0.5" opacity="0.9"/>`;
        svg += `<path d="M24 24 L44 14 L38 24 L44 34 Z" fill="url(#grad-dark-${l})" stroke="${p.main}" stroke-width="0.5" opacity="0.9"/>`;
      } else if (l >= 3) {
        svg += `<path d="M24 24 L10 18 L14 24 L10 30 Z" fill="url(#grad-dark-${l})" stroke="${p.main}" stroke-width="0.5" opacity="0.8"/>`;
        svg += `<path d="M24 24 L38 18 L34 24 L38 30 Z" fill="url(#grad-dark-${l})" stroke="${p.main}" stroke-width="0.5" opacity="0.8"/>`;
      }

      if (l >= 6) {
        svg += `<path d="M18 30 L14 46 L20 42 L24 48 L24 30 Z" fill="${p.dark}" stroke="url(#grad-main-${l})" stroke-width="1.5"/>`;
        svg += `<path d="M30 30 L34 46 L28 42 L24 48 L24 30 Z" fill="${p.dark}" stroke="url(#grad-main-${l})" stroke-width="1.5"/>`;
      }

      // Main Body
      if (l === 1) {
        svg += `<circle cx="24" cy="24" r="14" fill="${p.dark}" stroke="url(#grad-main-${l})" stroke-width="3" filter="url(#glow-${l})"/>`;
        svg += `<circle cx="24" cy="24" r="10" fill="none" stroke="${p.accent}" stroke-width="1" opacity="0.5"/>`;
      } else if (l === 2) {
        const poly = buildPolygonPoints(24, 24, 15, 6, 30);
        svg += `<polygon points="${poly}" fill="${p.dark}" stroke="url(#grad-main-${l})" stroke-width="3" filter="url(#glow-${l})"/>`;
        const inner = buildPolygonPoints(24, 24, 11, 6, 30);
        svg += `<polygon points="${inner}" fill="none" stroke="${p.accent}" stroke-width="1" opacity="0.5"/>`;
      } else if (l === 3) {
        svg += `<path d="M24 8 L38 12 L36 28 C36 36 24 42 24 42 C24 42 12 36 12 28 L10 12 Z" fill="${p.dark}" stroke="url(#grad-main-${l})" stroke-width="3" filter="url(#glow-${l})"/>`;
        svg += `<path d="M24 12 L34 15 L32 27 C32 33 24 38 24 38 C24 38 16 33 16 27 L14 15 Z" fill="none" stroke="${p.accent}" stroke-width="1" opacity="0.5"/>`;
      } else if (l === 4) {
        const poly = buildPolygonPoints(24, 24, 16, 8, 22.5);
        svg += `<polygon points="${poly}" fill="${p.dark}" stroke="url(#grad-main-${l})" stroke-width="3.5" filter="url(#glow-${l})"/>`;
        const inner = buildPolygonPoints(24, 24, 12, 8, 22.5);
        svg += `<polygon points="${inner}" fill="none" stroke="${p.accent}" stroke-width="1" opacity="0.6"/>`;
      } else if (l === 5) {
        svg += `<path d="M24 6 L36 10 L40 24 L34 36 L24 44 L14 36 L8 24 L12 10 Z" fill="${p.dark}" stroke="url(#grad-main-${l})" stroke-width="3.5" filter="url(#glow-${l})"/>`;
        svg += `<path d="M24 11 L32 14 L35 24 L30 33 L24 39 L18 33 L13 24 L16 14 Z" fill="none" stroke="${p.accent}" stroke-width="1.5" opacity="0.6"/>`;
      } else if (l === 6) {
        const poly = buildPolygonPoints(24, 24, 17, 10, 18);
        svg += `<polygon points="${poly}" fill="${p.dark}" stroke="url(#grad-main-${l})" stroke-width="4" filter="url(#glow-${l})"/>`;
        const star = buildStarPoints(24, 24, 18, 14, 10);
        svg += `<polygon points="${star}" fill="none" stroke="${p.accent}" stroke-width="1.5"/>`;
      } else if (l === 7) {
        const starBg = buildStarPoints(24, 24, 22, 16, 12);
        svg += `<polygon points="${starBg}" fill="${p.dark}" stroke="url(#grad-main-${l})" stroke-width="4" filter="url(#glow-${l})"/>`;
        const innerPoly = buildPolygonPoints(24, 24, 14, 12, 15);
        svg += `<polygon points="${innerPoly}" fill="none" stroke="${p.accent}" stroke-width="2"/>`;
      }

      // Center Emblem
      if (l <= 2) {
        svg += `<circle cx="24" cy="24" r="5" fill="url(#grad-main-${l})"/>`;
      } else if (l <= 4) {
        const star = buildStarPoints(24, 24, 8, 4, 5);
        svg += `<polygon points="${star}" fill="url(#grad-main-${l})"/>`;
      } else if (l <= 6) {
        const star = buildStarPoints(24, 24, 10, 5, 6);
        svg += `<polygon points="${star}" fill="url(#grad-main-${l})"/>`;
        svg += `<circle cx="24" cy="24" r="3" fill="${p.dark}"/>`;
      } else {
        const star = buildStarPoints(24, 24, 12, 6, 8);
        svg += `<polygon points="${star}" fill="url(#grad-main-${l})"/>`;
        const innerStar = buildStarPoints(24, 24, 6, 3, 4);
        svg += `<polygon points="${innerStar}" fill="${p.dark}"/>`;
        svg += `<circle cx="24" cy="24" r="2" fill="${p.accent}"/>`;
      }

      // Top Crown
      if (l >= 5) {
        svg += `<path d="M18 10 L24 2 L30 10 L26 12 L24 8 L22 12 Z" fill="url(#grad-main-${l})" filter="url(#glow-${l})"/>`;
      }

      svg += `</svg>`;
      return svg;
    };

    const myLevelIconSvg = computed(() => getLevelBadgeSvg(myLevel.value));
    
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
      getLevelBadgeSvg,
      myLevel,
      myLevelIconSvg,
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

.level-icon-badge {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.level-icon-badge :deep(svg) {
  width: 36px;
  height: 36px;
  display: block;
}
</style>
