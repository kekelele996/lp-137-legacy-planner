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

/**
 * 把任意 Unicode 字符串转成 Base64。
 * 不能直接用 btoa(str)：btoa 只接受 Latin1，含中文时会抛
 * InvalidCharacterError: The string to be encoded contains characters outside of the Latin1 range。
 * 这里先按 UTF-8 编码成字节，再逐块拼成 Latin1 二进制串交给 btoa。
 */
export function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  const CHUNK = 0x8000
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK))
  }
  return btoa(binary)
}

/** utf8ToBase64 的逆运算：Base64 → UTF-8 字符串。 */
export function base64ToUtf8(base64) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new TextDecoder('utf-8').decode(bytes)
}

export function exportData(password = null) {
  const data = loadData()
  let content = JSON.stringify(data, null, 2)

  if (password) {
    content = utf8ToBase64(password + '|' + content)
  }

  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const filename = `life-organizer-backup-${Date.now()}.json`
  const a = document.createElement('a')
  try {
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
  } finally {
    if (a.parentNode) a.parentNode.removeChild(a)
    URL.revokeObjectURL(url)
  }
  return { filename, encrypted: Boolean(password) }
}

export function importData(file, password = null) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        let content = e.target.result
        
        if (password) {
          // 与 exportData 对称：Base64 里存的是 UTF-8 字节，必须按 UTF-8 还原，
          // 否则 atob 得到的是乱码，JSON.parse 会失败或中文丢失。
          const decoded = base64ToUtf8(String(content).trim())
          const separator = decoded.indexOf('|')
          if (separator === -1) {
            reject(new Error('文件格式不正确，不是加密备份文件'))
            return
          }
          if (decoded.slice(0, separator) !== password) {
            reject(new Error('密码错误'))
            return
          }
          content = decoded.slice(separator + 1)
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
