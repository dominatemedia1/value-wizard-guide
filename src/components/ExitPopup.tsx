
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';

interface ExitPopupProps {
  onClose: () => void;
  onContinue: () => void;
}

const ExitPopup = ({ onClose, onContinue }: ExitPopupProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-[45px] p-4 z-50">
      <Card className="w-full max-w-md bg-card shadow-2xl animate-scale-in">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-foreground">HOLD YOUR HORSES BUDDY.</h3>
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
            <p className="text-foreground">
              C'mon, you can't sit still and ✨focus✨ for the next 53 seconds to finish the quiz that'll get your hot little hands on the formula that will quite literally 12x your SaaS' current valuation ($497 value)?
            </p>

            <div className="flex justify-center">
              <iframe 
                src="https://lottie.host/embed/e27544af-1d2a-4828-9192-d669294990fe/yjNbxuCSBM.lottie" 
                width="300" 
                height="200"
                className="border-0"
              ></iframe>
            </div>

            <div className="flex space-x-3">
              <Button 
                onClick={onContinue}
                className="flex-1 bg-primary hover:bg-primary-dark text-white"
              >
                GIVE ME THE $497 FORMULA FOR FREE
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="px-4"
              >
                Exit
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Privacy Policy: There is a special place in hell for spammers and we never wanna visit.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExitPopup;
