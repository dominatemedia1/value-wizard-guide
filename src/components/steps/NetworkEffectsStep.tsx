
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface NetworkEffectsStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

const NetworkEffectsStep = ({ value, onChange, onNext }: NetworkEffectsStepProps) => {
  const options = [
    {
      id: 'strong',
      title: 'Strong Market Presence',
      description: 'Well-known brand, significant market share, loyal customer base'
    },
    {
      id: 'moderate',
      title: 'Moderate Market Presence',
      description: 'Growing brand recognition, established in niche markets'
    },
    {
      id: 'emerging',
      title: 'Emerging Market Presence',
      description: 'Building brand awareness, early-stage market penetration'
    },
    {
      id: 'limited',
      title: 'Limited Market Presence',
      description: 'New to market, minimal brand recognition'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          How would you rate your brand's market presence?
        </h2>
        <p className="text-muted-foreground">
          Network effects and brand strength significantly impact valuation multiples.
        </p>
      </div>

      <div className="space-y-4">
        {options.map((option) => (
          <Card
            key={option.id}
            className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
              value === option.id 
                ? 'ring-2 ring-primary bg-primary-light/10' 
                : 'hover:shadow-md'
            }`}
            onClick={() => onChange(option.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                  value === option.id 
                    ? 'bg-primary border-primary' 
                    : 'border-muted-foreground'
                }`} />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{option.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button 
        onClick={onNext}
        disabled={!value}
        className="w-full bg-primary hover:bg-primary-dark text-white py-3 text-lg font-semibold"
      >
        Continue →
      </Button>
    </div>
  );
};

export default NetworkEffectsStep;
