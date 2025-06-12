
import LZString from 'lz-string';
import { ValuationData } from '../components/ValuationGuide';

// Simple checksum function for data integrity
const generateChecksum = (data: string): string => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
};

export const generateRobustShareableUrl = (valuationData: ValuationData): string => {
  try {
    console.log('🔄 Starting robust URL generation...');
    console.log('📝 Input data:', valuationData);
    
    // Create minimal data object
    const shareableData = {
      arrSliderValue: valuationData.arrSliderValue,
      nrr: valuationData.nrr,
      revenueChurn: valuationData.revenueChurn,
      qoqGrowthRate: valuationData.qoqGrowthRate,
      cac: valuationData.cac,
      cacContext: valuationData.cacContext,
      profitability: valuationData.profitability,
      marketGravity: valuationData.marketGravity,
      businessModel: valuationData.businessModel,
      firstName: valuationData.firstName,
      lastName: valuationData.lastName,
      email: valuationData.email,
      phone: valuationData.phone || '',
      companyName: valuationData.companyName,
      website: valuationData.website || '',
      timestamp: new Date().toISOString()
    };

    // Convert to JSON and compress
    const jsonString = JSON.stringify(shareableData);
    console.log('📄 JSON string created, length:', jsonString.length);
    
    // Add checksum for integrity
    const checksum = generateChecksum(jsonString);
    const dataWithChecksum = { data: shareableData, checksum };
    
    // Compress using LZ-String
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(dataWithChecksum));
    console.log('🗜️ Compressed data length:', compressed.length);
    
    // Generate current origin URL
    const baseUrl = `${window.location.origin}/results`;
    const url = new URL(baseUrl);
    url.searchParams.set('d', compressed);
    
    const finalUrl = url.toString();
    console.log('🔗 Generated robust URL:', finalUrl);
    console.log('🔗 URL length:', finalUrl.length);
    
    return finalUrl;
    
  } catch (error) {
    console.error('❌ Error in robust URL generation:', error);
    // Fallback to current origin results page
    return `${window.location.origin}/results`;
  }
};

export const generateExternalShareableUrl = (valuationData: ValuationData): string => {
  try {
    console.log('🌐 Generating external URL for dominatemedia.io...');
    
    // Same compression logic but for external domain
    const shareableData = {
      arrSliderValue: valuationData.arrSliderValue,
      nrr: valuationData.nrr,
      revenueChurn: valuationData.revenueChurn,
      qoqGrowthRate: valuationData.qoqGrowthRate,
      cac: valuationData.cac,
      cacContext: valuationData.cacContext,
      profitability: valuationData.profitability,
      marketGravity: valuationData.marketGravity,
      businessModel: valuationData.businessModel,
      firstName: valuationData.firstName,
      lastName: valuationData.lastName,
      email: valuationData.email,
      phone: valuationData.phone || '',
      companyName: valuationData.companyName,
      website: valuationData.website || '',
      timestamp: new Date().toISOString()
    };

    const jsonString = JSON.stringify(shareableData);
    const checksum = generateChecksum(jsonString);
    const dataWithChecksum = { data: shareableData, checksum };
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(dataWithChecksum));
    
    const externalUrl = `https://dominatemedia.io/unicorn-valuation/results?d=${compressed}`;
    console.log('🌐 External URL generated:', externalUrl);
    
    return externalUrl;
    
  } catch (error) {
    console.error('❌ Error generating external URL:', error);
    return 'https://dominatemedia.io/unicorn-valuation/results';
  }
};

export const decodeRobustUrlData = (encodedData: string): ValuationData | null => {
  try {
    console.log('🔓 Starting robust decode process...');
    console.log('📥 Encoded data received:', encodedData.substring(0, 50) + '...');
    
    if (!encodedData || encodedData.trim() === '') {
      console.error('❌ Empty encoded data');
      return null;
    }

    // Decompress using LZ-String
    const decompressed = LZString.decompressFromEncodedURIComponent(encodedData);
    console.log('🗜️ Decompressed data:', decompressed ? 'Success' : 'Failed');
    
    if (!decompressed) {
      console.error('❌ Failed to decompress data');
      return null;
    }

    // Parse the JSON
    const parsedData = JSON.parse(decompressed);
    console.log('📄 Parsed structure:', Object.keys(parsedData));
    
    // Verify checksum if present
    if (parsedData.checksum && parsedData.data) {
      const expectedChecksum = generateChecksum(JSON.stringify(parsedData.data));
      if (parsedData.checksum !== expectedChecksum) {
        console.warn('⚠️ Checksum mismatch, data may be corrupted');
      } else {
        console.log('✅ Checksum verified');
      }
      
      // Return the actual data
      const validatedData = parsedData.data as ValuationData;
      
      // Validate essential fields
      if (!validatedData.firstName || !validatedData.email || !validatedData.companyName) {
        console.error('❌ Missing essential fields');
        return null;
      }
      
      console.log('✅ Successfully decoded and validated data');
      return validatedData;
    }
    
    // Fallback for data without checksum
    console.log('📦 Processing data without checksum');
    return parsedData as ValuationData;
    
  } catch (error) {
    console.error('❌ Error in robust decode:', error);
    return null;
  }
};

// Test function to validate URL generation and decoding
export const testUrlGeneration = (testData: ValuationData): boolean => {
  try {
    console.log('🧪 Testing URL generation and decoding...');
    
    const url = generateRobustShareableUrl(testData);
    const urlObj = new URL(url);
    const encodedData = urlObj.searchParams.get('d');
    
    if (!encodedData) {
      console.error('❌ No encoded data found in generated URL');
      return false;
    }
    
    const decodedData = decodeRobustUrlData(encodedData);
    
    if (!decodedData) {
      console.error('❌ Failed to decode generated URL');
      return false;
    }
    
    // Compare key fields
    const isValid = decodedData.firstName === testData.firstName &&
                   decodedData.email === testData.email &&
                   decodedData.companyName === testData.companyName &&
                   decodedData.arrSliderValue === testData.arrSliderValue;
    
    console.log('🧪 URL generation test result:', isValid ? 'PASSED' : 'FAILED');
    return isValid;
    
  } catch (error) {
    console.error('❌ URL generation test failed:', error);
    return false;
  }
};
