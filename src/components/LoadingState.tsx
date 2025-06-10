
import React from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface LoadingStateProps {
  type: 'loading' | 'success' | 'error';
  title: string;
  description: string;
  showSpinner?: boolean;
}

const LoadingState = ({ type, title, description, showSpinner = true }: LoadingStateProps) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-12 h-12 text-red-500" />;
      default:
        return showSpinner ? <Loader2 className="w-12 h-12 text-primary animate-spin" /> : null;
    }
  };

  const getColorClass = () => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
      {getIcon()}
      <div className="space-y-2">
        <h3 className={`text-xl font-semibold ${getColorClass()}`}>
          {title}
        </h3>
        <p className="text-muted-foreground max-w-md">
          {description}
        </p>
      </div>
    </div>
  );
};

export default LoadingState;
