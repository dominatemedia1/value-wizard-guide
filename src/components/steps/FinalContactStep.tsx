
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FinalContactStepProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  website: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onCompanyNameChange: (value: string) => void;
  onWebsiteChange: (value: string) => void;
  onNext: () => void;
}

const FinalContactStep = ({ 
  firstName, lastName, email, phone, companyName, website,
  onFirstNameChange, onLastNameChange, onEmailChange, onPhoneChange, 
  onCompanyNameChange, onWebsiteChange, onNext 
}: FinalContactStepProps) => {
  const isValid = firstName && email && companyName;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          Last step, {firstName || 'there'} (pinky promise).
        </h2>
        <p className="text-muted-foreground">
          Simply enter your details below and we'll send you that valuation report faster than you can say "unicorn status."
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              className="border border-border hover:border-primary focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => onLastNameChange(e.target.value)}
              className="border border-border hover:border-primary focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="border border-border hover:border-primary focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className="border border-border hover:border-primary focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            placeholder="Enter your company name"
            value={companyName}
            onChange={(e) => onCompanyNameChange(e.target.value)}
            className="border border-border hover:border-primary focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            placeholder="Enter your website URL"
            value={website}
            onChange={(e) => onWebsiteChange(e.target.value)}
            className="border border-border hover:border-primary focus:border-primary"
          />
        </div>
      </div>

      <Button 
        onClick={onNext}
        disabled={!isValid}
        className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg font-semibold"
      >
        Get My Valuation Report →
      </Button>
    </div>
  );
};

export default FinalContactStep;
