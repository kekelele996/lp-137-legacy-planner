<template>
  <div class="min-h-screen bg-gray-50 flex">
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div class="p-6 border-b border-gray-200">
        <h1 class="text-xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen class="w-6 h-6 text-primary-500" />
          人生整理
        </h1>
        <p class="text-sm text-gray-500 mt-1">记录珍贵的人生故事</p>
      </div>
      
      <div class="p-4">
        <div class="mb-4">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-600">完成进度</span>
            <span class="font-semibold text-primary-600">{{ progress }}%</span>
          </div>
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500"
              :style="{ width: progress + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-1">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="currentModule = item.id"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200"
          :class="currentModule === item.id 
            ? 'bg-primary-50 text-primary-700 font-medium' 
            : 'text-gray-600 hover:bg-gray-100'"
        >
          <component :is="item.icon" class="w-5 h-5" />
          {{ item.label }}
          <span 
            v-if="!isModuleCompleted(item.id)" 
            class="ml-auto w-2 h-2 bg-amber-400 rounded-full"
          ></span>
        </button>
      </nav>

      <div class="p-4 border-t border-gray-200 space-y-2">
        <button 
          @click="showExportModal = true"
          class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
        >
          <Download class="w-5 h-5" />
          导出备份
        </button>
        <button 
          @click="showImportModal = true"
          class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
        >
          <Upload class="w-5 h-5" />
          导入数据
        </button>
      </div>
    </aside>

    <main class="flex-1 overflow-auto">
      <WillEditor 
        v-if="currentModule === 'will'" 
        :data="data.will" 
        @update="updateWill" 
      />
      <FinanceManager 
        v-if="currentModule === 'finance'" 
        :data="data.finance" 
        @update="updateFinance" 
      />
      <ItemAllocator 
        v-if="currentModule === 'items'" 
        :data="data.items" 
        @update="updateItems" 
      />
      <FarewellLetter 
        v-if="currentModule === 'letter'" 
        :data="data.farewellLetter" 
        @update="updateLetter" 
      />
      <DigitalLegacy 
        v-if="currentModule === 'digital'" 
        :data="data.digitalLegacy" 
        @update="updateDigital" 
      />
      <Permissions 
        v-if="currentModule === 'permissions'" 
        :data="data.permissions" 
        @update="updatePermissions" 
      />
    </main>

    <div v-if="showExportModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showExportModal = false">
      <div class="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">导出数据</h3>
        <div class="space-y-4">
          <div>
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="exportWithPassword" type="checkbox" class="w-4 h-4 text-primary-500 rounded" />
              <span class="text-sm text-gray-700">加密导出</span>
            </label>
          </div>
          <div v-if="exportWithPassword" class="space-y-2">
            <input 
              v-model="exportPassword" 
              type="password" 
              placeholder="设置密码" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <input 
              v-model="exportPasswordConfirm" 
              type="password" 
              placeholder="确认密码" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div class="flex gap-3 pt-4">
            <button 
              @click="showExportModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
            >
              取消
            </button>
            <button 
              @click="handleExport"
              class="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
            >
              导出
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showImportModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showImportModal = false">
      <div class="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">导入数据</h3>
        <div class="space-y-4">
          <div>
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="importWithPassword" type="checkbox" class="w-4 h-4 text-primary-500 rounded" />
              <span class="text-sm text-gray-700">文件已加密</span>
            </label>
          </div>
          <div v-if="importWithPassword">
            <input 
              v-model="importPassword" 
              type="password" 
              placeholder="输入密码" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <input 
              ref="importFile"
              type="file" 
              accept=".json" 
              @change="handleFileSelect"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-500 file:text-white hover:file:bg-primary-600"
            />
          </div>
          <div v-if="importError" class="text-red-500 text-sm">{{ importError }}</div>
          <div class="flex gap-3 pt-4">
            <button 
              @click="showImportModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
            >
              取消
            </button>
            <button 
              @click="handleImport"
              :disabled="!selectedFile"
              class="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              导入
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { BookOpen, FileText, Wallet, Package, Mail, Cloud, Users, Download, Upload } from 'lucide-vue-next';
import WillEditor from './components/WillEditor.vue';
import FinanceManager from './components/FinanceManager.vue';
import ItemAllocator from './components/ItemAllocator.vue';
import FarewellLetter from './components/FarewellLetter.vue';
import DigitalLegacy from './components/DigitalLegacy.vue';
import Permissions from './components/Permissions.vue';
import { loadData, saveData, exportData, importData, getProgress, defaultData } from './utils/storage';

