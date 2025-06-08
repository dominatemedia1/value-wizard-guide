
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface GrowthRateStepProps {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
}

const GrowthRateStep = ({ value, onChange, onNext }: GrowthRateStepProps) => {
  const formatGrowthRate = (rate: number) => {
    return `${rate}%`;
  };

  const getGrowthCategory = (rate: number) => {
    if (rate >= 40) return { label: 'Hypergrowth', color: 'text-green-600' };
    if (rate >= 20) return { label: 'High Growth', color: 'text-primary' };
    if (rate >= 10) return { label: 'Steady Growth', color: 'text-blue-600' };
    if (rate >= 0) return { label: 'Slow Growth', color: 'text-yellow-600' };
    return { label: 'Declining', color: 'text-red-600' };
  };

  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  const category = getGrowthCategory(value);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          What's your quarter-over-quarter growth rate?
        </h2>
        <p className="text-muted-foreground">
          Growth rate is one of the most important factors in determining your valuation multiple.
        </p>
      </div>

      <div className="space-y-8">
        <div className="text-center">
          <div className="inline-block bg-primary-light/20 rounded-lg px-6 py-4 mb-4">
            <span className="text-4xl font-bold text-primary">
              {formatGrowthRate(value)}
            </span>
          </div>
          <p className={`text-lg font-semibold ${category.color}`}>
            {category.label}
          </p>
        </div>

        <div className="space-y-4">
          <Slider
            value={[value]}
            onValueChange={handleSliderChange}
            max={100}
            min={-20}
            step={1}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>-20%</span>
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[5, 15, 25, 50].map((rate) => (
            <Button
              key={rate}
              variant="outline"
              size="sm"
              onClick={() => onChange(rate)}
              className={value === rate ? 'bg-primary text-white' : ''}
            >
              {rate}%
            </Button>
          ))}
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Pro Tip:</strong> Companies with 40%+ QoQ growth typically command premium valuations.
          </p>
        </div>
      </div>

      <Button 
        onClick={onNext}
        className="w-full bg-primary hover:bg-primary-dark text-white py-3 text-lg font-semibold"
      >
        Continue →
      </Button>
    </div>
  );
};

export default GrowthRateStep;
