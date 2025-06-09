
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

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
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
