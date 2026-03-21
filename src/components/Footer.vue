<template>
    <footer class="py-4 mt-6 border-t border-app-pink/20 relative z-10 bg-transparent flex flex-col items-center justify-center h-20">
        <div class="flex flex-col items-center justify-center gap-3">
            <div class="flex items-center gap-4">
                <div class="font-display text-lg tracking-widest text-white shadow-black drop-shadow-md">AGENT.FI</div>
                
                <div class="flex items-center gap-3">
                    <a href="https://x.com/Agentfiafi0" target="_blank" class="w-8 h-8 rounded-full bg-[#221b44] border border-purple-500/30 flex items-center justify-center text-gray-400 hover:text-app-pink hover:border-app-pink/60 transition-all shadow-lg">
                        <i class="ph ph-twitter-logo text-lg"></i>
                    </a>
                    <a href="https://t.me/AgentFi_AFI" target="_blank" class="w-8 h-8 rounded-full bg-[#221b44] border border-purple-500/30 flex items-center justify-center text-gray-400 hover:text-app-pink hover:border-app-pink/60 transition-all shadow-lg">
                        <i class="ph ph-telegram-logo text-lg"></i>
                    </a>
                </div>
            </div>

            <div class="flex items-center gap-2 text-[9px]">
                <p class="text-gray-500 tracking-wide">{{ t('footer.copyright') }}</p>
                <p class="text-gray-600 tracking-[0.2em] uppercase">{{ versionLabel }}</p>
            </div>
        </div>
    </footer>
</template>

<script>
import { computed } from 'vue';
import { t } from '@/i18n';
import { APP_ENV } from '@/services/environment';

export default {
    name: 'Footer',
    setup() {
        const versionLabel = computed(() => (APP_ENV === 'PROD' ? 'M-1.0.0' : 'T-1.0.0'));

        return {
            t,
            versionLabel
        };
    }
}
</script>

<style scoped>
</style>
