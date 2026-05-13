<template>
  <div class="home-view relative min-h-[calc(100vh-140px)] flex flex-col pb-20">
    <!-- Fixed Background Image and Glows -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <img src="/asset/images/logo/bg.png" alt="background" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/50 rounded-full blur-[80px] mix-blend-screen animate-glow-float-slow"></div>
      <div class="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] bg-purple-500/50 rounded-full blur-[100px] mix-blend-screen animate-glow-float-delayed"></div>
    </div>

    <!-- Header -->
    <div class="relative z-20">
      <Header @open-get-started-modal="$emit('open-get-started-modal')" @open-language-modal="$emit('open-language-modal')" />
    </div>

    <!-- Hero Section -->
    <section class="w-full flex flex-col relative z-20 pt-10 items-center justify-center">
        <!-- 大标题 -->
        <div class="flex flex-col items-center justify-center px-4 text-center">
            <h1 class="title-moebius text-5xl mb-2">AGENT.FI</h1>
            <p class="subtitle-moebius font-bold text-[11px] tracking-widest">{{ t('home.heroSubtitle') }}</p>
        </div>
    </section>

    <!-- Content Sections -->
    <div class="home-content-wrapper relative z-20 w-full max-w-4xl mx-auto px-4 flex flex-col gap-4 mt-[40px]">
      <GlobalDashboard />
      <StakingSection />
      <StockDividendSection />
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import GlobalDashboard from '@/components/GlobalDashboard.vue';
import StakingSection from '@/components/StakingSection.vue';
import StockDividendSection from '@/components/StockDividendSection.vue';
import { t } from '@/i18n';

export default {
  name: 'HomeView',
  components: {
    Header,
    GlobalDashboard,
    StakingSection,
    StockDividendSection
  },
  setup() {
    return {
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
  animation: fadeIn 0.5s ease-out backwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>