
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

  const formatNumber = (num: number): string => {
    if (num === 0) return '';
    return new Intl.NumberFormat('en-US').format(num);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, '');
    onCACChange(Number(inputValue));
  };

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
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Customer Acquisition Cost ($)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg">$</span>
            <Input
              type="text"
              placeholder="Enter your CAC"
              value={formatNumber(cac)}
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
