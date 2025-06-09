
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, '');
    onChange(Number(inputValue));
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

  const quickSelectOptions = [
    { value: 0, label: '$0' },
    { value: 100000, label: '$100K' },
    { value: 500000, label: '$500K' },
    { value: 1000000, label: '$1M' },
    { value: 2500000, label: '$2.5M' },
    { value: 5000000, label: '$5M' },
    { value: 10000000, label: '$10M' },
    { value: 25000000, label: '$25M+' }
  ];

  return (
    <div className="space-y-8" onKeyPress={handleKeyPress} tabIndex={0}>
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          What is your current ANNUAL recurring revenue (ARR)?
        </h2>
        <p className="text-muted-foreground">
          We're asking you this so we can provide accurate valuation benchmarks that are going to have a meaningful impact on your company's enterprise value.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-2xl font-bold text-foreground">{formatNumber(value)}</span>
          </div>
          <div className="px-4">
            <Slider
              value={[value]}
              onValueChange={handleSliderChange}
              max={25000000}
              min={0}
              step={10000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>$0</span>
              <span>$6.25M</span>
              <span>$12.5M</span>
              <span>$18.75M</span>
              <span>$25M+</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Quick Select:</p>
          <div className="grid grid-cols-4 gap-2">
            {quickSelectOptions.map((option) => (
              <Button
                key={option.value}
                variant={value === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => onChange(option.value)}
                className="h-8 text-xs border border-border hover:border-primary transition-colors"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Or enter manually ($)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg">$</span>
            <Input
              type="text"
              placeholder="Enter your ARR"
              value={formatNumber(value).replace('$', '')}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="text-lg py-3 pl-8 border border-border hover:border-primary focus:border-primary transition-colors"
            />
          </div>
        </div>

        {value > 0 && (
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground">
              💡 <strong>AI Insight:</strong> Your revenue scale helps our AI determine appropriate valuation multiples and growth benchmarks.
            </p>
          </div>
        )}
      </div>

      <Button 
        onClick={onNext}
        disabled={value === 0}
        className="w-full bg-primary hover:bg-primary-dark text-white py-3 text-lg font-semibold border border-transparent hover:border-primary transition-colors"
      >
        Continue →
      </Button>
    </div>
  );
};

export default RevenueStep;
