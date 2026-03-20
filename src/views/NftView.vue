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
                <!-- 卡片 1 (第一期) - 左右布局，增加高度 -->
                <div class="w-full bg-[#1a153a] rounded-xl p-4 glow-border-pink flex relative overflow-hidden gap-4 min-h-[160px]">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl"></div>
                    
                    <!-- 左侧：图片和标题 -->
                    <div class="w-[140px] shrink-0 flex flex-col relative z-10">
                        <div class="flex justify-between items-center mb-2">
                            <div class="text-[11px] text-pink-300 font-bold leading-tight uppercase tracking-wider tech-font">第一期</div>
                            <div class="text-[14px] font-display text-white tracking-wide">GAMMA</div>
                        </div>
                        <!-- 正方形图片 -->
                        <div class="w-full aspect-square rounded-lg border border-pink-500/50 flex items-center justify-center overflow-hidden relative bg-black/40 p-1.5 shadow-inner">
                            <img src="/asset/images/logo/NFT.png" alt="NFT" class="w-full h-full object-contain relative z-10 drop-shadow-[0_0_10px_rgba(255,77,141,0.6)]" />
                        </div>
                    </div>

                    <!-- 右侧：信息和操作 -->
                    <div class="flex-1 flex flex-col justify-between relative z-10 py-1">
                        <div>
                            <!-- 进度条和售卖数量 -->
                            <div class="mb-3">
                                <div class="flex justify-between text-[11px] font-bold text-white mb-1.5">
                                    <span class="tech-font">已售: 150/500</span>
                                    <span class="text-pink-300">30%</span>
                                </div>
                                <div class="w-full bg-gray-700 rounded-full h-2">
                                    <div class="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full shadow-[0_0_5px_rgba(255,77,141,0.5)]" style="width: 30%"></div>
                                </div>
                            </div>
                            
                            <!-- 单价 -->
                            <div class="flex justify-between items-center mb-3">
                                <span class="text-[12px] text-gray-300 tech-font">单价:</span>
                                <span class="text-white font-bold text-[16px]">100 USDT</span>
                            </div>
                        </div>
                        
                        <div>
                            <!-- 数量选择器 -->
                            <div class="flex items-center w-full bg-black/30 rounded-lg border border-pink-500/30 overflow-hidden mb-3 h-9">
                                <button @click="quantity > 1 ? quantity-- : null" class="w-10 h-full bg-pink-500/20 text-white flex items-center justify-center hover:bg-pink-500/40 transition text-lg font-bold">-</button>
                                <input v-model.number="quantity" type="number" class="flex-1 w-full bg-transparent text-center text-white text-[15px] font-bold h-full outline-none tech-font p-0" min="1">
                                <button @click="quantity++" class="w-10 h-full bg-pink-500/20 text-white flex items-center justify-center hover:bg-pink-500/40 transition text-lg font-bold">+</button>
                            </div>

                            <!-- 认购按钮 -->
                            <button @click="subscribe" class="w-full bg-app-pink text-white font-display text-[14px] h-10 rounded-lg border border-pink-300 hover:bg-pink-600 relative z-10 tracking-widest transition tech-font font-bold shadow-[0_0_12px_rgba(255,77,141,0.4)] active:scale-95">
                                立即认购
                            </button>
                        </div>
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
                        <span class="text-[18px] font-bold text-white tracking-tight leading-tight">{{ myNfts.length }}</span>
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
                            <img src="/asset/images/logo/NFT.png" class="max-w-full max-h-full object-contain" />
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

export default {
  name: 'NftView',
  components: {
    Header
  },
  data() {
    return {
      quantity: 1,
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
      return this.myNfts.filter(nft => nft.activated).length;
    },
    unactivatedCount() {
      return this.myNfts.filter(nft => !nft.activated).length;
    },
    displayedNfts() {
      return this.myNfts.slice(0, this.displayCount);
    }
  },
  methods: {
    subscribe() {
      if (this.quantity < 1) return;
      // 模拟认购成功，添加新的NFT到列表顶部
      const newId = 100 + this.myNfts.length + 1;
      for (let i = 0; i < this.quantity; i++) {
        this.myNfts.unshift({
          id: newId + i,
          name: `GAMMA #${newId + i}`,
          activated: false,
          yield: 0
        });
      }
      showToast(`成功认购 ${this.quantity} 个 NFT！`);
      this.quantity = 1;
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
  -moz-appearance: textfield;
}

/* 现代科技风中文字体 */
.tech-font {
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: 0.05em;
}
</style>
