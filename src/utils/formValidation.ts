
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validatePhone = (phone: string): boolean => {
  if (!phone.trim()) return false; // Phone is now required
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return cleanPhone.length >= 10 && phoneRegex.test(cleanPhone);
};

export const validateWebsite = (website: string): boolean => {
  if (!website.trim()) return false; // Website is now required
  
  try {
    const url = website.startsWith('http') ? website : `https://${website}`;
    const urlObj = new URL(url);
    return urlObj.hostname.includes('.');
  } catch {
    return false;
  }
};

export const validateContactForm = (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  website: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.firstName.trim()) {
    errors.firstName = 'First name is required';
  }

  // lastName is now optional - no validation needed

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.companyName.trim()) {
    errors.companyName = 'Company name is required';
  }

  // Phone is now required
  if (!data.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!validatePhone(data.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  // Website is now required
  if (!data.website.trim()) {
    errors.website = 'Website is required';
  } else if (!validateWebsite(data.website)) {
    errors.website = 'Please enter a valid website URL';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateStep = (step: number, data: any): ValidationResult => {
  const errors: Record<string, string> = {};

  switch (step) {
    case 0: // ARR Step
      if (!data.arrSliderValue || data.arrSliderValue <= 0) {
        errors.arrSliderValue = 'Please select your annual recurring revenue';
      }
      break;
    
    case 1: // NRR Step
      if (!data.nrr) {
        errors.nrr = 'Please select your net revenue retention rate';
      }
      break;
    
    case 2: // Churn Step
      if (!data.revenueChurn) {
        errors.revenueChurn = 'Please select your revenue churn rate';
      }
      break;
    
    case 3: // QoQ Growth Step
      if (data.qoqGrowthRate === undefined || data.qoqGrowthRate === null) {
        errors.qoqGrowthRate = 'Please enter your quarter-over-quarter growth rate';
      }
      break;
    
    case 4: // CAC Step
      if (!data.cac || data.cac <= 0) {
        errors.cac = 'Please enter your customer acquisition cost';
      }
      break;
    
    case 5: // Profitability Step
      if (!data.profitability) {
        errors.profitability = 'Please select your profitability status';
      }
      break;
    
    case 6: // Market Gravity Step
      if (!data.marketGravity) {
        errors.marketGravity = 'Please select your market position';
      }
      break;
    
    case 7: // Business Model Step
      if (!data.businessModel) {
        errors.businessModel = 'Please select your business model';
      }
      break;
    
    case 8: // Contact Step
      return validateContactForm(data);
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
