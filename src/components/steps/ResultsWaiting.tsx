
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Brain } from 'lucide-react';

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
          <Brain className="w-10 h-10 text-primary animate-pulse" />
        </div>
        
        <h2 className="text-3xl font-bold text-foreground">
          AI is Analyzing Your Company Data
        </h2>
        
        <p className="text-muted-foreground max-w-md mx-auto">
          Our advanced AI is processing your metrics against our database of 10,000+ company valuations 
          to generate your personalized report. This typically takes 10-15 minutes for maximum accuracy.
        </p>
      </div>

      <div className="bg-primary-light/20 rounded-lg p-6 max-w-md mx-auto">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <span className="text-lg font-medium text-foreground">
            AI Processing Time: {formatTime(timeElapsed)}
          </span>
        </div>
        
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Data submitted to AI successfully</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>AI model initialized</span>
          </div>
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-primary animate-pulse" />
            <span>AI analyzing your valuation metrics...</span>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 max-w-md mx-auto">
        <p className="text-sm text-muted-foreground">
          🤖 <strong>AI Process:</strong> Our valuation AI is comparing your metrics against 
          industry benchmarks, calculating multiple scenarios, and generating personalized 
          insights to maximize your company's value.
        </p>
      </div>

      <p className="text-xs text-muted-foreground">
        You'll receive your AI-generated detailed report via email once the analysis is complete.
      </p>
    </div>
  );
};

export default ResultsWaiting;
