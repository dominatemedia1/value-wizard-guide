
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

interface GrowthRateStepProps {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
}

const GrowthRateStep = ({ value, onChange, onNext }: GrowthRateStepProps) => {
  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(e.target.value) || 0;
    if (inputValue >= -250 && inputValue <= 250) {
      onChange(inputValue);
    }
  };

  const quickSelectOptions = [
    { value: -10, label: '-10%' },
    { value: -5, label: '-5%' },
    { value: 0, label: '0%' },
    { value: 5, label: '5%' },
    { value: 10, label: '10%' },
    { value: 20, label: '20%' },
    { value: 50, label: '50%' },
    { value: 250, label: '250%+' }
  ];

  const formatPercentage = (num: number): string => {
    if (num > 0) return `+${num}%`;
    if (num < 0) return `${num}%`;
    return `${num}%`;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h3 className="text-xl text-foreground">
          What's your quarter-over-quarter growth rate?
        </h3>
        <p className="text-muted-foreground">
          This directly impacts your valuation multiple. Be as accurate as possible.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-2xl font-bold text-foreground">{formatPercentage(value)}</span>
          </div>
          
          <div className="px-4">
            <Slider
              value={[value]}
              onValueChange={handleSliderChange}
              max={250}
              min={-250}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>-250%</span>
              <span>-125%</span>
              <span>0%</span>
              <span>125%</span>
              <span>250%+</span>
            </div>
            <div className="text-center text-sm text-muted-foreground mt-2">
              Current QoQ Growth
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
                className="h-8 text-xs border border-border hover:border-primary transition-colors"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Or enter manually (%)
          </label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              min="-250"
              max="250"
              step="0.1"
              value={value}
              onChange={handleInputChange}
              className="text-center border border-border hover:border-primary focus:border-primary transition-colors"
              placeholder="0"
            />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        </div>

        {value !== 0 && (
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground">
              💡 <strong>AI Analysis:</strong> Growth rates above 40% typically command premium valuations in our AI model, while sustainable 20%+ growth is considered healthy.
            </p>
          </div>
        )}
      </div>

      <Button 
        onClick={onNext}
        className="w-full bg-primary hover:bg-primary-dark text-white py-3 text-lg font-semibold border border-transparent hover:border-primary transition-colors"
      >
        Continue →
      </Button>
    </div>
  );
};

export default GrowthRateStep;
