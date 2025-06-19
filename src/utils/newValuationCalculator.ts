export interface NewValuationData {
  arrSliderValue: number;
  revenueChurn: string;
  qoqGrowthRate: number;
  cac: number;
  cacContext: string;
  profitability: string;
  marketGravity: string;
  isB2B: boolean;
}

export function calculateAccurateValuation(data: NewValuationData) {
  // Base multiple: 2x (Updated per request)
  const baseMultiple = 2;
  
  // Convert ARR slider value to actual number
  let arr = data.arrSliderValue;
  
  // 1. GROWTH MULTIPLIER (Research: Primary valuation driver)
  // Now treating qoqGrowthRate as annual growth rate since we changed to year-over-year
  let annualGrowthRate = data.qoqGrowthRate / 100;
  
  let growthMultiplier;
  if (annualGrowthRate < -0.1) {
    growthMultiplier = 0.4; // Declining >10%
  } else if (annualGrowthRate < 0) {
    growthMultiplier = 0.6; // Declining <10%
  } else if (annualGrowthRate < 0.2) {
    growthMultiplier = 0.8; // 0-20% growth
  } else if (annualGrowthRate < 0.4) {
    growthMultiplier = 1.0; // 20-40% growth
  } else if (annualGrowthRate < 0.6) {
    growthMultiplier = 1.3; // 40-60% growth
  } else if (annualGrowthRate < 1.0) {
    growthMultiplier = 1.6; // 60-100% growth
  } else {
    growthMultiplier = 2.0; // 100%+ growth
  }
  
  // 2. CHURN MULTIPLIER (Research: Key metric investors watch)
  let churnMultiplier;
  switch(data.revenueChurn) {
    case 'under_2': 
      churnMultiplier = 1.3; 
      break;
    case '2_5': 
      churnMultiplier = 1.1; 
      break;
    case '5_10': 
      churnMultiplier = 1.0; 
      break;
    case '10_15': 
      churnMultiplier = 0.8; 
      break;
    case 'over_15': 
      churnMultiplier = 0.6; 
      break;
    case 'dont_track': 
      churnMultiplier = 0.9; 
      break;
    default: 
      churnMultiplier = 0.9;
  }
  
  // 3. PROFITABILITY MULTIPLIER (Research: 2025 market rewards profitable)
  let profitabilityMultiplier;
  switch(data.profitability) {
    case 'profitable_20_plus': 
      profitabilityMultiplier = 1.4; 
      break;
    case 'profitable_10_20': 
      profitabilityMultiplier = 1.2; 
      break;
    case 'breakeven': 
      profitabilityMultiplier = 1.0; 
      break;
    case 'burning_clear_path': 
      profitabilityMultiplier = 0.9; 
      break;
    case 'burning_no_path': 
      profitabilityMultiplier = 0.7; 
      break;
    default: 
      profitabilityMultiplier = 0.9;
  }
  
  // 4. MARKET GRAVITY MULTIPLIER (Network Effects + Brand Authority)
  let marketGravityMultiplier;
  switch(data.marketGravity) {
    case 'massive_magnet': 
      marketGravityMultiplier = 1.3; // You're a magnet
      break;
    case 'strong_momentum': 
      marketGravityMultiplier = 1.1; // Building momentum
      break;
    case 'moderate_pull': 
      marketGravityMultiplier = 1.0; // Some pull
      break;
    case 'weak_pushing': 
      marketGravityMultiplier = 0.9; // Mostly pushing
      break;
    case 'zero_invisible': 
      marketGravityMultiplier = 0.8; // Completely invisible
      break;
    default: 
      marketGravityMultiplier = 0.9;
  }
  
  // 5. CAC EFFICIENCY (Simplified calculation)
  let cacEfficiency = 1.0; // Default
  if (data.cac && data.cacContext !== 'no_clue') {
    let monthlyCAC = data.cac / 12;
    let monthlyRevenue = data.arrSliderValue / 12;
    let cacRatio = monthlyCAC / monthlyRevenue;
    
    if (cacRatio < 0.1) {
      cacEfficiency = 1.3; // Excellent
    } else if (cacRatio < 0.2) {
      cacEfficiency = 1.1; // Good
    } else if (cacRatio < 0.3) {
      cacEfficiency = 1.0; // Average
    } else if (cacRatio < 0.5) {
      cacEfficiency = 0.9; // Poor
    } else {
      cacEfficiency = 0.7; // Very poor
    }
  }
  
  // 6. B2B/B2C MULTIPLIER (Research confirmed)
  let businessModelMultiplier = data.isB2B ? 1.1 : 0.9;
  
  // CALCULATE CURRENT VALUATION (without NRR multiplier)
  let currentValuation = arr * baseMultiple * 
    growthMultiplier * 
    churnMultiplier * 
    profitabilityMultiplier * 
    marketGravityMultiplier * 
    cacEfficiency * 
    businessModelMultiplier;
  
  // CALCULATE OPTIMIZED VALUATION (Best-in-class metrics, without NRR)
  let optimizedValuation = arr * baseMultiple * 
    1.6 * // High growth (60%+ annual)
    1.3 * // Low churn (<2% monthly)
    1.4 * // Strong profitability (20%+ margins)
    1.3 * // Massive market gravity (YOUR SOLUTION)
    1.3 * // Excellent CAC efficiency
    businessModelMultiplier;
  
  // IDENTIFY BIGGEST OPPORTUNITY (updated without NRR)
  let opportunities = [
    {
      factor: 'Growth Rate', 
      current: growthMultiplier, 
      potential: 1.6, 
      impact: arr * baseMultiple * (1.6 - growthMultiplier),
      description: 'Accelerate customer acquisition'
    },
    {
      factor: 'Revenue Retention', 
      current: churnMultiplier, 
      potential: 1.3, 
      impact: arr * baseMultiple * (1.3 - churnMultiplier),
      description: 'Reduce customer churn'
    },
    {
      factor: 'Profitability', 
      current: profitabilityMultiplier, 
      potential: 1.4, 
      impact: arr * baseMultiple * (1.4 - profitabilityMultiplier),
      description: 'Improve unit economics'
    },
    {
      factor: 'Market Gravity', 
      current: marketGravityMultiplier, 
      potential: 1.3, 
      impact: arr * baseMultiple * (1.3 - marketGravityMultiplier),
      description: 'Build brand authority and network effects'
    },
    {
      factor: 'CAC Efficiency', 
      current: cacEfficiency, 
      potential: 1.3, 
      impact: arr * baseMultiple * (1.3 - cacEfficiency),
      description: 'Optimize acquisition channels'
    }
  ];
  
  // Find the opportunity with highest impact
  let biggestOpportunity = opportunities.reduce((max, opp) => 
    opp.impact > max.impact ? opp : max
  );
  
  // Calculate competitive benchmark
  let medianValuation = arr * baseMultiple * 1.0;
  
  // Calculate scores for email variables (1-5 scale, updated without NRR)
  const cacScore = Math.round(cacEfficiency * 3.125); // Convert 0.7-1.3 to 1-5  
  const brandScore = Math.round(marketGravityMultiplier * 3.125); // Convert 0.8-1.3 to 1-5
  const growthScore = Math.round(growthMultiplier * 2.5); // Convert 0.4-2.0 to 1-5
  const churnScore = Math.round(churnMultiplier * 3.125); // Convert 0.6-1.3 to 1-5
  
  return {
    current: Math.round(currentValuation),
    optimized: Math.round(optimizedValuation),
    median: Math.round(medianValuation),
    leftOnTable: Math.round(optimizedValuation - currentValuation),
    biggestLeak: biggestOpportunity.factor,
    biggestOpportunity: Math.round(biggestOpportunity.impact),
    improvementDescription: biggestOpportunity.description,
    
    // Email template variables (updated without revenue_score/NRR)
    emailVariables: {
      current_valuation: formatCurrency(Math.round(currentValuation)),
      gap_amount: formatCurrency(Math.round(optimizedValuation - currentValuation)),
      revenue_score: Math.max(1, Math.min(5, churnScore)), // Using churn score instead of NRR
      cac_score: Math.max(1, Math.min(5, cacScore)),
      brand_score: Math.max(1, Math.min(5, brandScore)), 
      growth_score: Math.max(1, Math.min(5, growthScore)),
      biggest_leak: mapBiggestLeak(biggestOpportunity.factor),
      biggest_opportunity: formatCurrency(Math.round(biggestOpportunity.impact)),
      roi_calculation: Math.round(((optimizedValuation - currentValuation) / currentValuation) * 100 * 100) // ROI as percentage * 100
    },
    
    // Detailed breakdown for results page (updated without NRR)
    multiplierBreakdown: {
      base: baseMultiple,
      growth: growthMultiplier,
      churn: churnMultiplier,
      profitability: profitabilityMultiplier,
      marketGravity: marketGravityMultiplier,
      cac: cacEfficiency,
      businessModel: businessModelMultiplier
    },
    
    // All opportunities ranked by impact
    allOpportunities: opportunities.sort((a, b) => b.impact - a.impact),
    
    // Performance vs benchmarks
    vsMedian: Math.round(((currentValuation / medianValuation) - 1) * 100),
    vsOptimal: Math.round(((currentValuation / optimizedValuation) - 1) * 100)
  };
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K`;
  }
  return amount.toLocaleString();
}

function mapBiggestLeak(factor: string): string {
  const mapping: { [key: string]: string } = {
    'Growth Rate': 'Lead Generation', 
    'Revenue Retention': 'Brand Authority',
    'Profitability': 'Market Positioning',
    'Market Gravity': 'Brand Authority',
    'CAC Efficiency': 'Lead Generation'
  };
  return mapping[factor] || 'Brand Authority';
}
