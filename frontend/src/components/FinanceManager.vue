<template>
  <div class="p-8">
    <div class="max-w-5xl mx-auto">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">财务整理</h2>
        <p class="text-gray-500 mt-1">记录您的财务信息，方便家人查阅</p>
      </div>

      <div class="grid grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard class="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">银行账户</p>
              <p class="text-xl font-bold text-gray-800">{{ localData.bankAccounts.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield class="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">保险保单</p>
              <p class="text-xl font-bold text-gray-800">{{ localData.insurances.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle class="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">债务记录</p>
              <p class="text-xl font-bold text-gray-800">{{ localData.debts.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CreditCard class="w-5 h-5 text-blue-600" />
          银行账户
        </h3>
        <div class="space-y-4">
          <div 
            v-for="account in localData.bankAccounts" 
            :key="account.id"
            class="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-between"
          >
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span class="font-semibold text-gray-800">{{ account.bank }}</span>
                <span class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{{ account.type }}</span>
              </div>
              <p class="text-gray-600">账户号: {{ account.accountNumber }}</p>
              <p v-if="account.balance" class="text-gray-500 text-sm">余额: {{ account.balance }}</p>
              <p v-if="account.remark" class="text-gray-500 text-sm mt-1">备注: {{ account.remark }}</p>
            </div>
            <button 
              @click="removeAccount(account.id, 'bankAccounts')"
              class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
          <button 
            @click="showBankModal = true"
            class="w-full bg-white border border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-400 transition-all"
          >
            <Plus class="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-500">添加银行账户</p>
          </button>
        </div>
      </div>

      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Shield class="w-5 h-5 text-green-600" />
          保险保单
        </h3>
        <div class="space-y-4">
          <div 
            v-for="insurance in localData.insurances" 
            :key="insurance.id"
            class="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-between"
          >
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span class="font-semibold text-gray-800">{{ insurance.company }}</span>
                <span class="px-2 py-0.5 bg-green-100 text-green-600 rounded text-xs">{{ insurance.type }}</span>
              </div>
              <p class="text-gray-600">保单号: {{ insurance.policyNumber }}</p>
              <p v-if="insurance.amount" class="text-gray-500 text-sm">保额: {{ insurance.amount }}</p>
              <p v-if="insurance.remark" class="text-gray-500 text-sm mt-1">备注: {{ insurance.remark }}</p>
            </div>
            <button 
              @click="removeAccount(insurance.id, 'insurances')"
              class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
          <button 
            @click="showInsuranceModal = true"
            class="w-full bg-white border border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-400 transition-all"
          >
            <Plus class="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-500">添加保险保单</p>
          </button>
        </div>
      </div>

      <div>
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <AlertCircle class="w-5 h-5 text-red-600" />
          债务记录
        </h3>
        <div class="space-y-4">
          <div 
            v-for="debt in localData.debts" 
            :key="debt.id"
            class="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-between"
          >
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span class="font-semibold text-gray-800">{{ debt.creditor }}</span>
              </div>
              <p class="text-gray-600">金额: {{ debt.amount }}</p>
              <p v-if="debt.dueDate" class="text-gray-500 text-sm">到期日: {{ debt.dueDate }}</p>
              <p v-if="debt.remark" class="text-gray-500 text-sm mt-1">备注: {{ debt.remark }}</p>
            </div>
            <button 
              @click="removeAccount(debt.id, 'debts')"
              class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
          <button 
            @click="showDebtModal = true"
            class="w-full bg-white border border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-400 transition-all"
          >
            <Plus class="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-500">添加债务记录</p>
          </button>
        </div>
      </div>
    </div>

    <div v-if="showBankModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeAllModals">
      <div class="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">添加银行账户</h3>
        <div class="space-y-4">
          <input v-model="formData.bank" type="text" placeholder="银行名称" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <select v-model="formData.type" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
            <option value="">账户类型</option>
            <option value="储蓄卡">储蓄卡</option>
            <option value="信用卡">信用卡</option>
            <option value="活期存款">活期存款</option>
            <option value="定期存款">定期存款</option>
            <option value="其他">其他</option>
          </select>
          <input v-model="formData.accountNumber" type="text" placeholder="账户号码" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input v-model="formData.balance" type="text" placeholder="账户余额" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <textarea v-model="formData.remark" rows="2" placeholder="备注信息" class="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"></textarea>
          <div class="flex gap-3 pt-4">
            <button @click="closeAllModals" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg">取消</button>
            <button @click="addAccount('bankAccounts')" class="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg">添加</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showInsuranceModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeAllModals">
      <div class="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">添加保险保单</h3>
        <div class="space-y-4">
          <input v-model="formData.company" type="text" placeholder="保险公司" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <select v-model="formData.type" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
            <option value="">保险类型</option>
            <option value="人寿保险">人寿保险</option>
            <option value="医疗保险">医疗保险</option>
            <option value="意外保险">意外保险</option>
            <option value="财产保险">财产保险</option>
            <option value="其他">其他</option>
          </select>
          <input v-model="formData.policyNumber" type="text" placeholder="保单号码" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input v-model="formData.amount" type="text" placeholder="保险金额" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <textarea v-model="formData.remark" rows="2" placeholder="备注信息" class="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"></textarea>
          <div class="flex gap-3 pt-4">
            <button @click="closeAllModals" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg">取消</button>
            <button @click="addAccount('insurances')" class="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg">添加</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDebtModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeAllModals">
      <div class="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">添加债务记录</h3>
        <div class="space-y-4">
          <input v-model="formData.creditor" type="text" placeholder="债权人姓名" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input v-model="formData.amount" type="text" placeholder="债务金额" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input v-model="formData.dueDate" type="date" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <textarea v-model="formData.remark" rows="2" placeholder="备注信息" class="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"></textarea>
          <div class="flex gap-3 pt-4">
            <button @click="closeAllModals" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg">取消</button>
            <button @click="addAccount('debts')" class="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg">添加</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { CreditCard, Shield, AlertCircle, Plus, Trash2 } from 'lucide-vue-next';
import { generateId } from '../utils/storage';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update']);

const localData = ref({ 
  bankAccounts: [], 
  insurances: [], 
  debts: [],
  ...props.data 
});

const showBankModal = ref(false);
const showInsuranceModal = ref(false);
const showDebtModal = ref(false);

const formData = ref({
  bank: '',
  type: '',
  accountNumber: '',
  balance: '',
  company: '',
  policyNumber: '',
  creditor: '',
  dueDate: '',
  remark: ''
});

const closeAllModals = () => {
  showBankModal.value = false;
  showInsuranceModal.value = false;
  showDebtModal.value = false;
  formData.value = {
    bank: '',
    type: '',
    accountNumber: '',
    balance: '',
    company: '',
    policyNumber: '',
    creditor: '',
    dueDate: '',
    remark: ''
  };
};

const addAccount = (type) => {
  const newItem = { id: generateId() };
  
  if (type === 'bankAccounts') {
    newItem.bank = formData.value.bank;
    newItem.type = formData.value.type;
    newItem.accountNumber = formData.value.accountNumber;
    newItem.balance = formData.value.balance;
    newItem.remark = formData.value.remark;
    localData.value.bankAccounts.push(newItem);
  } else if (type === 'insurances') {
    newItem.company = formData.value.company;
    newItem.type = formData.value.type;
    newItem.policyNumber = formData.value.policyNumber;
    newItem.amount = formData.value.amount;
    newItem.remark = formData.value.remark;
    localData.value.insurances.push(newItem);
  } else if (type === 'debts') {
    newItem.creditor = formData.value.creditor;
    newItem.amount = formData.value.amount;
    newItem.dueDate = formData.value.dueDate;
    newItem.remark = formData.value.remark;
    localData.value.debts.push(newItem);
  }
  
  emit('update', { ...localData.value });
  closeAllModals();
};

const removeAccount = (id, type) => {
  localData.value[type] = localData.value[type].filter(item => item.id !== id);
  emit('update', { ...localData.value });
};

watch(() => props.data, (newData) => {
  localData.value = { 
    bankAccounts: [], 
    insurances: [], 
    debts: [],
    ...newData 
  };
}, { deep: true });
</script>
