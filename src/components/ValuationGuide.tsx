
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ExitPopup from './ExitPopup';
import StepRenderer from './StepRenderer';
import StepProgress from './StepProgress';
import { useValuationData } from '@/hooks/useValuationData';
import { useWebhook } from '@/hooks/useWebhook';
import { initWebflowListener } from '@/utils/webflowIntegration';

export interface ValuationData {
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
  const [showExitPopup, setShowExitPopup] = useState(false);
  const { sendWebhook } = useWebhook();
  
  const {
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
  } = useValuationData();

  const totalSteps = 8; // Updated from 9 to 8 since we removed NRR step
  const progress = (currentStep / (totalSteps - 1)) * 100;

  useEffect(() => {
    initWebflowListener();
    
    let timer: NodeJS.Timeout;
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentStep >= 0 && currentStep < totalSteps - 1 && !showResultsWaiting && !showResults) {
        setShowExitPopup(true);
        e.preventDefault();
        e.returnValue = '';
      }
    };

    if (showResultsWaiting && !showResults && !isSubmitted) {
      const startTime = localStorage.getItem('valuation_start_time');
      if (startTime) {
        const elapsed = Date.now() - parseInt(startTime);
        const fiveSeconds = 5 * 1000;
        
        if (elapsed >= fiveSeconds) {
          console.log('Timer already elapsed, showing results immediately');
          setShowResultsWaiting(false);
          setShowResults(true);
          localStorage.removeItem('valuation_start_time');
        } else {
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
      }, 30000);
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentStep, showResultsWaiting, showResults, isSubmitted]);

  const nextStep = async () => {
    if (currentStep === 7) { // Updated from 8 to 7
      console.log('🚀 Form validation starting...');
      console.log('📝 Current valuation data:', valuationData);
      
      const requiredFields = ['firstName', 'email', 'phone', 'companyName', 'website'];
      const missingFields = requiredFields.filter(field => !valuationData[field as keyof ValuationData]);
      
      if (missingFields.length > 0) {
        console.log('❌ Missing required fields:', missingFields);
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }
      
      console.log('✅ All required fields present, proceeding with submission');
      console.log('📝 Marking submission as complete');
      setIsSubmitted(true);
      
      console.log('📡 Attempting to send webhook...');
      const success = await sendWebhook(valuationData);
      console.log('📡 Webhook success:', success);
      
      setShowResultsWaiting(true);
      localStorage.setItem('valuation_start_time', Date.now().toString());
      
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

  // Use different layouts for results vs steps
  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-6 py-8 max-w-none">
          <div className="animate-fade-in">
            <StepRenderer
              currentStep={currentStep}
              showResults={showResults}
              showResultsWaiting={showResultsWaiting}
              valuationData={valuationData}
              updateValuationData={updateValuationData}
              nextStep={nextStep}
              previousStep={previousStep}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center pt-[45px] p-4">
      <Card className="w-full max-w-4xl mx-auto border-2 border-border bg-card/95 backdrop-blur-sm">
        <CardContent className="p-10">
          <StepProgress
            currentStep={currentStep}
            totalSteps={totalSteps}
            progress={progress}
            showResultsWaiting={showResultsWaiting}
            showResults={showResults}
            isSubmitted={isSubmitted}
            previousStep={previousStep}
          />
          
          <div className="animate-fade-in">
            <StepRenderer
              currentStep={currentStep}
              showResults={showResults}
              showResultsWaiting={showResultsWaiting}
              valuationData={valuationData}
              updateValuationData={updateValuationData}
              nextStep={nextStep}
              previousStep={previousStep}
            />
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
