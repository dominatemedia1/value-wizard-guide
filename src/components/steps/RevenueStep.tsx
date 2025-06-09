
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

  const formatNumber = (num: number): string => {
    if (num === 0) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const revenueOptions = [
    { value: 0, label: '$0 - Just Starting' },
    { value: 100000, label: '$100K - $500K' },
    { value: 500000, label: '$500K - $1M' },
    { value: 1000000, label: '$1M - $2M' },
    { value: 2000000, label: '$2M - $5M' },
    { value: 5000000, label: '$5M - $10M' },
    { value: 10000000, label: '$10M+' }
  ];

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

      <div className="space-y-4">
        {revenueOptions.map((option) => (
          <Card
            key={option.value}
            className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
              value === option.value 
                ? 'ring-2 ring-primary bg-primary-light/10' 
                : 'hover:shadow-md'
            }`}
            onClick={() => onChange(option.value)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  value === option.value 
                    ? 'bg-primary border-primary' 
                    : 'border-muted-foreground'
                }`} />
                <h3 className="font-semibold text-foreground text-lg">{option.label}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {value > 0 && (
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            💡 <strong>AI Insight:</strong> Your revenue scale helps our AI determine appropriate valuation multiples and growth benchmarks.
          </p>
        </div>
      )}

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
