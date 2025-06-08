
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Shield, TrendingUp } from 'lucide-react';

interface ExitPopupProps {
  onClose: () => void;
  onContinue: () => void;
}

const ExitPopup = ({ onClose, onContinue }: ExitPopupProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-card shadow-2xl animate-scale-in">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-foreground">Wait! Don't leave yet</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium text-foreground">You're almost done!</p>
                <p className="text-sm text-muted-foreground">
                  Get your free valuation formula worth $2,500
                </p>
              </div>
            </div>

            <div className="bg-primary-light/20 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">What you'll get:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Comprehensive valuation methodology</li>
                <li>• Industry benchmarking data</li>
                <li>• Actionable growth recommendations</li>
                <li>• Market positioning insights</li>
              </ul>
            </div>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>100% free, no spam, unsubscribe anytime</span>
            </div>

            <div className="flex space-x-3">
              <Button 
                onClick={onContinue}
                className="flex-1 bg-primary hover:bg-primary-dark text-white"
              >
                Continue Valuation
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="px-4"
              >
                Exit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExitPopup;
