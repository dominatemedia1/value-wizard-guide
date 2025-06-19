import { ValuationData } from '../components/ValuationGuide';

export interface SavedData {
  valuationData: ValuationData;
  currentStep: number;
  isSubmitted: boolean;
  showResultsWaiting?: boolean;
  showResults?: boolean;
  submittedAt?: string;
  version?: string; // Add versioning for future migrations
}

const COOKIE_NAME = 'valuationData';
const STORAGE_VERSION = '1.0';
const MAX_COOKIE_SIZE = 3800; // Conservative size limit
const EXPIRY_DAYS = 180;

// Enhanced compression with validation
const compressData = (data: SavedData): any => {
  try {
    const compressed = {
      v: STORAGE_VERSION, // version
      vd: data.valuationData,
      cs: data.currentStep,
      is: data.isSubmitted,
      srw: data.showResultsWaiting,
      sr: data.showResults,
      sa: data.submittedAt,
      ts: Date.now() // timestamp for debugging
    };
    
    // Remove falsy values to save space
    Object.keys(compressed).forEach(key => {
      const value = compressed[key];
      if (value === undefined || value === false || value === '' || value === 0) {
        delete compressed[key];
      }
    });
    
    return compressed;
  } catch (error) {
    console.error('❌ Error compressing data:', error);
    throw new Error('Failed to compress data');
  }
};

// Enhanced decompression with validation
const decompressData = (compressed: any): SavedData => {
  try {
    // Validate data structure
    if (!compressed || typeof compressed !== 'object') {
      throw new Error('Invalid compressed data format');
    }

    const decompressed: SavedData = {
      valuationData: compressed.vd ||  {
        arrSliderValue: 0,
        nrr: '',
        revenueChurn: '',
        qoqGrowthRate: 0,
        cac: 0,
        cacContext: 'per_customer',
        profitability: '',
        marketGravity: '',
        businessModel: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        companyName: '',
        website: ''
      },
      currentStep: Math.max(0, compressed.cs || 0),
      isSubmitted: Boolean(compressed.is),
      showResultsWaiting: Boolean(compressed.srw),
      showResults: Boolean(compressed.sr),
      submittedAt: compressed.sa,
      version: compressed.v || '1.0'
    };

    // Validate step bounds
    if (decompressed.currentStep > 8) {
      decompressed.currentStep = 0;
    }

    console.log('✅ Successfully decompressed data:', decompressed);
    return decompressed;
  } catch (error) {
    console.error('❌ Error decompressing data:', error);
    throw new Error('Failed to decompress data');
  }
};

// Enhanced localStorage operations with error handling
const saveToLocalStorage = (data: SavedData): boolean => {
  try {
    const serialized = JSON.stringify(data);
    
    // Check localStorage quota
    const testKey = '_test_quota';
    try {
      localStorage.setItem(testKey, serialized);
      localStorage.removeItem(testKey);
    } catch (quotaError) {
      console.warn('⚠️ localStorage quota exceeded, clearing old data');
      // Clear old valuation data and try again
      localStorage.removeItem(COOKIE_NAME);
      localStorage.setItem(COOKIE_NAME, serialized);
    }
    
    localStorage.setItem(COOKIE_NAME, serialized);
    console.log('✅ Data saved to localStorage successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to save to localStorage:', error);
    return false;
  }
};

const loadFromLocalStorage = (): SavedData | undefined => {  
  try {
    const data = localStorage.getItem(COOKIE_NAME);
    console.log('🔍 Raw localStorage data:', data);
    
    if (!data) {
      console.log('📭 No localStorage data found');
      return undefined;
    }
    
    const parsed = JSON.parse(data);
    console.log('📦 Parsed localStorage data:', parsed);
    
    // Validate data before returning
    if (!parsed || typeof parsed !== 'object') {
      console.warn('⚠️ Invalid localStorage data format, clearing');
      localStorage.removeItem(COOKIE_NAME);
      return undefined;
    }
    
    console.log('📦 Successfully loaded data from localStorage');
    return parsed;
  } catch (error) {
    console.error('❌ Failed to load from localStorage:', error);
    // Clear corrupted data
    localStorage.removeItem(COOKIE_NAME);
    return undefined;
  }
};

