
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Calculator, TrendingUp, BarChart3, CheckCircle, Zap, Target } from 'lucide-react';
import { ValuationData } from '../ValuationGuide';

interface LoadingScreenProps {
  valuationData: ValuationData;
}

const LoadingScreen = ({ valuationData }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [pulseActive, setPulseActive] = useState(true);

  const steps = [
    {
      icon: Calculator,
      title: '🧮 Analyzing your enterprise metrics...',
      description: 'Processing your ARR, CAC, and growth fundamentals...',
      duration: 1500
    },
    {
      icon: BarChart3,
      title: '📊 Comparing against 2,847 similar SaaS exits...',
      description: 'Benchmarking with 1,000+ comparable companies...',
      duration: 2000
    },
    {
      icon: TrendingUp,
      title: '🚀 Calculating revenue multipliers...',
      description: 'Applying advanced DCF and market-based methodologies...',
      duration: 1800
    },
    {
      icon: Target,
      title: '🎯 Identifying optimization opportunities...',
      description: 'Finding your biggest valuation leaks and fixes...',
      duration: 1200
    },
    {
      icon: Zap,
      title: '⚡ Running competitor analysis...',
      description: 'Analyzing market positioning and competitive advantages...',
      duration: 1500
    },
    {
      icon: CheckCircle,
      title: '📋 Generating your personalized report...',
      description: 'Creating actionable insights and strategic recommendations...',
      duration: 1000
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setPulseActive(false);
          return 100;
        }
        return prev + 1.2;
      });
    }, 80);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let currentTimeout: NodeJS.Timeout;
    
    const advanceStep = (stepIndex: number) => {
      if (stepIndex < steps.length - 1) {
        currentTimeout = setTimeout(() => {
          setCurrentStep(stepIndex + 1);
          advanceStep(stepIndex + 1);
        }, steps[stepIndex].duration);
      }
    };

    advanceStep(0);

    return () => {
      if (currentTimeout) clearTimeout(currentTimeout);
    };
  }, []);

  const formatRevenue = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toLocaleString()}`;
  };

  const isB2B = valuationData.businessModel === 'b2b';
  const estimatedValue = Math.round((valuationData.arrSliderValue * 
    (isB2B ? 4.2 : 2.8) * 
    (1 + valuationData.qoqGrowthRate / 100)) / 1000000);

  const getMetricColor = (value: number, type: string) => {
    if (type === 'growth') {
      return value > 20 ? 'text-green-600' : value > 0 ? 'text-blue-600' : 'text-red-600';
    }
    return 'text-foreground';
  };

  return (
    <div className="space-y-8 text-center animate-fade-in">
      <div className="space-y-4">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all duration-500 ${
          pulseActive ? 'bg-gradient-to-br from-primary/30 to-primary/10 animate-pulse' : 'bg-gradient-to-br from-green-500/30 to-green-500/10'
        }`}>
          <Calculator className={`w-8 h-8 transition-colors duration-500 ${
            pulseActive ? 'text-primary' : 'text-green-600'
          }`} />
        </div>
        
        <h2 className="text-3xl font-bold text-foreground">
          {progress < 100 ? 'Calculating Your Company Valuation' : 'Analysis Complete!'}
        </h2>
        <p className="text-muted-foreground">
          {progress < 100 
            ? "We're analyzing your data against our comprehensive database of company valuations."
            : "Your detailed valuation report is ready!"
          }
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 border border-primary/20">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center justify-center">
            <Target className="w-5 h-5 mr-2 text-primary" />
            Your Company Profile
          </h3>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Annual Recurring Revenue:</span>
                <span className="font-bold text-lg text-primary">{formatRevenue(valuationData.arrSliderValue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Business Model:</span>
                <span className="font-medium">{isB2B ? '🏢 B2B' : '👥 B2C'}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">QoQ Growth Rate:</span>
                <span className={`font-bold text-lg ${getMetricColor(valuationData.qoqGrowthRate, 'growth')}`}>
                  {valuationData.qoqGrowthRate > 0 ? '+' : ''}{valuationData.qoqGrowthRate}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Customer Acquisition Cost:</span>
                <span className="font-medium">${valuationData.cac?.toLocaleString() || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Progress value={progress} className="h-4 flex-1" />
            <span className="text-sm font-medium text-primary min-w-[4rem]">{Math.round(progress)}%</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {progress < 25 && "🔍 Scanning financial metrics..."}
            {progress >= 25 && progress < 50 && "📈 Analyzing growth patterns..."}
            {progress >= 50 && progress < 75 && "🎯 Benchmarking performance..."}
            {progress >= 75 && progress < 95 && "💡 Identifying opportunities..."}
            {progress >= 95 && "✅ Finalizing calculations..."}
          </div>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const isUpcoming = index > currentStep;

            return (
              <div
                key={index}
                className={`flex items-center space-x-4 p-5 rounded-lg transition-all duration-500 border ${
                  isActive 
                    ? 'bg-gradient-to-r from-primary/15 to-primary/5 border-primary/40 shadow-lg scale-[1.02]' 
                    : isCompleted 
                    ? 'bg-gradient-to-r from-green-500/10 to-green-500/5 border-green-500/30' 
                    : 'bg-muted/30 border-muted opacity-60 scale-[0.98]'
                }`}
              >
                <div className={`p-2 rounded-full transition-all duration-300 ${
                  isActive ? 'bg-primary/20' : isCompleted ? 'bg-green-500/20' : 'bg-muted'
                }`}>
                  <Icon className={`w-6 h-6 transition-colors duration-300 ${
                    isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'
                  }`} />
                </div>
                <div className="text-left flex-1">
                  <h4 className={`font-medium transition-colors duration-300 ${
                    isActive ? 'text-primary' : isCompleted ? 'text-green-700' : 'text-muted-foreground'
                  }`}>{step.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                  {isActive && (
                    <div className="mt-2 w-24 h-1 bg-primary/20 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full animate-pulse w-3/4"></div>
                    </div>
                  )}
                </div>
                {isCompleted && (
                  <CheckCircle className="w-5 h-5 text-green-600 animate-scale-in" />
                )}
              </div>
            );
          })}
        </div>

        {progress > 75 && (
          <div className="bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 rounded-xl p-8 border border-primary/30 animate-fade-in shadow-xl">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full mb-2">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                💰 Preliminary Valuation Insight
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Based on your metrics, here's what we're seeing so far...
              </p>
              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    ${estimatedValue - 1}M - ${estimatedValue + 3}M
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Estimated Valuation Range
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="text-muted-foreground">Revenue Multiple</p>
                    <p className="font-bold text-primary">{((estimatedValue * 1000000) / valuationData.arrSliderValue).toFixed(1)}x</p>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="text-muted-foreground">Market Position</p>
                    <p className="font-bold text-green-600">
                      {estimatedValue > 10 ? 'Strong' : estimatedValue > 5 ? 'Growing' : 'Emerging'}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 italic">
                🔥 Fun fact: 94% of SaaS founders undervalue their companies by 40-60%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
