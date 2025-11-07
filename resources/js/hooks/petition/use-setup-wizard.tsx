import { useState } from 'react';

const useStepWizard = (totalSteps = 3) => {
    const [currentStep, setCurrentStep] = useState<number>(1);

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const previousStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const goToStep = (step: number) => {
        if (step >= 1 && step <= totalSteps) {
            setCurrentStep(step);
        }
    };

    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === totalSteps;

    return {
        currentStep,
        nextStep,
        previousStep,
        goToStep,
        isFirstStep,
        isLastStep,
    };
};

export default useStepWizard;
