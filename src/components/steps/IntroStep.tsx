
import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, Users, TrendingUp } from 'lucide-react';

interface IntroStepProps {
  onNext: () => void;
}

const IntroStep = ({ onNext }: IntroStepProps) => {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-light/20 rounded-full mb-4">
          <TrendingUp className="w-10 h-10 text-primary" />
        </div>
        
        <div className="space-y-2">
          <p className="text-lg font-semibold text-muted-foreground">
            YOU'RE ONE STEP CLOSER TO YOUR…
          </p>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">
            FREE AI SAAS VALUATION CALCULATOR
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Claim your 100% FREE no-bullsh*t AI-powered valuation calculator and growth map ($497 value). This is strictly for founders who are hungry for the exact formula that 2,847 SaaS companies used to explode their enterprise value and market share!
          </p>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-6 max-w-sm mx-auto">
        <div className="flex items-center justify-center space-x-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="text-sm font-medium text-foreground">4.72/5 stars</p>
        <p className="text-xs text-muted-foreground">from 232 reviews</p>
      </div>

      <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Users className="w-4 h-4" />
          <span>10,000+ valuations completed</span>
        </div>
      </div>

      <Button 
        onClick={onNext}
        size="lg"
        className="bg-primary hover:bg-primary-dark text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105"
      >
        Get Started →
      </Button>

      <p className="text-xs text-muted-foreground">
        Free • No credit card required • 2-minute setup
      </p>
    </div>
  );
};

export default IntroStep;
