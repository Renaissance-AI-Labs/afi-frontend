<template>
  <div class="nft-view relative pb-20 min-h-[calc(100vh-140px)]">
    <div class="bg-gradient-to-b from-[#1a153a] to-[#0b0914]">
      <Header @open-get-started-modal="$emit('open-get-started-modal')" @open-language-modal="$emit('open-language-modal')" />
    </div>

    <!-- 主要内容区域 -->
    <main class="px-4 pt-4 relative z-20">
        
        <!-- NFT 认购 模块 -->
        <section class="mb-6">
            <div class="bg-app-card/80 backdrop-blur-sm rounded-t-xl border-t border-x border-app-pink/30 px-3 py-1.5 inline-block mb-[-1px] relative z-10">
                <h2 class="text-[13px] font-display text-white tracking-wider tech-font font-bold">NFT 认购</h2>
            </div>
            
            <div class="flex flex-col gap-3 pb-4 pt-3 bg-app-card/40 rounded-b-xl rounded-tr-xl border border-app-pink/30 p-3">
                <div
                  v-if="walletState.isConnected"
                  class="w-full bg-[#1a153a] rounded-xl p-4 glow-border-pink flex relative overflow-hidden gap-4 min-h-[160px]"
                >
                    <div class="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl"></div>
                    
                    <!-- 左侧：图片和标题 -->
                    <div class="w-[140px] shrink-0 flex flex-col relative z-10">
                        <div class="flex justify-between items-center mb-2">
                            <div class="text-[11px] text-pink-300 font-bold leading-tight uppercase tracking-wider tech-font">{{ currentPhaseLabel }}</div>
                            <div class="text-[14px] font-display text-white tracking-wide">{{ currentPhaseName }}</div>
                        </div>
                        <!-- 正方形图片 -->
                        <div class="w-full aspect-square rounded-lg border border-pink-500/50 flex items-center justify-center overflow-hidden relative bg-black/40 p-1.5 shadow-inner">
                            <img :src="purchaseImageUrl" @error="onSubscriptionImageError" alt="NFT" class="w-full h-full object-contain relative z-10 drop-shadow-[0_0_10px_rgba(255,77,141,0.6)]" />
                        </div>
                    </div>

                    <!-- 右侧：信息和操作 -->
                    <div class="flex-1 flex flex-col justify-between relative z-10 py-1">
                        <div>
                            <!-- 进度条和售卖数量 -->
                            <div class="mb-3">
                                <div class="flex justify-between text-[11px] font-bold text-white mb-1.5">
                                    <span class="tech-font">已售: {{ purchaseData.totalPurchased }}/{{ purchaseData.maxPurchaseAmount }}</span>
                                    <span class="text-pink-300">{{ formattedProgressPercent }}</span>
                                </div>
                                <div class="w-full bg-gray-700 rounded-full h-2">
                                    <div class="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full shadow-[0_0_5px_rgba(255,77,141,0.5)]" :style="{ width: `${progressPercent}%` }"></div>
                                </div>
                            </div>
                            
                            <!-- 总价 -->
                            <div class="flex justify-between items-center mb-3">
                                <span class="text-[12px] text-gray-300 tech-font">总价:</span>
                                <span class="text-white font-bold text-[16px]">{{ formattedTotalPurchasePrice }}</span>
                            </div>
                        </div>
                        
                        <div>
                            <!-- 数量选择器 -->
                            <div class="flex items-center w-full bg-black/30 rounded-lg border border-pink-500/30 overflow-hidden mb-3 h-9">
                                <button @click="decreaseQuantity" class="w-10 h-full bg-pink-500/20 text-white flex items-center justify-center hover:bg-pink-500/40 transition text-lg font-bold">-</button>
                                <input v-model.number="quantity" @change="normalizeQuantity" type="number" class="flex-1 w-full bg-transparent text-center text-white text-[15px] font-bold h-full outline-none tech-font p-0" min="1">
                                <button @click="increaseQuantity" class="w-10 h-full bg-pink-500/20 text-white flex items-center justify-center hover:bg-pink-500/40 transition text-lg font-bold">+</button>
                            </div>

                            <!-- 认购按钮 -->
                            <button @click="subscribe" :disabled="isPurchaseButtonDisabled" class="w-full bg-app-pink text-white font-display text-[14px] h-10 rounded-lg border border-pink-300 hover:bg-pink-600 relative z-10 tracking-widest transition tech-font font-bold shadow-[0_0_12px_rgba(255,77,141,0.4)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-app-pink">
                                {{ purchaseButtonText }}
                            </button>
                        </div>
                    </div>
                </div>

                <div
                  v-else
                  class="w-full bg-[#1a153a] rounded-xl p-5 glow-border-pink relative overflow-hidden min-h-[160px] flex flex-col items-center justify-center text-center"
                >
                    <div class="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl"></div>
                    <div class="w-16 h-16 rounded-xl border border-pink-500/40 overflow-hidden bg-black/40 p-2 mb-3 relative z-10">
                        <img src="/asset/images/logo/Node.png" alt="NFT" class="w-full h-full object-contain" />
                    </div>
                    <div class="relative z-10">
                        <div class="text-white font-display text-[15px] tracking-wide mb-1">连接钱包后查看认购信息</div>
                        <div class="text-[12px] text-gray-400 tech-font">当前期数、进度、单价和 NFT 图片将在连接后自动读取</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 我的NFT 资产与列表区 (合并优化) -->
        <section class="mb-6 relative z-10">
            <!-- 顶部统计栏 (扁平化横向排版，融入列表头部) -->
            <div class="bg-[#1a153a]/80 backdrop-blur-md rounded-xl border border-white/10 p-3 mb-4 shadow-lg flex items-center justify-between relative overflow-hidden">
                <div class="absolute -left-10 -top-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl"></div>
                
                <div class="flex items-center gap-2 relative z-10">
                    <i class="ph-fill ph-wallet text-app-pink text-2xl drop-shadow-[0_0_5px_rgba(255,77,141,0.5)]"></i>
                    <div class="flex flex-col">
                        <span class="text-[12px] text-gray-400 tech-font leading-tight">总资产</span>
                        <span class="text-[18px] font-bold text-white tracking-tight leading-tight">{{ nftTotalBalance }}</span>
                    </div>
                </div>
                
                <div class="h-8 w-px bg-white/10 relative z-10"></div>
                
                <div class="flex flex-col items-center relative z-10">
                    <span class="text-[11px] text-gray-400 tech-font leading-tight">已激活</span>
                    <span class="text-[16px] font-bold text-pink-300 leading-tight">{{ activatedCount }}</span>
                </div>
                
                <div class="h-8 w-px bg-white/10 relative z-10"></div>
                
                <div class="flex flex-col items-end relative z-10">
                    <span class="text-[11px] text-gray-400 tech-font leading-tight">未激活</span>
                    <span class="text-[16px] font-bold text-gray-300 leading-tight">{{ unactivatedCount }}</span>
                </div>
            </div>

            <!-- 列表容器 -->
            <div class="flex flex-col gap-3">
                <!-- 空状态 -->
                <div v-if="myNfts.length === 0" class="text-center py-8 text-gray-500 tech-font text-[12px] bg-[#1a153a]/50 rounded-xl border border-white/5">
                    暂无资产，请先认购
                </div>

                <!-- 列表项 -->
                <div class="flex flex-col gap-3 bg-[#1a153a] p-3.5 rounded-xl border border-white/5 hover:border-pink-500/30 transition-all shadow-md" v-for="nft in displayedNfts" :key="nft.id">
                    <div class="flex gap-3 items-center">
                        <!-- 左侧图片 -->
                        <div class="w-14 h-14 rounded-lg border border-pink-500/30 overflow-hidden shrink-0 bg-black/40 p-1 flex items-center justify-center">
                            <img src="/asset/images/logo/Node.png" class="max-w-full max-h-full object-contain" />
                        </div>
                        
                        <!-- 中间信息 -->
                        <div class="flex-1 min-w-0">
                            <div class="flex justify-between items-start mb-1.5">
                                <div class="text-[15px] font-bold text-white truncate">{{ nft.name }}</div>
                                <!-- 状态标签 -->
                                <span v-if="nft.activated" class="text-[9px] text-pink-300 border border-pink-500/30 px-1.5 py-0.5 rounded tech-font">已激活</span>
                                <span v-else class="text-[9px] text-gray-400 border border-gray-500/30 px-1.5 py-0.5 rounded tech-font">未激活</span>
                            </div>
                            
                            <!-- 产币信息 -->
                            <div class="text-[12px] tech-font bg-black/20 rounded px-2 py-1 inline-block border border-white/5">
                                <span class="text-gray-400">可领取: </span>
                                <span :class="nft.activated ? 'text-white font-bold' : 'text-gray-500'">
                                    {{ nft.activated ? nft.yield.toFixed(2) : '0.00' }} <span class="text-[10px]">AFI</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 下方按钮区 -->
                    <div class="flex gap-2.5 mt-1">
                        <template v-if="!nft.activated">
                            <button @click="activateNft(nft)" class="flex-1 tech-font text-[13px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/30 py-2 rounded-lg hover:bg-pink-500/20 transition active:scale-95">
                                激 活
                            </button>
                            <button @click="transferNft(nft)" class="flex-1 tech-font text-[13px] font-bold bg-white/5 text-gray-300 border border-white/10 py-2 rounded-lg hover:bg-white/10 transition active:scale-95">
                                转 让
                            </button>
                        </template>
                        <template v-else>
                            <!-- 激活后显示领取收益按钮 -->
                            <button @click="claimYield(nft)" class="flex-1 tech-font text-[13px] font-bold bg-app-pink text-white border border-pink-300 py-2 rounded-lg hover:bg-pink-600 transition shadow-[0_0_8px_rgba(255,77,141,0.3)] active:scale-95">
                                领 取 收 益
                            </button>
                        </template>
                    </div>
                </div>
            </div>

            <!-- 加载更多按钮 -->
            <div v-if="displayCount < myNfts.length" class="mt-5 flex justify-center">
                <button @click="loadMore" class="text-[12px] text-pink-400 tech-font border border-pink-500/30 rounded-full px-6 py-2 hover:bg-pink-500/10 transition flex items-center gap-1">
                    点击加载更多 <i class="ph-bold ph-caret-down"></i>
                </button>
            </div>
            <div v-else-if="myNfts.length > 0" class="mt-5 text-center text-[11px] text-gray-500 tech-font">
                已加载全部资产
            </div>
        </section>

    </main>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import { showToast } from '@/services/notification';
