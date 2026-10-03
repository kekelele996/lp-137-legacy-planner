<template>
  <div class="p-8">
    <div class="max-w-3xl mx-auto">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">权限设置</h2>
        <p class="text-gray-500 mt-1">设置谁可以查看您的人生整理资料</p>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Users class="w-5 h-5 text-primary-600" />
          查看人员
        </h3>
        
        <div class="space-y-3">
          <div 
            v-for="viewer in localData.viewers" 
            :key="viewer.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <User class="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p class="font-medium text-gray-800">{{ viewer.name }}</p>
                <p class="text-sm text-gray-500">{{ viewer.relationship }}</p>
              </div>
            </div>
            <button 
              @click="removeViewer(viewer.id)"
              class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
          
          <button 
            @click="showViewerModal = true"
            class="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-primary-400 transition-all"
          >
            <Plus class="w-6 h-6 text-gray-400 mx-auto mb-1" />
            <span class="text-gray-500">添加查看人员</span>
          </button>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Clock class="w-5 h-5 text-primary-600" />
          查看时间设置
        </h3>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium text-gray-800">指定查看时间</p>
              <p class="text-sm text-gray-500">设置资料何时可以被查看</p>
            </div>
            <button 
              @click="showTimeModal = true"
              class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
            >
              {{ localData.viewTime ? '修改时间' : '设置时间' }}
            </button>
          </div>
          
          <div v-if="localData.viewTime" class="p-4 bg-green-50 rounded-lg border border-green-200">
            <div class="flex items-center gap-3">
              <CheckCircle class="w-5 h-5 text-green-600" />
              <div>
                <p class="font-medium text-green-800">查看时间已设置</p>
                <p class="text-sm text-green-600">{{ formatViewTime }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-amber-50 rounded-xl border border-amber-200 p-6">
        <div class="flex items-start gap-3">
          <AlertTriangle class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-medium text-amber-800 mb-1">重要提示</p>
            <p class="text-sm text-amber-700">
              本工具的数据仅存储在您的设备本地，建议定期导出备份。您可以设置查看人员和查看时间，
              但请确保将备份文件交给可信赖的人保管。
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showViewerModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeModals">
      <div class="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">{{ editingViewer ? '编辑人员' : '添加查看人员' }}</h3>
        <div class="space-y-4">
          <input v-model="formData.name" type="text" placeholder="姓名" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <select v-model="formData.relationship" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
            <option value="">关系</option>
            <option value="配偶">配偶</option>
            <option value="子女">子女</option>
            <option value="父母">父母</option>
            <option value="兄弟姐妹">兄弟姐妹</option>
            <option value="朋友">朋友</option>
            <option value="其他">其他</option>
          </select>
          <input v-model="formData.contact" type="text" placeholder="联系方式（选填）" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <div class="flex gap-3 pt-4">
            <button @click="closeModals" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg">取消</button>
            <button @click="saveViewer" class="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg">保存</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showTimeModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeModals">
      <div class="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">设置查看时间</h3>
        <div class="space-y-4">
          <div>
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="timeType" type="radio" value="immediate" class="w-4 h-4 text-primary-500" />
              <span class="text-gray-700">立即可见</span>
            </label>
          </div>
          <div>
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="timeType" type="radio" value="date" class="w-4 h-4 text-primary-500" />
              <span class="text-gray-700">指定日期</span>
            </label>
          </div>
          <div>
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="timeType" type="radio" value="condition" class="w-4 h-4 text-primary-500" />
              <span class="text-gray-700">满足条件时（需手动开启）</span>
            </label>
          </div>
          
          <div v-if="timeType === 'date'" class="pt-2">
            <input 
              v-model="formData.viewDate" 
              type="date" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div class="flex gap-3 pt-4">
            <button @click="closeModals" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg">取消</button>
            <button @click="saveTime" class="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Users, User, Clock, Plus, Trash2, CheckCircle, AlertTriangle } from 'lucide-vue-next';
import { generateId } from '../utils/storage';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update']);

const localData = ref({ 
  viewers: [], 
  viewTime: null,
  ...props.data 
});

const showViewerModal = ref(false);
const showTimeModal = ref(false);
const editingViewer = ref(null);
const timeType = ref('immediate');

const formData = ref({
  name: '',
  relationship: '',
  contact: '',
  viewDate: ''
});

const closeModals = () => {
  showViewerModal.value = false;
  showTimeModal.value = false;
  editingViewer.value = null;
  timeType.value = 'immediate';
  formData.value = {
    name: '',
    relationship: '',
    contact: '',
    viewDate: ''
  };
};

const saveViewer = () => {
  if (editingViewer.value) {
    const index = localData.value.viewers.findIndex(v => v.id === editingViewer.value.id);
    if (index >= 0) {
      localData.value.viewers[index] = {
        ...editingViewer.value,
        name: formData.value.name,
        relationship: formData.value.relationship,
        contact: formData.value.contact
      };
    }
  } else {
    localData.value.viewers.push({
      id: generateId(),
      name: formData.value.name,
      relationship: formData.value.relationship,
      contact: formData.value.contact
    });
  }
  emit('update', { ...localData.value });
  closeModals();
};

const removeViewer = (id) => {
  localData.value.viewers = localData.value.viewers.filter(v => v.id !== id);
  emit('update', { ...localData.value });
};

const saveTime = () => {
  let viewTime = null;
  if (timeType.value === 'immediate') {
    viewTime = { type: 'immediate' };
  } else if (timeType.value === 'date' && formData.value.viewDate) {
    viewTime = { type: 'date', date: formData.value.viewDate };
  } else if (timeType.value === 'condition') {
    viewTime = { type: 'condition' };
  }
  localData.value.viewTime = viewTime;
  emit('update', { ...localData.value });
  closeModals();
};

const formatViewTime = computed(() => {
  if (!localData.value.viewTime) return '';
  
  const { type, date } = localData.value.viewTime;
  if (type === 'immediate') return '资料可立即查看';
  if (type === 'date' && date) return `资料将于 ${date} 开放查看`;
  if (type === 'condition') return '资料将在满足条件时开放查看（需手动开启）';
  return '';
});

watch(() => props.data, (newData) => {
  localData.value = { 
    viewers: [], 
    viewTime: null,
    ...newData 
  };
}, { deep: true });
</script>
