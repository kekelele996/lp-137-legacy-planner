<template>
  <div class="p-8">
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">告别信</h2>
          <p class="text-gray-500 mt-1">写给家人的温暖留言</p>
        </div>
        <span class="text-sm text-gray-500">{{ lastSavedText }}</span>
      </div>

      <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="letter-bg min-h-[600px] p-12">
          <div class="max-w-2xl mx-auto">
            <div class="text-right mb-8">
              <input 
                :value="localData.recipient"
                @input="updateRecipient($event.target.value)"
                type="text"
                class="bg-transparent text-xl font-medium text-gray-700 focus:outline-none border-b border-transparent focus:border-primary-400"
                placeholder="致我的家人"
              />
            </div>
            
            <textarea 
              :value="localData.content"
              @input="updateContent($event.target.value)"
              rows="15"
              class="w-full bg-transparent text-gray-700 text-lg leading-relaxed focus:outline-none resize-none letter-text"
              placeholder="在这里写下想对家人说的话...

这是一封承载着我深情的信，希望当你读到它时，能感受到我对你的爱和思念。

人生短暂，但我们在一起的时光是我最珍贵的回忆。请记得，无论我身在何方，我的爱永远陪伴着你。

愿你健康快乐，平安顺遂。

永远爱你的"
            ></textarea>

            <div class="mt-8 text-right">
              <p class="text-gray-500 text-sm">{{ formatDate }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 bg-white rounded-xl border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">信纸样式</h3>
        <div class="flex gap-4">
          <button 
            v-for="style in letterStyles" 
            :key="style.id"
            @click="currentStyle = style.id"
            class="flex-1 p-4 rounded-lg border-2 transition-all"
            :class="currentStyle === style.id ? 'border-primary-500 shadow-md' : 'border-gray-200 hover:border-gray-300'"
          >
            <div 
              class="h-16 rounded mb-2"
              :style="{ background: style.bg }"
            ></div>
            <p class="text-sm text-gray-600">{{ style.name }}</p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, shallowRef } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update']);

const localData = shallowRef({ 
  content: '', 
  recipient: '',
  lastSaved: null
});

const initLocalData = (sourceData) => {
  localData.value = {
    content: sourceData.content || '',
    recipient: sourceData.recipient || '',
    lastSaved: sourceData.lastSaved || null
  };
};

initLocalData(props.data);

const currentStyle = ref('classic');

const letterStyles = [
  { id: 'classic', name: '经典米黄', bg: 'linear-gradient(to bottom, #fdf8f3, #f5ebe0)' },
  { id: 'warm', name: '温暖橙黄', bg: 'linear-gradient(to bottom, #fff8f0, #ffeedd)' },
  { id: 'soft', name: '柔和粉红', bg: 'linear-gradient(to bottom, #fff5f8, #ffeef4)' },
  { id: 'elegant', name: '优雅浅蓝', bg: 'linear-gradient(to bottom, #f0f7ff, #e6f0fa)' },
];

const lastSavedText = computed(() => {
  if (localData.value.lastSaved) {
    return `上次保存: ${new Date(localData.value.lastSaved).toLocaleString('zh-CN')}`;
  }
  return '尚未保存';
});

const formatDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

const updateRecipient = (value) => {
  localData.value.recipient = value;
  emitUpdate();
};

const updateContent = (value) => {
  localData.value.content = value;
  emitUpdate();
};

const emitUpdate = () => {
  emit('update', { 
    ...localData.value,
    lastSaved: new Date().toISOString()
  });
};

watch(() => props.data, (newData) => {
  initLocalData(newData);
}, { deep: true });
</script>

<style scoped>
.letter-text {
  font-family: 'Noto Serif SC', 'Source Han Serif SC', serif;
}
</style>
