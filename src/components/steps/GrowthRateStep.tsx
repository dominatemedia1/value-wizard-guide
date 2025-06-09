
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface GrowthRateStepProps {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
}

const GrowthRateStep = ({ value, onChange, onNext }: GrowthRateStepProps) => {
  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  const quickSelectOptions = [
    { value: 0, label: '0%' },
    { value: 10, label: '10%' },
    { value: 25, label: '25%' },
    { value: 50, label: '50%' },
    { value: 75, label: '75%' },
    { value: 100, label: '100%' },
    { value: 150, label: '150%' },
    { value: 200, label: '200%+' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          What's your current year-over-year growth rate?
        </h2>
        <p className="text-muted-foreground">
          Growth rate is a critical factor in our AI's valuation algorithm and future projections.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <label className="text-sm font-medium text-foreground">
            Annual Growth Rate: {value}%
          </label>
          <div className="px-4">
            <Slider
              value={[value]}
              onValueChange={handleSliderChange}
              max={200}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
              <span>150%</span>
              <span>200%</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Quick Select:</p>
          <div className="grid grid-cols-4 gap-2">
            {quickSelectOptions.map((option) => (
              <Button
                key={option.value}
                variant={value === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => onChange(option.value)}
                className="h-8 text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {value > 0 && (
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              💡 <strong>AI Analysis:</strong> Growth rates above 40% typically command premium valuations in our AI model, while sustainable 20%+ growth is considered healthy.
            </p>
          </div>
        )}
      </div>

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

export default GrowthRateStep;
