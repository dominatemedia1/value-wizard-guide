
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface NetworkEffectsStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

const NetworkEffectsStep = ({ value, onChange, onNext }: NetworkEffectsStepProps) => {
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    // Check for UTM parameters for first name
    const urlParams = new URLSearchParams(window.location.search);
    const utmFirstName = urlParams.get('first_name');
    
    if (utmFirstName && utmFirstName.trim() !== '') {
      setFirstName(utmFirstName);
    }
  }, []);

  const options = [
    {
      id: 'invisible',
      title: 'Invisible',
      description: 'Prospects have never heard of us'
    },
    {
      id: 'emerging',
      title: 'Emerging',
      description: 'Some recognition in our niche'
    },
    {
      id: 'established',
      title: 'Established',
      description: 'Well-known in our market'
    },
    {
      id: 'dominant',
      title: 'Dominant',
      description: 'Clear thought leader/category king'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h3 className="text-xl text-foreground">
          {firstName ? `${firstName}, be honest...` : 'Be honest...'} How would you rate your brand's online presence and authority?
        </h3>
        <p className="text-muted-foreground">
          Don't skip the details. Are you invisible & undervalued or are you the first thought that prospects have when facing a problem?
        </p>
      </div>

      <div className="space-y-4">
        {options.map((option) => (
          <Card
            key={option.id}
            className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] border ${
              value === option.id 
                ? 'border-primary bg-primary-light/10' 
                : 'border-border hover:border-primary hover:shadow-md'
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
        className="w-full bg-primary hover:bg-primary-dark text-white py-3 text-lg font-semibold border border-transparent hover:border-primary transition-colors"
      >
        Continue →
      </Button>
    </div>
  );
};

export default NetworkEffectsStep;
