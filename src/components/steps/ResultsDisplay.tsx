
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, DollarSign, Target, Zap, Award, ChevronRight, 
  BarChart3, Users, Clock, Shield, ArrowUp, ArrowDown,
  CheckCircle, AlertTriangle, Lightbulb, Trophy, 
  Calculator, PieChart, TrendingDown, Share2, ExternalLink, Play, Copy
} from 'lucide-react';
import { ValuationData } from '../ValuationGuide';
import { calculateAccurateValuation, NewValuationData } from '../../utils/newValuationCalculator';
import { generateShareableUrl } from '../../utils/urlSharing';

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
      console.log('📋 Share button clicked, copying current URL...');
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      console.log('📋 Successfully copied current URL to clipboard');
    } catch (error) {
      console.error('❌ Failed to copy URL:', error);
      alert('Unable to copy link. Please copy the URL manually from your browser.');
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

  return (
    <div className="space-y-12 w-full max-w-none">
      {/* Hero Section - Full width desktop optimization */}
      <div className="text-center space-y-8">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-6">
          <Calculator className="w-12 h-12 text-primary" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent leading-tight">
            Your Complete Valuation Analysis
          </h1>
          
          <p className="text-lg lg:text-xl xl:text-2xl text-muted-foreground max-w-5xl mx-auto leading-relaxed">
            AI-powered valuation analysis based on 15,000+ company benchmarks
          </p>
        </div>

        {/* Share buttons */}
        <div className="flex justify-center gap-4 lg:gap-6 pt-4">
          <Button onClick={handleShare} variant="outline" size="lg" className="text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4">
            {copySuccess ? (
              <>
                <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3 text-green-600" />
                Link Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3" />
                Copy Share Link
              </>
            )}
          </Button>
          <Button onClick={handleViewExternal} variant="outline" size="lg" className="text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4">
            <ExternalLink className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3" />
            View on Dominate Media
          </Button>
        </div>
        
        {/* Enhanced value cards with full desktop width */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-12 w-full max-w-7xl mx-auto pt-8">
          <Card className="border-2 border-primary/20 relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -mr-10 -mt-10"></div>
            <CardContent className="p-6 lg:p-8 xl:p-10 text-center relative">
              <h3 className="text-lg lg:text-xl xl:text-2xl font-semibold text-muted-foreground mb-4 lg:mb-6">Current Valuation</h3>
              <p className="text-3xl lg:text-4xl xl:text-5xl font-bold text-primary mb-3 lg:mb-4">{formatCurrency(valuation.current)}</p>
              <p className="text-sm lg:text-base xl:text-lg text-muted-foreground">
                {(valuation.current / valuationData.arrSliderValue).toFixed(1)}x Revenue Multiple
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-green-500/20 relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-10 -mt-10"></div>
            <CardContent className="p-6 lg:p-8 xl:p-10 text-center relative">
              <h3 className="text-lg lg:text-xl xl:text-2xl font-semibold text-muted-foreground mb-4 lg:mb-6">Optimized Valuation</h3>
              <p className="text-3xl lg:text-4xl xl:text-5xl font-bold text-green-600 mb-3 lg:mb-4">{formatCurrency(valuation.optimized)}</p>
              <p className="text-sm lg:text-base xl:text-lg text-muted-foreground">
                {((valuation.optimized / valuation.current - 1) * 100).toFixed(0)}% Increase Potential
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-orange-500/20 relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -mr-10 -mt-10"></div>
            <CardContent className="p-6 lg:p-8 xl:p-10 text-center relative">
              <h3 className="text-lg lg:text-xl xl:text-2xl font-semibold text-muted-foreground mb-4 lg:mb-6">Opportunity Value</h3>
              <p className="text-3xl lg:text-4xl xl:text-5xl font-bold text-orange-600 mb-3 lg:mb-4">{formatCurrency(valuation.leftOnTable)}</p>
              <p className="text-sm lg:text-base xl:text-lg text-muted-foreground">
                Money Left on the Table
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Comprehensive Analysis Tabs - Full width */}
      <div className="w-full max-w-none">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 lg:grid-cols-4 h-auto lg:h-14 mb-8">
            <TabsTrigger value="overview" className="text-sm lg:text-base py-3 px-4">
              <BarChart3 className="w-4 h-4 mr-2" />
              Performance Overview
            </TabsTrigger>
            <TabsTrigger value="metrics" className="text-sm lg:text-base py-3 px-4">
              <Target className="w-4 h-4 mr-2" />
              Detailed Metrics
            </TabsTrigger>
            <TabsTrigger value="competitive" className="text-sm lg:text-base py-3 px-4">
              <Users className="w-4 h-4 mr-2" />
              Competitive Analysis
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="text-sm lg:text-base py-3 px-4">
              <Lightbulb className="w-4 h-4 mr-2" />
              Action Roadmap
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 lg:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
              {metrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <Card key={index} className="border border-border hover:border-primary/50 transition-colors">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex items-center justify-between mb-3 lg:mb-4">
                        <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                        <div className={`flex items-center ${getScoreColor(metric.score)}`}>
                          {getScoreIcon(metric.score)}
                          <span className="ml-1 lg:ml-2 font-semibold text-sm lg:text-base">{metric.score}/5</span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-sm lg:text-base mb-2">{metric.label}</h3>
                      <p className="text-xs lg:text-sm text-muted-foreground mb-3 lg:mb-4">{metric.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs lg:text-sm">
                          <span>Multiplier Impact</span>
                          <span className="font-semibold">{metric.multiplier.toFixed(2)}x</span>
                        </div>
                        <Progress value={(metric.multiplier / 1.5) * 100} className="h-1.5 lg:h-2" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6 lg:space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
              {metrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <Card key={index} className="border border-border">
                    <CardContent className="p-6 lg:p-8">
                      <div className="flex items-start justify-between mb-4 lg:mb-6">
                        <div className="flex items-center">
                          <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-primary mr-3 lg:mr-4" />
                          <div>
                            <h3 className="text-lg lg:text-xl font-semibold">{metric.label}</h3>
                            <p className="text-sm lg:text-base text-muted-foreground">{metric.description}</p>
                          </div>
                        </div>
                        <div className={`flex items-center ${getScoreColor(metric.score)}`}>
                          {getScoreIcon(metric.score)}
                          <span className="ml-2 font-bold text-lg lg:text-xl">{metric.score}/5</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4 lg:space-y-6">
                        <div className="bg-muted/50 rounded-lg p-4 lg:p-6">
                          <h4 className="font-semibold text-sm lg:text-base mb-2 lg:mb-3">Performance Analysis</h4>
                          <div className="grid grid-cols-2 gap-3 lg:gap-4 text-sm lg:text-base">
                            <div>
                              <span className="text-muted-foreground">Current Impact:</span>
                              <p className="font-semibold">{metric.multiplier.toFixed(2)}x multiplier</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Industry Benchmark:</span>
                              <p className="font-semibold">{metric.benchmark}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 lg:p-6">
                          <h4 className="font-semibold text-sm lg:text-base mb-2 lg:mb-3 flex items-center">
                            <Lightbulb className="w-4 h-4 mr-2 text-blue-600" />
                            Strategic Recommendation
                          </h4>
                          <p className="text-sm lg:text-base text-blue-800">{metric.recommendation}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="competitive" className="space-y-6 lg:space-y-8">
            <Card className="border border-border">
              <CardContent className="p-6 lg:p-8">
                <h3 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 flex items-center">
                  <Users className="w-6 h-6 lg:w-8 lg:h-8 mr-3 lg:mr-4 text-primary" />
                  Competitive Positioning Analysis
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  <div className="space-y-4 lg:space-y-6">
                    <div>
                      <h4 className="font-semibold text-base lg:text-lg mb-3 lg:mb-4">Market Position</h4>
                      <div className="space-y-3 lg:space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm lg:text-base">Revenue Multiple</span>
                          <span className="font-semibold text-sm lg:text-base">{(valuation.current / valuationData.arrSliderValue).toFixed(1)}x</span>
                        </div>
                        <Progress value={((valuation.current / valuationData.arrSliderValue) / 10) * 100} className="h-2" />
                        <p className="text-xs lg:text-sm text-muted-foreground">
                          Industry range: 2x - 8x for SaaS companies
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-base lg:text-lg mb-3 lg:mb-4">Growth Efficiency</h4>
                      <div className="space-y-2 lg:space-y-3">
                        <div className="flex justify-between text-sm lg:text-base">
                          <span>CAC Efficiency Score</span>
                          <span className={`font-semibold ${getScoreColor(valuation.emailVariables.cac_score)}`}>
                            {valuation.emailVariables.cac_score}/5
                          </span>
                        </div>
                        <div className="flex justify-between text-sm lg:text-base">
                          <span>Revenue Retention</span>
                          <span className={`font-semibold ${getScoreColor(valuation.emailVariables.revenue_score)}`}>
                            {valuation.emailVariables.revenue_score}/5
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 lg:space-y-6">
                    <div>
                      <h4 className="font-semibold text-base lg:text-lg mb-3 lg:mb-4">Valuation Drivers</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 lg:p-4 bg-muted/50 rounded-lg">
                          <span className="text-sm lg:text-base">Current Valuation</span>
                          <span className="font-bold text-sm lg:text-base">{formatCurrency(valuation.current)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 lg:p-4 bg-green-50 border border-green-200 rounded-lg">
                          <span className="text-sm lg:text-base">Optimized Potential</span>
                          <span className="font-bold text-green-700 text-sm lg:text-base">{formatCurrency(valuation.optimized)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 lg:p-4 bg-orange-50 border border-orange-200 rounded-lg">
                          <span className="text-sm lg:text-base">Opportunity Gap</span>
                          <span className="font-bold text-orange-700 text-sm lg:text-base">{formatCurrency(valuation.leftOnTable)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6 lg:space-y-8">
            <Card className="border border-border">
              <CardContent className="p-6 lg:p-8">
                <h3 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 flex items-center">
                  <Lightbulb className="w-6 h-6 lg:w-8 lg:h-8 mr-3 lg:mr-4 text-primary" />
                  Strategic Action Roadmap
                </h3>
                
                <div className="space-y-6 lg:space-y-8">
                  {metrics
                    .filter(metric => metric.score < 4)
                    .map((metric, index) => {
                      const Icon = metric.icon;
                      return (
                        <div key={index} className="border border-border rounded-lg p-4 lg:p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                              <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-primary mr-3" />
                              <div>
                                <h4 className="font-semibold text-base lg:text-lg">{metric.label} Optimization</h4>
                                <p className="text-sm lg:text-base text-muted-foreground">Priority: High</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs lg:text-sm text-muted-foreground">Potential Impact</span>
                              <p className="font-bold text-green-600 text-sm lg:text-base">
                                +{formatCurrency((valuation.optimized - valuation.current) * 0.25)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-muted/50 rounded-lg p-4 lg:p-6 mb-4">
                            <h5 className="font-semibold text-sm lg:text-base mb-2 lg:mb-3">Recommended Actions</h5>
                            <p className="text-sm lg:text-base">{metric.recommendation}</p>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs lg:text-sm text-muted-foreground">Implementation Timeline</span>
                            <span className="text-sm lg:text-base font-semibold">3-6 months</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* YouTube Marketing Enhancement Section - Optimized for desktop */}
      <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-xl w-full">
        <CardContent className="p-8 lg:p-12">
          <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground mb-6 lg:mb-10 flex items-center">
            <Play className="w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 text-red-600 mr-3 lg:mr-4" />
            YouTube Marketing: Your Growth Catalyst
          </h2>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 lg:p-8 xl:p-10 border border-red-100">
            <h3 className="text-lg lg:text-xl xl:text-2xl font-semibold text-foreground mb-4 lg:mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 mr-3 lg:mr-4 text-red-600" />
              Transform Your Customer Acquisition with YouTube Ads
            </h3>
            <p className="text-muted-foreground mb-6 lg:mb-8 text-base lg:text-lg xl:text-xl leading-relaxed">
              Based on your current CAC efficiency metrics, YouTube advertising represents your biggest opportunity 
              to optimize marketing spend and dramatically improve acquisition costs. This could be the key factor 
              in unlocking that <strong className="text-red-600">{formatCurrency(valuation.leftOnTable)}</strong> opportunity value.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
              <div className="bg-red-50 rounded-2xl p-6 lg:p-8">
                <h4 className="font-semibold text-red-700 mb-3 lg:mb-4 text-base lg:text-lg xl:text-xl">Why YouTube Ads Excel for SaaS:</h4>
                <ul className="space-y-2 lg:space-y-3 text-sm lg:text-base">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3 mt-0.5 flex-shrink-0" />
                    Lower cost-per-click than Google Ads
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3 mt-0.5 flex-shrink-0" />
                    Higher engagement and conversion rates
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3 mt-0.5 flex-shrink-0" />
                    Superior brand building capabilities
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3 mt-0.5 flex-shrink-0" />
                    Precise B2B audience targeting
                  </li>
                </ul>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 lg:p-8">
                <h4 className="font-semibold text-orange-700 mb-3 lg:mb-4 text-base lg:text-lg xl:text-xl">Expected Impact on Your Metrics:</h4>
                <ul className="space-y-2 lg:space-y-3 text-sm lg:text-base">
                  <li className="flex items-start">
                    <Trophy className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600 mr-2 lg:mr-3 mt-0.5 flex-shrink-0" />
                    30-50% reduction in customer acquisition cost
                  </li>
                  <li className="flex items-start">
                    <Trophy className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600 mr-2 lg:mr-3 mt-0.5 flex-shrink-0" />
                    2-3x improvement in conversion rates
                  </li>
                  <li className="flex items-start">
                    <Trophy className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600 mr-2 lg:mr-3 mt-0.5 flex-shrink-0" />
                    Enhanced brand recognition and trust
                  </li>
                  <li className="flex items-start">
                    <Trophy className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600 mr-2 lg:mr-3 mt-0.5 flex-shrink-0" />
                    Scalable, predictable lead generation
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-2xl p-6 lg:p-8">
              <h4 className="font-semibold text-red-700 mb-3 lg:mb-4 text-base lg:text-lg xl:text-xl">Strategic Recommendation:</h4>
              <p className="text-muted-foreground leading-relaxed text-sm lg:text-base xl:text-lg">
                Given your current CAC challenges, implementing a strategic YouTube advertising campaign 
                could be the single most impactful change to optimize your customer acquisition funnel. 
                This investment in YouTube marketing and content creation could directly address your 
                biggest valuation gap and potentially unlock the full 
                <strong className="text-red-600"> {formatCurrency(valuation.leftOnTable)}</strong> opportunity.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
