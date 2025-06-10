
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface MarketGravityStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  firstName: string;
}

const MarketGravityStep = ({ value, onChange, onNext, firstName }: MarketGravityStepProps) => {
  const options = [
    {
      id: 'massive_magnet',
      label: 'Massive market gravity - you\'re a magnet',
      description: 'People seek you out, competitors copy you'
    },
    {
      id: 'strong_momentum',
      label: 'Strong market gravity - building momentum',
      description: 'Growing recognition, increasing inbound interest'
    },
    {
      id: 'moderate_pull',
      label: 'Moderate market gravity - some pull',
      description: 'Decent brand awareness, occasional inbound'
    },
    {
      id: 'weak_pushing',
      label: 'Weak market gravity - mostly pushing',
      description: 'You\'re chasing customers, not the other way around'
    },
    {
      id: 'zero_invisible',
      label: 'Zero market gravity - completely invisible',
      description: 'What brand? You\'re a ghost in your market'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          {firstName}, be honest... How much 'market gravity' does your brand have?
        </h2>
        <p className="text-muted-foreground">
          Market gravity = when customers find YOU, when talent wants to work for YOU, when partners chase YOU.
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

export default MarketGravityStep;
