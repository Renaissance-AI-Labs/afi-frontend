<template>
  <div class="achievements-view relative pb-20 min-h-[calc(100vh-140px)]">
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/80 rounded-full blur-[80px] mix-blend-screen animate-glow-float-slow"></div>
      <div class="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] bg-purple-500/80 rounded-full blur-[100px] mix-blend-screen animate-glow-float-delayed"></div>
    </div>

    <div class="fixed inset-0 bg-gradient-to-b from-[#1a153a]/20 to-[#0b0914]/40 z-10 backdrop-blur-sm pointer-events-none"></div>

    <div class="relative z-20">
      <Header @open-get-started-modal="$emit('open-get-started-modal')" @open-language-modal="$emit('open-language-modal')" />
    </div>

    <main class="px-4 pt-6 relative z-20 max-w-2xl mx-auto flex flex-col gap-4">
      <h2 class="text-2xl font-display text-white mb-1 tech-font tracking-widest text-center">{{ t('achievements.title') }}</h2>
      <p class="text-sm text-gray-400 text-center mb-2 tech-font">{{ t('achievements.intro') }}</p>
      <LpPoolGlorySection />
      <StockDividendSection expanded />
    </main>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import LpPoolGlorySection from '@/components/LpPoolGlorySection.vue';
import StockDividendSection from '@/components/StockDividendSection.vue';
import { t } from '@/i18n';

export default {
  name: 'AchievementsView',
  components: {
    Header,
    LpPoolGlorySection,
    StockDividendSection
  },
  setup() {
    return { t };
  }
};
</script>

<style scoped>
.tech-font {
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: 0.05em;
}
</style>
