import React from 'react';

const ProgressStepper = ({
    steps,
    currentStep,
}: {
    steps: { number: number; title: string; description: string }[];
    currentStep: number;
}) => {
    return (
        <div className="mb-8">
            <div className="relative flex items-center justify-between">
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        <div className="relative z-10 flex flex-1 flex-col items-center">
                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-full font-semibold transition-all ${
                                    currentStep === step.number
                                        ? 'scale-110 bg-primary text-primary-foreground'
                                        : currentStep > step.number
                                          ? 'bg-green-500 text-primary-foreground'
                                          : 'border-2 border-gray-300 bg-primary-foreground text-gray-400'
                                }`}
                            >
                                {currentStep > step.number ? '✓' : step.number}
                            </div>
                            <div className="mt-2 text-center">
                                <div
                                    className={`text-sm font-medium ${currentStep >= step.number ? 'text-primary' : 'text-muted-foreground'}`}
                                >
                                    {step.title}
                                </div>
                                <div className="hidden text-xs text-muted-foreground md:block">
                                    {step.description}
                                </div>
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={`mx-4 h-1 flex-1 transition-all ${
                                    currentStep > step.number
                                        ? 'bg-green-500'
                                        : 'bg-gray-300'
                                }`}
                                style={{ marginTop: '-20px' }}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default ProgressStepper;
