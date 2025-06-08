
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface RevenueStepProps {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
}

const RevenueStep = ({ value, onChange, onNext }: RevenueStepProps) => {
  const formatRevenue = (amount: number) => {
    if (amount >= 25000000) return '$25M+';
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toLocaleString()}`;
  };

  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          What is your current annual recurring revenue (ARR)?
        </h2>
        <p className="text-muted-foreground">
          This helps us understand the scale of your business and apply the right valuation multiple.
        </p>
      </div>

      <div className="space-y-8">
        <div className="text-center">
          <div className="inline-block bg-primary-light/20 rounded-lg px-6 py-4 mb-4">
            <span className="text-4xl font-bold text-primary">
              {formatRevenue(value)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Annual Recurring Revenue</p>
        </div>

        <div className="space-y-4">
          <Slider
            value={[value]}
            onValueChange={handleSliderChange}
            max={25000000}
            min={0}
            step={50000}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span>$5M</span>
            <span>$10M</span>
            <span>$15M</span>
            <span>$20M</span>
            <span>$25M+</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[100000, 500000, 1000000, 5000000].map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="sm"
              onClick={() => onChange(amount)}
              className={value === amount ? 'bg-primary text-white' : ''}
            >
              {formatRevenue(amount)}
            </Button>
          ))}
        </div>
      </div>

      <Button 
        onClick={onNext}
        disabled={value === 0}
        className="w-full bg-primary hover:bg-primary-dark text-white py-3 text-lg font-semibold"
      >
        Continue →
      </Button>
    </div>
  );
};

export default RevenueStep;
