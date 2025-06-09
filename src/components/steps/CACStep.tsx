
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
          CUSTOMER ACQUISITION COST
        </h2>
        <h3 className="text-xl text-foreground">
          What's your current Customer Acquisition Cost (CAC)?
        </h3>
        <p className="text-muted-foreground">
          This is one of the biggest valuation multipliers. If you don't know this number, just enter your best estimate.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="$___"
            value={cac > 0 ? formatNumber(cac).replace('$', '') : ''}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="text-lg py-3 text-center border border-border hover:border-primary focus:border-primary transition-colors"
          />
        </div>

        <div className="space-y-2">
          <Select value={context} onValueChange={onContextChange}>
            <SelectTrigger className="text-lg py-3 border border-border hover:border-primary focus:border-primary transition-colors">
              <SelectValue placeholder="Select context" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Per customer">Per customer</SelectItem>
              <SelectItem value="Per MRR">Per MRR</SelectItem>
              <SelectItem value="I don't know">I don't know</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {cac > 0 && (
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground">
              💡 <strong>AI Benchmark:</strong> Our AI compares your CAC against industry standards where healthy CAC should be 1/3 or less of customer lifetime value.
            </p>
          </div>
        )}
      </div>

      <Button 
        onClick={onNext}
        disabled={cac === 0}
        className="w-full bg-primary hover:bg-primary-dark text-white py-3 text-lg font-semibold border border-transparent hover:border-primary transition-colors"
      >
        Continue →
      </Button>
    </div>
  );
};

export default CACStep;
