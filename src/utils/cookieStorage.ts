
export const COOKIE_NAME = 'valuation_guide_data';
export const COOKIE_EXPIRY_DAYS = 7;

export const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

export const getCookie = (name: string): string | null => {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const saveValuationData = (data: any) => {
  try {
    setCookie(COOKIE_NAME, JSON.stringify(data), COOKIE_EXPIRY_DAYS);
  } catch (error) {
    console.error('Error saving data to cookie:', error);
  }
};

export const loadValuationData = (): any | null => {
  try {
    const cookieData = getCookie(COOKIE_NAME);
    return cookieData ? JSON.parse(cookieData) : null;
  } catch (error) {
    console.error('Error loading data from cookie:', error);
    return null;
  }
};

export const clearValuationData = () => {
  deleteCookie(COOKIE_NAME);
};
