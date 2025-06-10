
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface NRRStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  firstName: string;
}

const NRRStep = ({ value, onChange, onNext, firstName }: NRRStepProps) => {
  const options = [
    {
      id: 'below_90',
      label: 'Below 90%',
      description: 'Your customers are shrinking faster than your confidence'
    },
    {
      id: '90_100',
      label: '90-100%',
      description: 'Stable but not exciting - like vanilla ice cream'
    },
    {
      id: '100_110',
      label: '100-110%',
      description: 'Decent expansion, you\'re getting somewhere'
    },
    {
      id: '110_120',
      label: '110-120%',
      description: 'Now we\'re talking - solid retention game'
    },
    {
      id: '120_plus',
      label: '120%+',
      description: 'You beautiful unicorn, you'
    },
    {
      id: 'dont_track',
      label: 'I don\'t track this',
      description: 'Houston, we have a problem'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          {firstName}, what's your Net Revenue Retention (NRR) rate?
        </h2>
        <p className="text-muted-foreground">
          This is THE most important valuation driver (seriously, investors obsess over this number).
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

export default NRRStep;
