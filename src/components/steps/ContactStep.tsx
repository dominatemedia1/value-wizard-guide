
import React, { useEffect, useState } from 'react';
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
  const [showContactFields, setShowContactFields] = useState(true);
  const [displayFirstName, setDisplayFirstName] = useState('');

  useEffect(() => {
    // Check for UTM parameters
    const urlParams = new URLSearchParams(window.location.search);
    const utmFirstName = urlParams.get('first_name');
    const utmEmail = urlParams.get('email');
    const utmPhone = urlParams.get('phone');

    // If UTM parameters exist and are not empty, populate the fields and hide them
    if (utmFirstName && utmFirstName.trim() !== '') {
      onFirstNameChange(utmFirstName);
      setDisplayFirstName(utmFirstName);
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

  const isValidWebsite = (url: string): boolean => {
    const lowerUrl = url.toLowerCase();
    const pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return pattern.test(lowerUrl) && lowerUrl.includes('.');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9\-\+\(\)\s]/g, '');
    onPhoneChange(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      onNext();
    }
  };

  const isValid = firstName.trim().length > 0 && 
                  email.trim().length > 0 && 
                  email.includes('@') &&
                  phone.trim().length > 0 && 
                  companyName.trim().length > 0 && 
                  website.trim().length > 0 &&
                  isValidWebsite(website);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h3 className="text-xl text-foreground">
          Last step, {displayFirstName || firstName || 'friend'} (pinky promise). Simply enter your details below!
        </h3>
        <p className="text-muted-foreground">
          Please fill out your details and we'll send you that valuation report to your inbox faster than you can say "califragilisticexpialidocious".
        </p>
      </div>

      <div className="space-y-6">
        {showContactFields && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                First Name**
              </label>
              <Input
                type="text"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => onFirstNameChange(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-lg py-3 border border-border hover:border-primary focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-lg py-3 border border-border hover:border-primary focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Mobile*
              </label>
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={handlePhoneChange}
                onKeyPress={handleKeyPress}
                className="text-lg py-3 border border-border hover:border-primary focus:border-primary transition-colors"
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Company Name*
          </label>
          <Input
            type="text"
            placeholder="Enter your company name"
            value={companyName}
            onChange={(e) => onCompanyNameChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="text-lg py-3 border border-border hover:border-primary focus:border-primary transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Website*
          </label>
          <Input
            type="url"
            placeholder="https://yourcompany.com"
            value={website}
            onChange={(e) => onWebsiteChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="text-lg py-3 border border-border hover:border-primary focus:border-primary transition-colors"
          />
          {website && !isValidWebsite(website) && (
            <p className="text-sm text-destructive">Please enter a valid website URL (e.g., company.com)</p>
          )}
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-3 border border-border">
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

        <div className="bg-primary-light/20 rounded-lg p-4 border border-border">
          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">What your AI report includes:</p>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• AI-powered detailed valuation breakdown with methodology</li>
                <li>• Benchmarking against industry standards using AI analysis</li>
                <li>• AI-generated actionable insights to increase your valuation</li>
                <li>• Market comparables and trending data from our AI database</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Button 
        onClick={onNext}
        disabled={!isValid}
        className="w-full bg-primary hover:bg-primary-dark text-white py-3 text-lg font-semibold border border-transparent hover:border-primary transition-colors"
      >
        Calculate My Valuation →
      </Button>
    </div>
  );
};

export default ContactStep;
