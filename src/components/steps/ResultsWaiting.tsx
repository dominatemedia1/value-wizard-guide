
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle } from 'lucide-react';

const ResultsWaiting = () => {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 text-center">
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-light/20 rounded-full mb-4">
          <Clock className="w-10 h-10 text-primary" />
        </div>
        
        <h2 className="text-3xl font-bold text-foreground">
          Your Valuation Report is Being Prepared
        </h2>
        
        <p className="text-muted-foreground max-w-md mx-auto">
          Our team of experts is analyzing your data and preparing a comprehensive valuation report. 
          This process typically takes 10-15 minutes to ensure accuracy.
        </p>
      </div>

      <div className="bg-primary-light/20 rounded-lg p-6 max-w-md mx-auto">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <span className="text-lg font-medium text-foreground">
            Time Elapsed: {formatTime(timeElapsed)}
          </span>
        </div>
        
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Data submitted successfully</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Webhook notification sent</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>Expert analysis in progress...</span>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 max-w-md mx-auto">
        <p className="text-sm text-muted-foreground">
          💡 <strong>What's happening:</strong> Our valuation experts are reviewing your metrics 
          against our database of 10,000+ company valuations to provide you with the most 
          accurate assessment possible.
        </p>
      </div>

      <p className="text-xs text-muted-foreground">
        You'll receive your detailed report via email once the analysis is complete.
      </p>
    </div>
  );
};

export default ResultsWaiting;
