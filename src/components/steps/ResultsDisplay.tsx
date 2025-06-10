
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, DollarSign, Target, Zap, Award, ChevronRight, 
  BarChart3, Users, Clock, Shield, ArrowUp, ArrowDown,
  CheckCircle, AlertTriangle, Lightbulb, Trophy, 
  Calculator, PieChart, TrendingDown
} from 'lucide-react';
import { ValuationData } from '../ValuationGuide';
import { calculateAccurateValuation, NewValuationData } from '../../utils/newValuationCalculator';

interface ResultsDisplayProps {
  valuationData: ValuationData;
  onSendEmail: () => void;
}

const ResultsDisplay = ({ valuationData, onSendEmail }: ResultsDisplayProps) => {
  const [activeTab, setActiveTab] = useState('overview');

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

  const formatPercentage = (value: number) => `${value >= 0 ? '+' : ''}${value}%`;

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-blue-600';
    if (score >= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 4) return <Trophy className="w-4 h-4" />;
    if (score >= 3) return <CheckCircle className="w-4 h-4" />;
    if (score >= 2) return <AlertTriangle className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  const metrics = [
    {
      label: 'Net Revenue Retention',
      score: valuation.emailVariables.revenue_score,
      icon: DollarSign,
      description: 'Measures customer expansion and retention effectiveness',
      multiplier: valuation.multiplierBreakdown.nrr,
      benchmark: 'Industry avg: 105-115%',
      recommendation: valuation.multiplierBreakdown.nrr < 1.0 ? 'Focus on upselling and reducing churn' : 'Maintain excellent retention practices'
    },
    {
      label: 'CAC Efficiency',
      score: valuation.emailVariables.cac_score,
      icon: Target,
      description: 'Customer acquisition cost effectiveness and scalability',
      multiplier: valuation.multiplierBreakdown.cac,
      benchmark: 'Target: CAC payback < 12 months',
      recommendation: valuation.multiplierBreakdown.cac < 1.0 ? 'Optimize marketing channels and improve conversion' : 'Strong acquisition engine'
    },
    {
      label: 'Brand Authority',
      score: valuation.emailVariables.brand_score,
      icon: Award,
      description: 'Market gravity and positioning strength in your sector',
      multiplier: valuation.multiplierBreakdown.marketGravity,
      benchmark: 'Leaders: 40%+ inbound leads',
      recommendation: valuation.multiplierBreakdown.marketGravity < 1.0 ? 'Invest in content marketing and thought leadership' : 'Leverage your market position'
    },
    {
      label: 'Growth Trajectory',
      score: valuation.emailVariables.growth_score,
      icon: TrendingUp,
      description: 'Quarter-over-quarter growth momentum and sustainability',
      multiplier: valuation.multiplierBreakdown.growth,
      benchmark: 'High-growth: 40%+ annually',
      recommendation: valuation.multiplierBreakdown.growth < 1.0 ? 'Accelerate product-market fit and scaling' : 'Maintain growth efficiency'
    }
  ];

  const competitiveAnalysis = [
    {
      segment: 'Top 10% of SaaS Companies',
      multiple: '8.5x - 12x',
      characteristics: 'NRR >120%, Growth >50%, Profitable',
      gap: valuation.current < (valuationData.arrSliderValue * 8.5) ? `${formatCurrency((valuationData.arrSliderValue * 8.5) - valuation.current)} gap` : 'Within range'
    },
    {
      segment: 'Median SaaS Companies',
      multiple: '3.5x - 5.5x', 
      characteristics: 'NRR 100-110%, Growth 20-40%, Break-even',
      gap: valuation.vsMedian >= 0 ? `${formatPercentage(valuation.vsMedian)} above` : `${formatPercentage(Math.abs(valuation.vsMedian))} below`
    },
    {
      segment: 'Bottom 25% of SaaS Companies',
      multiple: '1.5x - 2.5x',
      characteristics: 'NRR <100%, Growth <20%, Burning cash',
      gap: valuation.current > (valuationData.arrSliderValue * 2.5) ? 'Above this tier' : 'Risk zone'
    }
  ];

  const actionPlan = valuation.allOpportunities.slice(0, 3).map((opp, index) => ({
    priority: index + 1,
    area: opp.factor,
    impact: formatCurrency(opp.impact),
    timeframe: index === 0 ? '3-6 months' : index === 1 ? '6-12 months' : '12+ months',
    difficulty: index === 0 ? 'Medium' : index === 1 ? 'High' : 'Medium',
    description: opp.description,
    specificActions: getSpecificActions(opp.factor)
  }));

  function getSpecificActions(factor: string): string[] {
    const actions: { [key: string]: string[] } = {
      'Net Revenue Retention': [
        'Implement customer success programs',
        'Develop upselling automation',
        'Create expansion revenue workflows',
        'Build customer health scoring'
      ],
      'Growth Rate': [
        'Optimize conversion funnels',
        'Scale high-performing channels',
        'Implement product-led growth',
        'Expand to new market segments'
      ],
      'Revenue Retention': [
        'Analyze churn patterns',
        'Improve onboarding experience',
        'Build retention campaigns',
        'Enhance product stickiness'
      ],
      'Profitability': [
        'Optimize cost structure',
        'Increase pricing strategically',
        'Improve unit economics',
        'Automate operations'
      ],
      'Market Gravity': [
        'Build thought leadership content',
        'Invest in SEO and content marketing',
        'Create community programs',
        'Develop strategic partnerships'
      ],
      'CAC Efficiency': [
        'Optimize ad targeting',
        'Improve landing page conversion',
        'Develop referral programs',
        'Focus on high-LTV channels'
      ]
    };
    return actions[factor] || ['Focus on operational excellence', 'Measure and optimize key metrics'];
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-4">
          <Calculator className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="text-4xl font-bold text-foreground">
          Your Complete Valuation Analysis
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="border-2 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full -mr-8 -mt-8"></div>
            <CardContent className="p-6 text-center relative">
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">Current Valuation</h3>
              <p className="text-3xl font-bold text-primary">{formatCurrency(valuation.current)}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {(valuation.current / valuationData.arrSliderValue).toFixed(1)}x Revenue Multiple
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-green-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-full -mr-8 -mt-8"></div>
            <CardContent className="p-6 text-center relative">
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">Optimized Valuation</h3>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(valuation.optimized)}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {((valuation.optimized / valuation.current - 1) * 100).toFixed(0)}% Increase Potential
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-orange-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 rounded-full -mr-8 -mt-8"></div>
            <CardContent className="p-6 text-center relative">
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">Opportunity Value</h3>
              <p className="text-3xl font-bold text-orange-600">{formatCurrency(valuation.leftOnTable)}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Money Left on the Table
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Analysis Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics Deep Dive</TabsTrigger>
          <TabsTrigger value="competitive">Competitive Analysis</TabsTrigger>
          <TabsTrigger value="roadmap">Action Roadmap</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              const percentage = (metric.score / 5) * 100;
              
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{metric.label}</h3>
                          <p className="text-sm text-muted-foreground">{metric.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`flex items-center space-x-1 ${getScoreColor(metric.score)}`}>
                          {getScoreIcon(metric.score)}
                          <span className="text-2xl font-bold">{metric.score}/5</span>
                        </div>
                      </div>
                    </div>
                    
                    <Progress value={percentage} className="h-3 mb-4" />
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Multiplier Impact:</span>
                        <span className="font-medium">{metric.multiplier.toFixed(2)}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Benchmark:</span>
                        <span className="font-medium">{metric.benchmark}</span>
                      </div>
                      <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          <Lightbulb className="w-3 h-3 inline mr-1" />
                          {metric.recommendation}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Priority Insight */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                <Zap className="w-6 h-6 text-primary mr-2" />
                Priority Focus Area
              </h2>
              
              <div className="bg-white/50 rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-primary" />
                  {valuation.biggestLeak} - ${formatCurrency(valuation.biggestOpportunity)} Opportunity
                </h3>
                <p className="text-muted-foreground mb-4">
                  Your biggest opportunity for valuation improvement. Fixing this single area could unlock 
                  <strong className="text-primary"> {formatCurrency(valuation.biggestOpportunity)}</strong> in additional enterprise value.
                </p>
                
                <div className="bg-primary/10 rounded-lg p-4">
                  <h4 className="font-medium text-primary mb-2">Immediate Next Steps:</h4>
                  <p className="text-sm text-muted-foreground">{valuation.improvementDescription}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Valuation Multiplier Breakdown</h2>
              
              <div className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Base Calculation</h3>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Annual Recurring Revenue (ARR)</span>
                      <span className="font-bold">{formatCurrency(valuationData.arrSliderValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Base Multiple</span>
                      <span className="font-bold">{valuation.multiplierBreakdown.base}x</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg">
                      <span>Base Valuation</span>
                      <span className="font-bold">{formatCurrency(valuationData.arrSliderValue * valuation.multiplierBreakdown.base)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(valuation.multiplierBreakdown).map(([key, value]) => {
                    if (key === 'base') return null;
                    
                    const labels: { [key: string]: string } = {
                      nrr: 'Net Revenue Retention',
                      growth: 'Growth Rate',
                      churn: 'Revenue Retention',
                      profitability: 'Profitability',
                      marketGravity: 'Market Gravity',
                      cac: 'CAC Efficiency',
                      businessModel: 'Business Model'
                    };

                    const impact = (value as number - 1) * 100;
                    
                    return (
                      <div key={key} className="bg-white/50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{labels[key]}</span>
                          <span className="font-bold">{(value as number).toFixed(2)}x</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {impact >= 0 ? (
                            <ArrowUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <ArrowDown className="w-4 h-4 text-red-600" />
                          )}
                          <span className={`text-sm ${impact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {impact >= 0 ? '+' : ''}{impact.toFixed(0)}% impact
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitive" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2" />
                Market Position Analysis
              </h2>
              
              <div className="space-y-6">
                {competitiveAnalysis.map((tier, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{tier.segment}</h3>
                        <p className="text-muted-foreground text-sm">{tier.characteristics}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-primary">{tier.multiple}</span>
                        <p className="text-sm text-muted-foreground">Revenue Multiple</p>
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded p-3">
                      <span className="text-sm font-medium">Your Position: </span>
                      <span className="text-sm">{tier.gap}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                <h3 className="font-semibold mb-3">Market Percentile Ranking</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Your Performance vs Market Median</span>
                      <span className={`font-bold ${valuation.vsMedian >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercentage(valuation.vsMedian)}
                      </span>
                    </div>
                    <Progress value={Math.max(0, Math.min(100, 50 + valuation.vsMedian))} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Distance to Optimal Performance</span>
                      <span className="font-bold text-orange-600">
                        {formatPercentage(valuation.vsOptimal)}
                      </span>
                    </div>
                    <Progress value={Math.max(0, 100 + valuation.vsOptimal)} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                <Target className="w-6 h-6 mr-2" />
                Strategic Improvement Roadmap
              </h2>
              
              <div className="space-y-6">
                {actionPlan.map((action, index) => (
                  <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                          <span className="font-bold text-primary">{action.priority}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{action.area}</h3>
                          <p className="text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-green-600 text-xl">{action.impact}</span>
                        <p className="text-sm text-muted-foreground">Potential Value</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-muted/50 rounded p-3">
                        <span className="text-xs text-muted-foreground block">TIMEFRAME</span>
                        <span className="font-medium">{action.timeframe}</span>
                      </div>
                      <div className="bg-muted/50 rounded p-3">
                        <span className="text-xs text-muted-foreground block">DIFFICULTY</span>
                        <span className="font-medium">{action.difficulty}</span>
                      </div>
                      <div className="bg-muted/50 rounded p-3">
                        <span className="text-xs text-muted-foreground block">PRIORITY</span>
                        <span className="font-medium">
                          {action.priority === 1 ? 'Critical' : action.priority === 2 ? 'High' : 'Medium'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Specific Action Items:</h4>
                      <ul className="space-y-1">
                        {action.specificActions.map((specificAction, actionIndex) => (
                          <li key={actionIndex} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <span>{specificAction}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Your Detailed Report Has Been Sent!</h2>
          <p className="text-lg opacity-90 mb-6">
            A comprehensive {actionPlan.length}-point action plan with your personalized roadmap has been delivered to {valuationData.email}.
            This includes specific tactics, timelines, and ROI projections for unlocking your ${formatCurrency(valuation.leftOnTable)} opportunity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm opacity-90">
            <div>
              <Shield className="w-6 h-6 mx-auto mb-2" />
              <p>Confidential Analysis</p>
            </div>
            <div>
              <Clock className="w-6 h-6 mx-auto mb-2" />
              <p>Updated Quarterly</p>
            </div>
            <div>
              <Users className="w-6 h-6 mx-auto mb-2" />
              <p>Peer Benchmarking</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
