
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, DollarSign, Target, Zap, Award, ChevronRight } from 'lucide-react';
import { ValuationData } from '../ValuationGuide';
import { calculateAccurateValuation, NewValuationData } from '../../utils/newValuationCalculator';

interface ResultsDisplayProps {
  valuationData: ValuationData;
  onSendEmail: () => void;
}

const ResultsDisplay = ({ valuationData, onSendEmail }: ResultsDisplayProps) => {
  // Prepare data for new calculation
  const newValuationData: NewValuationData = {
    arrSliderValue: valuationData.arrSliderValue,
    nrr: valuationData.nrr,
    revenueChurn: valuationData.revenueChurn,
    qoqGrowthRate: valuationData.qoqGrowthRate,
    cac: valuationData.cac,
    cacContext: valuationData.cacContext,
    profitability: valuationData.profitability,
    marketGravity: valuationData.marketGravity,
    isB2B: valuationData.businessModel === 'b2b'
  };

  // Calculate valuation using the new calculator
  const valuation = calculateAccurateValuation(newValuationData);

  // Helper functions for display
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toLocaleString()}`;
  };

  const metrics = [
    {
      label: 'Net Revenue Retention',
      score: valuation.emailVariables.revenue_score,
      icon: DollarSign,
      description: 'Based on your NRR and customer expansion'
    },
    {
      label: 'CAC Efficiency',
      score: valuation.emailVariables.cac_score,
      icon: Target,
      description: 'Customer acquisition cost effectiveness'
    },
    {
      label: 'Brand Authority',
      score: valuation.emailVariables.brand_score,
      icon: Award,
      description: 'Market gravity and positioning strength'
    },
    {
      label: 'Growth Trajectory',
      score: valuation.emailVariables.growth_score,
      icon: TrendingUp,
      description: 'Quarter-over-quarter growth momentum'
    }
  ];

  const lowestMetric = metrics.reduce((min, current) => 
    current.score < min.score ? current : min
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-4">
          <DollarSign className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="text-4xl font-bold text-foreground">
          Your Company Valuation
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">Current Valuation</h3>
              <p className="text-3xl font-bold text-primary">{formatCurrency(valuation.current)}</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-green-500/20">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">Optimized Valuation</h3>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(valuation.optimized)}</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-orange-500/20">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">Money Left on Table</h3>
              <p className="text-3xl font-bold text-orange-600">{formatCurrency(valuation.leftOnTable)}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <Card>
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Valuation Breakdown</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              const percentage = (metric.score / 5) * 100;
              
              return (
                <div key={index} className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-6 h-6 text-primary" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{metric.label}</h3>
                      <p className="text-sm text-muted-foreground">{metric.description}</p>
                    </div>
                    <span className="text-2xl font-bold text-primary">{metric.score}/5</span>
                  </div>
                  
                  <Progress value={percentage} className="h-3" />
                  
                  <div className="text-sm text-muted-foreground">
                    {percentage >= 80 ? '🟢 Excellent' : 
                     percentage >= 60 ? '🟡 Good' : 
                     percentage >= 40 ? '🟠 Fair' : '🔴 Needs Improvement'}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
            <Zap className="w-6 h-6 text-primary mr-2" />
            Key Insights & Recommendations
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white/50 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-3">🎯 Priority Focus Area</h3>
              <p className="text-muted-foreground mb-4">
                Your biggest opportunity for valuation improvement is <strong>{lowestMetric.label}</strong> 
                (currently {lowestMetric.score}/5). This could unlock <strong>{formatCurrency(valuation.biggestOpportunity)}</strong> in additional value.
              </p>
              
              <div className="bg-primary/10 rounded-lg p-4">
                <h4 className="font-medium text-primary mb-2">Recommended Actions:</h4>
                <p className="text-sm text-muted-foreground">{valuation.improvementDescription}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/50 rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-3">📊 vs Industry Benchmark</h3>
                <p className="text-muted-foreground mb-2">
                  Your company is valued at <strong>{((valuation.current / valuationData.arrSliderValue) * 1).toFixed(1)}x revenue</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  Performance vs median: <strong>{valuation.vsMedian >= 0 ? '+' : ''}{valuation.vsMedian}%</strong>
                </p>
              </div>
              
              <div className="bg-white/50 rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-3">🚀 Growth Potential</h3>
                <p className="text-muted-foreground mb-2">
                  With optimization, you could reach <strong>{formatCurrency(valuation.optimized)}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  That's {((valuation.optimized / valuation.current - 1) * 100).toFixed(0)}% increase in value
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Your Detailed Report Has Been Sent!</h2>
          <p className="text-lg opacity-90 mb-6">
            A comprehensive analysis with your personalized action plan has been delivered to {valuationData.email}.
            Check your inbox for the complete breakdown of how to unlock your ${formatCurrency(valuation.leftOnTable)} opportunity.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
