<template>
  <nav class="bottom-nav fixed bottom-0 inset-x-0 w-full bg-[#16132b]/95 backdrop-blur-md border-t border-app-pink/20 grid grid-cols-3 items-center z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
      <router-link to="/" class="w-full h-full flex flex-col items-center justify-center gap-1 cursor-pointer transition text-center" :class="[ $route.path === '/' ? 'text-app-pink drop-shadow-[0_0_5px_rgba(255,77,141,0.5)]' : 'text-gray-500 hover:text-white' ]">
          <i class="ph-fill ph-house text-[24px]"></i>
          <span class="text-[9px] font-bold">{{ t('bottomNav.home') }}</span>
      </router-link>
      <router-link to="/nft" class="w-full h-full flex flex-col items-center justify-center gap-1 cursor-pointer transition text-center" :class="[ $route.path === '/nft' ? 'text-app-pink drop-shadow-[0_0_5px_rgba(255,77,141,0.5)]' : 'text-gray-500 hover:text-white' ]">
          <i class="ph ph-robot text-[24px]"></i>
          <span class="text-[9px] font-medium">{{ t('bottomNav.nft') }}</span>
      </router-link>
      <router-link to="/friends" class="w-full h-full flex flex-col items-center justify-center gap-1 cursor-pointer transition text-center" :class="[ $route.path === '/friends' ? 'text-app-pink drop-shadow-[0_0_5px_rgba(255,77,141,0.5)]' : 'text-gray-500 hover:text-white' ]">
          <i class="ph ph-users text-[24px]"></i>
          <span class="text-[9px] font-medium">{{ t('bottomNav.friends') }}</span>
      </router-link>
  </nav>
</template>

<script>
import { t } from '@/i18n';

export default {
  name: 'BottomNav',
  setup() {
    return {
      t,
    };
  },
}
</script>

<style scoped>
.bottom-nav {
  height: var(--bottom-nav-height);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  box-sizing: content-box;
}
</style>
