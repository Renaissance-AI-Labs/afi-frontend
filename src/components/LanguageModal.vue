<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content bg-[#1a153a] rounded-xl p-5 panel-border relative overflow-hidden text-white w-[90%] max-w-[320px]">
      <div class="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
      
      <div class="modal-header flex justify-between items-center mb-6 relative z-10">
        <h3 class="tech-font font-bold text-lg tracking-wider text-app-purple drop-shadow-md">
          {{ t('language.title') }}
        </h3>
        <button @click="close" class="text-gray-400 hover:text-white transition">
          <i class="ph ph-x text-xl"></i>
        </button>
      </div>

      <div class="modal-body relative z-10">
        <div class="flex flex-col gap-3">
          <button 
            v-for="language in languages" 
            :key="language.code"
            class="w-full flex items-center justify-between p-4 bg-[#221b44] rounded-lg border transition-all group"
            :class="currentLang === language.code ? 'border-app-purple bg-[#2a2255] shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'border-purple-500/30 hover:border-app-purple/60 hover:bg-[#2a2255]'"
            @click="selectLanguage(language.code)"
          >
            <span class="tech-font font-bold text-sm tracking-wide transition-colors" :class="currentLang === language.code ? 'text-app-purple' : 'text-gray-300 group-hover:text-white'">
              {{ language.name }}
            </span>
            <i v-if="currentLang === language.code" class="ph-fill ph-check-circle text-app-purple text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { availableLanguages, setLanguage, currentLanguage, t } from '@/i18n';

export default {
  name: 'LanguageModal',
  setup(props, { emit }) {
    const close = () => {
      emit('close');
    };

    const selectLanguage = (languageCode) => {
      setLanguage(languageCode);
      close();
    };

    return {
      languages: availableLanguages,
      currentLang: computed(() => currentLanguage.value),
      close,
      selectLanguage,
      t,
    };
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.panel-border {
    border: 1px solid rgba(168, 85, 247, 0.4);
    box-shadow: inset 0 0 15px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.8);
}

.tech-font {
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: 0.05em;
}
</style>
