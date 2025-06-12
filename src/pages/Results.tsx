
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import ResultsDisplay from '@/components/steps/ResultsDisplay';
import { ValuationData } from '@/components/ValuationGuide';
import { decodeUrlData } from '@/utils/urlSharing';
import { decodeRobustUrlData } from '@/utils/robustUrlSharing';

const Results = () => {
  const [searchParams] = useSearchParams();
  const [valuationData, setValuationData] = useState<ValuationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<string>('');

  useEffect(() => {
    console.log('🚀 Results page loading with robust URL handling...');
    console.log('🔍 Current URL:', window.location.href);
    console.log('🔍 Search params:', Object.fromEntries(searchParams.entries()));
    
    // Try new robust format first (parameter 'd')
    const robustEncodedData = searchParams.get('d');
    if (robustEncodedData) {
      console.log('🔄 Attempting robust URL decode...');
      try {
        const decodedData = decodeRobustUrlData(robustEncodedData);
        if (decodedData) {
          console.log('✅ Successfully loaded data from robust URL format');
          setValuationData(decodedData);
          setDataSource('Robust URL format');
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('❌ Robust URL decode failed:', error);
      }
    }
    
    // Fallback to legacy format (parameter 'data')
    const legacyEncodedData = searchParams.get('data');
    if (legacyEncodedData) {
      console.log('🔄 Attempting legacy URL decode...');
      try {
        const decodedData = decodeUrlData(legacyEncodedData);
        if (decodedData) {
          console.log('✅ Successfully loaded data from legacy URL format');
          setValuationData(decodedData);
          setDataSource('Legacy URL format');
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('❌ Legacy URL decode failed:', error);
      }
    }

    // Final fallback to localStorage
    console.log('🔄 Falling back to localStorage...');
    try {
      const stored = localStorage.getItem('valuationData');
      if (stored) {
        const parsedData = JSON.parse(stored);
        if (parsedData.valuationData) {
          console.log('✅ Successfully loaded data from localStorage');
          setValuationData(parsedData.valuationData);
          setDataSource('localStorage');
        }
      }
    } catch (error) {
      console.error('❌ Error loading stored data:', error);
    }
    
    console.log('🏁 Data loading process complete');
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-start justify-center pt-[45px] p-4">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your valuation results...</p>
        </div>
      </div>
    );
  }

  if (!valuationData) {
    return (
      <div className="min-h-screen flex items-start justify-center pt-[45px] p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <ExternalLink className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">No Results Found</h1>
              <p className="text-muted-foreground">
                We couldn't find your valuation data. This could happen if:
              </p>
              <ul className="text-sm text-muted-foreground text-left space-y-1 mt-4">
                <li>• The link has expired or is invalid</li>
                <li>• You haven't completed the valuation yet</li>
                <li>• Your browser data has been cleared</li>
                <li>• The URL parameters are corrupted</li>
              </ul>
              <div className="mt-4 p-3 bg-muted rounded text-xs text-left">
                <strong>Debug Info:</strong><br/>
                URL: {window.location.href}<br/>
                Data source attempted: {dataSource || 'None'}<br/>
                Robust param: {searchParams.get('d') ? 'Present' : 'Missing'}<br/>
                Legacy param: {searchParams.get('data') ? 'Present' : 'Missing'}
              </div>
            </div>
            <Link to="/">
              <Button className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Start New Valuation
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 pt-[45px] pb-8 max-w-6xl">
        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-2 bg-yellow-100 border border-yellow-300 rounded text-sm">
            <strong>Debug:</strong> Data loaded from {dataSource}
          </div>
        )}
        
        {/* Header with back button */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Assessment
            </Button>
          </Link>
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Valuation Results
            </h1>
            <p className="text-muted-foreground text-lg">
              Your comprehensive company valuation analysis
            </p>
          </div>
        </div>

        {/* Results with better spacing */}
        <div className="space-y-8">
          <ResultsDisplay 
            valuationData={valuationData}
            onSendEmail={() => {}}
          />
        </div>

        {/* Footer */}
        <div className="mt-16 text-center border-t pt-8">
          <p className="text-sm text-muted-foreground">
            Generated by AI Valuation Engine • Confidential Analysis
          </p>
        </div>
      </div>
    </div>
  );
};

export default Results;
