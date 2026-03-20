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

        <!-- 底部遮罩平滑过渡到深蓝紫背景 -->
        <div class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-app-bg via-app-bg/80 to-transparent"></div>
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
</style>