const currentModule = ref('will');
const data = ref({ ...defaultData });
const progress = ref(0);
const showExportModal = ref(false);
const showImportModal = ref(false);
const exportWithPassword = ref(false);
const exportPassword = ref('');
const exportPasswordConfirm = ref('');
const importWithPassword = ref(false);
const importPassword = ref('');
const importError = ref('');
const selectedFile = ref(null);
const importFile = ref(null);

const navItems = [
  { id: 'will', label: '我的遗嘱', icon: FileText },
  { id: 'finance', label: '财务整理', icon: Wallet },
  { id: 'items', label: '物品分配', icon: Package },
  { id: 'letter', label: '告别信', icon: Mail },
  { id: 'digital', label: '数字遗产', icon: Cloud },
  { id: 'permissions', label: '权限设置', icon: Users },
];

const updateWill = (will) => {
  data.value.will = will;
  saveData(data.value);
  updateProgress();
};

const updateFinance = (finance) => {
  data.value.finance = finance;
  saveData(data.value);
  updateProgress();
};

const updateItems = (items) => {
  data.value.items = items;
  saveData(data.value);
  updateProgress();
};

const updateLetter = (letter) => {
  data.value.farewellLetter = letter;
  saveData(data.value);
  updateProgress();
};

const updateDigital = (digital) => {
  data.value.digitalLegacy = digital;
  saveData(data.value);
  updateProgress();
};

const updatePermissions = (permissions) => {
  data.value.permissions = permissions;
  saveData(data.value);
};

const updateProgress = () => {
  progress.value = getProgress(data.value);
};

const isModuleCompleted = (moduleId) => {
  switch (moduleId) {
    case 'will':
      return data.value.will?.segments?.every(s => s.content.trim()) || false;
    case 'finance':
      return (data.value.finance?.bankAccounts?.length > 0 ||
        data.value.finance?.insurances?.length > 0 ||
        data.value.finance?.debts?.length > 0);
    case 'items':
      return data.value.items?.length > 0;
    case 'letter':
      return data.value.farewellLetter?.content?.trim() || false;
    case 'digital':
      return (data.value.digitalLegacy?.socialAccounts?.length > 0 ||
        data.value.digitalLegacy?.cloudStorages?.length > 0);
    default:
      return true;
  }
};

const handleExport = () => {
  if (exportWithPassword.value) {
    if (exportPassword.value !== exportPasswordConfirm.value) {
      alert('两次输入的密码不一致');
      return;
    }
    exportData(exportPassword.value);
  } else {
    exportData();
  }
  showExportModal.value = false;
  exportPassword.value = '';
  exportPasswordConfirm.value = '';
};

const handleFileSelect = (e) => {
  selectedFile.value = e.target.files[0];
};

const handleImport = async () => {
  try {
    importError.value = '';
    await importData(selectedFile.value, importWithPassword.value ? importPassword.value : null);
    const loaded = loadData();
    data.value = { ...defaultData, ...loaded };
    updateProgress();
    showImportModal.value = false;
    selectedFile.value = null;
    importPassword.value = '';
    alert('导入成功');
  } catch (e) {
    importError.value = e.message;
  }
};

onMounted(() => {
  const loadedData = loadData();
  data.value = { ...defaultData, ...loadedData };
  updateProgress();
});
</script>
