
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NewCACStepProps {
  cac: number;
  context: string;
  onCACChange: (value: number) => void;
  onContextChange: (value: string) => void;
  onNext: () => void;
}

const NewCACStep = ({ cac, context, onCACChange, onContextChange, onNext }: NewCACStepProps) => {
  const handleCACChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onCACChange(value);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          What's your Customer Acquisition Cost (CAC)?
        </h2>
        <p className="text-muted-foreground">
          This is one of the biggest valuation multipliers.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg">$</span>
                <Input
                  type="number"
                  placeholder="Enter your CAC"
                  value={cac || ''}
                  onChange={handleCACChange}
                  className="text-lg py-3 pl-8"
                />
              </div>
            </div>
            <div className="w-48">
              <Select value={context} onValueChange={onContextChange}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="per_customer">Per customer</SelectItem>
                  <SelectItem value="per_mrr">Per MRR</SelectItem>
                  <SelectItem value="no_clue">I honestly have no clue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Pro tip:</strong> If your CAC is higher than your LTV, we need to have a serious conversation.
          </p>
        </div>
      </div>

      <Button 
        onClick={onNext}
        disabled={cac === 0 && context !== 'no_clue'}
        className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg font-semibold"
      >
        Continue →
      </Button>
    </div>
  );
};

export default NewCACStep;
