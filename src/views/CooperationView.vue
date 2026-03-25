<template>
  <div class="cooperation-view relative pb-20 min-h-[calc(100vh-140px)]">
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/80 rounded-full blur-[80px] mix-blend-screen animate-glow-float-slow"></div>
      <div class="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] bg-purple-500/80 rounded-full blur-[100px] mix-blend-screen animate-glow-float-delayed"></div>
    </div>

    <div class="fixed inset-0 bg-gradient-to-b from-[#1a153a]/20 to-[#0b0914]/40 z-10 backdrop-blur-sm pointer-events-none"></div>

    <div class="relative z-20">
      <Header @open-get-started-modal="$emit('open-get-started-modal')" @open-language-modal="$emit('open-language-modal')" />
    </div>

    <main class="px-4 pt-4 relative z-20">
      <section class="max-w-3xl mx-auto">
        <div class="bg-[#1a153a]/85 backdrop-blur-md rounded-2xl border-2 border-white/10 shadow-lg overflow-hidden">
          <div class="relative px-4 py-3.5 sm:px-5 sm:py-4">
            <div class="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div class="relative z-10 space-y-3.5">
              <div>
                <div class="flex items-center gap-2.5 flex-wrap">
                  <h1 class="text-[22px] text-white font-display font-bold tech-font tracking-wide">
                    {{ t('cooperation.title') }}
                  </h1>
                  <div class="inline-flex items-center gap-2 rounded-full border border-app-pink/30 bg-app-pink/10 px-3 py-1 text-[11px] text-app-pink tech-font font-bold tracking-wider">
                    <i class="ph-fill ph-handshake text-sm"></i>
                    {{ t('cooperation.badge') }}
                  </div>
                </div>
                <div class="mt-2.5 h-px w-full bg-white/12"></div>
                <div class="tip-box intro-tip mt-2">
                  <div class="tip-icon intro-tip-icon">
                    <i class="ph-fill ph-info text-[16px]"></i>
                  </div>
                  <p class="intro-tip-text" v-html="highlightedDescriptionHtml"></p>
                </div>
              </div>

              <div class="form-panel">
                <div class="form-section-title">
                  {{ t('cooperation.formTitle') }}
                </div>

                <div class="grid gap-3">
                  <label class="field-compact">
                    <div class="field-header">
                      <span>{{ t('cooperation.fields.studioName') }}</span>
                      <span class="required-mark">*</span>
                    </div>
                    <input
                      v-model.trim="studioName"
                      type="text"
                      :placeholder="t('cooperation.placeholders.studioName')"
                      class="field-input"
                    />
                  </label>

                  <label class="field-compact">
                    <div class="field-header">
                      <span>{{ t('cooperation.fields.purchaseAddress') }}</span>
                      <span class="required-mark">*</span>
                    </div>
                    <input
                      v-model.trim="purchaseAddress"
                      type="text"
                      inputmode="text"
                      autocapitalize="off"
                      spellcheck="false"
                      :placeholder="t('cooperation.placeholders.purchaseAddress')"
                      class="field-input"
                      :class="{ 'border-rose-500/40 focus:border-rose-400/70': purchaseAddress && !isPurchaseAddressValid }"
                    />
                    <p v-if="purchaseAddress && !isPurchaseAddressValid" class="field-error">
                      {{ t('cooperation.errors.purchaseAddress') }}
                    </p>
                  </label>

                  <label class="field-compact">
                    <div class="field-header">
                      <span>{{ t('cooperation.fields.purchaseQuantity') }}</span>
                      <span class="required-mark">*</span>
                    </div>
                    <input
                      v-model.trim="purchaseQuantity"
                      type="text"
                      inputmode="numeric"
                      :placeholder="t('cooperation.placeholders.purchaseQuantity')"
                      class="field-input"
                      :class="{ 'border-rose-500/40 focus:border-rose-400/70': purchaseQuantity && !isPurchaseQuantityValid }"
                    />
                    <p v-if="purchaseQuantity && !isPurchaseQuantityValid" class="field-error">
                      {{ t('cooperation.errors.purchaseQuantity') }}
                    </p>
                  </label>
                </div>
              </div>

              <div class="summary-card">
                <div class="mb-2.5">
                  <div>
                    <h2 class="text-[17px] text-white font-display font-bold tech-font">
                      {{ t('cooperation.summaryTitle') }}
                    </h2>
                    <!-- <p class="mt-1 text-[13px] text-gray-200/95 tech-font font-medium leading-5.5">
                      {{ t('cooperation.summaryHint') }}
                    </p> -->
                  </div>
                </div>

                <div class="summary-content">
                  <template v-if="isFormValid">{{ summaryText }}</template>
                  <template v-else>{{ t('cooperation.summaryPlaceholder') }}</template>
                </div>

                <button
                  type="button"
                  :disabled="!isFormValid"
                  @click="copySummary"
                  class="copy-button mt-2.5"
                >
                  <i class="ph ph-copy text-base"></i>
                  {{ t('cooperation.copyButton') }}
                </button>

                <!-- <div class="tip-box mt-2.5">
                  <div class="tip-icon">
                    <i class="ph-fill ph-warning-circle text-[16px]"></i>
                  </div>
                  <p class="tip-text">
                    {{ t('cooperation.copyTip') }}
                  </p>
                </div> -->

                <button
                  type="button"
                  :disabled="!isFormValid"
                  @click="openTelegramService"
                  class="telegram-button"
                >
                  <div class="flex items-center gap-3">
                    <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-[#229ED9]/15 border border-[#229ED9]/30">
                      <i class="ph-fill ph-telegram-logo text-[24px] text-[#54A9EB]"></i>
                    </div>
                    <div class="text-left">
                      <div class="text-[16px] text-white font-display font-bold tech-font">
                        {{ t('cooperation.telegramLabel') }}
                      </div>
                      <div class="text-[13px] text-[#8ed5ff] tech-font font-bold">
                        {{ telegramUsernameDisplay }}
                      </div>
                    </div>
                  </div>
                  <i class="ph-bold ph-arrow-up-right text-lg text-white/70"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { ethers } from 'ethers';
import Header from '@/components/Header.vue';
import { showToast } from '@/services/notification';
import { currentLanguage, t } from '@/i18n';

const TELEGRAM_USERNAME = 'AgentFi_AFI';

export default {
  name: 'CooperationView',
  components: {
    Header,
  },
  setup() {
    const studioName = ref('');
    const purchaseAddress = ref('');
    const purchaseQuantity = ref('');

    const isPurchaseAddressValid = computed(() => ethers.isAddress(purchaseAddress.value));
    const isPurchaseQuantityValid = computed(() => /^[1-9]\d*$/.test(purchaseQuantity.value));
    const isFormValid = computed(() => {
      return Boolean(
        studioName.value &&
        isPurchaseAddressValid.value &&
        isPurchaseQuantityValid.value
      );
    });

    const escapeHtml = (text) => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };

    const highlightedDescriptionHtml = computed(() => {
      const description = escapeHtml(t('cooperation.description'));
      const targetsByLanguage = {
        en: ['converted text', 'studio promo video'],
        'zh-cn': ['总结后的文案', '工作室宣传视频'],
        'zh-tw': ['轉換後的文字', '影片'],
      };

      return (targetsByLanguage[currentLanguage.value] || []).reduce((html, target) => {
        const safeTarget = escapeHtml(target);
        return html.replace(safeTarget, `<span class="intro-highlight">${safeTarget}</span>`);
      }, description);
    });

    const summaryText = computed(() => {
      return [
        '工作室信息',
        `工作室名称：${studioName.value}`,
        `购买地址：${purchaseAddress.value}`,
        `购买数量：${purchaseQuantity.value}`,
      ].join('\n');
    });

    const telegramUsernameDisplay = computed(() => `@${TELEGRAM_USERNAME}`);
    const telegramWebUrl = computed(() => {
      const text = encodeURIComponent(summaryText.value);
      return `https://t.me/${TELEGRAM_USERNAME}?text=${text}`;
    });
    const telegramAppUrl = computed(() => {
      const text = encodeURIComponent(summaryText.value);
      return `tg://resolve?domain=${TELEGRAM_USERNAME}&text=${text}`;
    });

    const copyText = (text) => {
      if (!text) return;

      const fallbackCopy = (textToCopy) => {
        try {
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          textArea.setAttribute('readonly', '');
          textArea.style.position = 'absolute';
          textArea.style.left = '-9999px';
          textArea.style.top = '0';
          document.body.appendChild(textArea);

          if (navigator.userAgent.match(/ipad|iphone/i)) {
            const range = document.createRange();
            range.selectNodeContents(textArea);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            textArea.setSelectionRange(0, 999999);
          } else {
            textArea.select();
          }

          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);

          if (successful) {
            showToast(t('cooperation.messages.copySuccess'), 'success');
          } else {
            showToast(t('cooperation.messages.copyFailed'), 'error');
          }
        } catch (error) {
          console.error('Fallback copy failed:', error);
          showToast(t('cooperation.messages.copyFailed'), 'error');
        }
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(t('cooperation.messages.copySuccess'), 'success');
        }).catch((error) => {
          console.error('Clipboard API failed:', error);
          fallbackCopy(text);
        });
      } else {
        fallbackCopy(text);
      }
    };

    const copySummary = () => {
      if (!isFormValid.value) {
        showToast(t('cooperation.messages.fillAllFields'), 'error');
        return;
      }
      copyText(summaryText.value);
    };

    const openTelegramService = () => {
      if (!isFormValid.value) {
        showToast(t('cooperation.messages.fillAllFields'), 'error');
        return;
      }

      window.location.href = telegramAppUrl.value;
      window.setTimeout(() => {
        window.open(telegramWebUrl.value, '_blank', 'noopener,noreferrer');
      }, 600);
    };

    return {
      studioName,
      purchaseAddress,
      purchaseQuantity,
      isPurchaseAddressValid,
      isPurchaseQuantityValid,
      isFormValid,
      highlightedDescriptionHtml,
      summaryText,
      telegramUsernameDisplay,
      copySummary,
      openTelegramService,
      t,
    };
  },
};
</script>

