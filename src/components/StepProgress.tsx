
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft } from 'lucide-react';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
  showResultsWaiting: boolean;
  showResults: boolean;
  isSubmitted: boolean;
  previousStep: () => void;
}

const StepProgress = ({
  currentStep,
  totalSteps,
  progress,
  showResultsWaiting,
  showResults,
  isSubmitted,
  previousStep
}: StepProgressProps) => {
  if (currentStep < 0 || currentStep >= totalSteps - 1 || showResultsWaiting || showResults) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {totalSteps - 1}
        </span>
        <span className="text-sm text-muted-foreground">
          {Math.round(progress)}% Complete
        </span>
      </div>
      <Progress value={progress} className="h-2" />
      
      {currentStep > 0 && !isSubmitted && (
        <Button
          variant="ghost"
          size="sm"
          onClick={previousStep}
          className="mt-4 text-muted-foreground hover:text-foreground border border-border hover:border-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      )}
    </div>
  );
};

export default StepProgress;
