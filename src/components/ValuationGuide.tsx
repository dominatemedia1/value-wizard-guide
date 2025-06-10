import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft } from 'lucide-react';

// New step components
import ARRStep from './steps/ARRStep';
import NRRStep from './steps/NRRStep';
import ChurnStep from './steps/ChurnStep';
import QoQGrowthStep from './steps/QoQGrowthStep';
import NewCACStep from './steps/NewCACStep';
import ProfitabilityStep from './steps/ProfitabilityStep';
import MarketGravityStep from './steps/MarketGravityStep';
import NewBusinessModelStep from './steps/NewBusinessModelStep';
import FinalContactStep from './steps/FinalContactStep';

import LoadingScreen from './steps/LoadingScreen';
import ResultsWaiting from './steps/ResultsWaiting';
import ExitPopup from './ExitPopup';
import ResultsDisplay from './steps/ResultsDisplay';
import { calculateAccurateValuation, NewValuationData } from '../utils/newValuationCalculator';
import { webflowControl, initWebflowListener } from '../utils/webflowIntegration';
import { saveValuationData, loadValuationData, clearValuationData } from '../utils/cookieStorage';

export interface ValuationData {
  // New structure matching the 9 steps
  arrSliderValue: number;
  nrr: string;
  revenueChurn: string;
  qoqGrowthRate: number;
  cac: number;
  cacContext: string;
  profitability: string;
  marketGravity: string;
  businessModel: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  website: string;
}

const ValuationGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [showResultsWaiting, setShowResultsWaiting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  const totalSteps = 9;
  const progress = (currentStep / (totalSteps - 1)) * 100;

  // Load data from cookies on component mount
  useEffect(() => {
    console.log('🚀 Component mounting, checking for saved data...');
    const savedData = loadValuationData();
    if (savedData) {
      console.log('📦 Loading saved data from storage:', savedData);
      setValuationData(savedData.valuationData || valuationData);
      setCurrentStep(savedData.currentStep || 0);
      setIsSubmitted(savedData.isSubmitted || false);
      
      // If they already submitted, show results immediately and post webhook success message
      if (savedData.isSubmitted) {
        console.log('✅ User already submitted, showing results and posting webhook success');
        setShowResults(true);
        setShowResultsWaiting(false);
        
        // Post webhook success message for returning users who completed the process
        console.log('📡 Posting webhook success message for returning user');
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ action: "webhookSuccess" }, "*");
        }
        
        // Set the webhook success flag if revenue qualifies
        if (savedData.valuationData.arrSliderValue >= 250000) {
          console.log('💰 Returning user revenue qualifies! Setting webhookSuccessFlag to true');
          (window as any).webhookSuccessFlag = true;
          console.log('🏁 Flag set for returning user! Current value:', (window as any).webhookSuccessFlag);
        }
        
        // Set body attribute for webhook success
        document.body.setAttribute("data-webhook-success", "true");
        console.log('🏷️ Set body attribute data-webhook-success to true for returning user');
      } else {
        console.log('📭 No saved data found, starting fresh');
      }
    }
  }, []);

  // Save data to storage whenever valuationData, currentStep, or submission status changes
  useEffect(() => {
    // Only save if we have meaningful data (not initial state)
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

  useEffect(() => {
    // Initialize Webflow listener
    initWebflowListener();
    
    let timer: NodeJS.Timeout;
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentStep >= 0 && currentStep < totalSteps - 1 && !showResultsWaiting && !showResults) {
        setShowExitPopup(true);
        e.preventDefault();
        e.returnValue = '';
      }
    };

    // Check if we should show results based on stored start time (only for new submissions)
    if (showResultsWaiting && !showResults && !isSubmitted) {
      const startTime = localStorage.getItem('valuation_start_time');
      if (startTime) {
        const elapsed = Date.now() - parseInt(startTime);
        const fiveSeconds = 5 * 1000; // 5 seconds in milliseconds
        
        if (elapsed >= fiveSeconds) {
          // Time is up, show results immediately
          console.log('Timer already elapsed, showing results immediately');
          setShowResultsWaiting(false);
          setShowResults(true);
          localStorage.removeItem('valuation_start_time');
        } else {
          // Set timer for remaining time
          const remainingTime = fiveSeconds - elapsed;
          console.log(`Setting timer for remaining ${remainingTime}ms`);
          timer = setTimeout(() => {
            console.log('5 seconds elapsed, showing results');
            setShowResultsWaiting(false);
            setShowResults(true);
            localStorage.removeItem('valuation_start_time');
          }, remainingTime);
        }
      }
    }

    if (currentStep >= 0 && currentStep < totalSteps - 1 && !showResultsWaiting && !showResults) {
      timer = setTimeout(() => {
        setShowExitPopup(true);
      }, 30000); // Show popup after 30 seconds of inactivity
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentStep, showResultsWaiting, showResults, isSubmitted]);

  const sendWebhook = async (data: ValuationData) => {
    try {
      console.log('🚀 Starting webhook process...');
      
      // Prepare data for new calculation
      const newValuationData: NewValuationData = {
        arrSliderValue: data.arrSliderValue,
        nrr: data.nrr,
        revenueChurn: data.revenueChurn,
        qoqGrowthRate: data.qoqGrowthRate,
        cac: data.cac,
        cacContext: data.cacContext,
        profitability: data.profitability,
        marketGravity: data.marketGravity,
        isB2B: data.businessModel === 'b2b'
      };
      
      // Calculate valuation using new formula
      const valuation = calculateAccurateValuation(newValuationData);

      // Get UTM parameters
      const urlParams = new URLSearchParams(window.location.search);
      
      const webhookData = {
        // Contact information
        contact: {
          first_name: data.firstName,
          last_name: data.lastName
        },
        company_name: data.companyName,
        
        // All email template variables
        ...valuation.emailVariables,
        
        // Original form data
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        website: data.website,
        arrSliderValue: data.arrSliderValue,
        nrr: data.nrr,
        revenueChurn: data.revenueChurn,
        qoqGrowthRate: data.qoqGrowthRate,
        cac: data.cac,
        cacContext: data.cacContext,
        profitability: data.profitability,
        marketGravity: data.marketGravity,
        businessModel: data.businessModel,
        
        // Full calculation results
        calculatedValuation: valuation,
        timestamp: new Date().toISOString(),
        source: 'valuation_guide_v2',
        
        // Include UTM parameters
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
        
        // After webhook success - properly typed postMessage
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ action: "webhookSuccess" }, "*");
        }
        
        // Check if revenue is $250K or above to set the flag
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

      // Notify Webflow of form submission
      webflowControl.formSubmitted(webhookData);
      
      // Hide Webflow elements after submission
      webflowControl.hideFields(['navigation-div', 'header-section']);
      webflowControl.hideElement('background-div');

      return true;
    } catch (error) {
      console.error('Error sending webhook:', error);
      console.log('❌ Webhook failed to send due to error');
      return false;
    }
  };

  const nextStep = async () => {
    if (currentStep === 8) { // Final contact step
      // Mark as submitted and save to storage
      console.log('📝 Marking submission as complete');
      setIsSubmitted(true);
      
      // Send webhook for new submissions (not returning users)
      console.log('📡 Attempting to send webhook...');
      const success = await sendWebhook(valuationData);
      console.log('📡 Webhook success:', success);
      
      // Always show results waiting for new submissions
      setShowResultsWaiting(true);
      
      // Set start time for the 5 second timer
      localStorage.setItem('valuation_start_time', Date.now().toString());
      
      // Set timer for 5 seconds
      setTimeout(() => {
        console.log('⏰ 5 seconds elapsed, showing results');
        setShowResultsWaiting(false);
        setShowResults(true);
        localStorage.removeItem('valuation_start_time');
      }, 5000);
    } else if (currentStep < totalSteps - 1) {
      console.log(`➡️ Moving to step ${currentStep + 1}`);
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0 && !isSubmitted) {
      console.log(`⬅️ Moving back to step ${currentStep - 1}`);
      setCurrentStep(currentStep - 1);
    }
  };

  const updateValuationData = (field: keyof ValuationData, value: any) => {
    if (!isSubmitted) {
      console.log(`📝 Updating ${field} to:`, value);
      setValuationData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const renderStep = () => {
    if (showResults) {
      return (
        <ResultsDisplay 
          valuationData={valuationData}
          onSendEmail={() => {}} // No separate email webhook needed
        />
      );
    }

    if (showResultsWaiting) {
      return <ResultsWaiting />;
    }

    switch (currentStep) {
      case 0:
        return (
          <ARRStep
            value={valuationData.arrSliderValue}
            onChange={(value) => updateValuationData('arrSliderValue', value)}
            onNext={nextStep}
          />
        );
      case 1:
        return (
          <NRRStep
            value={valuationData.nrr}
            onChange={(value) => updateValuationData('nrr', value)}
            onNext={nextStep}
            firstName={valuationData.firstName}
          />
        );
      case 2:
        return (
          <ChurnStep
            value={valuationData.revenueChurn}
            onChange={(value) => updateValuationData('revenueChurn', value)}
            onNext={nextStep}
          />
        );
      case 3:
        return (
          <QoQGrowthStep
            value={valuationData.qoqGrowthRate}
            onChange={(value) => updateValuationData('qoqGrowthRate', value)}
            onNext={nextStep}
          />
        );
      case 4:
        return (
          <NewCACStep
            cac={valuationData.cac}
            context={valuationData.cacContext}
            onCACChange={(value) => updateValuationData('cac', value)}
            onContextChange={(value) => updateValuationData('cacContext', value)}
            onNext={nextStep}
          />
        );
      case 5:
        return (
          <ProfitabilityStep
            value={valuationData.profitability}
            onChange={(value) => updateValuationData('profitability', value)}
            onNext={nextStep}
          />
        );
      case 6:
        return (
          <MarketGravityStep
            value={valuationData.marketGravity}
            onChange={(value) => updateValuationData('marketGravity', value)}
            onNext={nextStep}
            firstName={valuationData.firstName}
          />
        );
      case 7:
        return (
          <NewBusinessModelStep
            value={valuationData.businessModel}
            onChange={(value) => updateValuationData('businessModel', value)}
            onNext={nextStep}
          />
        );
      case 8:
        return (
          <FinalContactStep
            firstName={valuationData.firstName}
            lastName={valuationData.lastName}
            email={valuationData.email}
            phone={valuationData.phone}
            companyName={valuationData.companyName}
            website={valuationData.website}
            onFirstNameChange={(value) => updateValuationData('firstName', value)}
            onLastNameChange={(value) => updateValuationData('lastName', value)}
            onEmailChange={(value) => updateValuationData('email', value)}
            onPhoneChange={(value) => updateValuationData('phone', value)}
            onCompanyNameChange={(value) => updateValuationData('companyName', value)}
            onWebsiteChange={(value) => updateValuationData('website', value)}
            onNext={nextStep}
            onBack={previousStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto border-2 border-border bg-card/95 backdrop-blur-sm">
        <CardContent className="p-8">
          {currentStep >= 0 && currentStep < totalSteps - 1 && !showResultsWaiting && !showResults && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {totalSteps - 1}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              
              {currentStep > 0 && !isSubmitted && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={previousStep}
                  className="mt-4 text-muted-foreground hover:text-foreground border border-border hover:border-primary transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              )}
            </div>
          )}
          
          <div className="animate-fade-in">
            {renderStep()}
          </div>
        </CardContent>
      </Card>

      {showExitPopup && !showResultsWaiting && !showResults && (
        <ExitPopup
          onClose={() => setShowExitPopup(false)}
          onContinue={() => setShowExitPopup(false)}
        />
      )}
    </div>
  );
};

export default ValuationGuide;
