
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
      companyName: valuationData.companyName,
      timestamp: new Date().toISOString()
    };

    // Encode the data as base64
    const encodedData = btoa(JSON.stringify(shareableData));
    
    // Create the URL with the encoded data
    const url = new URL(baseUrl);
    url.searchParams.set('data', encodedData);
    
    console.log('🔗 Generated shareable URL:', url.toString());
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
      companyName: valuationData.companyName,
      timestamp: new Date().toISOString()
    };

    const encodedData = btoa(JSON.stringify(shareableData));
    const currentOrigin = window.location.origin;
    
    return `${currentOrigin}/results?data=${encodedData}`;
  } catch (error) {
    console.error('❌ Error generating local results URL:', error);
    return `${window.location.origin}/results`;
  }
};