<style scoped>
.tech-font {
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: 0.05em;
}

.form-panel {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding: 0.85rem 0.95rem 0.9rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.18));
}

.form-section-title {
  color: rgba(255, 255, 255, 0.98);
  font-size: 16px;
  font-weight: 800;
  line-height: 1.4;
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: 0.05em;
}

.field-compact {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.field-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.92);
  font-size: 14px;
  font-weight: 700;
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: 0.05em;
}

.required-mark {
  color: #fb7185;
}

.field-input {
  min-height: 46px;
  border-radius: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.34);
  padding: 0.75rem 0.9rem;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field-input::placeholder {
  color: rgba(203, 213, 225, 0.78);
}

.field-input:focus {
  border-color: rgba(255, 77, 141, 0.5);
  box-shadow: 0 0 0 3px rgba(255, 77, 141, 0.08);
}

.field-error {
  color: #fda4af;
  font-size: 12px;
  line-height: 1.45;
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.summary-card {
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(0, 0, 0, 0.2));
  padding: 0.9rem;
}

.tip-box {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.8rem 0.85rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(255, 141, 186, 0.32);
  background: linear-gradient(135deg, rgba(255, 77, 141, 0.14), rgba(255, 190, 220, 0.08));
}

.intro-tip {
  border-color: rgba(255, 255, 255, 0.12);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.07), rgba(255, 77, 141, 0.08));
}

