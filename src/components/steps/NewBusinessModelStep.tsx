
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface NewBusinessModelStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

const NewBusinessModelStep = ({ value, onChange, onNext }: NewBusinessModelStepProps) => {
  const options = [
    {
      id: 'b2b',
      label: 'B2B',
      description: 'Selling to businesses who have money'
    },
    {
      id: 'b2c',
      label: 'B2C',
      description: 'Selling to humans who complain about prices'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          Are you B2B or B2C?
        </h2>
        <p className="text-muted-foreground">
          This directly impacts your valuation multiple.
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
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  value === option.id ? 'bg-primary border-primary' : 'border-muted-foreground'
                }`} />
                <div>
                  <div className="font-semibold text-foreground text-lg">{option.label}</div>
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

export default NewBusinessModelStep;
