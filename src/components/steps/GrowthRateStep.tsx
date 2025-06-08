
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface GrowthRateStepProps {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
}

const GrowthRateStep = ({ value, onChange, onNext }: GrowthRateStepProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value > 0) {
      onNext();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, '');
    const numValue = Number(inputValue);
    // Cap at 999% for reasonable input
    onChange(Math.min(999, numValue));
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          What's your current year-over-year growth rate?
        </h2>
        <p className="text-muted-foreground">
          Growth rate is a critical factor in our AI's valuation algorithm and future projections.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Annual Growth Rate (%)
          </label>
          <Input
            type="text"
            placeholder="Enter growth percentage"
            value={value || ''}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="text-lg py-3"
          />
        </div>

        {value > 0 && (
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              💡 <strong>AI Analysis:</strong> Growth rates above 40% typically command premium valuations in our AI model, while sustainable 20%+ growth is considered healthy.
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

export default GrowthRateStep;