// Enhanced cookie operations with better error handling
export const saveValuationData = (data: SavedData): boolean => {
  console.log('💾 Starting save operation for valuation data');
  console.log('📊 Data to save:', data);
  
  try {
    // Add timestamp and version info
    const dataWithMeta = {
      ...data,
      version: STORAGE_VERSION,
      lastSaved: new Date().toISOString()
    };
    
    // Compress data
    const compressedData = compressData(dataWithMeta);
    const jsonString = JSON.stringify(compressedData);
    
    console.log(`📊 Compressed data size: ${jsonString.length} bytes`);
    console.log('🔧 Compressed data:', compressedData);
    
    // Try cookies first if data is small enough
    if (jsonString.length <= MAX_COOKIE_SIZE) {
      try {
        const encodedValue = encodeURIComponent(jsonString);
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + EXPIRY_DAYS);
        
        const cookieString = `${COOKIE_NAME}=${encodedValue}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
        document.cookie = cookieString;
        
        console.log('🍪 Attempting to set cookie:', cookieString.substring(0, 100) + '...');
        
        // Verify cookie was set
        const cookieCheck = document.cookie.includes(`${COOKIE_NAME}=`);
        console.log('🔍 Cookie verification result:', cookieCheck);
        console.log('🍪 Current cookies:', document.cookie);
        
        if (cookieCheck) {
          console.log('✅ Data saved to cookies successfully');
          // Also save to localStorage as backup
          saveToLocalStorage(dataWithMeta);
          return true;
        } else {
          throw new Error('Cookie verification failed');
        }
      } catch (cookieError) {
        console.warn('⚠️ Cookie save failed, using localStorage:', cookieError);
        return saveToLocalStorage(dataWithMeta);
      }
    } else {
      console.log('📏 Data too large for cookies, using localStorage');
      return saveToLocalStorage(dataWithMeta);
    }
  } catch (error) {
    console.error('❌ Critical error in saveValuationData:', error);
    return false;
  }
};

export const loadValuationData = (): SavedData | undefined => {
  console.log('📖 Starting load operation for valuation data');
  console.log('🍪 Current cookies:', document.cookie);
  
  try {
    // Try cookies first
    const cookies = document.cookie.split(';');
    console.log('🔍 All cookies:', cookies);
    
    const valuationCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${COOKIE_NAME}=`)
    );
    
    console.log('🎯 Found valuation cookie:', valuationCookie);
    
    if (valuationCookie) {
      try {
        const cookieValue = valuationCookie.split('=').slice(1).join('=').trim();
        console.log('🔓 Cookie value (first 100 chars):', cookieValue.substring(0, 100));
        
        const decodedValue = decodeURIComponent(cookieValue);
        console.log('🔓 Decoded value (first 100 chars):', decodedValue.substring(0, 100));
        
        const parsedData = JSON.parse(decodedValue);
        console.log('🔧 Parsed cookie data:', parsedData);
        
        let result: SavedData;
        if (parsedData.vd || parsedData.v) {
          // Compressed format
          console.log('🗃️ Using compressed format');
          result = decompressData(parsedData);
        } else {
          // Legacy format
          console.log('📜 Using legacy format');
          result = parsedData;
        }
        
        console.log('✅ Successfully loaded data from cookies:', result);
        return result;
      } catch (cookieError) {
        console.warn('⚠️ Cookie parsing failed, trying localStorage:', cookieError);
      }
    } else {
      console.log('🍪 No valuation cookie found');
    }
    
    // Fallback to localStorage
    console.log('🔄 Falling back to localStorage');
    const localData = loadFromLocalStorage();
    if (localData) {
      console.log('✅ Successfully loaded data from localStorage');
      return localData;
    }
    
    console.log('📭 No saved data found in any storage');
    return undefined;
    
  } catch (error) {
    console.error('❌ Critical error in loadValuationData:', error);
    return undefined;
  }
};

export const clearValuationData = (): void => {
  console.log('🗑️ Clearing all valuation data');
  
  try {
    // Clear cookies
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
    
    // Clear localStorage
    localStorage.removeItem(COOKIE_NAME);
    localStorage.removeItem('valuation_start_time');
    
    // Clear any other related storage
    const keysToRemove = Object.keys(localStorage).filter(key => 
      key.startsWith('valuation_') || key.startsWith('webhook_')
    );
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log('✅ All valuation data cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing valuation data:', error);
  }
};

// Utility function to check storage health
export const checkStorageHealth = (): { cookies: boolean; localStorage: boolean } => {
  const testData = { test: 'data', timestamp: Date.now() };
  
  let cookiesWorking = false;
  let localStorageWorking = false;
  
  try {
    // Test cookies
    const testCookie = `test_cookie=${JSON.stringify(testData)}; path=/`;
    document.cookie = testCookie;
    cookiesWorking = document.cookie.includes('test_cookie=');
    if (cookiesWorking) {
      document.cookie = 'test_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    }
  } catch (error) {
    console.warn('Cookie test failed:', error);
  }
  
  try {
    // Test localStorage
    localStorage.setItem('test_storage', JSON.stringify(testData));
    const retrieved = localStorage.getItem('test_storage');
    localStorageWorking = !!retrieved;
    localStorage.removeItem('test_storage');
  } catch (error) {
    console.warn('localStorage test failed:', error);
  }
  
  return { cookies: cookiesWorking, localStorage: localStorageWorking };
};
