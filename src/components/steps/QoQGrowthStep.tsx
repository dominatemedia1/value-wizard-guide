
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface QoQGrowthStepProps {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
}

const QoQGrowthStep = ({ value, onChange, onNext }: QoQGrowthStepProps) => {
  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          What's your quarter-over-quarter growth rate?
        </h2>
        <p className="text-muted-foreground">
          This directly impacts your valuation multiple, so be as accurate as possible.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-3xl font-bold text-primary">
              {value >= 0 ? '+' : ''}{value}%
            </span>
          </div>
          <div className="px-4">
            <Slider
              value={[value]}
              onValueChange={handleSliderChange}
              max={100}
              min={-50}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>-50%</span>
              <span>0%</span>
              <span>+100%</span>
            </div>
          </div>
        </div>

        {value < 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800">
              Declining? Hey, it happens. Even Netflix had a rough quarter.
            </p>
          </div>
        )}
      </div>

      <Button 
        onClick={onNext}
        className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg font-semibold"
      >
        Continue →
      </Button>
    </div>
  );
};

export default QoQGrowthStep;
