import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, DollarSign, Target, Zap, Award, ChevronRight, 
  BarChart3, Users, Clock, Shield, ArrowUp, ArrowDown,
  CheckCircle, AlertTriangle, Lightbulb, Trophy, 
  Calculator, PieChart, TrendingDown, Share2, ExternalLink
} from 'lucide-react';
import { ValuationData } from '../ValuationGuide';
import { calculateAccurateValuation, NewValuationData } from '../../utils/newValuationCalculator';
import { generateShareableUrl, generateLocalResultsUrl } from '../../utils/urlSharing';

interface ResultsDisplayProps {
  valuationData: ValuationData;
  onSendEmail: () => void;
}

const ResultsDisplay = ({ valuationData, onSendEmail }: ResultsDisplayProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [copySuccess, setCopySuccess] = useState(false);

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

  const handleShare = async () => {
    try {
      const shareableUrl = generateShareableUrl(valuationData);
      await navigator.clipboard.writeText(shareableUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      console.log('📋 Copied shareable URL to clipboard');
    } catch (error) {
      console.error('❌ Failed to copy URL:', error);
    }
  };

  const handleViewExternal = () => {
    const externalUrl = generateShareableUrl(valuationData);
    window.open(externalUrl, '_blank');
  };

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
    <div className="space-y-12">
      {/* Hero Section with better spacing */}
      <div className="text-center space-y-8">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-6">
          <Calculator className="w-12 h-12 text-primary" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent leading-tight">
            Your Complete Valuation Analysis
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            AI-powered valuation analysis based on 15,000+ company benchmarks
          </p>
        </div>

        {/* Share buttons */}
        <div className="flex justify-center gap-4 pt-4">
          <Button onClick={handleShare} variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            {copySuccess ? 'Copied!' : 'Copy Share Link'}
          </Button>
          <Button onClick={handleViewExternal} variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Dominate Media
          </Button>
        </div>
        
        {/* Enhanced value cards with better spacing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto pt-8">
          <Card className="border-2 border-primary/20 relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -mr-10 -mt-10"></div>
            <CardContent className="p-8 text-center relative">
              <h3 className="text-xl font-semibold text-muted-foreground mb-4">Current Valuation</h3>
              <p className="text-4xl font-bold text-primary mb-3">{formatCurrency(valuation.current)}</p>
              <p className="text-base text-muted-foreground">
                {(valuation.current / valuationData.arrSliderValue).toFixed(1)}x Revenue Multiple
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-green-500/20 relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-10 -mt-10"></div>
            <CardContent className="p-8 text-center relative">
              <h3 className="text-xl font-semibold text-muted-foreground mb-4">Optimized Valuation</h3>
              <p className="text-4xl font-bold text-green-600 mb-3">{formatCurrency(valuation.optimized)}</p>
              <p className="text-base text-muted-foreground">
                {((valuation.optimized / valuation.current - 1) * 100).toFixed(0)}% Increase Potential
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-orange-500/20 relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -mr-10 -mt-10"></div>
            <CardContent className="p-8 text-center relative">
              <h3 className="text-xl font-semibold text-muted-foreground mb-4">Opportunity Value</h3>
              <p className="text-4xl font-bold text-orange-600 mb-3">{formatCurrency(valuation.leftOnTable)}</p>
              <p className="text-base text-muted-foreground">
                Money Left on the Table
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Analysis Tabs with better spacing */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-14 text-base">
          <TabsTrigger value="overview" className="text-sm md:text-base">Overview</TabsTrigger>
          <TabsTrigger value="metrics" className="text-sm md:text-base">Metrics Deep Dive</TabsTrigger>
          <TabsTrigger value="competitive" className="text-sm md:text-base">Competitive Analysis</TabsTrigger>
          <TabsTrigger value="roadmap" className="text-sm md:text-base">Action Roadmap</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-10 mt-8">
          {/* Key Metrics Cards with enhanced spacing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              const percentage = (metric.score / 5) * 100;
              
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border border-border/50">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary/10 rounded-xl">
                          <Icon className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{metric.label}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{metric.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`flex items-center space-x-2 ${getScoreColor(metric.score)}`}>
                          {getScoreIcon(metric.score)}
                          <span className="text-3xl font-bold">{metric.score}/5</span>
                        </div>
                      </div>
                    </div>
                    
                    <Progress value={percentage} className="h-3 mb-6" />
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Multiplier Impact:</span>
                        <span className="font-semibold">{metric.multiplier.toFixed(2)}x</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Benchmark:</span>
                        <span className="font-semibold">{metric.benchmark}</span>
                      </div>
                      <div className="mt-4 p-4 bg-muted/50 rounded-xl">
                        <p className="text-sm text-muted-foreground">
                          <Lightbulb className="w-4 h-4 inline mr-2" />
                          {metric.recommendation}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Priority Insight with enhanced design */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-lg">
            <CardContent className="p-10">
              <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center">
                <Zap className="w-8 h-8 text-primary mr-3" />
                Priority Focus Area
              </h2>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <Target className="w-6 h-6 mr-3 text-primary" />
                  {valuation.biggestLeak} - {formatCurrency(valuation.biggestOpportunity)} Opportunity
                </h3>
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  Your biggest opportunity for valuation improvement. Fixing this single area could unlock 
                  <strong className="text-primary"> {formatCurrency(valuation.biggestOpportunity)}</strong> in additional enterprise value.
                </p>
                
                <div className="bg-primary/10 rounded-xl p-6">
                  <h4 className="font-semibold text-primary mb-3 text-lg">Immediate Next Steps:</h4>
                  <p className="text-muted-foreground leading-relaxed">{valuation.improvementDescription}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-8 mt-8">
          <Card className="shadow-lg">
            <CardContent className="p-10">
              <h2 className="text-3xl font-bold text-foreground mb-8">Valuation Multiplier Breakdown</h2>
              
              <div className="space-y-8">
                <div className="bg-muted/50 rounded-xl p-8">
                  <h3 className="text-xl font-semibold mb-6">Base Calculation</h3>
                  <div className="text-base space-y-3">
                    <div className="flex justify-between py-2">
                      <span>Annual Recurring Revenue (ARR)</span>
                      <span className="font-bold">{formatCurrency(valuationData.arrSliderValue)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Base Multiple</span>
                      <span className="font-bold">{valuation.multiplierBreakdown.base}x</span>
                    </div>
                    <hr className="my-4" />
                    <div className="flex justify-between text-xl py-2">
                      <span>Base Valuation</span>
                      <span className="font-bold">{formatCurrency(valuationData.arrSliderValue * valuation.multiplierBreakdown.base)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                      <div key={key} className="bg-white/70 rounded-xl p-6 border border-border/30">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-semibold text-base">{labels[key]}</span>
                          <span className="font-bold text-lg">{(value as number).toFixed(2)}x</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {impact >= 0 ? (
                            <ArrowUp className="w-5 h-5 text-green-600" />
                          ) : (
                            <ArrowDown className="w-5 h-5 text-red-600" />
                          )}
                          <span className={`text-sm font-medium ${impact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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

        <TabsContent value="competitive" className="space-y-8 mt-8">
          <Card className="shadow-lg">
            <CardContent className="p-10">
              <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center">
                <BarChart3 className="w-8 h-8 mr-3" />
                Market Position Analysis
              </h2>
              
              <div className="space-y-8">
                {competitiveAnalysis.map((tier, index) => (
                  <div key={index} className="border border-border/50 rounded-xl p-8 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="font-semibold text-xl">{tier.segment}</h3>
                        <p className="text-muted-foreground text-base mt-2">{tier.characteristics}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-primary text-xl">{tier.multiple}</span>
                        <p className="text-sm text-muted-foreground mt-1">Revenue Multiple</p>
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <span className="text-base font-medium">Your Position: </span>
                      <span className="text-base">{tier.gap}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
                <h3 className="font-semibold mb-6 text-xl">Market Percentile Ranking</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="text-base">Your Performance vs Market Median</span>
                      <span className={`font-bold text-lg ${valuation.vsMedian >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercentage(valuation.vsMedian)}
                      </span>
                    </div>
                    <Progress value={Math.max(0, Math.min(100, 50 + valuation.vsMedian))} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="text-base">Distance to Optimal Performance</span>
                      <span className="font-bold text-orange-600 text-lg">
                        {formatPercentage(valuation.vsOptimal)}
                      </span>
                    </div>
                    <Progress value={Math.max(0, 100 + valuation.vsOptimal)} className="h-3" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-8 mt-8">
          <Card className="shadow-lg">
            <CardContent className="p-10">
              <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center">
                <Target className="w-8 h-8 mr-3" />
                Strategic Improvement Roadmap
              </h2>
              
              <div className="space-y-8">
                {actionPlan.map((action, index) => (
                  <div key={index} className="border border-border/50 rounded-xl p-8 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                          <span className="font-bold text-primary text-lg">{action.priority}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-xl">{action.area}</h3>
                          <p className="text-muted-foreground text-base mt-2">{action.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-green-600 text-2xl">{action.impact}</span>
                        <p className="text-sm text-muted-foreground mt-1">Potential Value</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <span className="text-xs text-muted-foreground block uppercase tracking-wide">TIMEFRAME</span>
                        <span className="font-medium text-base">{action.timeframe}</span>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <span className="text-xs text-muted-foreground block uppercase tracking-wide">DIFFICULTY</span>
                        <span className="font-medium text-base">{action.difficulty}</span>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <span className="text-xs text-muted-foreground block uppercase tracking-wide">PRIORITY</span>
                        <span className="font-medium text-base">
                          {action.priority === 1 ? 'Critical' : action.priority === 2 ? 'High' : 'Medium'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-4 text-lg">Specific Action Items:</h4>
                      <ul className="space-y-3">
                        {action.specificActions.map((specificAction, actionIndex) => (
                          <li key={actionIndex} className="flex items-center space-x-3 text-base">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
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

      {/* Enhanced CTA Section */}
      <Card className="bg-gradient-to-r from-primary via-primary to-primary/80 text-white shadow-xl">
        <CardContent className="p-10 text-center">
          <h2 className="text-3xl font-bold mb-6">Your Detailed Report Has Been Sent!</h2>
          <p className="text-xl opacity-90 mb-8 leading-relaxed max-w-4xl mx-auto">
            A comprehensive {actionPlan.length}-point action plan with your personalized roadmap has been delivered to {valuationData.email}.
            This includes specific tactics, timelines, and ROI projections for unlocking your ${formatCurrency(valuation.leftOnTable)} opportunity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-base opacity-90 max-w-2xl mx-auto">
            <div className="flex flex-col items-center space-y-3">
              <Shield className="w-8 h-8" />
              <p>Confidential Analysis</p>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <Clock className="w-8 h-8" />
              <p>Updated Quarterly</p>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <Users className="w-8 h-8" />
              <p>Peer Benchmarking</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
