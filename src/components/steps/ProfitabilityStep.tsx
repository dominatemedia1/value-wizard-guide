
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ProfitabilityStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

const ProfitabilityStep = ({ value, onChange, onNext }: ProfitabilityStepProps) => {
  const options = [
    {
      id: 'profitable_20_plus',
      label: 'Profitable with 20%+ margins',
      description: 'You absolute legend'
    },
    {
      id: 'profitable_10_20',
      label: 'Profitable with 10-20% margins',
      description: 'Solid, respectable business'
    },
    {
      id: 'breakeven',
      label: 'Break-even or slightly profitable',
      description: 'Walking the tightrope'
    },
    {
      id: 'burning_clear_path',
      label: 'Burning cash but path to profitability clear',
      description: 'Growth mode activated'
    },
    {
      id: 'burning_no_path',
      label: 'Burning cash with no clear path to profitability',
      description: 'We\'ve all been there'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          What's your current profitability status?
        </h2>
        <p className="text-muted-foreground">
          The 2025 market actually rewards profitable companies now.
        </p>
      </div>

      <div className="space-y-4">
        {options.map((option) => (
          <Card
            key={option.id}
            className={`cursor-pointer transition-all hover:border-primary ${
              value === option.id ? 'border-primary bg-primary/5' : 'border-border'
            }`}
            onClick={() => onChange(option.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  value === option.id ? 'bg-primary border-primary' : 'border-muted-foreground'
                }`} />
                <div>
                  <div className="font-semibold text-foreground">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button 
        onClick={onNext}
        disabled={!value}
        className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg font-semibold"
      >
        Continue →
      </Button>
    </div>
  );
};

export default ProfitabilityStep;
