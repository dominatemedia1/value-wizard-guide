
import { ValuationData } from '../components/ValuationGuide';

export const generateShareableUrl = (valuationData: ValuationData, baseUrl: string = 'https://www.dominatemedia.io/unicorn-valuation/results'): string => {
  try {
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

    // Encode the data as base64 with URL-safe encoding
    const encodedData = btoa(JSON.stringify(shareableData))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    // Create the URL with the encoded data
    const url = new URL(baseUrl);
    url.searchParams.set('data', encodedData);
    
    console.log('🔗 Generated shareable URL:', url.toString());
    console.log('📦 Shareable data being encoded:', shareableData);
    return url.toString();
    
  } catch (error) {
    console.error('❌ Error generating shareable URL:', error);
    return baseUrl;
  }
};

export const generateLocalResultsUrl = (valuationData: ValuationData): string => {
  try {
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

    // Use URL-safe base64 encoding
    const encodedData = btoa(JSON.stringify(shareableData))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    const currentOrigin = window.location.origin;
    const localUrl = `${currentOrigin}/results?data=${encodedData}`;
    
    console.log('🏠 Generated local results URL:', localUrl);
    return localUrl;
  } catch (error) {
    console.error('❌ Error generating local results URL:', error);
    return `${window.location.origin}/results`;
  }
};

export const decodeUrlData = (encodedData: string): any => {
  try {
    // Restore base64 padding and decode URL-safe characters
    let base64Data = encodedData
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // Add padding if needed
    while (base64Data.length % 4) {
      base64Data += '=';
    }
    
    const decodedString = atob(base64Data);
    const parsedData = JSON.parse(decodedString);
    
    console.log('🔓 Successfully decoded URL data:', parsedData);
    return parsedData;
  } catch (error) {
    console.error('❌ Error decoding URL data:', error);
    return null;
  }
};
