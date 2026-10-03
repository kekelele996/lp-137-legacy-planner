<template>
  <div class="p-8">
    <div class="max-w-5xl mx-auto">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">物品分配</h2>
        <p class="text-gray-500 mt-1">记录珍贵物品的分配意愿</p>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div 
          v-for="item in localData" 
          :key="item.id"
          class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all"
        >
          <div class="relative h-48 bg-gray-100">
            <img 
              v-if="item.image" 
              :src="item.image" 
              :alt="item.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <ImageIcon class="w-12 h-12 text-gray-400" />
            </div>
            <button 
              @click="removeItem(item.id)"
              class="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-all"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
          <div class="p-4">
            <h4 class="font-semibold text-gray-800 mb-2">{{ item.name }}</h4>
            <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <User class="w-4 h-4" />
              <span>{{ item.recipient || '未指定' }}</span>
            </div>
            <p v-if="item.remark" class="text-sm text-gray-500">{{ item.remark }}</p>
          </div>
        </div>

        <div 
          @click="triggerUpload"
          class="bg-white border-2 border-dashed border-gray-300 rounded-xl overflow-hidden cursor-pointer hover:border-primary-400 transition-all min-h-[280px] flex flex-col items-center justify-center"
        >
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Camera class="w-8 h-8 text-gray-400" />
          </div>
          <p class="text-gray-500">添加物品</p>
          <p class="text-sm text-gray-400 mt-1">点击或拖拽上传图片</p>
          <input 
            ref="fileInput"
            type="file" 
            accept="image/*" 
            @change="handleFileUpload"
            class="hidden"
          />
        </div>
      </div>
    </div>

    <div v-if="showDetailModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeDetailModal">
      <div class="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">物品详情</h3>
        <div class="space-y-4">
          <div class="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img 
              v-if="currentItem.image" 
              :src="currentItem.image" 
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <ImageIcon class="w-12 h-12 text-gray-400" />
            </div>
          </div>
          <input 
            v-model="currentItem.name" 
            type="text" 
            placeholder="物品名称" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <input 
            v-model="currentItem.recipient" 
            type="text" 
            placeholder="留给谁" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <textarea 
            v-model="currentItem.remark" 
            rows="3" 
            placeholder="备注信息" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
          ></textarea>
          <div class="flex gap-3 pt-4">
            <button @click="closeDetailModal" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg">取消</button>
            <button @click="saveItem" class="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Camera, X, User, Image as ImageIcon } from 'lucide-vue-next';
import { generateId } from '../utils/storage';

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update']);

const localData = ref([...props.data]);
const fileInput = ref(null);
const showDetailModal = ref(false);
const currentItem = ref({ id: '', name: '', image: '', recipient: '', remark: '' });

const triggerUpload = () => {
  fileInput.value?.click();
};

const handleFileUpload = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      currentItem.value = {
        id: generateId(),
        name: file.name,
        image: event.target.result,
        recipient: '',
        remark: ''
      };
      showDetailModal.value = true;
    };
    reader.readAsDataURL(file);
  }
};

const saveItem = () => {
  const existingIndex = localData.value.findIndex(item => item.id === currentItem.value.id);
  if (existingIndex >= 0) {
    localData.value[existingIndex] = { ...currentItem.value };
  } else {
    localData.value.push({ ...currentItem.value });
  }
  emit('update', [...localData.value]);
  closeDetailModal();
};

const removeItem = (id) => {
  localData.value = localData.value.filter(item => item.id !== id);
  emit('update', [...localData.value]);
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  currentItem.value = { id: '', name: '', image: '', recipient: '', remark: '' };
};

watch(() => props.data, (newData) => {
  localData.value = [...newData];
}, { deep: true });
</script>
