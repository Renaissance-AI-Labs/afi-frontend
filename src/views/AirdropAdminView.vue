<template>
  <div class="airdrop-admin-view relative pb-24 min-h-[calc(100vh-140px)]">
    <div class="fixed inset-0 z-0 pointer-events-none">
      <img src="/asset/images/logo/bg.png" alt="background" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/60 rounded-full blur-[80px] mix-blend-screen animate-glow-float-slow"></div>
      <div class="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] bg-purple-500/60 rounded-full blur-[100px] mix-blend-screen animate-glow-float-delayed"></div>
    </div>

    <div class="fixed inset-0 bg-gradient-to-b from-[#1a153a]/20 to-[#0b0914]/50 z-10 backdrop-blur-sm pointer-events-none"></div>

    <div class="relative z-20">
      <Header @open-get-started-modal="$emit('open-get-started-modal')" @open-language-modal="$emit('open-language-modal')" />
    </div>

    <main class="relative z-20 w-full max-w-4xl mx-auto px-4 pt-6 flex flex-col gap-4">
      <div class="flex items-center justify-between gap-3">
        <div>
          <router-link to="/" class="text-[11px] text-gray-300 tech-font hover:text-white inline-flex items-center gap-1 mb-2">
            <i class="ph ph-caret-left"></i> 返回首页
          </router-link>
          <h1 class="text-2xl font-display text-white tech-font font-bold tracking-widest">活动空投后台</h1>
          <p class="text-xs text-gray-300 tech-font mt-1 leading-relaxed">运营只需要发空投、充奖池、看记录。</p>
        </div>
        <button
          @click="refreshAdminData"
          :disabled="loading"
          class="shrink-0 w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition flex items-center justify-center disabled:opacity-50"
          aria-label="刷新后台数据"
        >
          <i class="ph ph-arrows-clockwise text-base" :class="{ 'animate-spin': loading }"></i>
        </button>
      </div>

      <section v-if="!walletState.isConnected" class="panel p-5 text-center">
        <i class="ph ph-wallet text-4xl text-purple-300 mb-3"></i>
        <h2 class="text-lg text-white tech-font font-bold mb-2">请先连接管理员钱包</h2>
        <p class="text-sm text-gray-300 tech-font mb-4">只有拥有 DEFAULT_ADMIN_ROLE 或 MANAGER_ROLE 的钱包才能进入后台。</p>
        <button @click="$emit('open-get-started-modal')" class="primary-btn w-full">
          连接钱包
        </button>
      </section>

      <section v-else-if="loading && !accessChecked" class="panel p-5 text-center text-gray-300 tech-font">
        <i class="ph ph-spinner animate-spin text-xl"></i>
        <p class="mt-2">正在检查管理员权限...</p>
      </section>

      <section v-else-if="!isAdmin" class="panel p-5 text-center">
        <i class="ph ph-warning-circle text-4xl text-yellow-300 mb-3"></i>
        <h2 class="text-lg text-white tech-font font-bold mb-2">当前钱包不是空投管理员</h2>
        <p class="text-sm text-gray-300 tech-font leading-relaxed">请切换到拥有 DEFAULT_ADMIN_ROLE 或 MANAGER_ROLE 的钱包。普通用户看不到首页后台入口，也不能在这里发放空投。</p>
      </section>

      <template v-else>
        <section class="panel p-2">
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="tab in adminTabs"
              :key="tab.id"
              @click="activeAdminTab = tab.id"
              class="tab-btn"
              :class="activeAdminTab === tab.id ? 'tab-btn-active' : 'tab-btn-idle'"
            >
              <i :class="tab.icon"></i>
              <span>{{ tab.label }}</span>
            </button>
          </div>
        </section>

        <section v-if="activeAdminTab === 'single'" class="panel p-4">
          <h2 class="section-title"><i class="ph-fill ph-user-plus text-purple-400"></i> 单地址空投</h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="input-block sm:col-span-2">
              <label>用户钱包地址</label>
              <input v-model="singleForm.user" placeholder="0x..." />
            </div>
            <div class="input-block">
              <label>数量 AFI</label>
              <input v-model="singleForm.amount" type="number" min="0" placeholder="例如 1000" />
            </div>
            <div class="input-block">
              <label>释放天数</label>
              <input v-model="singleForm.days" type="number" min="0" placeholder="例如 30" />
            </div>
            <div class="input-block">
              <label>门槛 USDT</label>
              <input v-model="singleForm.threshold" type="number" min="0" placeholder="没门槛填 0" />
            </div>
            <button @click="createSingleAirdrop" :disabled="actionLoading === 'single' || !canManage" class="primary-btn compact-submit">
              {{ actionLoading === 'single' ? '发放中...' : '确认发放' }}
            </button>
          </div>

          <div class="preview-box compact-preview">
            <p>单个用户直接填表发放：给 <b>{{ shortAddress(singleForm.user) || '用户地址' }}</b> 发放 <b>{{ singleForm.amount || '0' }} AFI</b>，分 <b>{{ singleForm.days || '0' }} 天</b>释放，领取门槛 <b>{{ singleForm.threshold || '0' }} USDT</b>。</p>
          </div>
        </section>

        <section v-else-if="activeAdminTab === 'batch'" class="panel p-4">
          <h2 class="section-title"><i class="ph-fill ph-files text-purple-400"></i> 批量空投</h2>
          <p class="section-desc">一行一条：用户地址,AFI数量,释放天数,领取门槛USDT；中间必须用英文逗号 "," 分隔。</p>
          <textarea
            v-model="batchText"
            class="batch-input"
            rows="6"
            placeholder="0x0000...,1000.5,30,500.25&#10;0x0001...,88.88,15,0"
          ></textarea>
          <div class="preview-box compact-preview">
            <p>有效 <b>{{ parsedBatch.valid.length }}</b> 条，错误 <b>{{ parsedBatch.invalid.length }}</b> 条。</p>
            <p v-if="parsedBatch.invalid.length" class="text-yellow-300 mt-1">错误行：{{ parsedBatch.invalid.slice(0, 5).join('、') }}</p>
          </div>
          <button @click="createBatchAirdrop" :disabled="actionLoading === 'batch' || !canManage || parsedBatch.valid.length === 0" class="primary-btn w-full">
            {{ actionLoading === 'batch' ? '批量发放中...' : `批量发放 ${parsedBatch.valid.length} 条` }}
          </button>
        </section>

        <section v-else-if="activeAdminTab === 'fund'" class="panel p-4">
          <h2 class="section-title"><i class="ph-fill ph-vault text-purple-400"></i> 充值 AFI</h2>
          <p class="section-desc">把当前钱包里的 AFI 转到空投奖池。奖池有余额，用户才能领取。</p>

          <div class="grid grid-cols-3 gap-2 mb-3">
            <InfoCard label="奖池余额" :value="formatToken(poolBalance)" tone="pink" />
            <InfoCard label="已分配" :value="formatToken(totalAllocated)" tone="white" />
            <InfoCard label="已领取" :value="formatToken(totalClaimed)" tone="cyan" />
          </div>

          <div class="input-block">
            <label>充值数量（AFI）</label>
            <input v-model="fundAmount" type="number" min="0" placeholder="例如 50000" />
            <button @click="fundPool" :disabled="actionLoading === 'fund' || !afiTokenReady" class="primary-btn">
              {{ actionLoading === 'fund' ? '充值中...' : '确认充值' }}
            </button>
          </div>
        </section>

        <section v-else class="panel p-4">
          <h2 class="section-title"><i class="ph-fill ph-clock-counter-clockwise text-purple-400"></i> 空投记录</h2>
          <p class="section-desc">每页显示 30 条，滑到底部可加载更早记录。</p>

          <div v-if="recentRecords.length === 0" class="empty-box">暂无记录</div>
          <div v-else class="flex flex-col gap-2">
            <div v-for="record in recentRecords" :key="record.recordId" class="record-row">
              <div class="flex items-center justify-between gap-2">
                <p class="text-sm text-white tech-font font-bold">空投 #{{ record.recordId + 1 }}</p>
                <p class="text-sm text-app-pink tech-font font-bold">{{ formatToken(record.totalAmount) }} AFI</p>
              </div>
              <div class="record-address-row">
                <span class="record-address">{{ record.user }}</span>
                <button @click="copyText(record.user)" class="record-copy-btn" aria-label="复制地址">
                  <i class="ph ph-copy"></i>
                </button>
              </div>
              <div class="record-meta-row">
                <p class="record-meta-text">释放 {{ formatDuration(record.duration) }} · 门槛 {{ formatToken(record.claimThreshold) }} USDT</p>
                <p class="record-meta-text text-right">已领 {{ formatToken(record.claimed) }} AFI</p>
              </div>
            </div>
            <button
              v-if="recordsNextCursor > 0"
              @click="loadMoreRecords"
              :disabled="recordsLoading"
              class="secondary-btn w-full mt-2"
            >
              {{ recordsLoading ? '加载中...' : '加载更多记录' }}
            </button>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<script>
