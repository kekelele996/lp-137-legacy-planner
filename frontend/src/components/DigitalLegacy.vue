<template>
  <div class="p-8">
    <div class="max-w-5xl mx-auto">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">数字遗产</h2>
        <p class="text-gray-500 mt-1">整理您的数字资产和账号信息</p>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Globe class="w-5 h-5 text-blue-600" />
              社交账号
            </h3>
            <button 
              @click="showSocialModal = true"
              class="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-all"
            >
              <Plus class="w-5 h-5" />
            </button>
          </div>
          
          <div class="space-y-3">
            <div 
              v-for="account in localData.socialAccounts" 
              :key="account.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center" :style="{ background: getPlatformColor(account.platform) }">
                  <component :is="getPlatformIcon(account.platform)" class="w-5 h-5 text-white" />
                </div>
                <div>
                  <p class="font-medium text-gray-800">{{ account.username }}</p>
                  <p class="text-sm text-gray-500">{{ account.platform }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button 
                  @click="editAccount(account, 'social')"
                  class="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded transition-all"
                >
                  <Edit class="w-4 h-4" />
                </button>
                <button 
                  @click="removeAccount(account.id, 'socialAccounts')"
                  class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div v-if="localData.socialAccounts.length === 0" class="text-center py-8 text-gray-400">
              <Globe class="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>暂无社交账号</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <HardDrive class="w-5 h-5 text-green-600" />
              云存储
            </h3>
            <button 
              @click="showCloudModal = true"
              class="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-all"
            >
              <Plus class="w-5 h-5" />
            </button>
          </div>
          
          <div class="space-y-3">
            <div 
              v-for="storage in localData.cloudStorages" 
              :key="storage.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center" :style="{ background: getCloudColor(storage.provider) }">
                  <component :is="getCloudIcon(storage.provider)" class="w-5 h-5 text-white" />
                </div>
                <div>
                  <p class="font-medium text-gray-800">{{ storage.name }}</p>
                  <p class="text-sm text-gray-500">{{ storage.provider }} · {{ storage.size }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button 
                  @click="editAccount(storage, 'cloud')"
                  class="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded transition-all"
                >
                  <Edit class="w-4 h-4" />
                </button>
                <button 
                  @click="removeAccount(storage.id, 'cloudStorages')"
                  class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div v-if="localData.cloudStorages.length === 0" class="text-center py-8 text-gray-400">
              <HardDrive class="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>暂无云存储</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showSocialModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeModals">
      <div class="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">{{ editingSocial ? '编辑账号' : '添加社交账号' }}</h3>
        <div class="space-y-4">
          <select v-model="formData.platform" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
            <option value="">选择平台</option>
            <option value="微信">微信</option>
            <option value="QQ">QQ</option>
            <option value="微博">微博</option>
            <option value="抖音">抖音</option>
            <option value="知乎">知乎</option>
            <option value="GitHub">GitHub</option>
            <option value="其他">其他</option>
          </select>
          <input v-model="formData.username" type="text" placeholder="账号/用户名" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input v-model="formData.email" type="email" placeholder="注册邮箱" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <textarea v-model="formData.remark" rows="2" placeholder="备注信息" class="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"></textarea>
          <div class="flex gap-3 pt-4">
            <button @click="closeModals" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg">取消</button>
            <button @click="saveSocial" class="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg">保存</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showCloudModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeModals">
      <div class="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">{{ editingCloud ? '编辑云存储' : '添加云存储' }}</h3>
        <div class="space-y-4">
          <select v-model="formData.provider" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
            <option value="">选择服务商</option>
            <option value="百度网盘">百度网盘</option>
            <option value="阿里云盘">阿里云盘</option>
            <option value="腾讯微云">腾讯微云</option>
            <option value="Dropbox">Dropbox</option>
            <option value="iCloud">iCloud</option>
            <option value="OneDrive">OneDrive</option>
            <option value="其他">其他</option>
          </select>
          <input v-model="formData.name" type="text" placeholder="存储名称" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input v-model="formData.size" type="text" placeholder="存储容量" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input v-model="formData.email" type="email" placeholder="登录邮箱" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <textarea v-model="formData.remark" rows="2" placeholder="备注信息" class="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"></textarea>
          <div class="flex gap-3 pt-4">
            <button @click="closeModals" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg">取消</button>
            <button @click="saveCloud" class="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Globe, HardDrive, Plus, Edit, Trash2, MessageCircle, Mail, Twitter, Video, MessageSquare, Code, Folder } from 'lucide-vue-next';
import { generateId } from '../utils/storage';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update']);

const localData = ref({ 
  socialAccounts: [], 
  cloudStorages: [],
  ...props.data 
});

const showSocialModal = ref(false);
const showCloudModal = ref(false);
const editingSocial = ref(null);
const editingCloud = ref(null);

const formData = ref({
  platform: '',
  username: '',
  email: '',
  provider: '',
  name: '',
  size: '',
  remark: ''
});

const closeModals = () => {
  showSocialModal.value = false;
  showCloudModal.value = false;
  editingSocial.value = null;
  editingCloud.value = null;
  formData.value = {
    platform: '',
    username: '',
    email: '',
    provider: '',
    name: '',
    size: '',
    remark: ''
  };
};

const editAccount = (account, type) => {
  if (type === 'social') {
    editingSocial.value = account;
    formData.value = {
      platform: account.platform,
      username: account.username,
      email: account.email || '',
      remark: account.remark || ''
    };
    showSocialModal.value = true;
  } else {
    editingCloud.value = account;
    formData.value = {
      provider: account.provider,
      name: account.name,
      size: account.size,
      email: account.email || '',
      remark: account.remark || ''
    };
    showCloudModal.value = true;
  }
};

const saveSocial = () => {
  if (editingSocial.value) {
    const index = localData.value.socialAccounts.findIndex(a => a.id === editingSocial.value.id);
    if (index >= 0) {
      localData.value.socialAccounts[index] = {
        ...editingSocial.value,
        platform: formData.value.platform,
        username: formData.value.username,
        email: formData.value.email,
        remark: formData.value.remark
      };
    }
  } else {
    localData.value.socialAccounts.push({
      id: generateId(),
      platform: formData.value.platform,
      username: formData.value.username,
      email: formData.value.email,
      remark: formData.value.remark
    });
  }
  emit('update', { ...localData.value });
  closeModals();
};

const saveCloud = () => {
  if (editingCloud.value) {
    const index = localData.value.cloudStorages.findIndex(s => s.id === editingCloud.value.id);
    if (index >= 0) {
      localData.value.cloudStorages[index] = {
        ...editingCloud.value,
        provider: formData.value.provider,
        name: formData.value.name,
        size: formData.value.size,
        email: formData.value.email,
        remark: formData.value.remark
      };
    }
  } else {
    localData.value.cloudStorages.push({
      id: generateId(),
      provider: formData.value.provider,
      name: formData.value.name,
      size: formData.value.size,
      email: formData.value.email,
      remark: formData.value.remark
    });
  }
  emit('update', { ...localData.value });
  closeModals();
};

const removeAccount = (id, type) => {
  localData.value[type] = localData.value[type].filter(item => item.id !== id);
  emit('update', { ...localData.value });
};

const platformIcons = {
  '微信': MessageCircle,
  'QQ': Mail,
  '微博': Twitter,
  '抖音': Video,
  '知乎': MessageSquare,
  'GitHub': Code,
  '其他': Globe
};

const cloudIcons = {
  '百度网盘': Folder,
  '阿里云盘': Folder,
  '腾讯微云': Folder,
  'Dropbox': Folder,
  'iCloud': Folder,
  'OneDrive': Folder,
  '其他': HardDrive
};

const getPlatformIcon = (platform) => platformIcons[platform] || Globe;
const getCloudIcon = (provider) => cloudIcons[provider] || HardDrive;

const getPlatformColor = (platform) => {
  const colors = {
    '微信': '#07C160',
    'QQ': '#12B7F5',
    '微博': '#E6162D',
    '抖音': '#000000',
    '知乎': '#0077E6',
    'GitHub': '#333333',
    '其他': '#6B7280'
  };
  return colors[platform] || '#6B7280';
};

const getCloudColor = (provider) => {
  const colors = {
    '百度网盘': '#2319DC',
    '阿里云盘': '#FF6A00',
    '腾讯微云': '#12B7F5',
    'Dropbox': '#0061FF',
    'iCloud': '#333333',
    'OneDrive': '#0078D4',
    '其他': '#6B7280'
  };
  return colors[provider] || '#6B7280';
};

watch(() => props.data, (newData) => {
  localData.value = { 
    socialAccounts: [], 
    cloudStorages: [],
    ...newData 
  };
}, { deep: true });
</script>
