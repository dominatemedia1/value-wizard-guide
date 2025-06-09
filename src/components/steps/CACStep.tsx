
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CACStepProps {
  cac: number;
  context: string;
  onCACChange: (value: number) => void;
  onContextChange: (value: string) => void;
  onNext: () => void;
}

const CACStep = ({ cac, context, onCACChange, onContextChange, onNext }: CACStepProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && cac > 0) {
      onNext();
    }
  };

  const handleSliderChange = (values: number[]) => {
    onCACChange(values[0]);
  };

  const formatNumber = (num: number): string => {
    if (num === 0) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, '');
    onCACChange(Number(inputValue));
  };

  const quickSelectOptions = [
    { value: 0, label: '$0' },
    { value: 50, label: '$50' },
    { value: 100, label: '$100' },
    { value: 250, label: '$250' },
    { value: 500, label: '$500' },
    { value: 1000, label: '$1K' },
    { value: 2500, label: '$2.5K' },
    { value: 5000, label: '$5K+' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          What's your current Customer Acquisition Cost?
        </h2>
        <p className="text-muted-foreground">
          Our AI uses CAC data to evaluate the efficiency of your growth engine and market positioning.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <label className="text-sm font-medium text-foreground">
            Customer Acquisition Cost: {formatNumber(cac)}
          </label>
          <div className="px-4">
            <Slider
              value={[cac]}
              onValueChange={handleSliderChange}
              max={5000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>$0</span>
              <span>$1.25K</span>
              <span>$2.5K</span>
              <span>$3.75K</span>
              <span>$5K</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Quick Select:</p>
          <div className="grid grid-cols-4 gap-2">
            {quickSelectOptions.map((option) => (
              <Button
                key={option.value}
                variant={cac === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => onCACChange(option.value)}
                className="h-8 text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Or enter manually ($)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg">$</span>
            <Input
              type="text"
              placeholder="Enter your CAC"
              value={formatNumber(cac).replace('$', '')}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="text-lg py-3 pl-8"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Context
          </label>
          <Select value={context} onValueChange={onContextChange}>
            <SelectTrigger className="text-lg py-3">
              <SelectValue placeholder="Select context" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Per customer">Per customer</SelectItem>
              <SelectItem value="Per lead">Per lead</SelectItem>
              <SelectItem value="Per conversion">Per conversion</SelectItem>
              <SelectItem value="Blended CAC">Blended CAC</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {cac > 0 && (
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              💡 <strong>AI Benchmark:</strong> Our AI compares your CAC against industry standards where healthy CAC should be 1/3 or less of customer lifetime value.
            </p>
          </div>
        )}
      </div>

      <Button 
        onClick={onNext}
        disabled={cac === 0}
        className="w-full bg-primary hover:bg-primary-dark text-white py-3 text-lg font-semibold"
      >
        Continue →
      </Button>
    </div>
  );
};

export default CACStep;
