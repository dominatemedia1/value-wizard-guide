
import { ValuationData } from '../components/ValuationGuide';

export const generateShareableUrl = (valuationData: ValuationData, baseUrl: string = 'https://www.dominatemedia.io/unicorn-valuation/results'): string => {
  try {
    console.log('🔄 Starting simplified URL generation...');
    console.log('📝 Input valuation data:', valuationData);
    
    // Create a minimal data object with only essential fields
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

    console.log('📦 Prepared shareable data:', shareableData);

    // Convert to JSON string
    const jsonString = JSON.stringify(shareableData);
    console.log('📄 JSON string length:', jsonString.length);

    // Simple base64 encoding
    const base64Data = btoa(jsonString);
    console.log('🔒 Base64 encoded length:', base64Data.length);

    // Make URL-safe
    const urlSafeData = base64Data
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    console.log('🌐 URL-safe data length:', urlSafeData.length);
    
    // Create the URL with the encoded data
    const url = new URL(baseUrl);
    url.searchParams.set('data', urlSafeData);
    
    const finalUrl = url.toString();
    console.log('🔗 Final shareable URL:', finalUrl);
    
    return finalUrl;
    
  } catch (error) {
    console.error('❌ Error generating shareable URL:', error);
    return baseUrl;
  }
};

export const generateLocalResultsUrl = (valuationData: ValuationData): string => {
  try {
    console.log('🏠 Generating local results URL...');
    
    // Get current origin and create results URL with data
    const baseUrl = `${window.location.origin}/results`;
    
    // Use the same encoding as generateShareableUrl
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
    const base64Data = btoa(jsonString);
    const urlSafeData = base64Data
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    const url = new URL(baseUrl);
    url.searchParams.set('data', urlSafeData);
    
    const finalUrl = url.toString();
    console.log('🏠 Generated local results URL:', finalUrl);
    
    return finalUrl;
  } catch (error) {
    console.error('❌ Error generating local results URL:', error);
    return `${window.location.origin}/results`;
  }
};

export const decodeUrlData = (encodedData: string): ValuationData | null => {
  try {
    console.log('🔓 Starting decode process...');
    console.log('📥 Raw encoded data received:', encodedData.substring(0, 50) + '...');
    
    if (!encodedData || encodedData.trim() === '') {
      console.error('❌ Empty or null encoded data');
      return null;
    }

    // Restore URL-safe characters to standard base64
    let base64Data = encodedData
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // Add padding if needed
    const paddingNeeded = 4 - (base64Data.length % 4);
    if (paddingNeeded !== 4) {
      base64Data += '='.repeat(paddingNeeded);
    }
    
    console.log('🔄 Attempting base64 decode...');
    
    // Decode base64 to string
    const decodedString = atob(base64Data);
    console.log('📄 Decoded string length:', decodedString.length);
    
    // Parse JSON
    const parsedData = JSON.parse(decodedString);
    console.log('✅ Successfully parsed data:', parsedData);
    
    // Validate that we have the essential fields
    if (!parsedData.firstName || !parsedData.email || !parsedData.companyName) {
      console.error('❌ Missing essential fields in decoded data');
      console.log('📋 Available fields:', Object.keys(parsedData));
      return null;
    }
    
    console.log('✅ Data validation passed');
    return parsedData as ValuationData;
  } catch (error) {
    console.error('❌ Error decoding URL data:', error);
    console.log('🔍 Error details:', error);
    return null;
  }
};
