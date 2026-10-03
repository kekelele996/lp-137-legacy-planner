const STORAGE_KEY = 'life-organizer-data'
const BACKUP_KEY = 'life-organizer-backup'

export const defaultData = {
  will: {
    segments: [
      { id: 1, title: '前言', content: '', completed: false },
      { id: 2, title: '家庭情况', content: '', completed: false },
      { id: 3, title: '财产分配', content: '', completed: false },
      { id: 4, title: '债务处理', content: '', completed: false },
      { id: 5, title: '其他事项', content: '', completed: false },
      { id: 6, title: '签名日期', content: '', completed: false },
    ],
    lastSaved: null
  },
  finance: {
    bankAccounts: [],
    insurances: [],
    debts: []
  },
  items: [],
  farewellLetter: {
    content: '',
    recipient: '',
    lastSaved: null
  },
  digitalLegacy: {
    socialAccounts: [],
    cloudStorages: []
  },
  permissions: {
    viewers: [],
    viewTime: null
  }
}

export function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load data:', e)
  }
  return { ...defaultData }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch (e) {
    console.error('Failed to save data:', e)
    return false
  }
}

export function exportData(password = null) {
  const data = loadData()
  let content = JSON.stringify(data, null, 2)
  
  if (password) {
    content = btoa(password + '|' + content)
  }
  
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `life-organizer-backup-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function importData(file, password = null) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        let content = e.target.result
        
        if (password) {
          const decoded = atob(content)
          const [pwd, dataStr] = decoded.split('|')
          if (pwd !== password) {
            reject(new Error('密码错误'))
            return
          }
          content = dataStr
        }
        
        const data = JSON.parse(content)
        saveData(data)
        resolve(data)
      } catch (e) {
        reject(new Error('导入失败，请检查文件格式和密码'))
      }
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsText(file)
  })
}

export function getProgress(data) {
  let total = 0
  let completed = 0
  
  if (data.will?.segments) {
    total += data.will.segments.length
    completed += data.will.segments.filter(s => s.content.trim()).length
  }
  
  if (data.finance?.bankAccounts) {
    total += Math.max(1, data.finance.bankAccounts.length)
    completed += data.finance.bankAccounts.length > 0 ? 1 : 0
  }
  
  if (data.finance?.insurances) {
    total += Math.max(1, data.finance.insurances.length)
    completed += data.finance.insurances.length > 0 ? 1 : 0
  }
  
  if (data.finance?.debts) {
    total += Math.max(1, data.finance.debts.length)
    completed += data.finance.debts.length > 0 ? 1 : 0
  }
  
  if (data.items) {
    total += Math.max(1, data.items.length)
    completed += data.items.length > 0 ? 1 : 0
  }
  
  if (data.farewellLetter?.content) {
    total += 1
    completed += data.farewellLetter.content.trim() ? 1 : 0
  }
  
  if (data.digitalLegacy?.socialAccounts) {
    total += Math.max(1, data.digitalLegacy.socialAccounts.length)
    completed += data.digitalLegacy.socialAccounts.length > 0 ? 1 : 0
  }
  
  if (data.digitalLegacy?.cloudStorages) {
    total += Math.max(1, data.digitalLegacy.cloudStorages.length)
    completed += data.digitalLegacy.cloudStorages.length > 0 ? 1 : 0
  }
  
  return total > 0 ? Math.round((completed / total) * 100) : 0
}

export function generateId() {
  return Date.now() + '-' + Math.random().toString(36).substr(2, 9)
}
