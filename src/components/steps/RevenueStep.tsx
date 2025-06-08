
import React from 'react';
import { Button } from '@/components/ui/button';
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, '');
    onChange(Number(inputValue));
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          What's your current Annual Recurring Revenue?
        </h2>
        <p className="text-muted-foreground">
          This helps our AI analyze your company's revenue scale and market position.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Annual Recurring Revenue ($)
          </label>
          <Input
            type="text"
            placeholder="Enter your ARR"
            value={value || ''}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="text-lg py-3"
          />
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