import { computed, defineComponent, h, onMounted, reactive, ref, watch } from 'vue';
import { ethers } from 'ethers';
import Header from '@/components/Header.vue';
import { walletState } from '@/services/wallet';
import { getContractAddress } from '@/services/contracts';
import { getDefaultRpcUrl } from '@/services/environment';
import { showToast } from '@/services/notification';
import AirdropABI from '@/abis/Airdrop.json';
import ERC20ABI from '@/abis/usdt.json';

const ZERO_ADDRESS = ethers.ZeroAddress;
const RECORDS_PAGE_SIZE = 30;

const InfoCard = defineComponent({
  name: 'InfoCard',
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
    tone: { type: String, default: 'white' },
  },
  setup(props) {
    const toneClass = computed(() => ({
      pink: 'text-app-pink',
      cyan: 'text-cyan-300',
      yellow: 'text-yellow-300',
      white: 'text-white',
    }[props.tone] || 'text-white'));

    return () => h('div', { class: 'bg-white/5 rounded-lg p-3 border border-white/5 text-center' }, [
      h('p', { class: 'text-[10px] text-gray-300 tech-font uppercase tracking-wider mb-1' }, props.label),
      h('p', { class: ['text-sm font-bold break-all', toneClass.value] }, props.value),
    ]);
  },
});

