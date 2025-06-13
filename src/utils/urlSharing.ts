
import { ValuationData } from '../components/ValuationGuide';

export const generateShareableUrl = (valuationData: ValuationData, baseUrl: string = 'https://www.dominatemedia.io/unicorn-valuation/results'): string => {
  try {
    console.log('🔄 Creating simple URL with parameters...');
    
    const url = new URL(baseUrl);
    
    // Add all valuation data as simple URL parameters
    url.searchParams.set('arr', valuationData.arrSliderValue.toString());
    url.searchParams.set('nrr', valuationData.nrr.toString());
    url.searchParams.set('churn', valuationData.revenueChurn.toString());
    url.searchParams.set('growth', valuationData.qoqGrowthRate.toString());
    url.searchParams.set('cac', valuationData.cac.toString());
    url.searchParams.set('cacContext', valuationData.cacContext);
    url.searchParams.set('profit', valuationData.profitability);
    url.searchParams.set('gravity', valuationData.marketGravity);
    url.searchParams.set('model', valuationData.businessModel);
    url.searchParams.set('firstName', valuationData.firstName);
    url.searchParams.set('lastName', valuationData.lastName);
    url.searchParams.set('email', valuationData.email);
    url.searchParams.set('company', valuationData.companyName);
    
    if (valuationData.phone) {
      url.searchParams.set('phone', valuationData.phone);
    }
    if (valuationData.website) {
      url.searchParams.set('website', valuationData.website);
    }
    
    const finalUrl = url.toString();
    console.log('✅ Generated simple URL:', finalUrl);
    
    return finalUrl;
    
  } catch (error) {
    console.error('❌ Error generating URL:', error);
    return baseUrl;
  }
};

export const generateLocalResultsUrl = (valuationData: ValuationData): string => {
  const baseUrl = `${window.location.origin}/results`;
  return generateShareableUrl(valuationData, baseUrl);
};

export const decodeUrlData = (searchParams: URLSearchParams): ValuationData | null => {
  try {
    console.log('🔓 Decoding URL parameters...');
    
    const arr = searchParams.get('arr');
    const nrr = searchParams.get('nrr');
    const firstName = searchParams.get('firstName');
    const email = searchParams.get('email');
    const company = searchParams.get('company');
    
    if (!arr || !nrr || !firstName || !email || !company) {
      console.error('❌ Missing required URL parameters');
      return null;
    }
    
    const valuationData: ValuationData = {
      arrSliderValue: parseInt(arr),
      nrr: parseInt(nrr),
      revenueChurn: parseInt(searchParams.get('churn') || '0'),
      qoqGrowthRate: parseInt(searchParams.get('growth') || '0'),
      cac: parseInt(searchParams.get('cac') || '0'),
      cacContext: searchParams.get('cacContext') || '',
      profitability: searchParams.get('profit') || '',
      marketGravity: searchParams.get('gravity') || '',
      businessModel: searchParams.get('model') || '',
      firstName: firstName,
      lastName: searchParams.get('lastName') || '',
      email: email,
      phone: searchParams.get('phone') || '',
      companyName: company,
      website: searchParams.get('website') || ''
    };
    
    console.log('✅ Successfully decoded data:', valuationData);
    return valuationData;
    
  } catch (error) {
    console.error('❌ Error decoding URL data:', error);
    return null;
  }
};
