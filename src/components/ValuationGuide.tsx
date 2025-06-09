
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import IntroStep from './steps/IntroStep';
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

  const totalSteps = 8;
  const progress = (currentStep / (totalSteps - 1)) * 100;

  useEffect(() => {
    // Initialize Webflow listener
    initWebflowListener();
    
    let timer: NodeJS.Timeout;
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentStep > 0 && currentStep < totalSteps - 1 && !showResultsWaiting) {
        setShowExitPopup(true);
        e.preventDefault();
        e.returnValue = '';
      }
    };

    if (currentStep > 0 && currentStep < totalSteps - 1 && !showResultsWaiting) {
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
      console.log('Webhook sent successfully');

      // Notify Webflow of form submission
      webflowControl.formSubmitted(webhookData);
      
      // Hide Webflow elements after submission
      webflowControl.hideFields(['navigation-div', 'header-section']);
      webflowControl.hideElement('background-div');

      return true;
    } catch (error) {
      console.error('Error sending webhook:', error);
      return false;
    }
  };

  const getBrandScore = (networkEffects: string): number => {
    // Convert network effects to a score between 0-4
    const scoreMap: { [key: string]: number } = {
      'minimal': 1,
      'moderate': 2,
      'strong': 3,
      'dominant': 4
    };
    return scoreMap[networkEffects] || 0;
  };

  const nextStep = async () => {
    if (currentStep === 6) { // Contact step
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

  const updateValuationData = (field: keyof ValuationData, value: any) => {
    setValuationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderStep = () => {
    if (showResultsWaiting) {
      return <ResultsWaiting />;
    }

    switch (currentStep) {
      case 0:
        return <IntroStep onNext={nextStep} />;
      case 1:
        return (
          <RevenueStep
            value={valuationData.revenue}
            onChange={(value) => updateValuationData('revenue', value)}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <CACStep
            cac={valuationData.cac}
            context={valuationData.cacContext}
            onCACChange={(value) => updateValuationData('cac', value)}
            onContextChange={(value) => updateValuationData('cacContext', value)}
            onNext={nextStep}
          />
        );
      case 3:
        return (
          <NetworkEffectsStep
            value={valuationData.networkEffects}
            onChange={(value) => updateValuationData('networkEffects', value)}
            onNext={nextStep}
          />
        );
      case 4:
        return (
          <GrowthRateStep
            value={valuationData.growthRate}
            onChange={(value) => updateValuationData('growthRate', value)}
            onNext={nextStep}
          />
        );
      case 5:
        return (
          <BusinessModelStep
            value={valuationData.businessModel}
            onChange={(value) => updateValuationData('businessModel', value)}
            onNext={nextStep}
          />
        );
      case 6:
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
      case 7:
        return <LoadingScreen valuationData={valuationData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
        <CardContent className="p-8">
          {currentStep > 0 && currentStep < totalSteps - 1 && !showResultsWaiting && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  Step {currentStep} of {totalSteps - 2}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="h-2" />
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
