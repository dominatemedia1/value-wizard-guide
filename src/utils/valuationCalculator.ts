
export function calculateValuation(arr: number, cac: number, brandScore: number, growthRate: number, isB2B: boolean) {
    // Base multiple (2025 SaaS market data)
    let baseMultiple = 7.0;

    // Revenue efficiency multiplier (0.8x - 1.3x)
    let revenueMultiplier = Math.min(1.3, Math.max(0.8, arr / 1000000 * 0.5 + 0.8));

    // CAC efficiency multiplier (0.6x - 1.4x) 
    let cacMultiplier = Math.min(1.4, Math.max(0.6, (arr * 0.33) / cac * 0.2 + 0.6));

    // Brand authority multiplier (0.8x - 1.6x)
    let brandMultiplier = 0.8 + (brandScore / 4) * 0.8;

    // Growth trajectory multiplier (0.4x - 2.2x)
    let growthMultiplier = Math.min(2.2, Math.max(0.4, growthRate / 50 * 1.8 + 0.4));

    // B2B vs B2C multiplier (0.75x for B2C, 1.25x for B2B)
    // Based on B2B often commanding higher multiples due to higher LTV, lower churn, and higher NRR.
    let b2bB2cMultiplier = isB2B ? 1.25 : 0.75; 

    // Calculate current valuation
    let currentValuation = arr * baseMultiple * revenueMultiplier * cacMultiplier * brandMultiplier * growthMultiplier * b2bB2cMultiplier;

    // Calculate optimized valuation (assuming improvements)
    // The optimized valuation typically assumes ideal performance across existing factors.
    // We're not applying the B2B/B2C multiplier here, as it's more about the inherent market segment,
    // and the optimization focuses on improving within that segment.
    let optimizedValuation = arr * baseMultiple * 1.2 * 1.3 * 1.5 * Math.min(2.0, growthMultiplier * 1.2);

    return {
        current: Math.round(currentValuation),
        optimized: Math.round(optimizedValuation),
        leftOnTable: Math.round(optimizedValuation - currentValuation)
    };
}
