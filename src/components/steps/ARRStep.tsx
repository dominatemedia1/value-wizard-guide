
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface ARRStepProps {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
}

const ARRStep = ({ value, onChange, onNext }: ARRStepProps) => {
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
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleNext = () => {
    if (value < 250000) {
      alert('Sorry, this tool is designed for companies with at least $250K in annual recurring revenue. Please reach out to us directly if you\'d like a custom valuation assessment.');
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-8" onKeyPress={handleKeyPress} tabIndex={0}>
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          What is your current ANNUAL recurring revenue (ARR)?
        </h2>
        <p className="text-muted-foreground">
          We need this to provide accurate valuation benchmarks for your company's enterprise value.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-3xl font-bold text-primary">{formatNumber(value)}</span>
          </div>
          <div className="px-4">
            <Slider
              value={[value]}
              onValueChange={handleSliderChange}
              max={20000000}
              min={0}
              step={50000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>$0</span>
              <span>$20M+</span>
            </div>
          </div>
        </div>

        {value > 0 && value < 250000 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              ⚠️ This tool is designed for companies with at least $250K ARR. Please contact us for a custom assessment.
            </p>
          </div>
        )}
      </div>

      <Button 
        onClick={handleNext}
        disabled={value === 0}
        className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg font-semibold"
      >
        Continue →
      </Button>
    </div>
  );
};

export default ARRStep;
