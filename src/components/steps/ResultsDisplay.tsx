
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
      console.log('📋 Share button clicked, generating URL...');
      
      // Generate a proper shareable URL with the data
      const shareableUrl = generateLocalResultsUrl(valuationData);
      console.log('📋 Generated shareable URL:', shareableUrl);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareableUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      console.log('📋 Successfully copied URL to clipboard');
    } catch (error) {
      console.error('❌ Failed to copy URL:', error);
      
      // Fallback - try to copy current URL
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        console.log('📋 Copied current URL as fallback');
      } catch (fallbackError) {
        console.error('❌ Clipboard access failed completely:', fallbackError);
        alert('Unable to copy link. Please copy the URL manually from your browser.');
      }
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
    <div className="space-y-16 max-w-7xl mx-auto">
      {/* Hero Section - Optimized for desktop */}
      <div className="text-center space-y-10">
        <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-8">
          <Calculator className="w-14 h-14 text-primary" />
        </div>
        
        <div className="space-y-6">
          <h1 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent leading-tight">
            Your Complete Valuation Analysis
          </h1>
          
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            AI-powered valuation analysis based on 15,000+ company benchmarks
          </p>
        </div>

        {/* Share buttons */}
        <div className="flex justify-center gap-6 pt-6">
          <Button onClick={handleShare} variant="outline" size="lg" className="text-lg px-8 py-4">
            {copySuccess ? (
              <>
                <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
                Link Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 mr-3" />
                Copy Share Link
              </>
            )}
          </Button>
          <Button onClick={handleViewExternal} variant="outline" size="lg" className="text-lg px-8 py-4">
            <ExternalLink className="w-5 h-5 mr-3" />
            View on Dominate Media
          </Button>
        </div>
        
        {/* Enhanced value cards with better desktop spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl mx-auto pt-12">
          <Card className="border-2 border-primary/20 relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-12 -mt-12"></div>
            <CardContent className="p-10 text-center relative">
              <h3 className="text-2xl font-semibold text-muted-foreground mb-6">Current Valuation</h3>
              <p className="text-5xl font-bold text-primary mb-4">{formatCurrency(valuation.current)}</p>
              <p className="text-lg text-muted-foreground">
                {(valuation.current / valuationData.arrSliderValue).toFixed(1)}x Revenue Multiple
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-green-500/20 relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -mr-12 -mt-12"></div>
            <CardContent className="p-10 text-center relative">
              <h3 className="text-2xl font-semibold text-muted-foreground mb-6">Optimized Valuation</h3>
              <p className="text-5xl font-bold text-green-600 mb-4">{formatCurrency(valuation.optimized)}</p>
              <p className="text-lg text-muted-foreground">
                {((valuation.optimized / valuation.current - 1) * 100).toFixed(0)}% Increase Potential
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-orange-500/20 relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -mr-12 -mt-12"></div>
            <CardContent className="p-10 text-center relative">
              <h3 className="text-2xl font-semibold text-muted-foreground mb-6">Opportunity Value</h3>
              <p className="text-5xl font-bold text-orange-600 mb-4">{formatCurrency(valuation.leftOnTable)}</p>
              <p className="text-lg text-muted-foreground">
                Money Left on the Table
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* YouTube Marketing Enhancement Section - Larger for desktop */}
      <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-xl">
        <CardContent className="p-12">
          <h2 className="text-4xl font-bold text-foreground mb-10 flex items-center">
            <Play className="w-10 h-10 text-red-600 mr-4" />
            YouTube Marketing: Your Growth Catalyst
          </h2>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 border border-red-100">
            <h3 className="text-2xl font-semibold text-foreground mb-6 flex items-center">
              <TrendingUp className="w-7 h-7 mr-4 text-red-600" />
              Transform Your Customer Acquisition with YouTube Ads
            </h3>
            <p className="text-muted-foreground mb-8 text-xl leading-relaxed">
              Based on your current CAC efficiency metrics, YouTube advertising represents your biggest opportunity 
              to optimize marketing spend and dramatically improve acquisition costs. This could be the key factor 
              in unlocking that <strong className="text-red-600">{formatCurrency(valuation.leftOnTable)}</strong> opportunity value.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-red-50 rounded-2xl p-8">
                <h4 className="font-semibold text-red-700 mb-4 text-xl">Why YouTube Ads Excel for SaaS:</h4>
                <ul className="space-y-3 text-base text-muted-foreground">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    Lower cost-per-click than Google Ads
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    Higher engagement and conversion rates
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    Superior brand building capabilities
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    Precise B2B audience targeting
                  </li>
                </ul>
              </div>
              <div className="bg-orange-50 rounded-2xl p-8">
                <h4 className="font-semibold text-orange-700 mb-4 text-xl">Expected Impact on Your Metrics:</h4>
                <ul className="space-y-3 text-base text-muted-foreground">
                  <li className="flex items-start">
                    <Trophy className="w-5 h-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                    30-50% reduction in customer acquisition cost
                  </li>
                  <li className="flex items-start">
                    <Trophy className="w-5 h-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                    2-3x improvement in conversion rates
                  </li>
                  <li className="flex items-start">
                    <Trophy className="w-5 h-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                    Enhanced brand recognition and trust
                  </li>
                  <li className="flex items-start">
                    <Trophy className="w-5 h-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                    Scalable, predictable lead generation
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-2xl p-8">
              <h4 className="font-semibold text-red-700 mb-4 text-xl">Strategic Recommendation:</h4>
              <p className="text-muted-foreground leading-relaxed text-lg">
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
