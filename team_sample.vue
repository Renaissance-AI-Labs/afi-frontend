<template>
  <div class="team-page">
    <div class="background-animation">
      <div class="code-grid-bg"></div>
      <div class="floating-particles" id="particles-team"></div>
    </div>

    <div class="page-content">
      <div class="header-section">
        <h2 class="page-title" :data-text="t('team.pageTitle')">{{ t('team.pageTitle') }}</h2>
        <p class="page-intro">
          {{ t('team.intro') }}
        </p>
      </div>

      <div class="right-section">
        <div class="team-container">
          <!-- Tabs Navigation -->
          <div class="tabs-nav">
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'friends' }" 
              @click="activeTab = 'friends'"
            >
              {{ t('team.tab.myFriends') }}
            </button>
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'team' }" 
              @click="activeTab = 'team'"
            >
              {{ t('team.tab.myReferrals') }}
            </button>
          </div>

          <!-- Tab Content -->
          <div class="tab-content">
            
            <!-- Tab 1: My Friends (Previously My Team - List of children) -->
            <div v-if="activeTab === 'friends'" class="team-tab fade-in">
              
              <!-- State: Wallet Not Connected -->
              <div v-if="!walletState.isConnected" class="connect-wallet-state">
                  <div class="connect-box">
                      <p class="connect-msg">{{ t('team.inputPlaceholder.connectWallet') }}</p>
                  </div>
              </div>

              <!-- State: Wallet Connected -->
              <div v-else>
                  <div class="list-header">
                    <span>{{ t('team.myStats') }}</span>
                  </div>
                  <div class="stats-card">
                    <div class="stats-row">
                        <div class="stat-item">
                          <span class="label">{{ t('team.friendsCount') }}</span>
                          <span class="value">{{ referralCount }} <span class="unit">{{ t('team.peopleUnit') }}</span></span>
                        </div>
                        <div class="stat-divider"></div>
                        <div class="stat-item">
                          <span class="label">{{ t('team.validDirectReferrals') }}</span>
                          <span class="value">{{ validDirectReferrals }} <span class="unit">{{ t('team.peopleUnit') }}</span></span>
                        </div>
                        <div class="stat-divider"></div>
                        <div class="stat-item">
                          <span class="label">{{ t('team.myStake') }}</span>
                          <span class="value">{{ myStakedAmount }} <span class="unit">U</span></span>
                        </div>
                    </div>
                    
                    <div class="stats-row-divider"></div>

                    <div class="stats-row">
                        <div class="stat-item">
                          <span class="label">{{ t('team.teamCount') }}</span>
                          <span class="value">{{ teamCount }} <span class="unit">{{ t('team.peopleUnit') }}</span></span>
                        </div>
                        <div class="stat-divider"></div>
                        <div class="stat-item">
                          <span class="label">{{ t('nft.teamPerformance') }}</span>
                          <span class="value highlight">{{ myTeamTotalInvestValue }} <span class="unit">U</span></span>
                        </div>
                    </div>
                  </div>

                  <div class="children-list-container">
                    <div class="list-header">
                      <span>{{ t('team.friendsList') }}</span>
                    </div>
                    
                    <!-- Loading State -->
                    <div v-if="loadingChildren" class="loading-state">
                      <div class="spinner"></div> {{ t('team.loading') }}
                    </div>

                    <!-- Empty State (Only show if NOT loading and list is empty) -->
                    <div v-else-if="childrenList.length === 0" class="empty-state">
                      {{ t('team.noFriends') }}
                    </div>

                    <!-- Carousel View (Show if list has items) -->
                    <div v-else class="carousel-view">
                        <div class="card-viewport">
                            <transition name="slide-fade" mode="out-in">
                                <div :key="currentCardIndex" class="friend-card" v-if="currentChild">
                                    <div class="card-header-row">
                                        <div class="user-avatar-placeholder">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        </div>
                                        <div class="card-address" @click="copyText(currentChild.address)">
                                            {{ formatAddress(currentChild.address) }}
                                            <!-- <svg class="copy-icon-small" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> -->
                                        </div>
                                    </div>

                                    <div class="card-stats-grid">
                                        <div class="stat-box">
                                            <span class="stat-label">{{ t('team.friendStaking') }}</span>
                                            <span class="stat-value">
                                                <span v-if="currentChild.friendStaking !== null">{{ currentChild.friendStaking }}</span>
                                                <span v-else class="loading-dots">...</span>
                                                <span class="unit">U</span>
                                            </span>
                                        </div>

                                        <div class="stat-box">
                                            <span class="stat-label">{{ t('team.teamCount') }}</span>
                                            <span class="stat-value">
                                                <span v-if="currentChild.teamCount !== null">{{ currentChild.teamCount }}</span>
                                                <span v-else class="loading-dots">...</span>
                                                <span class="unit">{{ t('team.peopleUnit') }}</span>
                                            </span>
                                        </div>

                                        <div class="stat-box">
                                            <span class="stat-label">{{ t('nft.teamPerformance') }}</span>
                                            <span class="stat-value highlight">
                                                <span v-if="currentChild.teamTotalInvestValue !== null">{{ currentChild.teamTotalInvestValue }}</span>
                                                <span v-else class="loading-dots">...</span>
                                                <span class="unit">U</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </transition>
                        </div>

                        <div class="pagination-controls">
                            <button class="nav-btn prev" @click="prevCard" :disabled="currentCardIndex === 0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                            </button>
                            
                            <span class="page-indicator">{{ currentCardIndex + 1 }} / {{ referralCount }}</span>

                            <button class="nav-btn next" @click="nextCard" :disabled="!hasMoreChildren && currentCardIndex === childrenList.length - 1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                            </button>
                        </div>
                    </div>

                  </div>
              </div>
            </div>

            <!-- Tab 2: My Referral (Previously My Friends - Bind & Link) -->
            <div v-if="activeTab === 'team'" class="friends-tab fade-in">

              <!-- Section: My Referrer -->
              <div class="friend-section">
                <h3 class="section-title">{{ t('team.myReferrer') }}</h3>
                <p class="section-desc" v-if="!isBound">{{ t('team.bindReferrerDesc') }}</p>
                <p class="section-desc success-text" v-else>{{ t('team.bindSuccessDesc') }}</p>

                <div class="input-box">
                  <input 
                    type="text" 
                    :value="isBound ? formatAddress(referrerInput) : referrerInput" 
                    readonly 
                    :placeholder="walletState.isConnected ? t('team.inputPlaceholder.autoFill') : t('team.inputPlaceholder.connectWallet')"
                    class="code-input disabled"
                  />
                  <button 
                    v-if="!isBound"
                    class="btn-bind" 
                    @click="handleBindReferral"
                    :disabled="bindingReferrer || !walletState.isConnected || !referrerInput"
                  >
                    <span v-if="bindingReferrer">{{ t('team.binding') }}</span>
                    <span v-else>{{ t('team.bind') }}</span>
                  </button>
                </div>
              </div>
              
              <!-- <div class="divider-horizontal"></div> -->

              <!-- Section: My Referral Link -->
              <div class="friend-section">
                <h3 class="section-title">{{ t('team.myReferralLink') }}</h3>
                <p class="section-desc">{{ t('team.referralLinkDesc') }}</p>
                <div class="input-box" :class="{ 'referral-box': walletState.isConnected && isBound }">
                  <textarea 
                    :value="myReferralLink" 
                    readonly 
                    class="code-input code-textarea" 
                    :class="{ 'disabled': !isBound || !walletState.isConnected }"
                    @focus="$event.target.select()"
                    rows="1"
                    ref="referralTextarea"
                  ></textarea>
                  <button 
                    class="btn-copy" 
                    @click="copyText(myReferralLink)"
                    :disabled="!walletState.isConnected || !isBound"
                  >
                    {{ t('team.copy') }}
                  </button>
                </div>
                <div class="section-hint">
                  <i class="fas fa-exclamation-circle hint-icon"></i>
                  <span v-html="t('team.link.copyHint')"></span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <transition name="modal">
      <ConnectWalletModal v-if="isModalVisible" @close="closeModal" />
    </transition>

    <!-- Confirm Modal -->
    <transition name="modal">
      <div v-if="isConfirmModalVisible" class="modal-mask">
        <div class="modal-container">
          <div class="modal-header">
            <h3>{{ t('team.modal.bindTitle') }}</h3>
          </div>
          <div class="modal-body">
            <p class="warning-text">{{ t('team.modal.warning') }}</p>
            <div class="confirm-address">{{ confirmAddress }}</div>
          </div>
          <div class="modal-footer">
            <button class="modal-btn cancel" @click="closeConfirmModal">{{ t('team.modal.cancel') }}</button>
            <button 
              class="modal-btn confirm" 
              :disabled="confirmCountdown > 0"
              @click="executeBind"
            >
              {{ confirmCountdown > 0 ? `${t('team.modal.confirm')} (${confirmCountdown}s)` : t('team.modal.confirm') }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { walletState, formatAddress } from '@/services/wallet.js';
import { getContractAddress } from '@/services/contracts.js';
import { showToast } from '@/services/notification.js';
import { onMounted, ref, computed, watch, nextTick } from 'vue';
import { ethers } from 'ethers';
import referralAbi from '@/abis/referral.json';
import stakingAbi from '@/abis/staking.json';
import ConnectWalletModal from '@/components/ConnectWalletModal.vue';
import { useRoute } from 'vue-router'; // We might need router for query params, but window.location is safer without router setup check
import { t } from '@/i18n/index.js';

export default {
  name: 'TeamView',
  components: {
    ConnectWalletModal
  },
  setup() {
    // --- State ---
    const isModalVisible = ref(false);
    const activeTab = ref('friends'); // Default to 'friends' (which is now the list view)
    
    // Data State
    const referralCount = ref(0);
    const validDirectReferrals = ref(0);
    const teamCount = ref(0);
    const myTeamTotalInvestValue = ref('0.0');
    const myStakedAmount = ref('0.0');
    const childrenList = ref([]);
    const currentCardIndex = ref(0);
    const childrenCursor = ref(0);
    const loadingChildren = ref(false);
    const hasMoreChildren = ref(false);
    const pageSize = 10;

    // Friends Tab State
    const referrerInput = ref('');
    const isBound = ref(false);
    const bindingReferrer = ref(false);
    
    // Confirm Modal State
    const isConfirmModalVisible = ref(false);
    const confirmCountdown = ref(5);
    const confirmTimer = ref(null);
    const confirmAddress = ref('');
    const referralTextarea = ref(null);

    // Computed
    const currentChild = computed(() => {
        if (childrenList.value.length === 0) return null;
        return childrenList.value[currentCardIndex.value];
    });

    const myReferralLink = computed(() => {
      if (!walletState.address) return t('team.inputPlaceholder.connectWallet');
      if (!isBound.value) return t('team.link.bindFirst'); // Logic added: Show hint when not bound
      const baseUrl = window.location.origin + window.location.pathname;
      return `${baseUrl}?ref=${walletState.address}`;
    });

    // --- Methods ---
    const openModal = () => isModalVisible.value = true;
    const closeModal = () => isModalVisible.value = false;

    // Get Contract Instance
    const getReferralContract = () => {
      if (!walletState.signer) return null;
      const address = getContractAddress('referral');
      if (!address) return null;
      return new ethers.Contract(address, referralAbi, walletState.signer);
    };

    const getReferralContractReadOnly = async () => {
        // If wallet not connected, use provider if available, or just return null
        // For 'read' operations we can use provider.
        if (!walletState.provider && !window.ethereum) return null;
        
        let provider = walletState.provider;
        if (!provider) {
             provider = new ethers.BrowserProvider(window.ethereum);
        }
        
        const address = getContractAddress('referral');
        if (!address) return null;
        return new ethers.Contract(address, referralAbi, provider);
    };


    // 1. Fetch Referral Data (Count & Check Bind Status)
    const fetchReferralData = async () => {
      if (!walletState.address) return;

      try {
        const contract = await getReferralContractReadOnly(); // Can use read-only for checks
        if (!contract) return;

        // Get Count
        const count = await contract.getReferralCount(walletState.address);
        referralCount.value = count.toString();

        // Get Team Count
        const tCount = await contract.getTeamCount(walletState.address);
        teamCount.value = tCount.toString();

        // Get My Team Total Invest Value & Valid Direct Referrals
        try {
            let provider = walletState.provider;
            if (!provider && window.ethereum) {
                 provider = new ethers.BrowserProvider(window.ethereum);
            }
            if (provider) {
                const stakingAddress = getContractAddress('Staking');
                if (stakingAddress) {
                    const stakingContract = new ethers.Contract(stakingAddress, stakingAbi, provider);
                    
                    // Parallel fetch
                    const [value, validCount, balance] = await Promise.all([
                        stakingContract.teamTotalInvestValue(walletState.address),
                        stakingContract.validDirectReferralsCount(walletState.address),
                        stakingContract.balanceOf(walletState.address)
                    ]);

                    myTeamTotalInvestValue.value = parseFloat(ethers.formatEther(value)).toFixed(1);
                    validDirectReferrals.value = validCount.toString();
                    myStakedAmount.value = parseFloat(ethers.formatEther(balance)).toFixed(1);
                }
            }
        } catch (err) {
            console.error("Error fetching staking data:", err);
            myTeamTotalInvestValue.value = '0.0';
            validDirectReferrals.value = 0;
            myStakedAmount.value = '0.0';
        }

        // Get Current Referrer
        const referrer = await contract.getReferral(walletState.address);
        
        if (referrer && referrer !== ethers.ZeroAddress) {
          isBound.value = true;
          referrerInput.value = referrer;
        } else {
          isBound.value = false;
          // Only if not bound, we check URL param (on init)
          checkUrlParam(); 
        }

        // Refresh list
        loadChildren(true);

      } catch (error) {
        console.error("Error fetching referral data:", error);
      }
    };

    // 2. Check URL for ref param
    const checkUrlParam = () => {
       if (isBound.value) return; // Don't overwrite if already bound
       
       const urlParams = new URLSearchParams(window.location.search);
       const refParam = urlParams.get('ref');
       
       if (!walletState.isConnected) {
           referrerInput.value = ''; // 未连接钱包时，始终清空，不预填充
           return;
       }

       if (refParam && ethers.isAddress(refParam)) {
           // Prevent self-ref in input if connected
           if (walletState.address && refParam.toLowerCase() === walletState.address.toLowerCase()) {
               console.log("Self-referral detected in URL, ignoring.");
               referrerInput.value = '';
               return;
           }
           referrerInput.value = refParam;
       }
    };

    // 3. Load Children (Pagination)
    const loadChildren = async (reset = false) => {
      if (!walletState.address) return;
      
      const contract = await getReferralContractReadOnly();
      if (!contract) return;

      if (reset) {
        childrenCursor.value = 0;
        childrenList.value = [];
        currentCardIndex.value = 0;
        hasMoreChildren.value = true; // reset assumption
      }

      if (!hasMoreChildren.value && !reset) return;

      loadingChildren.value = true;
      try {
        // getChildren(address referrer, uint256 cursor, uint256 size)
        // returns (address[] memory, uint256 newCursor)
        const result = await contract.getChildren(
            walletState.address, 
            childrenCursor.value, 
            pageSize
        );

        const newChildren = result[0]; // array
        const newCursor = result[1];   // uint

        if (newChildren && newChildren.length > 0) {
            // Filter out empty addresses if any (solidity static array return might include empty if not careful, but dynamic array should be fine)
            const validChildren = newChildren.filter(addr => addr !== ethers.ZeroAddress);
            // Map to objects
            const childObjects = validChildren.map(addr => ({
                address: addr,
                teamCount: null, // Init as null
                teamTotalInvestValue: null, // Init as null
                friendStaking: null // Init as null
            }));
            
            childrenList.value = [...childrenList.value, ...childObjects];
            childrenCursor.value = Number(newCursor);
            
            // If this is the first load (or reset), fetch the first child's team count immediately
            if (reset && childrenList.value.length > 0) {
                fetchChildTeamCount(0);
                fetchChildStakingData(0);
            }

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

    // 5. Fetch Team Count for a Child
    const fetchChildTeamCount = async (index) => {
        const child = childrenList.value[index];
        if (!child || child.teamCount !== null) return; // Already fetched or invalid

        try {
            const contract = await getReferralContractReadOnly();
            if (!contract) return;
            const tCount = await contract.getTeamCount(child.address);
            child.teamCount = tCount.toString();
        } catch (error) {
            console.error(`Error fetching team count for ${child.address}:`, error);
            child.teamCount = '0'; // Fallback
        }
    };

    const fetchChildStakingData = async (index) => {
        const child = childrenList.value[index];
        if (!child || (child.teamTotalInvestValue !== null && child.friendStaking !== null)) return;

        try {
            // Get Staking Contract (Read Only)
            let provider = walletState.provider;
            if (!provider && window.ethereum) {
                 provider = new ethers.BrowserProvider(window.ethereum);
            }
            if (!provider) return;

            const address = getContractAddress('Staking');
            if (!address) return;
            
            const contract = new ethers.Contract(address, stakingAbi, provider);
            
            const [value, balance] = await Promise.all([
                contract.teamTotalInvestValue(child.address),
                contract.balanceOf(child.address)
            ]);
            
            // Format to 1 decimal place
            child.teamTotalInvestValue = parseFloat(ethers.formatEther(value)).toFixed(1);
            child.friendStaking = parseFloat(ethers.formatEther(balance)).toFixed(1);
        } catch (error) {
            console.error(`Error fetching staking data for ${child.address}:`, error);
            child.teamTotalInvestValue = '0.0';
            child.friendStaking = '0.0';
        }
    };

    // 6. Carousel Navigation
    const prevCard = () => {
        if (currentCardIndex.value > 0) {
            currentCardIndex.value--;
        }
    };

    const nextCard = () => {
        if (currentCardIndex.value < childrenList.value.length - 1) {
            currentCardIndex.value++;
        } else if (hasMoreChildren.value && !loadingChildren.value) {
            // Load more if at the end
            loadChildren(false).then(() => {
                // If new items were added, move next
                if (currentCardIndex.value < childrenList.value.length - 1) {
                    currentCardIndex.value++;
                }
            });
        }
    };

    // Watch current index to fetch team count
    watch(currentCardIndex, (newIndex) => {
        if (newIndex >= 0 && newIndex < childrenList.value.length) {
            fetchChildTeamCount(newIndex);
            fetchChildStakingData(newIndex);
        }
    });

    const closeConfirmModal = () => {
      isConfirmModalVisible.value = false;
      if (confirmTimer.value) clearInterval(confirmTimer.value);
    };

    const startConfirmCountdown = () => {
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

    // 4. Bind Referrer
    const handleBindReferral = async () => {
        if (!walletState.isConnected) {
            openModal();
            return;
        }

        const inputAddress = referrerInput.value.trim();
        const currentAccount = walletState.address;

        // Validation
        if (!inputAddress || inputAddress === ethers.ZeroAddress) {
            showToast(t('team.toast.invalidAddress'), 'error');
            return;
        }

        if (!ethers.isAddress(inputAddress)) {
            showToast(t('team.toast.formatError'), 'error');
            return;
        }

        if (inputAddress.toLowerCase() === currentAccount.toLowerCase()) {
            showToast(t('team.toast.selfBindError'), 'error');
            return;
        }
        
        // Show Confirm Modal
        confirmAddress.value = inputAddress;
        isConfirmModalVisible.value = true;
        startConfirmCountdown();
    };

    const executeBind = async () => {
        closeConfirmModal();
        bindingReferrer.value = true;
        const inputAddress = confirmAddress.value;

        try {
            const contract = getReferralContract();
            if (!contract) throw new Error("Contract not initialized");

            // Check if referrer is valid (must be bound themselves)
            // Call isBindReferral(address)
            const isValidReferrer = await contract.isBindReferral(inputAddress);
            
            if (!isValidReferrer) {
                showToast(t('team.toast.referrerNotJoined'), 'error');
                bindingReferrer.value = false;
                return;
            }

            // Bind
            const tx = await contract.bindReferral(inputAddress);
            showToast(t('team.toast.txSubmitted'), 'success');
            
            await tx.wait();
            
            showToast(t('team.toast.bindSuccess'), 'success');
            isBound.value = true;
            
            // Refresh data
            fetchReferralData();

        } catch (error) {
            console.error("Binding failed:", error);
            
            // User rejected check
            if (error.code === 4001 || error.code === 'ACTION_REJECTED' || (error.reason && error.reason.includes('rejected'))) {
                return;
            }

            if (error.reason) {
                 showToast(t('team.toast.bindFailed') + error.reason, 'error');
            } else if (error.message && error.message.includes("User already has a referral")) {
                 showToast(t('team.toast.alreadyBound'), 'error');
            } else {
                 showToast(t('team.toast.checkNetwork'), 'error');
            }
        } finally {
            bindingReferrer.value = false;
        }
    };

    // Helper: Copy
    const copyText = (text) => {
        if (!text || text === t('team.inputPlaceholder.connectWallet') || text === t('team.link.bindFirst')) return;
        
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            
            // Ensure textarea is not visible but part of DOM to avoid layout shifts
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            textArea.style.top = '0';
            
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                showToast(t('team.toast.copySuccess'), 'success');
            } else {
                throw new Error('execCommand returned false');
            }
        } catch (err) {
            console.error('Copy failed (fallback): ', err);
            // Try navigator.clipboard as backup if available
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text)
                    .then(() => showToast(t('team.toast.copySuccess'), 'success'))
                    .catch(() => showToast(t('team.toast.copyFailed'), 'error'));
            } else {
                showToast(t('team.toast.copyFailed'), 'error');
            }
        }
    };

    const adjustTextareaHeight = async () => {
        await nextTick();
        const el = referralTextarea.value;
        if (el) {
            el.style.height = 'auto'; // Reset height
            el.style.height = el.scrollHeight + 'px'; // Set to content height
        }
    };

    // Watchers
    watch(() => [walletState.isConnected, walletState.address], ([newConnected, newAddress], [oldConnected, oldAddress]) => {
        // If disconnected
        if (!newConnected) {
            referralCount.value = 0;
            validDirectReferrals.value = 0;
            teamCount.value = 0;
            myTeamTotalInvestValue.value = '0.0';
            childrenList.value = [];
            currentCardIndex.value = 0;
            childrenCursor.value = 0;
            hasMoreChildren.value = false;
            isBound.value = false;
            referrerInput.value = ''; // Ensure input is cleared
            checkUrlParam(); // Re-check URL param after disconnect. If ref param exists, fill it; otherwise keep empty
            return;
        }

        // If connection state changes or address changes
        if (newConnected && newAddress) {
            // If just address changed, or just connected, re-fetch
             if (newAddress !== oldAddress || !oldConnected) {
                // Reset list state
                childrenList.value = [];
                currentCardIndex.value = 0;
                childrenCursor.value = 0;
                hasMoreChildren.value = false;
                
                // Re-fetch data
                fetchReferralData();
             }
        }
    });

    watch(myReferralLink, () => {
        adjustTextareaHeight();
    });

    watch(activeTab, async (newTab) => {
      if (newTab === 'team') {
        await nextTick();
        adjustTextareaHeight();
      }
    });

    onMounted(() => {
        // Adjust height initially
        adjustTextareaHeight();

        // Init particles
        const particlesContainer = document.getElementById('particles-team');
        if (particlesContainer && particlesContainer.childElementCount === 0) {
            const codeSymbols = ['{', '}', '[', ']', '(', ')', '<', '>', '/', '*', '=', '+', '-', ';', ':', '&', '|', '%', '$', '#', '@'];
            const particleCount = 20;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.textContent = codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 15 + 's';
                particle.style.animationDuration = (10 + Math.random() * 10) + 's';
                particlesContainer.appendChild(particle);
            }
        }

        // Check param for Tab Switching
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('ref') || urlParams.get('tab') === 'team') {
            activeTab.value = 'team'; // 'team' key now corresponds to "我的推荐" (Bind & Link)
        }

        // Init Data
        if (walletState.isConnected) {
            fetchReferralData();
        } else {
            checkUrlParam();
        }
    });

    return {
      t,
      walletState,
      formatAddress,
      isModalVisible,
      openModal,
      closeModal,
      activeTab,
      referralCount,
      validDirectReferrals,
      teamCount,
      myTeamTotalInvestValue,
      myStakedAmount,
      childrenList,
      loadingChildren,
      hasMoreChildren,
      loadChildren,
      myReferralLink,
      referrerInput,
      isBound,
      bindingReferrer,
      handleBindReferral,
      copyText,
      // Carousel
      currentCardIndex,
      currentChild,
      prevCard,
      nextCard,
      // Confirm Modal
      isConfirmModalVisible,
      confirmCountdown,
      closeConfirmModal,
      executeBind,
      confirmAddress,
      referralTextarea
    };
  }
}
</script>