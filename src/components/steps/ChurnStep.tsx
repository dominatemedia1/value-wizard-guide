
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ChurnStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

const ChurnStep = ({ value, onChange, onNext }: ChurnStepProps) => {
  const options = [
    {
      id: 'under_2',
      label: 'Less than 2%',
      description: 'Customers stick like glue - teach us your ways'
    },
    {
      id: '2_5',
      label: '2-5%',
      description: 'Pretty solid retention, nothing to panic about'
    },
    {
      id: '5_10',
      label: '5-10%',
      description: 'Average but could be better - room for improvement'
    },
    {
      id: '10_15',
      label: '10-15%',
      description: 'Ouch, that\'s gotta hurt the bank account'
    },
    {
      id: 'over_15',
      label: 'More than 15%',
      description: 'We need to talk... seriously'
    },
    {
      id: 'dont_track',
      label: 'I don\'t track this',
      description: 'Ignorance is not bliss in SaaS, my friend'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          What's your monthly gross revenue churn rate?
        </h2>
        <p className="text-muted-foreground">
          This is the percentage of revenue lost each month from cancellations and downgrades.
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

export default ChurnStep;
