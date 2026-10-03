<template>
  <div class="p-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">我的遗嘱</h2>
          <p class="text-gray-500 mt-1">分段记录您的遗愿和安排</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500">{{ lastSavedText }}</span>
          <button 
            @click="saveDraft"
            class="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
          >
            <Save class="w-4 h-4" />
            保存草稿
          </button>
        </div>
      </div>

      <div class="space-y-6">
        <div 
          v-for="(segment, index) in localData.segments" 
          :key="segment.id"
          class="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all hover:shadow-md"
          :class="{ 'border-amber-300 bg-amber-50': !segment.content.trim() }"
        >
          <div class="flex items-center gap-4 px-6 py-4 border-b border-gray-200">
            <span class="w-8 h-8 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full text-sm font-medium">
              {{ index + 1 }}
            </span>
            <input 
              :value="segment.title"
              @input="updateSegmentTitle(index, $event.target.value)"
              type="text"
              class="flex-1 bg-transparent text-lg font-semibold text-gray-800 focus:outline-none"
              placeholder="段落标题"
            />
            <button 
              @click="toggleComplete(index)"
              class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all"
              :class="segment.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              <Check v-if="segment.completed" class="w-4 h-4" />
              <Circle v-else class="w-4 h-4" />
              {{ segment.completed ? '已完成' : '未完成' }}
            </button>
          </div>
          <div class="p-6">
            <textarea 
              :value="segment.content"
              @input="updateSegmentContent(index, $event.target.value)"
              rows="6"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              :placeholder="`请输入${segment.title}的内容...`"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="mt-8 bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
        <FileText class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 mb-4">遗嘱是一份严肃的法律文件</p>
        <p class="text-sm text-gray-400">建议在完成后咨询专业法律人士进行公证</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, shallowRef } from 'vue';
import { Save, Check, Circle, FileText } from 'lucide-vue-next';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update']);

const localData = shallowRef({ 
  segments: [],
  lastSaved: null
});

const initLocalData = (sourceData) => {
  localData.value = {
    segments: sourceData.segments?.map(s => ({ ...s })) || [],
    lastSaved: sourceData.lastSaved || null
  };
};

initLocalData(props.data);

const lastSavedText = computed(() => {
  if (localData.value.lastSaved) {
    return `上次保存: ${new Date(localData.value.lastSaved).toLocaleString('zh-CN')}`;
  }
  return '尚未保存';
});

const updateSegmentTitle = (index, title) => {
  localData.value.segments[index].title = title;
  emitUpdate();
};

const updateSegmentContent = (index, content) => {
  localData.value.segments[index].content = content;
  emitUpdate();
};

const toggleComplete = (index) => {
  localData.value.segments[index].completed = !localData.value.segments[index].completed;
  emitUpdate();
};

const saveDraft = () => {
  localData.value.lastSaved = new Date().toISOString();
  emitUpdate();
};

const emitUpdate = () => {
  emit('update', { ...localData.value });
};

watch(() => props.data, (newData) => {
  initLocalData(newData);
}, { deep: true });
</script>
