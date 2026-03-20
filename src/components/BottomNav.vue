<template>
  <nav class="absolute bottom-0 w-full bg-[#16132b]/95 backdrop-blur-md border-t border-app-pink/20 px-12 py-2 flex justify-around items-center z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] h-14">
      <router-link to="/" class="flex flex-col items-center gap-1 cursor-pointer transition" :class="[ $route.path === '/' ? 'text-app-pink drop-shadow-[0_0_5px_rgba(255,77,141,0.5)]' : 'text-gray-500 hover:text-white' ]">
          <i class="ph-fill ph-house text-[24px]"></i>
          <span class="text-[9px] font-bold">Home</span>
      </router-link>
      <router-link to="/nft" class="flex flex-col items-center gap-1 cursor-pointer transition" :class="[ $route.path === '/nft' ? 'text-app-pink drop-shadow-[0_0_5px_rgba(255,77,141,0.5)]' : 'text-gray-500 hover:text-white' ]">
          <i class="ph ph-robot text-[24px]"></i>
          <span class="text-[9px] font-medium">NFT</span>
      </router-link>
      <router-link to="/nft-backup" class="flex flex-col items-center gap-1 cursor-pointer transition" :class="[ $route.path === '/nft-backup' ? 'text-app-pink drop-shadow-[0_0_5px_rgba(255,77,141,0.5)]' : 'text-gray-500 hover:text-white' ]">
          <i class="ph ph-copy text-[24px]"></i>
          <span class="text-[9px] font-medium">NFT Backup</span>
      </router-link>
  </nav>
</template>

<script>
export default {
  name: 'BottomNav'
}
</script>

<style scoped>
</style>
