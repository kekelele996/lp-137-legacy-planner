const { describe, it, expect, beforeEach } = require('@jest/globals');

const defaultData = {
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
};

const STORAGE_KEY = 'life-organizer-data';

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load data:', e);
  }
  return { ...defaultData };
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Failed to save data:', e);
    return false;
  }
}

function getProgress(data) {
  let total = 0;
  let completed = 0;
  
  if (data.will?.segments) {
    total += data.will.segments.length;
    completed += data.will.segments.filter(s => s.content.trim()).length;
  }
  
  if (data.finance?.bankAccounts) {
    total += Math.max(1, data.finance.bankAccounts.length);
    completed += data.finance.bankAccounts.length > 0 ? 1 : 0;
  }
  
  if (data.finance?.insurances) {
    total += Math.max(1, data.finance.insurances.length);
    completed += data.finance.insurances.length > 0 ? 1 : 0;
  }
  
  if (data.finance?.debts) {
    total += Math.max(1, data.finance.debts.length);
    completed += data.finance.debts.length > 0 ? 1 : 0;
  }
  
  if (data.items) {
    total += Math.max(1, data.items.length);
    completed += data.items.length > 0 ? 1 : 0;
  }
  
  if (data.farewellLetter?.content) {
    total += 1;
    completed += data.farewellLetter.content.trim() ? 1 : 0;
  }
  
  if (data.digitalLegacy?.socialAccounts) {
    total += Math.max(1, data.digitalLegacy.socialAccounts.length);
    completed += data.digitalLegacy.socialAccounts.length > 0 ? 1 : 0;
  }
  
  if (data.digitalLegacy?.cloudStorages) {
    total += Math.max(1, data.digitalLegacy.cloudStorages.length);
    completed += data.digitalLegacy.cloudStorages.length > 0 ? 1 : 0;
  }
  
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

function generateId() {
  return Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

describe('Storage Utility Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('defaultData', () => {
    it('should have all required modules', () => {
      expect(defaultData).toHaveProperty('will');
      expect(defaultData).toHaveProperty('finance');
      expect(defaultData).toHaveProperty('items');
      expect(defaultData).toHaveProperty('farewellLetter');
      expect(defaultData).toHaveProperty('digitalLegacy');
      expect(defaultData).toHaveProperty('permissions');
    });

    it('should have proper will structure with segments', () => {
      expect(Array.isArray(defaultData.will.segments)).toBe(true);
      expect(defaultData.will.segments.length).toBe(6);
      expect(defaultData.will.segments[0]).toHaveProperty('id');
      expect(defaultData.will.segments[0]).toHaveProperty('title');
      expect(defaultData.will.segments[0]).toHaveProperty('content');
      expect(defaultData.will.segments[0]).toHaveProperty('completed');
    });

    it('should have proper finance structure', () => {
      expect(defaultData.finance.bankAccounts).toEqual([]);
      expect(defaultData.finance.insurances).toEqual([]);
      expect(defaultData.finance.debts).toEqual([]);
    });

    it('should have proper farewellLetter structure', () => {
      expect(defaultData.farewellLetter.content).toBe('');
      expect(defaultData.farewellLetter.recipient).toBe('');
      expect(defaultData.farewellLetter.lastSaved).toBeNull();
    });
  });

  describe('loadData', () => {
    it('should return defaultData when localStorage is empty', () => {
      const data = loadData();
      expect(data).toEqual(defaultData);
    });

    it('should return stored data when localStorage has data', () => {
      const customData = { ...defaultData, will: { ...defaultData.will, lastSaved: '2024-01-01' } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customData));
      
      const data = loadData();
      expect(data.will.lastSaved).toBe('2024-01-01');
    });

    it('should return defaultData when localStorage has invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json');
      
      const data = loadData();
      expect(data).toEqual(defaultData);
    });
  });

  describe('saveData', () => {
    it('should save data to localStorage', () => {
      const data = { ...defaultData };
      const result = saveData(data);
      
      expect(result).toBe(true);
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toBe(JSON.stringify(data));
    });

    it('should return false on error', () => {
      const mockSetItem = jest.fn(() => { throw new Error('Storage full'); });
      Object.defineProperty(global, 'localStorage', {
        value: {
          getItem: () => null,
          setItem: mockSetItem,
          clear: () => {}
        },
        writable: true
      });
      
      const result = saveData(defaultData);
      expect(result).toBe(false);
    });
  });

  describe('getProgress', () => {
    it('should return 0 for empty data', () => {
      const progress = getProgress(defaultData);
      expect(progress).toBe(0);
    });

    it('should calculate progress correctly', () => {
      const data = {
        ...defaultData,
        will: {
          ...defaultData.will,
          segments: [
            { id: 1, title: '前言', content: '内容', completed: true },
            { id: 2, title: '家庭情况', content: '', completed: false },
            { id: 3, title: '财产分配', content: '', completed: false },
            { id: 4, title: '债务处理', content: '', completed: false },
            { id: 5, title: '其他事项', content: '', completed: false },
            { id: 6, title: '签名日期', content: '', completed: false },
          ]
        },
        farewellLetter: {
          ...defaultData.farewellLetter,
          content: '这是一封信'
        }
      };
      
      const progress = getProgress(data);
      expect(progress).toBeGreaterThan(0);
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('should generate valid IDs', () => {
      const id = generateId();
      expect(id).toBeTruthy();
      expect(typeof id).toBe('string');
    });
  });
});
