
import React from 'react';
import { ValuationData } from './ValuationGuide';
import ARRStep from './steps/ARRStep';
import NRRStep from './steps/NRRStep';
import ChurnStep from './steps/ChurnStep';
import QoQGrowthStep from './steps/QoQGrowthStep';
import NewCACStep from './steps/NewCACStep';
import ProfitabilityStep from './steps/ProfitabilityStep';
import MarketGravityStep from './steps/MarketGravityStep';
import NewBusinessModelStep from './steps/NewBusinessModelStep';
import FinalContactStep from './steps/FinalContactStep';
import ResultsDisplay from './steps/ResultsDisplay';
import ResultsWaiting from './steps/ResultsWaiting';

interface StepRendererProps {
  currentStep: number;
  showResults: boolean;
  showResultsWaiting: boolean;
  valuationData: ValuationData;
  updateValuationData: (field: keyof ValuationData, value: any) => void;
  nextStep: () => void;
  previousStep: () => void;
}

const StepRenderer = ({
  currentStep,
  showResults,
  showResultsWaiting,
  valuationData,
  updateValuationData,
  nextStep,
  previousStep
}: StepRendererProps) => {
  if (showResults) {
    return (
      <ResultsDisplay 
        valuationData={valuationData}
        onSendEmail={() => {}}
      />
    );
  }

  if (showResultsWaiting) {
    return <ResultsWaiting />;
  }

  switch (currentStep) {
    case 0:
      return (
        <ARRStep
          value={valuationData.arrSliderValue}
          onChange={(value) => updateValuationData('arrSliderValue', value)}
          onNext={nextStep}
        />
      );
    case 1:
      return (
        <NRRStep
          value={valuationData.nrr}
          onChange={(value) => updateValuationData('nrr', value)}
          onNext={nextStep}
          firstName={valuationData.firstName}
        />
      );
    case 2:
      return (
        <ChurnStep
          value={valuationData.revenueChurn}
          onChange={(value) => updateValuationData('revenueChurn', value)}
          onNext={nextStep}
        />
      );
    case 3:
      return (
        <QoQGrowthStep
          value={valuationData.qoqGrowthRate}
          onChange={(value) => updateValuationData('qoqGrowthRate', value)}
          onNext={nextStep}
        />
      );
    case 4:
      return (
        <NewCACStep
          cac={valuationData.cac}
          context={valuationData.cacContext}
          onCACChange={(value) => updateValuationData('cac', value)}
          onContextChange={(value) => updateValuationData('cacContext', value)}
          onNext={nextStep}
        />
      );
    case 5:
      return (
        <ProfitabilityStep
          value={valuationData.profitability}
          onChange={(value) => updateValuationData('profitability', value)}
          onNext={nextStep}
        />
      );
    case 6:
      return (
        <MarketGravityStep
          value={valuationData.marketGravity}
          onChange={(value) => updateValuationData('marketGravity', value)}
          onNext={nextStep}
          firstName={valuationData.firstName}
        />
      );
    case 7:
      return (
        <NewBusinessModelStep
          value={valuationData.businessModel}
          onChange={(value) => updateValuationData('businessModel', value)}
          onNext={nextStep}
        />
      );
    case 8:
      return (
        <FinalContactStep
          firstName={valuationData.firstName}
          lastName={valuationData.lastName}
          email={valuationData.email}
          phone={valuationData.phone}
          companyName={valuationData.companyName}
          website={valuationData.website}
          onFirstNameChange={(value) => updateValuationData('firstName', value)}
          onLastNameChange={(value) => updateValuationData('lastName', value)}
          onEmailChange={(value) => updateValuationData('email', value)}
          onPhoneChange={(value) => updateValuationData('phone', value)}
          onCompanyNameChange={(value) => updateValuationData('companyName', value)}
          onWebsiteChange={(value) => updateValuationData('website', value)}
          onNext={nextStep}
          onBack={previousStep}
        />
      );
    default:
      return null;
  }
};

export default StepRenderer;
