
import { ValuationData } from '@/components/ValuationGuide';
import { calculateAccurateValuation, NewValuationData } from '@/utils/newValuationCalculator';
import { webflowControl } from '@/utils/webflowIntegration';
import { generateShareableUrl, generateLocalResultsUrl } from '@/utils/urlSharing';

export const useWebhook = () => {
  const sendWebhook = async (data: ValuationData) => {
    try {
      console.log('🚀 Starting webhook process...');
      
      const newValuationData: NewValuationData = {
        arrSliderValue: data.arrSliderValue,
        revenueChurn: data.revenueChurn,
        qoqGrowthRate: data.qoqGrowthRate,
        cac: data.cac,
        cacContext: data.cacContext,
        profitability: data.profitability,
        marketGravity: data.marketGravity,
        isB2B: data.businessModel === 'b2b'
      };
      
      const valuation = calculateAccurateValuation(newValuationData);
      const shareableUrl = generateShareableUrl(data);
      const localResultsUrl = generateLocalResultsUrl(data);
      
      console.log('🔗 Generated shareable URL:', shareableUrl);
      console.log('🔗 Generated local results URL:', localResultsUrl);

      const urlParams = new URLSearchParams(window.location.search);
      
      const webhookData = {
        contact: {
          first_name: data.firstName,
          last_name: data.lastName
        },
        company_name: data.companyName,
        ...valuation.emailVariables,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        website: data.website,
        arrSliderValue: data.arrSliderValue,
        nrr: '', // Empty since we removed NRR
        revenueChurn: data.revenueChurn,
        qoqGrowthRate: data.qoqGrowthRate,
        cac: data.cac,
        cacContext: data.cacContext,
        profitability: data.profitability,
        marketGravity: data.marketGravity,
        businessModel: data.businessModel,
        calculatedValuation: valuation,
        timestamp: new Date().toISOString(),
        source: 'valuation_guide_v2',
        shareableUrl: shareableUrl,
        localResultsUrl: localResultsUrl,
        utm_source: urlParams.get('utm_source') || '',
        utm_medium: urlParams.get('utm_medium') || '',
        utm_campaign: urlParams.get('utm_campaign') || '',
        utm_term: urlParams.get('utm_term') || '',
        utm_content: urlParams.get('utm_content') || ''
      };

      console.log('Sending webhook data:', webhookData);

      const response = await fetch('https://hook.us1.make.com/ibj7l0wt2kmub6olt7qu4qeluyi4q8mz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      console.log('Webhook response status:', response.status);
      
      if (response.ok) {
        console.log('✅ Webhook sent successfully to the system!');
        console.log("Webhook success: true");
        document.body.setAttribute("data-webhook-success", "true");
        
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ action: "webhookSuccess" }, "*");
        }
        
        if (data.arrSliderValue >= 250000) {
          console.log('💰 Revenue qualifies! Setting webhookSuccessFlag to true');
          (window as any).webhookSuccessFlag = true;
          console.log('🏁 Flag set! Current value:', (window as any).webhookSuccessFlag);
        } else {
          console.log('💸 Revenue below $250K, not setting flag');
        }
      } else {
        console.log('❌ Webhook failed to send');
      }

      webflowControl.formSubmitted(webhookData);
      webflowControl.hideFields(['navigation-div', 'header-section']);
      webflowControl.hideElement('background-div');

      return true;
    } catch (error) {
      console.error('Error sending webhook:', error);
      console.log('❌ Webhook failed to send due to error');
      return false;
    }
  };

  return { sendWebhook };
};
