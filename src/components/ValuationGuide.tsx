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
import ResultsDisplay from './steps/ResultsDisplay';
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
  const [showResults, setShowResults] = useState(false);
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
      if (currentStep >= 0 && currentStep < totalSteps - 1 && !showResultsWaiting && !showResults) {
        setShowExitPopup(true);
        e.preventDefault();
        e.returnValue = '';
      }
    };

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
  }, [currentStep, showResultsWaiting, showResults]);

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
        
        // After webhook success - properly typed postMessage
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ action: "webhookSuccess" }, "*");
        }
        
        // Check if revenue is $250K or above to set the flag
        if (data.revenue >= 250000) {
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

  const sendEmailWebhook = async (data: ValuationData) => {
    try {
      console.log('🚀 Sending email webhook...');
      
      // Calculate valuation for email
      const brandScore = getBrandScore(data.networkEffects);
      const isB2B = data.businessModel === 'b2b';
      const valuation = calculateValuation(
        data.revenue,
        data.cac,
        brandScore,
        data.growthRate,
        isB2B
      );

      // Helper functions for email data
      const formatCurrencyForEmail = (amount: number) => {
        if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
        if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
        return amount.toLocaleString();
      };

      const getScoreFromRevenue = (revenue: number): number => {
        return Math.min(5, Math.max(1, Math.round((revenue / 1000000) * 2 + 2)));
      };

      const getBiggestLeak = (data: ValuationData): string => {
        const revenueScore = getScoreFromRevenue(data.revenue);
        const cacScore = Math.min(5, Math.max(1, Math.round(((data.revenue * 0.33) / data.cac) * 0.8 + 1)));
        const brandScoreForEmail = brandScore + 1;
        const growthScore = Math.min(5, Math.max(1, Math.round(data.growthRate / 20 + 1)));
        
        const scores = [
          { name: 'revenue predictability', score: revenueScore },
          { name: 'customer acquisition efficiency', score: cacScore },
          { name: 'brand authority', score: brandScoreForEmail },
          { name: 'growth trajectory', score: growthScore }
        ];
        
        return scores.reduce((min, current) => current.score < min.score ? current : min).name;
      };

      // Email template with populated data
      const emailHtml = `<!DOCTYPE html>
<html>
<head>
    <title>Dominate Media - SaaS Valuation Report</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #061812;
        }
        .brand-primary { color: #024227; }
        .brand-accent { color: #3DFF90; }
        .brand-dark { color: #061812; }
        .cta-button {
            background-color: #3DFF90;
            color: #024227 !important;
            padding: 16px 32px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            display: inline-block;
            box-shadow: 0 4px 6px rgba(0, 66, 39, 0.1);
        }
        .card {
            background: #ffffff;
            border-radius: 18px;
            padding: 2rem;
            margin: 1.5rem 0;
            box-shadow: 0 4px 24px rgba(0, 66, 39, 0.08);
            border: 1px solid rgba(0, 66, 39, 0.05);
        }
        .progress-bar {
            height: 8px;
            background: #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: #3DFF90;
        }
        .chart-container {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 1.5rem;
            margin: 2rem 0;
        }
        @media (max-width: 600px) {
            .container { padding: 1rem; }
            .card { padding: 1.5rem; }
        }
    </style>
</head>
<body>
    <div style="max-width: 680px; margin: 0 auto; padding: 2rem;">
        <div class="card">
            <h1 class="brand-primary" style="font-size: 28px; margin-bottom: 1.5rem;">Hey ${data.firstName},</h1>
            
            <p style="font-size: 18px;">Remember that 3 AM Google search?</p>
            <h2 class="brand-dark" style="font-size: 24px; margin: 1.5rem 0;">"How much is my SaaS actually worth?"</h2>
            
            <div class="chart-container">
                <div style="text-align: center;">
                    <h3>Your Valuation Results</h3>
                    <div style="display: flex; justify-content: space-around; margin: 2rem 0;">
                        <div>
                            <div style="font-size: 24px; font-weight: bold; color: #024227;">Current</div>
                            <div style="font-size: 32px; color: #3DFF90;">$${formatCurrencyForEmail(valuation.current)}</div>
                        </div>
                        <div>
                            <div style="font-size: 24px; font-weight: bold; color: #024227;">Optimized</div>
                            <div style="font-size: 32px; color: #3DFF90;">$${formatCurrencyForEmail(valuation.optimized)}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="brand-accent" style="margin: 2rem 0;">
                <h3 style="font-size: 22px; margin-bottom: 1rem;">💰 What you're leaving on the table:</h3>
                <div style="font-size: 32px; font-weight: 700;">$${formatCurrencyForEmail(valuation.leftOnTable)}</div>
            </div>

            <div style="margin: 2rem 0;">
                <h4>⭐ Revenue Predictability: ${getScoreFromRevenue(data.revenue)}/5</h4>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(getScoreFromRevenue(data.revenue)/5)*100}%"></div>
                </div>
            </div>

            <div style="text-align: center; margin: 2.5rem 0;">
                <a href="#" class="cta-button">STOP BEING INVISIBLE - CLAIM MY $${formatCurrencyForEmail(valuation.leftOnTable)}</a>
            </div>

            <div style="border-left: 3px solid #3DFF90; padding-left: 1.5rem; margin: 2rem 0;">
                <h3 class="brand-dark" style="font-size: 20px;">Your Roadmap:</h3>
                <ul style="list-style: none; padding-left: 0;">
                    <li style="margin-bottom: 1rem;">✅ Month 1: Fix ${getBiggestLeak(data)}</li>
                    <li style="margin-bottom: 1rem;">🚀 Month 2: Launch content engine</li>
                    <li>📈 Month 3: Scale authority</li>
                </ul>
            </div>
        </div>

        <div style="text-align: center; color: #666; font-size: 14px; margin-top: 2rem;">
            <p>© 2025 Dominate Media. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

      // Get UTM parameters
      const urlParams = new URLSearchParams(window.location.search);
      
      const emailWebhookData = {
        to: data.email,
        subject: `${data.firstName}, your $${formatCurrencyForEmail(valuation.leftOnTable)} SaaS valuation report is ready`,
        html: emailHtml,
        firstName: data.firstName,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        website: data.website,
        currentValuation: valuation.current,
        optimizedValuation: valuation.optimized,
        leftOnTable: valuation.leftOnTable,
        revenue: data.revenue,
        cac: data.cac,
        growthRate: data.growthRate,
        businessModel: data.businessModel,
        networkEffects: data.networkEffects,
        timestamp: new Date().toISOString(),
        source: 'valuation_guide_email',
        utm_source: urlParams.get('utm_source') || '',
        utm_medium: urlParams.get('utm_medium') || '',
        utm_campaign: urlParams.get('utm_campaign') || '',
        utm_term: urlParams.get('utm_term') || '',
        utm_content: urlParams.get('utm_content') || ''
      };

      console.log('Sending email webhook data:', emailWebhookData);

      const response = await fetch('https://hook.us1.make.com/ibj7l0wt2kmub6olt7qu4qeluyi4q8mz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailWebhookData),
      });

      console.log('Email webhook response status:', response.status);
      
      if (response.ok) {
        console.log('✅ Email webhook sent successfully!');
        return true;
      } else {
        console.log('❌ Email webhook failed to send');
        return false;
      }
    } catch (error) {
      console.error('Error sending email webhook:', error);
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
      
      // Set a random timer between 7-12 minutes, then show results
      const randomMinutes = Math.floor(Math.random() * (12 - 7 + 1)) + 7;
      setTimeout(() => {
        console.log(`Random ${randomMinutes} minutes elapsed, showing results`);
        setShowResultsWaiting(false);
        setShowResults(true);
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
    if (showResults) {
      return (
        <ResultsDisplay 
          valuationData={valuationData}
          onSendEmail={() => sendEmailWebhook(valuationData)}
        />
      );
    }

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
