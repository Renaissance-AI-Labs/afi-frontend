<template>
  <div class="nft-view relative pb-10 min-h-[calc(100vh-140px)]">
    <div class="bg-gradient-to-b from-[#1a153a] to-[#0b0914]">
      <Header @open-get-started-modal="$emit('open-get-started-modal')" @open-language-modal="$emit('open-language-modal')" />
    </div>

    <!-- 主要内容区域 -->
    <main class="px-4 pt-6 relative z-20">
        
        <!-- AI Agent Pools 模块 -->
        <section class="mb-5">
            <div class="bg-app-card/80 backdrop-blur-sm rounded-t-xl border-t border-x border-app-pink/30 px-3 py-1.5 inline-block mb-[-1px] relative z-10">
                <h2 class="text-[12px] font-display text-white tracking-wider">AI AGENT POOLS</h2>
            </div>
            
            <!-- 横向滚动卡片容器 -->
            <div class="flex gap-3 overflow-x-auto hide-scrollbar pb-3 pt-2 bg-app-card/40 rounded-b-xl rounded-tr-xl border border-app-pink/30 p-2">
                
                <!-- 卡片 1 (粉色) -->
                <div class="min-w-[150px] bg-[#1a153a] rounded-xl p-3 glow-border-pink flex flex-col justify-between shrink-0 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-16 h-16 bg-pink-500/10 rounded-full blur-xl"></div>
                    <div class="relative z-10">
                        <div class="text-[9px] text-pink-300 font-bold leading-tight uppercase tracking-wider">Optimized Yield</div>
                        <div class="text-lg font-display text-white mb-2 tracking-wide">GAMMA</div>
                        <div class="w-full h-16 rounded border border-pink-500/50 flex items-center justify-center mb-2 overflow-hidden relative">
                            <div class="absolute inset-0 bg-gradient-to-br from-pink-900/50 to-purple-900/50"></div>
                            <i class="ph-duotone ph-planet text-3xl text-pink-300 relative z-10"></i>
                        </div>
                        <div class="text-[13px] font-bold text-white mb-1">APY: 34.8%</div>
                        <p class="text-[8px] text-gray-400 leading-tight mb-3 h-[24px]">
                            Description of balance agents, and yield dynamic growth.
                        </p>
                    </div>
                    <button class="action-btn w-full bg-app-pink text-white font-display text-[11px] py-1.5 rounded border border-pink-300 hover:bg-pink-600 relative z-10 tracking-widest">
                        [DEPLOY]
                    </button>
                </div>

                <!-- 卡片 2 (蓝色) -->
                <div class="min-w-[150px] bg-[#1a153a] rounded-xl p-3 glow-border-blue flex flex-col justify-between shrink-0 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full blur-xl"></div>
                    <div class="relative z-10">
                        <div class="text-[9px] text-blue-300 font-bold leading-tight uppercase tracking-wider">Risk Mitigator</div>
                        <div class="text-lg font-display text-white mb-2 tracking-wide">ZETA</div>
                        <div class="w-full h-16 rounded border border-blue-500/50 flex items-center justify-center mb-2 overflow-hidden relative">
                            <div class="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-cyan-900/50"></div>
                            <i class="ph-duotone ph-robot text-3xl text-blue-300 relative z-10"></i>
                        </div>
                        <div class="text-[13px] font-bold text-white mb-1">APY: 22.1%</div>
                        <p class="text-[8px] text-gray-400 leading-tight mb-3 h-[24px]">
                            Calm approach to change markets, and maintain investments.
                        </p>
                    </div>
                    <button class="action-btn w-full bg-app-blue text-[#0b0914] font-display text-[11px] py-1.5 rounded border border-blue-200 hover:bg-blue-400 relative z-10 tracking-widest">
                        [ACTIVATE]
                    </button>
                </div>

                <!-- 卡片 3 (紫色) -->
                <div class="min-w-[150px] bg-[#1a153a] rounded-xl p-3 glow-border-purple flex flex-col justify-between shrink-0 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full blur-xl"></div>
                    <div class="relative z-10">
                        <div class="text-[9px] text-purple-300 font-bold leading-tight uppercase tracking-wider">Arbitrage</div>
                        <div class="text-lg font-display text-white mb-2 tracking-wide">ALPHA</div>
                        <div class="w-full h-16 rounded border border-purple-500/50 flex items-center justify-center mb-2 overflow-hidden relative">
                            <div class="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-indigo-900/50"></div>
                            <i class="ph-duotone ph-rocket text-3xl text-purple-300 relative z-10"></i>
                        </div>
                        <div class="text-[13px] font-bold text-white mb-1">APY: 28.5%</div>
                        <p class="text-[8px] text-gray-400 leading-tight mb-3 h-[24px]">
                            Description of arbitrage merit and multi-chain reallocations.
                        </p>
                    </div>
                    <button class="action-btn w-full bg-app-blue text-[#0b0914] font-display text-[11px] py-1.5 rounded border border-blue-200 hover:bg-blue-400 relative z-10 tracking-widest">
                        [EXPLORE]
                    </button>
                </div>

            </div>
        </section>

        <!-- 底部网格数据区 -->
        <div class="grid grid-cols-2 gap-3 mb-4">
            
            <!-- Your Portfolio -->
            <div class="bg-[#1a153a] rounded-xl p-3 panel-border relative overflow-hidden">
                <div class="absolute -top-6 -right-6 w-16 h-16 bg-pink-500/20 rounded-full blur-xl"></div>
                <h3 class="text-[11px] font-display tracking-wider text-white mb-2">YOUR PORTFOLIO</h3>
                <div class="text-[9px] text-gray-400 mb-0.5">Total Value:</div>
                <div class="text-xl font-bold text-white mb-4 tracking-tight drop-shadow-md">$54,321.10</div>
                
                <div class="flex justify-between items-center text-[10px] mb-1.5">
                    <span class="text-gray-400">Agents Running:</span>
                    <span class="font-bold text-white">12</span>
                </div>
                <div class="flex justify-between items-center text-[10px]">
                    <span class="text-gray-400">24H Gain:</span>
                    <span class="font-bold text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">+$198.76</span>
                </div>
            </div>

            <!-- Market Explorer -->
            <div class="bg-[#1a153a] rounded-xl p-3 panel-border flex flex-col relative">
                <div class="flex justify-between items-center mb-3">
                    <h3 class="text-[11px] font-display tracking-wider text-white">MARKET EXPLORER</h3>
                    <div class="flex gap-1">
                        <i class="ph ph-caret-left text-gray-400 cursor-pointer hover:text-white"></i>
                        <i class="ph ph-caret-right text-white cursor-pointer hover:text-app-pink"></i>
                    </div>
                </div>
                
                <div class="flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-2.5 relative pr-2">
                    <!-- 列表项 1 -->
                    <div class="flex gap-2 items-center">
                        <div class="w-7 h-7 rounded border border-purple-500/50 bg-gradient-to-br from-purple-900 to-blue-900 shrink-0 flex items-center justify-center shadow-[0_0_8px_rgba(168,85,247,0.4)]">
                            <i class="ph-fill ph-triangle text-purple-300 text-xs"></i>
                        </div>
                        <div class="flex-1">
                            <div class="flex justify-between items-center">
                                <div class="text-[10px] font-bold text-white">Alpha Bot</div>
                                <div class="text-[8px] text-yellow-400 drop-shadow-[0_0_2px_rgba(250,204,21,0.8)]">★★★★☆</div>
                            </div>
                            <div class="text-[7px] text-gray-400 mt-0.5 truncate w-[85px]">
                                Agent Bot is the descrip...
                            </div>
                        </div>
                    </div>
                    <!-- 列表项 2 -->
                    <div class="flex gap-2 items-center">
                        <div class="w-7 h-7 rounded border border-green-500/50 bg-gradient-to-br from-green-900 to-teal-900 shrink-0 flex items-center justify-center shadow-[0_0_8px_rgba(34,197,94,0.4)]">
                            <i class="ph-fill ph-circle text-green-300 text-xs"></i>
                        </div>
                        <div class="flex-1">
                            <div class="flex justify-between items-center">
                                <div class="text-[10px] font-bold text-white">Yield Bot</div>
                                <div class="text-[8px] text-yellow-400 drop-shadow-[0_0_2px_rgba(250,204,21,0.8)]">★★★★★</div>
                            </div>
                            <div class="text-[7px] text-gray-400 mt-0.5 truncate w-[85px]">
                                Agent toe a estimate fro...
                            </div>
                        </div>
                    </div>
                    <!-- 列表项 3 -->
                    <div class="flex gap-2 items-center opacity-60">
                        <div class="w-7 h-7 rounded border border-red-500/50 bg-gradient-to-br from-red-900 to-orange-900 shrink-0 flex items-center justify-center">
                            <i class="ph-fill ph-square text-red-300 text-xs"></i>
                        </div>
                        <div class="flex-1">
                            <div class="flex justify-between items-center">
                                <div class="text-[10px] font-bold text-white">Predictor</div>
                                <div class="text-[8px] text-yellow-400">★★★☆☆</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 模拟自定义发光滚动条 -->
                    <div class="absolute right-[-4px] top-1 w-1.5 h-12 bg-gradient-to-b from-app-pink via-purple-500 to-transparent rounded-full shadow-[0_0_8px_rgba(255,77,141,0.8)]"></div>
                </div>
            </div>

        </div>
    </main>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';

export default {
  name: 'NftView',
  components: {
    Header
  }
}
</script>

<style scoped>
</style>