const AddressRow = defineComponent({
  name: 'AddressRow',
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
    status: { type: String, required: true },
  },
  emits: ['copy'],
  setup(props, { emit }) {
    const isReady = computed(() => props.value && props.value !== ZERO_ADDRESS);
    return () => h('div', { class: 'bg-black/20 border border-white/5 rounded-xl p-3 flex items-center justify-between gap-3' }, [
      h('div', { class: 'min-w-0' }, [
        h('p', { class: 'text-[11px] text-gray-300 tech-font mb-1' }, props.label),
        h('p', { class: 'text-xs text-white tech-font truncate' }, props.value || '-'),
      ]),
      h('div', { class: 'shrink-0 flex items-center gap-2' }, [
        h('span', {
          class: [
            'px-2 py-1 rounded text-[10px] tech-font border',
            isReady.value ? 'text-green-300 bg-green-500/10 border-green-500/30' : 'text-yellow-300 bg-yellow-500/10 border-yellow-500/30',
          ],
        }, props.status),
        h('button', {
          class: 'w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white',
          onClick: () => emit('copy'),
        }, [h('i', { class: 'ph ph-copy' })]),
      ]),
    ]);
  },
});

export default {
  name: 'AirdropAdminView',
  components: {
    Header,
    InfoCard,
    AddressRow,
  },
  emits: ['open-get-started-modal', 'open-language-modal'],
  setup() {
    const loading = ref(false);
    const accessChecked = ref(false);
    const isAdmin = ref(false);
    const hasDefaultAdmin = ref(false);
    const hasManagerRole = ref(false);
    const actionLoading = ref(null);
    const activeAdminTab = ref('single');
    const airdropAddress = getContractAddress('Airdrop');
    const afiTokenAddress = ref('');
    const stakingAddress = ref('');
    const poolBalance = ref(0n);
    const totalAllocated = ref(0n);
    const totalClaimed = ref(0n);
    const recordCount = ref(0n);
    const recentRecords = ref([]);
    const recordsNextCursor = ref(0);
    const recordsLoading = ref(false);
    let fallbackProvider = null;

    const configForm = reactive({
      afiToken: '',
      staking: '',
    });
    const fundAmount = ref('');
    const singleForm = reactive({
      user: '',
      amount: '',
      days: '30',
      threshold: '0',
    });
    const batchText = ref('');

    const adminTabs = [
      { id: 'single', label: '单地址空投', icon: 'ph-fill ph-user-plus' },
      { id: 'batch', label: '批量空投', icon: 'ph-fill ph-files' },
      { id: 'fund', label: '充值 AFI', icon: 'ph-fill ph-vault' },
      { id: 'records', label: '空投记录', icon: 'ph-fill ph-clock-counter-clockwise' },
    ];

    const getProvider = () => {
      if (walletState.provider) return walletState.provider;
      if (!fallbackProvider) fallbackProvider = new ethers.JsonRpcProvider(getDefaultRpcUrl());
      return fallbackProvider;
    };

    const getAirdrop = (runner = getProvider()) => new ethers.Contract(airdropAddress, AirdropABI, runner);

    const canManage = computed(() => hasDefaultAdmin.value || hasManagerRole.value);
    const afiTokenReady = computed(() => Boolean(afiTokenAddress.value && afiTokenAddress.value !== ZERO_ADDRESS));
    const stakingReady = computed(() => Boolean(stakingAddress.value && stakingAddress.value !== ZERO_ADDRESS));
    const reservedBalance = computed(() => (
      totalAllocated.value > totalClaimed.value ? totalAllocated.value - totalClaimed.value : 0n
    ));
    const roleLabel = computed(() => {
      if (hasDefaultAdmin.value && hasManagerRole.value) return '管理员 + 运营';
      if (hasDefaultAdmin.value) return '管理员';
      if (hasManagerRole.value) return '运营';
      return '无权限';
    });
    const recordCountDisplay = computed(() => recordCount.value.toString());

    // Non-negative decimal number, e.g. "0", "1000", "88.88" (rejects "", "-1", "1e3", "0x10", "12abc")
    const isNonNegativeNumber = (value) => /^\d+(\.\d+)?$/.test(value);
    // Positive integer without leading zeros, e.g. "1", "30" (rejects "0", "1.5", "-3")
    const isPositiveInteger = (value) => /^[1-9]\d*$/.test(value);

    const parsedBatch = computed(() => {
      const rows = batchText.value
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      const valid = [];
      const invalid = [];

      rows.forEach((line, index) => {
        const rowNumber = index + 1;
        const parts = line.split(',').map((item) => item.trim());
        // Exactly 3 English commas => exactly 4 fields: user,amount,days,threshold
        if (parts.length !== 4) {
          invalid.push(`第 ${rowNumber} 行`);
          return;
        }
        const [user, amount, days, threshold] = parts;
        const isValid = ethers.isAddress(user)
          && isNonNegativeNumber(amount) && Number(amount) > 0
          && isPositiveInteger(days)
          && isNonNegativeNumber(threshold);
        if (!isValid) {
          invalid.push(`第 ${rowNumber} 行`);
          return;
        }
        valid.push({ user, amount, days, threshold });
      });

      return { valid, invalid };
    });

    const formatToken = (value, precision = 2) => {
      try {
        const formatted = ethers.formatEther(value || 0n);
        const [integerPart, decimalPart = ''] = formatted.split('.');
        const safeInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return `${safeInteger}.${decimalPart.slice(0, precision).padEnd(precision, '0')}`;
      } catch (error) {
        return `0.${'0'.repeat(precision)}`;
      }
    };

    const shortAddress = (address) => {
      if (!address || !ethers.isAddress(address)) return '';
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const formatDuration = (seconds) => {
      const total = Number(seconds || 0);
      if (total >= 86400) return `${Math.round(total / 86400)} 天`;
      if (total >= 3600) return `${Math.round(total / 3600)} 小时`;
      return `${total} 秒`;
    };

    const parseRevert = (error) => {
      if (error?.reason) return error.reason;
      if (error?.shortMessage) return error.shortMessage;
      const data = error?.data?.data || error?.data;
      if (typeof data === 'string' && data.startsWith('0x08c379a0')) {
        try {
          return ethers.AbiCoder.defaultAbiCoder().decode(['string'], `0x${data.slice(10)}`)[0];
        } catch (decodeError) {
          return '';
        }
      }
      return '';
    };

    const copyText = async (text) => {
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        showToast('已复制', 'success');
      } catch (error) {
        showToast('复制失败，请手动复制', 'error');
      }
    };

    const validateAddress = (address, label) => {
      if (!ethers.isAddress(address)) {
        showToast(`${label} 不是正确的钱包地址`, 'error');
        return false;
      }
      return true;
    };

    const toDurationSeconds = (days) => {
      const parsed = Number(days);
      if (!Number.isFinite(parsed) || parsed <= 0) return 0n;
      return BigInt(Math.floor(parsed * 86400));
    };

    const checkAccess = async () => {
      accessChecked.value = false;
      isAdmin.value = false;
      hasDefaultAdmin.value = false;
      hasManagerRole.value = false;

      if (!walletState.isConnected || !walletState.address || !airdropAddress) {
        accessChecked.value = true;
        return;
      }

      try {
        const airdrop = getAirdrop();
        const [defaultRole, managerRole] = await Promise.all([
          airdrop.DEFAULT_ADMIN_ROLE(),
          airdrop.MANAGER_ROLE(),
        ]);
        const [defaultAllowed, managerAllowed] = await Promise.all([
          airdrop.hasRole(defaultRole, walletState.address),
          airdrop.hasRole(managerRole, walletState.address),
        ]);
        hasDefaultAdmin.value = defaultAllowed;
        hasManagerRole.value = managerAllowed;
        isAdmin.value = defaultAllowed || managerAllowed;
      } catch (error) {
        console.error('Failed to check airdrop admin role:', error);
      } finally {
        accessChecked.value = true;
      }
    };

    const refreshAdminData = async () => {
      if (!walletState.isConnected || !walletState.address || !airdropAddress) return;

      loading.value = true;
      try {
        await checkAccess();
        if (!isAdmin.value) return;

        const provider = getProvider();
        const airdrop = getAirdrop(provider);
        const [
          afiToken,
          staking,
          allocated,
          claimed,
          count,
        ] = await Promise.all([
          airdrop.afiToken().catch(() => ZERO_ADDRESS),
          airdrop.stakingContract().catch(() => ZERO_ADDRESS),
          airdrop.totalAllocated().catch(() => 0n),
          airdrop.totalClaimed().catch(() => 0n),
          airdrop.recordCount().catch(() => 0n),
        ]);

        afiTokenAddress.value = afiToken;
        stakingAddress.value = staking;
        totalAllocated.value = allocated;
        totalClaimed.value = claimed;
        recordCount.value = count;
        configForm.afiToken = afiToken !== ZERO_ADDRESS ? afiToken : getContractAddress('AFI');
        configForm.staking = staking !== ZERO_ADDRESS ? staking : getContractAddress('Staking');

        if (afiToken !== ZERO_ADDRESS) {
          const afi = new ethers.Contract(afiToken, ERC20ABI, provider);
          poolBalance.value = await afi.balanceOf(airdropAddress);
        } else {
          poolBalance.value = 0n;
        }

        await fetchRecordsPage(airdrop, count, true);
      } catch (error) {
        console.error('Failed to refresh airdrop admin data:', error);
        showToast('后台数据加载失败', 'error');
      } finally {
        loading.value = false;
      }
    };

    const fetchRecordsPage = async (airdrop, count, reset = false) => {
      const total = Number(count);
      if (reset) {
        recentRecords.value = [];
        recordsNextCursor.value = total;
      }

      if (!total) {
        recentRecords.value = [];
        recordsNextCursor.value = 0;
        return;
      }

      if (recordsNextCursor.value <= 0 || recordsLoading.value) {
        return;
      }

      recordsLoading.value = true;
      try {
        const nextCursor = Number(recordsNextCursor.value);
        const size = Math.min(RECORDS_PAGE_SIZE, nextCursor);
        const cursor = Math.max(0, nextCursor - size);
        const [list, ids] = await airdrop.getRecordsBySize(cursor, size);
        const rows = list
          .map((record, index) => ({
            recordId: Number(ids[index]),
            user: record.user,
            duration: Number(record.duration),
            totalAmount: record.totalAmount,
            claimed: record.claimed,
            claimThreshold: record.claimThreshold,
          }))
          .sort((a, b) => b.recordId - a.recordId);

        recentRecords.value = reset ? rows : [...recentRecords.value, ...rows];
        recordsNextCursor.value = cursor;
      } finally {
        recordsLoading.value = false;
      }
    };

    const loadMoreRecords = async () => {
      const provider = getProvider();
      const airdrop = getAirdrop(provider);
      await fetchRecordsPage(airdrop, recordCount.value, false);
    };

    const setAfiToken = async () => {
      if (!validateAddress(configForm.afiToken, 'AFI 代币地址')) return;
      actionLoading.value = 'setAfi';
      try {
        const tx = await getAirdrop(walletState.signer).setAfiToken(configForm.afiToken);
        showToast('设置交易已提交', 'info');
        await tx.wait();
        showToast('AFI Token 设置成功', 'success');
        await refreshAdminData();
      } catch (error) {
        showToast(parseRevert(error) || '设置 AFI Token 失败', 'error');
      } finally {
        actionLoading.value = null;
      }
    };

    const setStakingContract = async () => {
      if (!validateAddress(configForm.staking, 'Staking 合约地址')) return;
      actionLoading.value = 'setStaking';
      try {
        const tx = await getAirdrop(walletState.signer).setStakingContract(configForm.staking);
        showToast('设置交易已提交', 'info');
        await tx.wait();
        showToast('Staking 设置成功', 'success');
        await refreshAdminData();
      } catch (error) {
        showToast(parseRevert(error) || '设置 Staking 失败', 'error');
      } finally {
        actionLoading.value = null;
      }
    };

    const fundPool = async () => {
      if (!afiTokenReady.value) {
        showToast('请先配置 AFI Token', 'error');
        return;
      }
      if (Number(fundAmount.value) <= 0) {
        showToast('请输入正确的充值数量', 'error');
        return;
      }

      actionLoading.value = 'fund';
      try {
        const afi = new ethers.Contract(afiTokenAddress.value, ERC20ABI, walletState.signer);
        const tx = await afi.transfer(airdropAddress, ethers.parseEther(fundAmount.value.toString()));
        showToast('充值交易已提交', 'info');
        await tx.wait();
        showToast('奖池充值成功', 'success');
        fundAmount.value = '';
        await refreshAdminData();
      } catch (error) {
        showToast(parseRevert(error) || '奖池充值失败', 'error');
      } finally {
        actionLoading.value = null;
      }
    };

    const createSingleAirdrop = async () => {
      if (!validateAddress(singleForm.user, '用户地址')) return;
      if (Number(singleForm.amount) <= 0) {
        showToast('空投总量必须大于 0', 'error');
        return;
      }

      const duration = toDurationSeconds(singleForm.days);
      if (duration <= 0n) {
        showToast('释放天数必须大于 0', 'error');
        return;
      }

      actionLoading.value = 'single';
      try {
        const tx = await getAirdrop(walletState.signer).addAirdrop(
          singleForm.user,
          ethers.parseEther(singleForm.amount.toString()),
          duration,
          ethers.parseEther((singleForm.threshold || '0').toString()),
        );
        showToast('发放交易已提交', 'info');
        await tx.wait();
        showToast('单条空投发放成功', 'success');
        singleForm.user = '';
        singleForm.amount = '';
        await refreshAdminData();
      } catch (error) {
        showToast(parseRevert(error) || '单条空投发放失败', 'error');
      } finally {
        actionLoading.value = null;
      }
    };

    const createBatchAirdrop = async () => {
      if (parsedBatch.value.invalid.length) {
        showToast('请先修改批量文本里的错误行', 'error');
        return;
      }
      if (parsedBatch.value.valid.length > 100) {
        showToast('一次最多建议发 100 条，请拆分批次', 'error');
        return;
      }

      actionLoading.value = 'batch';
      try {
        const users = parsedBatch.value.valid.map((row) => row.user);
        const amounts = parsedBatch.value.valid.map((row) => ethers.parseEther(row.amount.toString()));
        const durations = parsedBatch.value.valid.map((row) => toDurationSeconds(row.days));
        const thresholds = parsedBatch.value.valid.map((row) => ethers.parseEther((row.threshold || '0').toString()));

        const tx = await getAirdrop(walletState.signer).addAirdropBatch(users, amounts, durations, thresholds);
        showToast('批量发放交易已提交', 'info');
        await tx.wait();
        showToast('批量空投发放成功', 'success');
        batchText.value = '';
        await refreshAdminData();
      } catch (error) {
        showToast(parseRevert(error) || '批量空投发放失败', 'error');
      } finally {
        actionLoading.value = null;
      }
    };

    onMounted(refreshAdminData);

    watch(() => [walletState.isConnected, walletState.address], () => {
      refreshAdminData();
    });

    return {
      walletState,
      loading,
      accessChecked,
      isAdmin,
      canManage,
      actionLoading,
      activeAdminTab,
      adminTabs,
      airdropAddress,
      afiTokenAddress,
      stakingAddress,
      afiTokenReady,
      stakingReady,
      poolBalance,
      totalAllocated,
      totalClaimed,
      reservedBalance,
      roleLabel,
      recordCountDisplay,
      recentRecords,
      recordsNextCursor,
      recordsLoading,
      configForm,
      fundAmount,
      singleForm,
      batchText,
      parsedBatch,
      refreshAdminData,
      loadMoreRecords,
      copyText,
      formatToken,
      shortAddress,
      formatDuration,
      setAfiToken,
      setStakingContract,
      fundPool,
      createSingleAirdrop,
      createBatchAirdrop,
    };
  },
};
</script>

