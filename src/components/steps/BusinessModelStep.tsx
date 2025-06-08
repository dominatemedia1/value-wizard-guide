
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Users } from 'lucide-react';

interface BusinessModelStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

const BusinessModelStep = ({ value, onChange, onNext }: BusinessModelStepProps) => {
  const options = [
    {
      id: 'b2b',
      title: 'B2B (Business to Business)',
      description: 'Selling products or services to other businesses',
      icon: Building2,
      examples: 'SaaS, Enterprise software, Professional services'
    },
    {
      id: 'b2c',
      title: 'B2C (Business to Consumer)',
      description: 'Selling products or services directly to consumers',
      icon: Users,
      examples: 'E-commerce, Mobile apps, Consumer services'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          Are you B2B or B2C?
        </h2>
        <p className="text-muted-foreground">
          Business model significantly impacts valuation methodology and multiples.
        </p>
      </div>

      <div className="space-y-4">
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <Card
              key={option.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                value === option.id 
                  ? 'ring-2 ring-primary bg-primary-light/10' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => onChange(option.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    value === option.id 
                      ? 'bg-primary text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{option.title}</h3>
                    <p className="text-muted-foreground mb-2">{option.description}</p>
                    <p className="text-sm text-muted-foreground italic">
                      Examples: {option.examples}
                    </p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 ${
                    value === option.id 
                      ? 'bg-primary border-primary' 
                      : 'border-muted-foreground'
                  }`}>
                    {value === option.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
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

export default BusinessModelStep;
