
import { ValuationData } from '../components/ValuationGuide';

export interface SavedData {
  valuationData: ValuationData;
  currentStep: number;
  isSubmitted: boolean;
  showResultsWaiting?: boolean;
  showResults?: boolean;
  submittedAt?: string; // timestamp when they submitted
}

const COOKIE_NAME = 'valuationData';
const MAX_COOKIE_SIZE = 4000; // 4KB limit minus some buffer

// Helper function to compress data by removing unnecessary fields
const compressData = (data: SavedData): any => {
  const compressed = {
    vd: data.valuationData,
    cs: data.currentStep,
    is: data.isSubmitted,
    srw: data.showResultsWaiting,
    sr: data.showResults,
    sa: data.submittedAt
  };
  
  // Remove empty/default values to save space
  Object.keys(compressed).forEach(key => {
    if (compressed[key] === undefined || compressed[key] === false || compressed[key] === '') {
      delete compressed[key];
    }
  });
  
  return compressed;
};

// Helper function to decompress data
const decompressData = (compressed: any): SavedData => {
  return {
    valuationData: compressed.vd || {},
    currentStep: compressed.cs || 0,
    isSubmitted: compressed.is || false,
    showResultsWaiting: compressed.srw || false,
    showResults: compressed.sr || false,
    submittedAt: compressed.sa
  };
};

// Fallback to localStorage if cookies fail
const saveToLocalStorage = (data: SavedData) => {
  try {
    localStorage.setItem(COOKIE_NAME, JSON.stringify(data));
    console.log('✅ Data saved to localStorage as fallback');
    return true;
  } catch (error) {
    console.error('❌ Failed to save to localStorage:', error);
    return false;
  }
};

const loadFromLocalStorage = (): SavedData | undefined => {
  try {
    const data = localStorage.getItem(COOKIE_NAME);
    if (data) {
      console.log('📦 Loading data from localStorage fallback');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('❌ Failed to load from localStorage:', error);
  }
  return undefined;
};

export const saveValuationData = (data: SavedData) => {
  console.log('💾 Attempting to save valuation data:', data);
  
  try {
    // First try to compress the data
    const compressedData = compressData(data);
    const jsonString = JSON.stringify(compressedData);
    console.log('📊 Data size before encoding:', jsonString.length, 'bytes');
    
    // Check size before encoding
    if (jsonString.length > MAX_COOKIE_SIZE) {
      console.warn('⚠️ Data too large for cookies, using localStorage fallback');
      return saveToLocalStorage(data);
    }
    
    // Encode the data properly
    const encodedValue = encodeURIComponent(jsonString);
    console.log('📊 Encoded data size:', encodedValue.length, 'bytes');
    
    // Final size check after encoding
    if (encodedValue.length > MAX_COOKIE_SIZE) {
      console.warn('⚠️ Encoded data too large for cookies, using localStorage fallback');
      return saveToLocalStorage(data);
    }
    
    // Set the cookie with proper encoding
    const days180 = 60 * 60 * 24 * 180; // 180 days in seconds
    const cookieString = `${COOKIE_NAME}=${encodedValue}; max-age=${days180}; path=/; SameSite=Lax`;
    document.cookie = cookieString;
    
    console.log('🍪 Cookie set with string:', cookieString.substring(0, 100) + '...');
    
    // Immediately verify the cookie was saved
    const verification = loadValuationData();
    if (verification) {
      console.log('✅ Cookie verification successful - data saved and can be read back');
      return true;
    } else {
      console.warn('⚠️ Cookie verification failed, trying localStorage fallback');
      return saveToLocalStorage(data);
    }
    
  } catch (error) {
    console.error('❌ Error saving to cookies:', error);
    console.log('🔄 Falling back to localStorage');
    return saveToLocalStorage(data);
  }
};

export const loadValuationData = (): SavedData | undefined => {
  console.log('📖 Attempting to load valuation data...');
  
  try {
    // First try to load from cookies
    const cookieName = `${COOKIE_NAME}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    
    console.log('🍪 Available cookies:', document.cookie ? 'found cookies' : 'no cookies found');
    
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();
      if (cookie.indexOf(cookieName) === 0) {
        try {
          const cookieValue = cookie.substring(cookieName.length);
          console.log('🔍 Found cookie value (first 50 chars):', cookieValue.substring(0, 50));
          
          // Try to decode and parse
          const decodedValue = decodeURIComponent(cookieValue);
          const parsedData = JSON.parse(decodedValue);
          
          // Check if it's compressed format
          if (parsedData.vd) {
            const decompressed = decompressData(parsedData);
            console.log('✅ Successfully loaded compressed data from cookies');
            return decompressed;
          } else {
            // Legacy format
            console.log('✅ Successfully loaded legacy data from cookies');
            return parsedData;
          }
        } catch (parseError) {
          console.error('❌ Error parsing cookie data:', parseError);
          break;
        }
      }
    }
    
    // If cookies failed, try localStorage
    console.log('🔄 Cookie loading failed, trying localStorage...');
    return loadFromLocalStorage();
    
  } catch (error) {
    console.error('❌ Error loading valuation data:', error);
    return loadFromLocalStorage();
  }
};

export const clearValuationData = () => {
  console.log('🗑️ Clearing valuation data from all storage');
  
  // Clear cookie
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  
  // Clear localStorage
  localStorage.removeItem(COOKIE_NAME);
  localStorage.removeItem('valuation_start_time');
  
  console.log('✅ All valuation data cleared');
};
