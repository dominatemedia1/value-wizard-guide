
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
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          What's your current Customer Acquisition Cost?
        </h2>
        <p className="text-muted-foreground">
          Understanding your CAC helps us evaluate the efficiency of your growth engine.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Customer Acquisition Cost ($)
          </label>
          <Input
            type="number"
            placeholder="Enter your CAC"
            value={cac || ''}
            onChange={(e) => onCACChange(Number(e.target.value))}
            className="text-lg py-3"
          />
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
              💡 <strong>Industry Benchmark:</strong> A healthy CAC should be 1/3 or less of your customer lifetime value (LTV).
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
