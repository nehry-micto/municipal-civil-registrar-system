import React from 'react';

const ProgressStepper = ({ steps, currentStep }) => {
    return (
        <div className="mb-8">
            <div className="relative flex items-center justify-between">
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        <div className="relative z-10 flex flex-1 flex-col items-center">
                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-full font-semibold transition-all ${
                                    currentStep === step.number
                                        ? 'scale-110 bg-blue-600 text-white shadow-lg'
                                        : currentStep > step.number
                                          ? 'bg-green-500 text-white'
                                          : 'border-2 border-gray-300 bg-white text-gray-400'
                                }`}
                            >
                                {currentStep > step.number ? '✓' : step.number}
                            </div>
                            <div className="mt-2 text-center">
                                <div
                                    className={`text-sm font-medium ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'}`}
                                >
                                    {step.title}
                                </div>
                                <div className="hidden text-xs text-gray-500 md:block">
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
