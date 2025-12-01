import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import petitions from '@/routes/petitions';
import {
    BreadcrumbItem,
    DocumentType,
    Petition,
    PetitionForm,
    PetitionType,
    Priority,
} from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2Icon,
    Edit2,
    FileText,
    Lock,
    Save,
    User,
} from 'lucide-react';
import { useState } from 'react';
import ErrorCorrectionsSection from './error-corrections-section';
import CertificateModal from './steps/certificate-modal';
import FinalityModal from './steps/finality-modal';
import NoticeModal from './steps/notice-modal';
import RecordSheetModal from './steps/record-sheet-modal';

interface EditProps {
    petition: Petition;
}

const Edit = ({ petition }: EditProps) => {
    const { petitionSteps, petitionTypes, documentTypes, priorities } =
        usePage<{
            petitionSteps: {
                value: number;
                label: string;
                description: string;
            }[];
            petitionTypes: PetitionType[];
            documentTypes: DocumentType[];
            priorities: Priority[];
        }>().props;

    console.log('petition', petition);

    const { data, setData, put, processing, errors } = useForm<PetitionForm>({
        client_id: petition.client_id,
        petition_number: petition.petition_number,
        registry_number: petition.registry_number,
        date_of_filing: petition.date_of_filing.split('T')[0],
        document_type: petition.document_type,
        petition_type: petition.petition_type,
        document_owner: petition.document_owner,
        petition_nature: petition.petition_nature,
        errors_to_correct: petition.errors_to_correct || [],
        priority: petition.priority,
        notice: petition.notice,
        certificate: petition.certificate,
        record_sheet: petition.record_sheet,
        finality: petition.finality,
    });

    const [activeModal, setActiveModal] = useState<number | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(petitions.update(petition.id).url, {
            onSuccess: () => {
                // Optional: Show toast
            },
        });
    };

    // Determine current step index
    const currentStepLabel = petition.next_step;
    const currentStepIndex = currentStepLabel
        ? petitionSteps.findIndex((s) => s.label === currentStepLabel)
        : petitionSteps.length;

    const getStepStatus = (stepIndex: number) => {
        if (stepIndex < currentStepIndex) return 'completed';
        if (stepIndex === currentStepIndex) return 'current';
        return 'future';
    };

    return (
        <div className="container mx-auto max-w-7xl space-y-8 px-8 py-4">
            {/* Header */}
            <div className="">
                <div>
                    <div className="flex items-center gap-1">
                        <FileText className="h-6 w-6 text-primary" />
                        <h1 className="text-3xl font-bold text-primary">
                            Edit Petition
                        </h1>
                    </div>
                    <p className="text-muted-foreground">
                        Update petition details and corrections
                    </p>
                </div>
                <div className="flex w-full items-center justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSubmit}
                        disabled={processing}
                    >
                        <Save className="h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Left Column: Details & Errors */}
                <div className="space-y-6 lg:col-span-2">
                    <form
                        id="petition-form"
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        {/* Client Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <User className="size-4" /> Client
                                    Information
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    The petitioner filing this request
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            Full Name
                                        </Label>
                                        <p className="text-sm font-medium">
                                            {petition.client?.full_name}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            Contact Number
                                        </Label>
                                        <p className="text-sm">
                                            {petition.client?.contact_number ||
                                                'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Petition Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <FileText className="size-4" /> Petition
                                    Details
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Core information about the petition
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="petition_number">
                                            Petition Number{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="petition_number"
                                            value={data.petition_number}
                                            onChange={(e) =>
                                                setData(
                                                    'petition_number',
                                                    e.target.value,
                                                )
                                            }
                                            aria-invalid={
                                                !!errors.petition_number
                                            }
                                        />
                                        <InputError
                                            message={errors.petition_number}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="registry_number">
                                            Registry Number{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="registry_number"
                                            value={data.registry_number}
                                            onChange={(e) =>
                                                setData(
                                                    'registry_number',
                                                    e.target.value,
                                                )
                                            }
                                            aria-invalid={
                                                !!errors.registry_number
                                            }
                                        />
                                        <InputError
                                            message={errors.registry_number}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="date_of_filing">
                                            Date of Filing{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="date_of_filing"
                                            type="date"
                                            value={data.date_of_filing}
                                            onChange={(e) =>
                                                setData(
                                                    'date_of_filing',
                                                    e.target.value,
                                                )
                                            }
                                            aria-invalid={
                                                !!errors.date_of_filing
                                            }
                                        />
                                        <InputError
                                            message={errors.date_of_filing}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="document_type">
                                            Document Type{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={data.document_type}
                                            onValueChange={(value) =>
                                                setData('document_type', value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {documentTypes.map((type) => (
                                                    <SelectItem
                                                        key={type.value}
                                                        value={type.value}
                                                    >
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={errors.document_type}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="petition_type">
                                            Petition Type{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={data.petition_type}
                                            onValueChange={(value) =>
                                                setData('petition_type', value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {petitionTypes.map((type) => (
                                                    <SelectItem
                                                        key={type.value}
                                                        value={type.value}
                                                    >
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={errors.petition_type}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="priority">
                                            Priority
                                        </Label>
                                        <Select
                                            value={data.priority}
                                            onValueChange={(value) =>
                                                setData('priority', value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {priorities.map((p) => (
                                                    <SelectItem
                                                        key={p.value}
                                                        value={p.value}
                                                    >
                                                        {p.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.priority} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="document_owner">
                                        Document Owner{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="document_owner"
                                        value={data.document_owner}
                                        onChange={(e) =>
                                            setData(
                                                'document_owner',
                                                e.target.value,
                                            )
                                        }
                                        aria-invalid={!!errors.document_owner}
                                    />
                                    <InputError
                                        message={errors.document_owner}
                                    />
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={
                                                data.document_owner ===
                                                petition.client?.full_name
                                            }
                                            id="same_as_client"
                                            onCheckedChange={(checked) => {
                                                if (
                                                    checked &&
                                                    petition.client
                                                ) {
                                                    setData(
                                                        'document_owner',
                                                        petition.client
                                                            .full_name,
                                                    );
                                                }
                                            }}
                                        />
                                        <Label
                                            htmlFor="same_as_client"
                                            className="text-sm font-normal text-muted-foreground"
                                        >
                                            Same as client
                                        </Label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="petition_nature">
                                        Nature of Petition{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="petition_nature"
                                        rows={4}
                                        value={data.petition_nature}
                                        onChange={(e) =>
                                            setData(
                                                'petition_nature',
                                                e.target.value,
                                            )
                                        }
                                        aria-invalid={!!errors.petition_nature}
                                    />
                                    <InputError
                                        message={errors.petition_nature}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Errors to Correct */}
                        <ErrorCorrectionsSection
                            data={data}
                            setData={setData}
                        />
                    </form>
                </div>

                {/* Right Column: Workflow Timeline */}
                <div className="space-y-6">
                    <Card className="">
                        <CardHeader>
                            <CardTitle>Workflow Timeline</CardTitle>
                            <CardDescription>
                                Track and edit the progress of the petition.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative space-y-0">
                                {petitionSteps.map((step, index) => {
                                    const status = step.value <= petition.current_step; 
                                    const isLast =
                                        index === petitionSteps.length - 1;

                                    console.log(step.value);

                                    return (
                                        <div
                                            key={step.value}
                                            className="relative pb-8 last:pb-0"
                                        >
                                            {!isLast && (
                                                <span
                                                    className={cn(
                                                        'absolute top-4 left-4 -ml-px h-full w-0.5',
                                                        status 
                                                            ? 'bg-primary'
                                                            : 'bg-muted',
                                                    )}
                                                    aria-hidden="true"
                                                />
                                            )}
                                            <div className="relative flex items-start space-x-3">
                                                <div
                                                    className={cn(
                                                        'relative flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white',
                                                        status ? 'bg-green-500' : 'bg-muted',
                                                    )}
                                                >
                                                    {status  ? (
                                                        <CheckCircle2Icon
                                                            className="h-5 w-5 text-white"
                                                            aria-hidden="true"
                                                        />
                                                    ) : status  ? (
                                                        <span
                                                            className="h-2.5 w-2.5 rounded-full bg-white"
                                                            aria-hidden="true"
                                                        />
                                                    ) : (
                                                        <Lock
                                                            className="h-4 w-4 text-muted-foreground"
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1 pt-1.5">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p
                                                                className={cn(
                                                                    'text-sm font-medium',
                                                                    !status &&
                                                                        'text-muted-foreground',
                                                                )}
                                                            >
                                                                {step.label}
                                                            </p>
                                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                                {
                                                                    step.description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-2">
                                                        {status &&
                                                            step.label !==
                                                                'Encoding' && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-7 text-xs"
                                                                    onClick={() =>
                                                                    {
                                                                        setActiveModal(step.value)
                                                                        console.log(step.value)
                                                                    }
                                                                    }
                                                                >
                                                                    <Edit2 className="mr-1.5 size-3" />
                                                                    Edit
                                                                </Button>
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Modals */}
            <NoticeModal
                open={activeModal === 1}
                onOpenChange={() => setActiveModal(null)}
                petition={petition}
            />
            <CertificateModal
                open={activeModal === 2}
                onOpenChange={() => setActiveModal(null)}
                petition={petition}
            />
            <RecordSheetModal
                open={activeModal === 3}
                onOpenChange={() => setActiveModal(null)}
                petition={petition}
            />
            <FinalityModal
                open={activeModal === 4}
                onOpenChange={() => setActiveModal(null)}
                petition={petition}
            />
        </div>
    );
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Petitions',
        href: petitions.index().url,
    },
    {
        title: 'Edit Petition',
        href: '#',
    },
];

Edit.layout = (page: React.ReactNode) => (
    <AppLayout children={page} breadcrumbs={breadcrumbs} />
);

export default Edit;
