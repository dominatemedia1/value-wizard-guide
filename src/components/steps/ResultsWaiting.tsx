
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Brain, TrendingUp, BarChart3 } from 'lucide-react';

const ResultsWaiting = () => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [randomTargetTime] = useState(() => {
    // Random time between 7-12 minutes (420-720 seconds)
    return Math.floor(Math.random() * (720 - 420 + 1)) + 420;
  });

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

  const formatTargetTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} minutes`;
  };

  const progressPercentage = Math.min((timeElapsed / randomTargetTime) * 100, 100);

  return (
    <div className="space-y-8 text-center">
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-6">
          <Brain className="w-12 h-12 text-primary animate-pulse" />
        </div>
        
        <h2 className="text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          AI Valuation Engine Processing
        </h2>
        
        <p className="text-muted-foreground max-w-lg mx-auto text-lg">
          Our advanced AI is processing your metrics against our proprietary database of 15,000+ company valuations 
          to generate your comprehensive valuation report.
        </p>
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8 max-w-lg mx-auto border border-primary/20">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Clock className="w-6 h-6 text-primary" />
          <span className="text-xl font-semibold text-foreground">
            Processing Time: {formatTime(timeElapsed)}
          </span>
        </div>
        
        <div className="w-full bg-secondary rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-6">
          Estimated completion: {formatTargetTime(randomTargetTime)}
        </p>
        
        <div className="space-y-4 text-sm">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-foreground">Data validated and submitted successfully</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-foreground">AI valuation model initialized</span>
          </div>
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-foreground">Analyzing industry comparables...</span>
          </div>
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-foreground">Calculating valuation scenarios...</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-muted/80 to-muted/40 rounded-xl p-6 max-w-lg mx-auto">
        <div className="flex items-start space-x-3">
          <Brain className="w-6 h-6 text-primary mt-0.5" />
          <div className="text-left">
            <p className="font-semibold text-foreground mb-2">What our AI is analyzing:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Revenue efficiency & growth trajectory analysis</li>
              <li>• Market positioning & competitive benchmarking</li>
              <li>• Multiple scenario valuation modeling</li>
              <li>• Strategic improvement recommendations</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 rounded-lg p-4 max-w-md mx-auto border border-primary/10">
        <p className="text-sm text-muted-foreground">
          <strong className="text-primary">📧 Delivery Method:</strong> Your detailed AI valuation report will be delivered 
          directly to your email once the analysis is complete.
        </p>
      </div>
    </div>
  );
};

export default ResultsWaiting;
