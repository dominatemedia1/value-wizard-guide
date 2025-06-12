
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateContactForm, ValidationResult } from '@/utils/formValidation';
import LoadingState from '@/components/LoadingState';
import { AlertCircle, CheckCircle, Loader2, ChevronLeft } from 'lucide-react';

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
  onBack?: () => void;
}

const FinalContactStep = ({ 
  firstName, lastName, email, phone, companyName, website,
  onFirstNameChange, onLastNameChange, onEmailChange, onPhoneChange, 
  onCompanyNameChange, onWebsiteChange, onNext, onBack 
}: FinalContactStepProps) => {
  const [validation, setValidation] = useState<ValidationResult>({ isValid: false, errors: {} });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [hiddenFields, setHiddenFields] = useState({
    firstName: false,
    email: false,
    phone: false
  });

  // Check if fields should be hidden based on existing values
  useEffect(() => {
    console.log('🔍 FinalContactStep: Checking field visibility...');
    console.log('📋 Current field values:');
    console.log('  - firstName:', firstName);
    console.log('  - email:', email);
    console.log('  - phone:', phone);

    setHiddenFields({
      firstName: firstName && firstName.trim() !== '',
      email: email && email.trim() !== '',
      phone: phone && phone.trim() !== ''
    });

    console.log('👁️ Field visibility:', {
      firstName: firstName && firstName.trim() !== '',
      email: email && email.trim() !== '',
      phone: phone && phone.trim() !== ''
    });
  }, [firstName, email, phone]);

  // Real-time validation
  useEffect(() => {
    const result = validateContactForm({
      firstName, lastName, email, phone, companyName, website
    });
    setValidation(result);
    console.log('📝 Form validation result:', result);
  }, [firstName, lastName, email, phone, companyName, website]);

  const handleFieldBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleSubmit = async () => {
    console.log('🚀 Submit clicked, validation:', validation);
    
    // Mark all fields as touched to show validation errors - excluding lastName
    setTouched({
      firstName: true,
      email: true,
      phone: true,
      companyName: true,
      website: true
    });

    if (!validation.isValid) {
      console.log('❌ Form validation failed:', validation.errors);
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log('📞 Calling onNext...');
      await onNext();
    } catch (error) {
      console.error('💥 Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName: string) => {
    return touched[fieldName] && validation.errors[fieldName];
  };

  if (isSubmitting) {
    return (
      <LoadingState
        type="loading"
        title="Submitting Your Information"
        description="We're processing your details and preparing your personalized valuation report. This will just take a moment..."
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      {onBack && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground border border-border hover:border-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      )}

      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          Last step{firstName ? `, ${firstName}` : ''} (pinky promise).
        </h2>
        <p className="text-muted-foreground">
          Simply enter your details below and we'll send you that valuation report faster than you can say "unicorn status."
        </p>
      </div>

      <div className="space-y-6">
        {!hiddenFields.firstName && (
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              onBlur={() => handleFieldBlur('firstName')}
              className={`border ${getFieldError('firstName') ? 'border-red-500' : 'border-border'} hover:border-primary focus:border-primary`}
            />
            {getFieldError('firstName') && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {getFieldError('firstName')}
              </p>
            )}
          </div>
        )}

        {!hiddenFields.email && (
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              onBlur={() => handleFieldBlur('email')}
              className={`border ${getFieldError('email') ? 'border-red-500' : 'border-border'} hover:border-primary focus:border-primary`}
            />
            {getFieldError('email') && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {getFieldError('email')}
              </p>
            )}
          </div>
        )}

        {!hiddenFields.phone && (
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              onBlur={() => handleFieldBlur('phone')}
              className={`border ${getFieldError('phone') ? 'border-red-500' : 'border-border'} hover:border-primary focus:border-primary`}
            />
            {getFieldError('phone') && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {getFieldError('phone')}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            placeholder="Enter your company name"
            value={companyName}
            onChange={(e) => onCompanyNameChange(e.target.value)}
            onBlur={() => handleFieldBlur('companyName')}
            className={`border ${getFieldError('companyName') ? 'border-red-500' : 'border-border'} hover:border-primary focus:border-primary`}
          />
          {getFieldError('companyName') && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {getFieldError('companyName')}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website *</Label>
          <Input
            id="website"
            placeholder="Enter your website URL"
            value={website}
            onChange={(e) => onWebsiteChange(e.target.value)}
            onBlur={() => handleFieldBlur('website')}
            className={`border ${getFieldError('website') ? 'border-red-500' : 'border-border'} hover:border-primary focus:border-primary`}
          />
          {getFieldError('website') && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {getFieldError('website')}
            </p>
          )}
        </div>

        {!validation.isValid && Object.keys(touched).length > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              Please fix the errors above before submitting.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Button 
        onClick={handleSubmit}
        disabled={!validation.isValid || isSubmitting}
        className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          'Get My Valuation Report →'
        )}
      </Button>
    </div>
  );
};

export default FinalContactStep;