<style scoped>
.tech-font {
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: 0.05em;
}

.panel {
  background: rgba(26, 21, 58, 0.42);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: 0.05em;
}

.section-desc {
  color: rgb(209 213 219);
  font-size: 0.75rem;
  line-height: 1.7;
  margin-bottom: 0.75rem;
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.input-block {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.input-block label {
  color: rgb(209 213 219);
  font-size: 0.75rem;
  font-weight: 700;
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.input-block input,
.batch-input {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.35);
  color: white;
  padding: 0.55rem 0.7rem;
  outline: none;
  font-size: 0.82rem;
}

.input-block input:focus,
.batch-input:focus {
  border-color: rgb(168 85 247);
}

.helper {
  color: rgb(209 213 219);
  font-size: 0.68rem;
  line-height: 1.5;
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.tab-btn {
  min-height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.72rem;
  font-weight: 700;
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  transition: 0.2s ease;
}

.tab-btn i {
  font-size: 1rem;
}

.tab-btn-active {
  color: white;
  border-color: rgba(168, 85, 247, 0.65);
  background: linear-gradient(to right, rgba(147, 51, 234, 0.35), rgba(219, 39, 119, 0.28));
}

.tab-btn-idle {
  color: rgb(209 213 219);
  background: rgba(255, 255, 255, 0.04);
}

.tab-btn-idle:hover {
  color: white;
  background: rgba(255, 255, 255, 0.08);
}

.primary-btn {
  border-radius: 0.75rem;
  background: linear-gradient(to right, rgb(147 51 234), rgb(219 39 119));
  color: white;
  font-weight: 700;
  padding: 0.65rem 1rem;
  transition: 0.2s ease;
  font-size: 0.875rem;
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.primary-btn:disabled,
.secondary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.secondary-btn {
  border-radius: 0.75rem;
  border: 1px solid rgba(168, 85, 247, 0.35);
  background: rgba(168, 85, 247, 0.12);
  color: rgb(216 180 254);
  font-weight: 700;
  padding: 0.6rem 1rem;
  transition: 0.2s ease;
  font-size: 0.8rem;
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.preview-box {
  margin: 0.75rem 0;
  border-radius: 0.75rem;
  border: 1px solid rgba(34, 211, 238, 0.2);
  background: rgba(34, 211, 238, 0.08);
  color: rgb(209 213 219);
  padding: 0.75rem;
  font-size: 0.75rem;
  line-height: 1.6;
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.compact-preview {
  margin: 0.55rem 0;
  padding: 0.55rem 0.65rem;
}

.compact-submit {
  align-self: end;
}

.empty-box {
  text-align: center;
  color: rgb(209 213 219);
  padding: 1.5rem 0;
  font-size: 0.8rem;
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.record-row {
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.24);
  padding: 0.5rem 0.6rem;
}

.record-address-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
}

.record-address {
  flex: 1;
  min-width: 0;
  color: rgb(209 213 219);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 0.6rem;
  letter-spacing: -0.065em;
  white-space: nowrap;
}

.record-copy-btn {
  width: 1.45rem;
  height: 1.45rem;
  flex-shrink: 0;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: rgb(216 180 254);
  display: flex;
  align-items: center;
  justify-content: center;
}

.record-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  min-width: 0;
}

.record-meta-text {
  color: rgb(209 213 219);
  font-size: 0.62rem;
  line-height: 1.2;
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  white-space: nowrap;
}
</style>