import { walletState } from '@/services/wallet.js';
import { getContractAddress } from '@/services/contracts.js';
import { ethers } from 'ethers';
import nodeAbi from '@/abis/node.json';
import usdtAbi from '@/abis/usdt.json';

export default {
  name: 'NftView',
  components: {
    Header
  },
  data() {
    return {
      walletState,
      quantity: 1,
      purchaseCardLoading: false,
      purchaseSubmitting: false,
      purchasePaymentStateLoading: false,
      purchaseButtonStatus: '',
      purchaseStatusTimer: null,
      purchaseLogCache: {
        raw: '',
        formatted: '',
        payment: ''
      },
      purchaseImageErrored: false,
      purchaseDataRequestId: 0,
      nftTotalBalance: 0,
      nftActivatedCount: 0,
      purchaseData: {
        purchaseLevel: 0,
        phaseName: '',
        totalPurchased: 0,
        maxPurchaseAmount: 0,
        purchasePrice: '0',
        purchasePriceRaw: '0',
        usdtDecimals: 18,
        baseURI: ''
      },
      purchasePaymentState: {
        balanceRaw: '0',
        allowanceRaw: '0'
      },
      displayCount: 10, // 初始显示数量
      // 模拟生成 15 个数据以测试分页
      myNfts: Array.from({ length: 15 }, (_, i) => ({
        id: 101 + i,
        name: `GAMMA #${101 + i}`,
        activated: i < 3, // 前3个默认激活
        yield: i < 3 ? (Math.random() * 50 + 10) : 0 // 激活的有随机收益
      }))
    }
  },
  computed: {
    activatedCount() {
      return this.nftActivatedCount;
    },
    unactivatedCount() {
      return Math.max(this.nftTotalBalance - this.nftActivatedCount, 0);
    },
    displayedNfts() {
      return this.myNfts.slice(0, this.displayCount);
    },
    currentPhaseLabel() {
      if (!this.purchaseData.purchaseLevel) {
        return '--';
      }
      return `第${this.purchaseData.purchaseLevel}期`;
    },
    currentPhaseName() {
      return this.purchaseData.phaseName || '--';
    },
    progressPercent() {
      if (!this.purchaseData.maxPurchaseAmount) {
        return 0;
      }
      const progress = (this.purchaseData.totalPurchased / this.purchaseData.maxPurchaseAmount) * 100;
      return Math.min(progress, 100);
    },
    formattedProgressPercent() {
      const progress = this.progressPercent;
      return Number.isInteger(progress) ? `${progress}%` : `${progress.toFixed(2)}%`;
    },
    formattedPurchasePrice() {
      return `${this.purchaseData.purchasePrice} USDT`;
    },
    formattedTotalPurchasePrice() {
      return `${this.totalPurchasePrice} USDT`;
    },
    totalPurchasePrice() {
      return this.formatUsdtAmount(this.totalPurchasePriceRaw);
    },
    remainingPurchaseAmount() {
      return Math.max(this.purchaseData.maxPurchaseAmount - this.purchaseData.totalPurchased, 0);
    },
    totalPurchasePriceRaw() {
      const priceRaw = BigInt(this.purchaseData.purchasePriceRaw || '0');
      return priceRaw * BigInt(this.quantity || 0);
    },
    hasEnoughUsdtBalance() {
      return BigInt(this.purchasePaymentState.balanceRaw || '0') >= this.totalPurchasePriceRaw;
    },
    hasEnoughUsdtAllowance() {
      return BigInt(this.purchasePaymentState.allowanceRaw || '0') >= this.totalPurchasePriceRaw;
    },
    purchaseImageUrl() {
      if (this.purchaseImageErrored || !this.purchaseData.baseURI || !this.purchaseData.phaseName) {
        return '/asset/images/logo/Node.png';
      }
      const baseURI = this.purchaseData.baseURI.endsWith('/')
        ? this.purchaseData.baseURI
        : `${this.purchaseData.baseURI}/`;
      return `${baseURI}${this.purchaseData.phaseName}.png`;
    },
    purchaseButtonText() {
      if (!this.walletState.isConnected) {
        return '请先连接钱包';
      }
      if (this.purchaseButtonStatus) {
        return this.purchaseButtonStatus;
      }
      if (this.purchaseCardLoading || this.purchasePaymentStateLoading) {
        return '加载中...';
      }
      if (this.remainingPurchaseAmount <= 0) {
        return '已售罄';
      }
      if (this.quantity < 1) {
        return '请输入数量';
      }
      if (!this.hasEnoughUsdtBalance) {
        return 'USDT余额不足';
      }
      if (!this.hasEnoughUsdtAllowance) {
        return '授权USDT';
      }
      return '立即认购';
    },
    isPurchaseButtonDisabled() {
      return !this.walletState.isConnected || this.purchaseCardLoading || this.purchasePaymentStateLoading || this.purchaseSubmitting || this.remainingPurchaseAmount <= 0 || this.quantity < 1 || !this.hasEnoughUsdtBalance;
    }
  },
  methods: {
    setPurchaseButtonStatus(text, duration = 0) {
      this.purchaseButtonStatus = text;
      if (this.purchaseStatusTimer) {
        clearTimeout(this.purchaseStatusTimer);
        this.purchaseStatusTimer = null;
      }
      if (duration > 0) {
        this.purchaseStatusTimer = setTimeout(() => {
          this.purchaseButtonStatus = '';
          this.purchaseStatusTimer = null;
        }, duration);
      }
    },
    clearPurchaseButtonStatus() {
      if (this.purchaseStatusTimer) {
        clearTimeout(this.purchaseStatusTimer);
        this.purchaseStatusTimer = null;
      }
      this.purchaseButtonStatus = '';
    },
    logPurchaseDataOnce(cacheKey, title, payload) {
      const snapshot = JSON.stringify(payload);
      if (this.purchaseLogCache[cacheKey] === snapshot) {
        return;
      }
      this.purchaseLogCache[cacheKey] = snapshot;
      console.log(title, payload);
    },
    formatUsdtAmount(value) {
      return ethers.formatUnits(value, this.purchaseData.usdtDecimals).replace(/\.?0+$/, '') || '0';
    },
    resetPurchasePaymentState() {
      this.purchasePaymentState = {
        balanceRaw: '0',
        allowanceRaw: '0'
      };
      this.purchasePaymentStateLoading = false;
      this.purchaseLogCache.payment = '';
    },
    getProvider() {
      if (this.walletState.provider) {
        return this.walletState.provider;
      }
      if (window.ethereum) {
        return new ethers.BrowserProvider(window.ethereum);
      }
      return null;
    },
    getNodeContract(withSigner = false) {
      const address = getContractAddress('node');
      if (!address) {
        return null;
      }
      if (withSigner && this.walletState.signer) {
        return new ethers.Contract(address, nodeAbi, this.walletState.signer);
      }
      const provider = this.getProvider();
      if (!provider) {
        return null;
      }
      return new ethers.Contract(address, nodeAbi, provider);
    },
    getUsdtContract(withSigner = false) {
      const address = getContractAddress('USDT');
      if (!address) {
        return null;
      }
      if (withSigner && this.walletState.signer) {
        return new ethers.Contract(address, usdtAbi, this.walletState.signer);
      }
      const provider = this.getProvider();
      if (!provider) {
        return null;
      }
      return new ethers.Contract(address, usdtAbi, provider);
    },
    resetPurchaseData() {
      this.nftTotalBalance = 0;
      this.nftActivatedCount = 0;
      this.purchaseData = {
        purchaseLevel: 0,
        phaseName: '',
        totalPurchased: 0,
        maxPurchaseAmount: 0,
        purchasePrice: '0',
        purchasePriceRaw: '0',
        usdtDecimals: 18,
        baseURI: ''
      };
      this.purchaseCardLoading = false;
      this.purchaseSubmitting = false;
      this.purchaseImageErrored = false;
      this.clearPurchaseButtonStatus();
      this.resetPurchasePaymentState();
      this.purchaseLogCache = {
        raw: '',
        formatted: '',
        payment: ''
      };
      this.quantity = 1;
    },
    normalizeQuantity() {
      const parsed = Number(this.quantity);
      if (!Number.isFinite(parsed) || parsed < 1) {
        this.quantity = 1;
        return;
      }
      const normalized = Math.floor(parsed);
      if (this.remainingPurchaseAmount > 0 && normalized > this.remainingPurchaseAmount) {
        this.quantity = this.remainingPurchaseAmount;
        return;
      }
      this.quantity = normalized;
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity -= 1;
      }
    },
    increaseQuantity() {
      if (this.remainingPurchaseAmount > 0 && this.quantity >= this.remainingPurchaseAmount) {
        return;
      }
      this.quantity += 1;
    },
    onSubscriptionImageError() {
      this.purchaseImageErrored = true;
    },
    async refreshPurchasePaymentState() {
      if (!this.walletState.isConnected || !this.walletState.address) {
        this.resetPurchasePaymentState();
        return;
      }

      const nodeAddress = getContractAddress('node');
      const usdtContract = this.getUsdtContract();
      if (!nodeAddress || !usdtContract) {
        this.resetPurchasePaymentState();
        return;
      }

      this.purchasePaymentStateLoading = true;

      try {
        const [balanceRaw, allowanceRaw] = await Promise.all([
          usdtContract.balanceOf(this.walletState.address),
          usdtContract.allowance(this.walletState.address, nodeAddress)
        ]);

        this.purchasePaymentState = {
          balanceRaw: balanceRaw.toString(),
          allowanceRaw: allowanceRaw.toString()
        };

        this.logPurchaseDataOnce('payment', 'NFT 认购支付检查', {
          购买数量: this.quantity,
          单价: `${this.purchaseData.purchasePrice} USDT`,
          总价: `${this.totalPurchasePrice} USDT`,
          钱包USDT余额: this.formatUsdtAmount(balanceRaw),
          当前授权额度: this.formatUsdtAmount(allowanceRaw)
        });
      } catch (error) {
        console.error('获取 NFT 支付状态失败:', error);
        this.resetPurchasePaymentState();
      } finally {
        this.purchasePaymentStateLoading = false;
      }
    },
    async fetchPurchaseData() {
      if (!this.walletState.isConnected) {
        this.resetPurchaseData();
        return;
      }

      const nodeContract = this.getNodeContract();
      const usdtContract = this.getUsdtContract();
      if (!nodeContract || !usdtContract) {
        this.resetPurchaseData();
        return;
      }

      const requestId = ++this.purchaseDataRequestId;
      this.purchaseCardLoading = true;
      this.purchaseImageErrored = false;

      try {
        const [
          purchaseLevel,
          totalPurchased,
          maxPurchaseAmount,
          purchasePrice,
          names,
          baseURI,
          usdtDecimals,
          userNftBalance,
          activatedNftsResult
        ] = await Promise.all([
          nodeContract.purchaseLevel(),
          nodeContract.totalPurchased(),
          nodeContract.maxPurchaseAmount(),
          nodeContract.purchasePrice(),
          nodeContract.getInfos('name'),
          nodeContract.baseURI(),
          usdtContract.decimals(),
          nodeContract.balanceOf(this.walletState.address),
          nodeContract.levelsOfOwnerBySize(this.walletState.address, 0, 100, 2)
        ]);

        const phaseNames = names
          .flatMap(name => String(name).split(','))
          .map(name => name.trim())
          .filter(Boolean);

        this.logPurchaseDataOnce('raw', 'NFT 认购原始数据', {
          当前售卖期数: purchaseLevel.toString(),
          已售数量: totalPurchased.toString(),
          本期总量: maxPurchaseAmount.toString(),
          单价原始值: purchasePrice.toString(),
          期数名称列表: names,
          拆分后的期数名称列表: phaseNames,
          图片基础地址: baseURI,
          USDT精度: usdtDecimals.toString()
        });

        if (requestId !== this.purchaseDataRequestId || !this.walletState.isConnected) {
          return;
        }

        const currentLevel = Number(purchaseLevel);
        const phaseName = currentLevel > 0 ? (phaseNames[currentLevel - 1] || '') : '';
        const formattedPurchasePrice = ethers.formatUnits(purchasePrice, Number(usdtDecimals)).replace(/\.?0+$/, '');

        this.purchaseData = {
          purchaseLevel: currentLevel,
          phaseName,
          totalPurchased: Number(totalPurchased),
          maxPurchaseAmount: Number(maxPurchaseAmount),
          purchasePrice: formattedPurchasePrice,
          purchasePriceRaw: purchasePrice.toString(),
          usdtDecimals: Number(usdtDecimals),
          baseURI
        };
        this.nftTotalBalance = Number(userNftBalance);
        this.nftActivatedCount = Array.isArray(activatedNftsResult?.[0]) ? activatedNftsResult[0].length : 0;

        this.logPurchaseDataOnce('formatted', 'NFT 认购格式化后数据', {
          当前售卖期数: this.purchaseData.purchaseLevel,
          期数名称: this.purchaseData.phaseName,
          已售数量: this.purchaseData.totalPurchased,
          本期总量: this.purchaseData.maxPurchaseAmount,
          单价: `${formattedPurchasePrice} USDT`,
          进度百分比: `${this.progressPercent}%`,
          图片地址: this.purchaseImageUrl,
          持有NFT总数: this.nftTotalBalance,
          已激活数量: this.nftActivatedCount,
          未激活数量: this.unactivatedCount
        });

        this.normalizeQuantity();
        await this.refreshPurchasePaymentState();
      } catch (error) {
        console.error('获取 NFT 认购数据失败:', error);
        if (requestId === this.purchaseDataRequestId) {
          this.nftTotalBalance = 0;
          this.nftActivatedCount = 0;
          this.resetPurchaseData();
        }
      } finally {
        if (requestId === this.purchaseDataRequestId) {
          this.purchaseCardLoading = false;
        }
      }
    },
    async subscribe() {
      if (!this.walletState.isConnected) {
        this.setPurchaseButtonStatus('请先连接钱包', 2000);
        return;
      }
      this.normalizeQuantity();
      if (this.quantity < 1) {
        this.setPurchaseButtonStatus('数量错误', 2000);
        return;
      }
      if (this.remainingPurchaseAmount <= 0) {
        this.setPurchaseButtonStatus('已售罄', 2000);
        return;
      }
      if (this.quantity > this.remainingPurchaseAmount) {
        this.quantity = this.remainingPurchaseAmount;
      }

      const nodeContract = this.getNodeContract(true);
      const usdtContract = this.getUsdtContract(true);
      const nodeAddress = getContractAddress('node');
      if (!nodeAddress || !nodeContract || !usdtContract || !this.walletState.address) {
        this.setPurchaseButtonStatus('合约未就绪', 2500);
        return;
      }

      const totalCostRaw = this.totalPurchasePriceRaw;

      this.purchaseSubmitting = true;

      try {
        this.setPurchaseButtonStatus(this.hasEnoughUsdtAllowance ? '购买中...' : '授权中...');
        let balanceRaw = BigInt(this.purchasePaymentState.balanceRaw || '0');
        let allowanceRaw = BigInt(this.purchasePaymentState.allowanceRaw || '0');

        if (balanceRaw < totalCostRaw) {
          this.setPurchaseButtonStatus('USDT余额不足', 2500);
          return;
        }

        if (allowanceRaw < totalCostRaw) {
          const approveTx = await usdtContract.approve(nodeAddress, ethers.MaxUint256);
          this.setPurchaseButtonStatus('等待授权确认...');
          await approveTx.wait();
          await this.refreshPurchasePaymentState();
          this.clearPurchaseButtonStatus();
          showToast('授权成功');
          return;
        }

        this.setPurchaseButtonStatus('购买中...');
        const buyTx = await nodeContract.buyNFTs(this.quantity);
        this.setPurchaseButtonStatus('等待购买确认...');
        await buyTx.wait();

        this.setPurchaseButtonStatus('认购成功', 2500);
        showToast(`成功认购 ${this.quantity} 个 NFT`);
        this.quantity = 1;
        await this.fetchPurchaseData();
        await this.refreshPurchasePaymentState();
      } catch (error) {
        console.error('NFT 认购失败:', error);
        if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
          this.clearPurchaseButtonStatus();
          await this.refreshPurchasePaymentState();
          return;
        }
        this.setPurchaseButtonStatus('认购失败', 2500);
        await this.refreshPurchasePaymentState();
      } finally {
        this.purchaseSubmitting = false;
      }
    },
    activateNft(nft) {
      nft.activated = true;
      nft.yield = 0; // 刚激活时收益为0
      showToast(`NFT ${nft.name} 已激活！`);
    },
    transferNft(nft) {
      showToast(`准备转让 ${nft.name}，后端接口开发中...`);
    },
    claimYield(nft) {
      if (nft.yield <= 0) {
        showToast('当前没有可领取的收益');
        return;
      }
      showToast(`成功领取 ${nft.yield.toFixed(2)} AFI 收益！`);
      nft.yield = 0; // 领取后清零
    },
    loadMore() {
      this.displayCount += 10;
    }
  },
  watch: {
    'walletState.isConnected'(connected) {
      if (connected) {
        this.fetchPurchaseData();
        return;
      }
      this.purchaseDataRequestId += 1;
      this.resetPurchaseData();
    },
    'walletState.address'(newAddress, oldAddress) {
      if (this.walletState.isConnected && newAddress && newAddress !== oldAddress) {
        this.fetchPurchaseData();
      }
    },
    'walletState.chainId'(newChainId, oldChainId) {
      if (this.walletState.isConnected && newChainId && newChainId !== oldChainId) {
        this.fetchPurchaseData();
      }
    },
    quantity() {
      this.normalizeQuantity();
      if (this.walletState.isConnected) {
        this.refreshPurchasePaymentState();
      }
    }
  },
  mounted() {
    if (this.walletState.isConnected) {
      this.fetchPurchaseData();
    }
  },
  beforeUnmount() {
    if (this.purchaseStatusTimer) {
      clearTimeout(this.purchaseStatusTimer);
    }
  }
}
</script>

<style scoped>
/* 隐藏输入框的上下箭头 */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
input[type=number] {
  appearance: textfield;
  -moz-appearance: textfield;
}

/* 现代科技风中文字体 */
.tech-font {
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: 0.05em;
}
</style>