.tip-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.7rem;
  height: 1.7rem;
  flex-shrink: 0;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.12);
  color: #ffc0da;
}

.intro-tip-icon {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.14);
}

.intro-tip-text {
  color: rgba(255, 255, 255, 0.96);
  font-size: 14px;
  line-height: 1.65;
  font-weight: 700;
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: 0.04em;
}

.intro-tip-text :deep(.intro-highlight) {
  color: #ffd166;
  font-weight: 800;
  text-shadow: 0 0 12px rgba(255, 209, 102, 0.22);
}

.tip-text {
  color: #ffd7e8;
  font-size: 13px;
  line-height: 1.6;
  font-weight: 700;
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: 0.04em;
}

.summary-content {
  min-height: 108px;
  white-space: pre-wrap;
  word-break: break-word;
  border-radius: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.3);
  padding: 0.95rem;
  color: #f8fafc;
  font-size: 14px;
  line-height: 1.8;
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.copy-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: 100%;
  height: 38px;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  transition: all 0.2s ease;
}

.copy-button:hover:not(:disabled) {
  border-color: rgba(255, 77, 141, 0.35);
  background: rgba(255, 255, 255, 0.1);
}

.copy-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.telegram-button {
  margin-top: 0.7rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(84, 169, 235, 0.35);
  background: linear-gradient(135deg, rgba(34, 158, 217, 0.16), rgba(255, 77, 141, 0.1));
  padding: 0.85rem 0.95rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.telegram-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(34, 158, 217, 0.16);
  border-color: rgba(84, 169, 235, 0.55);
}

.telegram-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
