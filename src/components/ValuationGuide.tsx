
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
import ExitPopup from './ExitPopup';

export interface ValuationData {
  revenue: number;
  cac: number;
  cacContext: string;
  networkEffects: string;
  growthRate: number;
  businessModel: string;
  companyName: string;
  website: string;
}

const ValuationGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [valuationData, setValuationData] = useState<ValuationData>({
    revenue: 0,
    cac: 0,
    cacContext: 'Per customer',
    networkEffects: '',
    growthRate: 0,
    businessModel: '',
    companyName: '',
    website: ''
  });

  const totalSteps = 8;
  const progress = (currentStep / (totalSteps - 1)) * 100;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentStep > 0 && currentStep < totalSteps - 1) {
        setShowExitPopup(true);
        e.preventDefault();
        e.returnValue = '';
      }
    };

    if (currentStep > 0 && currentStep < totalSteps - 1) {
      timer = setTimeout(() => {
        setShowExitPopup(true);
      }, 30000); // Show popup after 30 seconds of inactivity
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentStep]);

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
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
            companyName={valuationData.companyName}
            website={valuationData.website}
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
          {currentStep > 0 && currentStep < totalSteps - 1 && (
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

      {showExitPopup && (
        <ExitPopup
          onClose={() => setShowExitPopup(false)}
          onContinue={() => setShowExitPopup(false)}
        />
      )}
    </div>
  );
};

export default ValuationGuide;
