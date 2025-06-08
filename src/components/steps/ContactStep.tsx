
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Mail } from 'lucide-react';

interface ContactStepProps {
  firstName: string;
  email: string;
  phone: string;
  companyName: string;
  website: string;
  onFirstNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onCompanyNameChange: (value: string) => void;
  onWebsiteChange: (value: string) => void;
  onNext: () => void;
}

const ContactStep = ({ 
  firstName, 
  email, 
  phone, 
  companyName, 
  website, 
  onFirstNameChange, 
  onEmailChange, 
  onPhoneChange, 
  onCompanyNameChange, 
  onWebsiteChange, 
  onNext 
}: ContactStepProps) => {
  const [showContactFields, setShowContactFields] = React.useState(true);

  useEffect(() => {
    // Check for UTM parameters
    const urlParams = new URLSearchParams(window.location.search);
    const utmFirstName = urlParams.get('first_name');
    const utmEmail = urlParams.get('email');
    const utmPhone = urlParams.get('phone');

    // If UTM parameters exist and are not empty, populate the fields and hide them
    if (utmFirstName && utmFirstName.trim() !== '') {
      onFirstNameChange(utmFirstName);
      setShowContactFields(false);
    }
    if (utmEmail && utmEmail.trim() !== '') {
      onEmailChange(utmEmail);
      setShowContactFields(false);
    }
    if (utmPhone && utmPhone.trim() !== '') {
      onPhoneChange(utmPhone);
      setShowContactFields(false);
    }
  }, [onFirstNameChange, onEmailChange, onPhoneChange]);

  const isValid = firstName.trim().length > 0 && 
                  email.trim().length > 0 && 
                  phone.trim().length > 0 && 
                  companyName.trim().length > 0 && 
                  website.trim().length > 0;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          Almost there! Get your personalized AI valuation report
        </h2>
        <p className="text-muted-foreground">
          We'll send your comprehensive AI-powered valuation analysis to help you understand your company's worth.
        </p>
      </div>

      <div className="space-y-6">
        {showContactFields && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                First Name *
              </label>
              <Input
                type="text"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => onFirstNameChange(e.target.value)}
                className="text-lg py-3"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email *
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                className="text-lg py-3"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Phone *
              </label>
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
                className="text-lg py-3"
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Company Name *
          </label>
          <Input
            type="text"
            placeholder="Enter your company name"
            value={companyName}
            onChange={(e) => onCompanyNameChange(e.target.value)}
            className="text-lg py-3"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Website *
          </label>
          <Input
            type="url"
            placeholder="https://yourcompany.com"
            value={website}
            onChange={(e) => onWebsiteChange(e.target.value)}
            className="text-lg py-3"
          />
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">Your data is secure</span>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1 ml-7">
            <li>• We never share your information with third parties</li>
            <li>• All data is encrypted and stored securely</li>
            <li>• You can request deletion at any time</li>
          </ul>
        </div>

        <div className="bg-primary-light/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">What you'll receive:</p>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• AI-powered detailed valuation breakdown with methodology</li>
                <li>• Benchmarking against industry standards</li>
                <li>• Actionable insights to increase your valuation</li>
                <li>• Market comparables and trending data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Button 
        onClick={onNext}
        disabled={!isValid}
        className="w-full bg-primary hover:bg-primary-dark text-white py-3 text-lg font-semibold"
      >
        Generate My AI Valuation Report →
      </Button>
    </div>
  );
};

export default ContactStep;
