
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Calculator, TrendingUp, BarChart3, CheckCircle } from 'lucide-react';
import { ValuationData } from '../ValuationGuide';

interface LoadingScreenProps {
  valuationData: ValuationData;
}

const LoadingScreen = ({ valuationData }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Calculator,
      title: 'Analyzing your financial metrics',
      description: 'Processing your ARR, CAC, and growth data...'
    },
    {
      icon: BarChart3,
      title: 'Benchmarking against industry standards',
      description: 'Comparing with 1,000+ similar companies...'
    },
    {
      icon: TrendingUp,
      title: 'Calculating valuation multiples',
      description: 'Applying advanced valuation methodologies...'
    },
    {
      icon: CheckCircle,
      title: 'Generating your personalized report',
      description: 'Creating actionable insights and recommendations...'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2000);

    return () => clearInterval(stepTimer);
  }, []);

  const formatRevenue = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toLocaleString()}`;
  };

  const estimatedValue = Math.round((valuationData.revenue * 
    (valuationData.businessModel === 'b2b' ? 8 : 4) * 
    (1 + valuationData.growthRate / 100)) / 1000000);

  return (
    <div className="space-y-8 text-center">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          Calculating Your Company Valuation
        </h2>
        <p className="text-muted-foreground">
          We're analyzing your data against our comprehensive database of company valuations.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-primary-light/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Your Company Profile</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">ARR:</span>
              <span className="ml-2 font-medium">{formatRevenue(valuationData.revenue)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Growth:</span>
              <span className="ml-2 font-medium">{valuationData.growthRate}%</span>
            </div>
            <div>
              <span className="text-muted-foreground">Model:</span>
              <span className="ml-2 font-medium">{valuationData.businessModel.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">CAC:</span>
              <span className="ml-2 font-medium">${valuationData.cac}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-muted-foreground">{progress}% Complete</p>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div
                key={index}
                className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary-light/20 border border-primary/30' 
                    : isCompleted 
                    ? 'bg-muted/50' 
                    : 'opacity-50'
                }`}
              >
                <Icon className={`w-6 h-6 ${
                  isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'
                }`} />
                <div className="text-left">
                  <h4 className="font-medium text-foreground">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {progress > 80 && (
          <div className="bg-gradient-to-r from-primary-light/20 to-primary/20 rounded-lg p-6 animate-fade-in">
            <h3 className="text-xl font-bold text-foreground mb-2">
              Preliminary Valuation Range
            </h3>
            <p className="text-3xl font-bold text-primary">
              ${estimatedValue - 2}M - ${estimatedValue + 5}M
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Final report will include detailed breakdown and methodology
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
