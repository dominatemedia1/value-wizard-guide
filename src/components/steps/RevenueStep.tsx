
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface RevenueStepProps {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
}

const RevenueStep = ({ value, onChange, onNext }: RevenueStepProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value > 0) {
      onNext();
    }
  };

  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  const formatNumber = (num: number): string => {
    if (num === 0) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="space-y-8" onKeyPress={handleKeyPress} tabIndex={0}>
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          What's your current Annual Recurring Revenue?
        </h2>
        <p className="text-muted-foreground">
          This helps our AI analyze your company's revenue scale and market position.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <label className="text-sm font-medium text-foreground">
            Annual Recurring Revenue: {formatNumber(value)}
          </label>
          <div className="px-4">
            <Slider
              value={[value]}
              onValueChange={handleSliderChange}
              max={10000000}
              min={0}
              step={10000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>$0</span>
              <span>$2.5M</span>
              <span>$5M</span>
              <span>$7.5M</span>
              <span>$10M</span>
            </div>
          </div>
        </div>

        {value > 0 && (
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              💡 <strong>AI Insight:</strong> Your revenue scale helps our AI determine appropriate valuation multiples and growth benchmarks.
            </p>
          </div>
        )}
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
