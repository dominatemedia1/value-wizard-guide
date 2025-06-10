
import { ValuationData } from '../components/ValuationGuide';

export interface SavedData {
  valuationData: ValuationData;
  currentStep: number;
  isSubmitted: boolean;
  showResultsWaiting?: boolean;
  showResults?: boolean;
}

export const saveValuationData = (data: SavedData) => {
  const cookieValue = JSON.stringify(data);
  document.cookie = `valuationData=${cookieValue}; max-age=${60 * 60 * 24 * 7}; path=/;`; // Expires in 7 days
};

export const loadValuationData = (): SavedData | undefined => {
  const cookieName = 'valuationData=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) === 0) {
      try {
        return JSON.parse(cookie.substring(cookieName.length, cookie.length));
      } catch (e) {
        console.error("Error parsing cookie data:", e);
        return undefined;
      }
    }
  }
  return undefined;
};

export const clearValuationData = () => {
  document.cookie = 'valuationData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  localStorage.removeItem('valuation_start_time');
};
