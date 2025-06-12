
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

  // Load data from cookies on component mount and populate UTM parameters immediately
  useEffect(() => {
    console.log('🚀 Component mounting, checking for saved data...');
    
    // First, check for UTM parameters and populate immediately
    console.log('🔍 Checking URL parameters for auto-population...');
    console.log('🌐 Current URL:', window.location.href);
    console.log('🔗 Search params:', window.location.search);
    
    const urlParams = new URLSearchParams(window.location.search);
    const utmFirstName = urlParams.get('first_name');
    const utmEmail = urlParams.get('email');
    const utmPhone = urlParams.get('phone');

    console.log('📋 UTM Parameters found:');
    console.log('  - first_name:', utmFirstName);
    console.log('  - email:', utmEmail);
    console.log('  - phone:', utmPhone);

    // Create initial data object with UTM parameters if available
    let initialData = {
      arrSliderValue: 0,
      nrr: '',
      revenueChurn: '',
      qoqGrowthRate: 0,
      cac: 0,
      cacContext: 'per_customer',
      profitability: '',
      marketGravity: '',
      businessModel: '',
      firstName: utmFirstName || '',
      lastName: '',
      email: utmEmail || '',
      phone: utmPhone || '',
      companyName: '',
      website: ''
    };

    // Then load saved data and merge with UTM parameters
    const savedData = loadValuationData();
    if (savedData) {
      console.log('📦 Loading saved data from storage:', savedData);
      
      // Merge saved data with UTM parameters (UTM takes precedence for contact fields)
      const mergedData = {
        ...savedData.valuationData,
        firstName: utmFirstName || savedData.valuationData.firstName || '',
        email: utmEmail || savedData.valuationData.email || '',
        phone: utmPhone || savedData.valuationData.phone || ''
      };
      
      console.log('🔄 Merged data with UTM parameters:', mergedData);
      
      setValuationData(mergedData);
      setCurrentStep(savedData.currentStep || 0);
      setIsSubmitted(savedData.isSubmitted || false);
      
      if (savedData.isSubmitted) {
        console.log('✅ User already submitted, showing results and posting webhook success');
        setShowResults(true);
        setShowResultsWaiting(false);
        
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ action: "webhookSuccess" }, "*");
        }
        
        if (mergedData.arrSliderValue >= 250000) {
          console.log('💰 Returning user revenue qualifies! Setting webhookSuccessFlag to true');
          (window as any).webhookSuccessFlag = true;
          console.log('🏁 Flag set for returning user! Current value:', (window as any).webhookSuccessFlag);
        }
        
        document.body.setAttribute("data-webhook-success", "true");
        console.log('🏷️ Set body attribute data-webhook-success to true for returning user');
      }
    } else {
      console.log('📭 No saved data found, using UTM data as initial state');
      setValuationData(initialData);
    }

    // Log final state
    console.log('🎯 Final initial valuation data:', initialData);
  }, []);

  // Save data to storage whenever valuationData, currentStep, or submission status changes
  useEffect(() => {
    if (currentStep > 0 || valuationData.arrSliderValue > 0 || isSubmitted || valuationData.firstName) {
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
