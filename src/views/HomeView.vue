<template>
  <div class="home-view flex flex-col min-h-[calc(100vh-140px)]">
    <!-- 头部区域 (背景图) -->
    <div class="hero-bg flex-1 w-full flex flex-col relative pb-10">
        <Header @open-get-started-modal="$emit('open-get-started-modal')" @open-language-modal="$emit('open-language-modal')" />

        <!-- 大标题 -->
        <div class="flex-1 flex flex-col items-center justify-center z-10 px-4 text-center">
            <h1 class="title-moebius text-5xl mb-2">AGENT.FI</h1>
            <p class="subtitle-moebius font-bold text-[11px] tracking-widest">AUTOMATE DEFI WITH AI AGENTS</p>
        </div>

        <!-- Fade hero image into app container background -->
        <div
            class="hero-bottom-fade pointer-events-none absolute bottom-0 left-0 z-[1] w-full"
            aria-hidden="true"
        />
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';

export default {
  name: 'HomeView',
  components: {
    Header
  }
}
</script>

<style scoped>
/* Match .app-container background (#1a153a); long ease so the image meets footer area cleanly */
.hero-bottom-fade {
    height: min(42vh, 280px);
    background: linear-gradient(
        to top,
        #1a153a 0%,
        rgba(26, 21, 58, 0.92) 12%,
        rgba(26, 21, 58, 0.65) 38%,
        rgba(26, 21, 58, 0.28) 68%,
        transparent 100%
    );
}
</style>
