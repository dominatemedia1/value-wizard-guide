
import { useState, useEffect } from 'react';
import { ValuationData } from '@/components/ValuationGuide';
import { saveValuationData, loadValuationData } from '@/utils/cookieStorage';

export const useValuationData = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResultsWaiting, setShowResultsWaiting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [valuationData, setValuationData] = useState<ValuationData>({
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
  });

  // Load data from cookies on component mount
  useEffect(() => {
    console.log('🚀 Component mounting, checking for saved data...');
    const savedData = loadValuationData();
    if (savedData) {
      console.log('📦 Loading saved data from storage:', savedData);
      setValuationData(savedData.valuationData || valuationData);
      setCurrentStep(savedData.currentStep || 0);
      setIsSubmitted(savedData.isSubmitted || false);
      
      if (savedData.isSubmitted) {
        console.log('✅ User already submitted, showing results and posting webhook success');
        setShowResults(true);
        setShowResultsWaiting(false);
        
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ action: "webhookSuccess" }, "*");
        }
        
        if (savedData.valuationData.arrSliderValue >= 250000) {
          console.log('💰 Returning user revenue qualifies! Setting webhookSuccessFlag to true');
          (window as any).webhookSuccessFlag = true;
          console.log('🏁 Flag set for returning user! Current value:', (window as any).webhookSuccessFlag);
        }
        
        document.body.setAttribute("data-webhook-success", "true");
        console.log('🏷️ Set body attribute data-webhook-success to true for returning user');
      } else {
        console.log('📭 No saved data found, starting fresh');
      }
    }
  }, []);

  // Save data to storage whenever valuationData, currentStep, or submission status changes
  useEffect(() => {
    if (currentStep > 0 || valuationData.arrSliderValue > 0 || isSubmitted) {
      const dataToSave = {
        valuationData,
        currentStep,
        isSubmitted,
        showResultsWaiting,
        showResults,
        submittedAt: isSubmitted ? new Date().toISOString() : undefined
      };
      
      console.log('💾 Auto-saving data to storage...', dataToSave);
      const saveSuccess = saveValuationData(dataToSave);
      console.log('💾 Save result:', saveSuccess ? 'success' : 'failed');
    }
  }, [valuationData, currentStep, isSubmitted, showResultsWaiting, showResults]);

  const updateValuationData = (field: keyof ValuationData, value: any) => {
    if (!isSubmitted) {
      console.log(`📝 Updating ${field} to:`, value);
      setValuationData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return {
    currentStep,
    setCurrentStep,
    isSubmitted,
    setIsSubmitted,
    showResultsWaiting,
    setShowResultsWaiting,
    showResults,
    setShowResults,
    valuationData,
    updateValuationData
  };
};
