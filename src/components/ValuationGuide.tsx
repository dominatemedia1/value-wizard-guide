import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft } from 'lucide-react';
import RevenueStep from './steps/RevenueStep';
import CACStep from './steps/CACStep';
import NetworkEffectsStep from './steps/NetworkEffectsStep';
import GrowthRateStep from './steps/GrowthRateStep';
import BusinessModelStep from './steps/BusinessModelStep';
import ContactStep from './steps/ContactStep';
import LoadingScreen from './steps/LoadingScreen';
import ResultsWaiting from './steps/ResultsWaiting';
import ExitPopup from './ExitPopup';
import { calculateValuation } from '../utils/valuationCalculator';
import { webflowControl, initWebflowListener } from '../utils/webflowIntegration';
import { saveValuationData, loadValuationData, clearValuationData } from '../utils/cookieStorage';

export interface ValuationData {
  revenue: number;
  cac: number;
  cacContext: string;
  networkEffects: string;
  growthRate: number;
  businessModel: string;
  firstName: string;
  email: string;
  phone: string;
  companyName: string;
  website: string;
}

const ValuationGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [showResultsWaiting, setShowResultsWaiting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [valuationData, setValuationData] = useState<ValuationData>({
    revenue: 0,
    cac: 0,
    cacContext: 'Per customer',
    networkEffects: '',
    growthRate: 0,
    businessModel: '',
    firstName: '',
    email: '',
    phone: '',
    companyName: '',
    website: ''
  });

  const totalSteps = 7; // Reduced by 1 since we removed intro step
  const progress = (currentStep / (totalSteps - 1)) * 100;

  // Load data from cookies on component mount
  useEffect(() => {
    const savedData = loadValuationData();
    if (savedData) {
      setValuationData(savedData.valuationData || valuationData);
      setCurrentStep(savedData.currentStep || 0);
      setIsSubmitted(savedData.isSubmitted || false);
      if (savedData.isSubmitted) {
        setShowResultsWaiting(true);
      }
    }
  }, []);

  // Save data to cookies whenever valuationData or currentStep changes
  useEffect(() => {
    if (currentStep >= 0 && !isSubmitted) {
      saveValuationData({
        valuationData,
        currentStep,
        isSubmitted
      });
    }
  }, [valuationData, currentStep, isSubmitted]);

  useEffect(() => {
    // Initialize Webflow listener
    initWebflowListener();
    
    let timer: NodeJS.Timeout;
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentStep >= 0 && currentStep < totalSteps - 1 && !showResultsWaiting) {
        setShowExitPopup(true);
        e.preventDefault();
        e.returnValue = '';
      }
    };

    if (currentStep >= 0 && currentStep < totalSteps - 1 && !showResultsWaiting) {
      timer = setTimeout(() => {
        setShowExitPopup(true);
      }, 30000); // Show popup after 30 seconds of inactivity
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentStep, showResultsWaiting]);

  const sendWebhook = async (data: ValuationData) => {
    try {
      console.log('🚀 Starting webhook process...');
      console.log('Revenue check:', data.revenue, 'is >= 250000?', data.revenue >= 250000);
      
      // Calculate valuation using your formula
      const brandScore = getBrandScore(data.networkEffects);
      const isB2B = data.businessModel === 'b2b';
      const valuation = calculateValuation(
        data.revenue,
        data.cac,
        brandScore,
        data.growthRate,
        isB2B
      );

      // Get UTM parameters
      const urlParams = new URLSearchParams(window.location.search);
      
      const webhookData = {
        firstName: data.firstName,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        website: data.website,
        revenue: data.revenue,
        cac: data.cac,
        cacContext: data.cacContext,
        networkEffects: data.networkEffects,
        growthRate: data.growthRate,
        businessModel: data.businessModel,
        calculatedValuation: valuation,
        timestamp: new Date().toISOString(),
        source: 'valuation_guide',
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
        
        // After webhook success
        window.parent.postMessage({ action: "webhookSuccess" }, "*");
        
        // Check if revenue is $250K or above to set the flag
        if (data.revenue >= 250000) {
          console.log('💰 Revenue qualifies! Setting webhookSuccessFlag to true');
          window.webhookSuccessFlag = true;
          console.log('🏁 Flag set! Current value:', window.webhookSuccessFlag);
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

  const getBrandScore = (networkEffects: string): number => {
    // Convert network effects to a score between 0-4
    const scoreMap: { [key: string]: number } = {
      'invisible': 1,
      'emerging': 2,
      'established': 3,
      'dominant': 4
    };
    return scoreMap[networkEffects] || 0;
  };

  const nextStep = async () => {
    if (currentStep === 5) { // Contact step (now step 5 instead of 6)
      // Mark as submitted and clear cookies for form data (but keep submitted state)
      setIsSubmitted(true);
      saveValuationData({
        valuationData,
        currentStep,
        isSubmitted: true
      });
      
      // Send webhook and show results waiting
      console.log('Attempting to send webhook...');
      const success = await sendWebhook(valuationData);
      console.log('Webhook success:', success);
      
      // Always show results waiting regardless of webhook success
      setShowResultsWaiting(true);
      
      // Set a random timer between 7-12 minutes
      const randomMinutes = Math.floor(Math.random() * (12 - 7 + 1)) + 7;
      setTimeout(() => {
        console.log(`Random ${randomMinutes} minutes elapsed`);
        // In a real implementation, you might check for results here
      }, randomMinutes * 60 * 1000);
    } else if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0 && !isSubmitted) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateValuationData = (field: keyof ValuationData, value: any) => {
    if (!isSubmitted) {
      setValuationData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const renderStep = () => {
    if (showResultsWaiting) {
      return <ResultsWaiting />;
    }

    switch (currentStep) {
      case 0:
        return (
          <RevenueStep
            value={valuationData.revenue}
            onChange={(value) => updateValuationData('revenue', value)}
            onNext={nextStep}
          />
        );
      case 1:
        return (
          <CACStep
            cac={valuationData.cac}
            context={valuationData.cacContext}
            onCACChange={(value) => updateValuationData('cac', value)}
            onContextChange={(value) => updateValuationData('cacContext', value)}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <NetworkEffectsStep
            value={valuationData.networkEffects}
            onChange={(value) => updateValuationData('networkEffects', value)}
            onNext={nextStep}
          />
        );
      case 3:
        return (
          <GrowthRateStep
            value={valuationData.growthRate}
            onChange={(value) => updateValuationData('growthRate', value)}
            onNext={nextStep}
          />
        );
      case 4:
        return (
          <BusinessModelStep
            value={valuationData.businessModel}
            onChange={(value) => updateValuationData('businessModel', value)}
            onNext={nextStep}
          />
        );
      case 5:
        return (
          <ContactStep
            firstName={valuationData.firstName}
            email={valuationData.email}
            phone={valuationData.phone}
            companyName={valuationData.companyName}
            website={valuationData.website}
            onFirstNameChange={(value) => updateValuationData('firstName', value)}
            onEmailChange={(value) => updateValuationData('email', value)}
            onPhoneChange={(value) => updateValuationData('phone', value)}
            onCompanyNameChange={(value) => updateValuationData('companyName', value)}
            onWebsiteChange={(value) => updateValuationData('website', value)}
            onNext={nextStep}
          />
        );
      case 6:
        return <LoadingScreen valuationData={valuationData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto border-2 border-border bg-card/95 backdrop-blur-sm">
        <CardContent className="p-8">
          {currentStep >= 0 && currentStep < totalSteps - 1 && !showResultsWaiting && (
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

      {showExitPopup && !showResultsWaiting && (
        <ExitPopup
          onClose={() => setShowExitPopup(false)}
          onContinue={() => setShowExitPopup(false)}
        />
      )}
    </div>
  );
};

export default ValuationGuide;
