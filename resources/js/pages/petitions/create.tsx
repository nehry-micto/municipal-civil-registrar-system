import usePetitionForm from '@/hooks/petition/use-petition-form';
import useStepWizard from '@/hooks/petition/use-setup-wizard';
import AppLayout from '@/layouts/app-layout';
import petitions from '@/routes/petitions';
import { BreadcrumbItem, Client, DocumentType, Priority } from '@/types';
import { usePage } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import ClientSelectionStep from './create/client-selection-step';
import DocumentDetailsStep from './create/document-details-step';
import ErrorCorrectionsStep from './create/error-correction-step';
import PetitionSummary from './create/petition-summary';
import ProgressStepper from './create/progress-stepper';

const Create = () => {
    const { props } = usePage();

    const clients = props.clients as Client[];

    const documentTypes: DocumentType[] = [
        { value: '0', label: 'Birth Certificate' },
        { value: '1', label: 'Death Certificate' },
    ];

    const priorities: Priority[] = [
        { value: '0', label: 'Normal' },
        { value: '1', label: 'Urgent' },
    ];

    const steps = [
        {
            number: 1,
            title: 'Select Client',
            description: 'Choose who is filing this petition',
        },
        {
            number: 2,
            title: 'Document Details',
            description: 'Information about the document to correct',
        },
        {
            number: 3,
            title: 'Corrections',
            description: 'Specify what needs to be corrected',
        },
    ];

    // Custom hooks
    const { currentStep, nextStep, previousStep } = useStepWizard(3);
    const {
        formData,
        setData,
        addErrorCorrection,
        removeErrorCorrection,
        updateErrorCorrection,
        reset,
        setSelectedClient,
        selectedClient,
    } = usePetitionForm();

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        alert(
            '✅ Petition created successfully!\n\nIn production, this would call:\nrouter.post("/petitions", formData)',
        );
        // In real app: router.post('/petitions', formData)
        reset();
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="mb-2 flex items-center gap-2">
                        <FileText className="h-6 w-6 text-primary" />
                        <h1 className="text-3xl font-bold text-gray-900">
                            Create New Petition
                        </h1>
                    </div>
                    <p className="text-gray-600">
                        Follow the steps below to create a petition for civil
                        registry correction
                    </p>
                </div>

                {/* Progress Stepper */}
                <ProgressStepper steps={steps} currentStep={currentStep} />

                {/* Step Content */}
                {currentStep === 1 && (
                    <ClientSelectionStep
                        formData={formData}
                        setData={setData}
                        setSelectedClient={setSelectedClient}
                        clients={clients}
                        onNext={nextStep}
                    />
                )}

                {currentStep === 2 && (
                    <DocumentDetailsStep
                        formData={formData}
                        setData={setData}
                        documentTypes={documentTypes}
                        priorities={priorities}
                        selectedClient={selectedClient}
                        onNext={nextStep}
                        onPrevious={previousStep}
                    />
                )}

                {currentStep === 3 && (
                    <ErrorCorrectionsStep
                        formData={formData}
                        addErrorCorrection={addErrorCorrection}
                        removeErrorCorrection={removeErrorCorrection}
                        updateErrorCorrection={updateErrorCorrection}
                        onPrevious={previousStep}
                        onSubmit={handleSubmit}
                    />
                )}

                {/* Summary Panel */}
                <PetitionSummary
                    formData={formData}
                    selectedClient={selectedClient}
                />
            </div>
        </div>
    );
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Petitions',
        href: petitions.index().url,
    },
    {
        title: 'Create',
        href: petitions.create().url,
    },
];

Create.layout = (page: React.ReactNode) => (
    <AppLayout children={page} breadcrumbs={breadcrumbs} />
);

export default Create;
