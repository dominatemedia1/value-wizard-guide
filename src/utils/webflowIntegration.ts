
// Communication helper for Webflow integration
export const webflowControl = {
  hideFields: (fieldIds: string[]) => {
    window.parent.postMessage({
      action: 'hideFields',
      fields: fieldIds
    }, '*');
  },
  
  hideElement: (elementId: string) => {
    window.parent.postMessage({
      action: 'hideElement',
      elementId: elementId
    }, '*');
  },
  
  showElement: (elementId: string) => {
    window.parent.postMessage({
      action: 'showElement',
      elementId: elementId
    }, '*');
  },
  
  formSubmitted: (formData: any) => {
    window.parent.postMessage({
      action: 'formSubmitted',
      formData: formData
    }, '*');
  }
};

// Get URL parameters passed from Webflow
export function getUrlParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    firstName: urlParams.get('first_name') || '',
    phone: urlParams.get('phone') || '',
    email: urlParams.get('email') || ''
  };
}

// Listen for messages from parent Webflow page
export function initWebflowListener() {
  window.addEventListener('message', function(event) {
    if (event.data.type === 'parentReady') {
      console.log('Parent Webflow page is ready', event.data.urlParams);
      // You can use this to confirm parameters were received
    }
  });
}
