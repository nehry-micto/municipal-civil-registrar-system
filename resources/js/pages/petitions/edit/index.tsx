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
import petitions from '@/routes/petitions';
import {
    BreadcrumbItem,
    DocumentType,
    Petition,
    PetitionForm,
    PetitionType,
    Priority,
} from '@/types';
import { useForm } from '@inertiajs/react';
import { ArrowLeft, FileText, Save, User } from 'lucide-react';
import ErrorCorrectionsSection from './error-corrections-section';
import CertificateStep from './steps/certificate-step';
import FinalityStep from './steps/finality-step';
import NoticeStep from './steps/notice-step';
import RecordSheetStep from './steps/record-sheet-step';

interface EditProps {
    petition: Petition;
}

const Edit = ({ petition }: EditProps) => {
    const formDefaults: PetitionForm = {
        client_id: petition.client_id,
        petition_number: petition.petition_number,
        registry_number: petition.registry_number,
        date_of_filing: petition.date_of_filing,
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
    };

    const { data, setData, put, processing, errors } =
        useForm<PetitionForm>(formDefaults);

    const documentTypes: DocumentType[] = [
        { value: '0', label: 'Birth Certificate' },
        { value: '1', label: 'Death Certificate' },
    ];

    const petitionTypes: PetitionType[] = [
        { value: '0', label: 'Correction of Clerical Error' },
        { value: '1', label: 'Other' },
    ];

    const priorities: Priority[] = [
        { value: '0', label: 'Normal' },
        { value: '1', label: 'Urgent' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(petitions.update(petition.id).url, {
            onSuccess: () => {
                // Optional: Show toast
            },
        });
    };

    return (
        <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Edit Petition
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Update petition details and corrections
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSubmit}
                        disabled={processing}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-8 lg:grid-cols-3"
            >
                {/* Left Column: Details */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Client Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <User className="size-4" /> Client Information
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
                                <FileText className="size-4" /> Petition Details
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
                                        <span className="text-red-500">*</span>
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
                                        aria-invalid={!!errors.petition_number}
                                    />
                                    <InputError
                                        message={errors.petition_number}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="registry_number">
                                        Registry Number{' '}
                                        <span className="text-red-500">*</span>
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
                                        aria-invalid={!!errors.registry_number}
                                    />
                                    <InputError
                                        message={errors.registry_number}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date_of_filing">
                                        Date of Filing{' '}
                                        <span className="text-red-500">*</span>
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
                                        aria-invalid={!!errors.date_of_filing}
                                    />
                                    <InputError
                                        message={errors.date_of_filing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="document_type">
                                        Document Type{' '}
                                        <span className="text-red-500">*</span>
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
                                        <span className="text-red-500">*</span>
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
                                    <Label htmlFor="priority">Priority</Label>
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
                                <InputError message={errors.document_owner} />
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="same_as_client"
                                        onCheckedChange={(checked) => {
                                            if (checked && petition.client) {
                                                setData(
                                                    'document_owner',
                                                    petition.client.full_name,
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
                                <InputError message={errors.petition_nature} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Errors to Correct & Steps */}
                <div className="space-y-6">
                    <ErrorCorrectionsSection data={data} setData={setData} />

                    {/* Step Data Editing */}
                    <NoticeStep data={data} setData={setData} />
                    <CertificateStep data={data} setData={setData} />
                    <RecordSheetStep data={data} setData={setData} />
                    <FinalityStep data={data} setData={setData} />
                </div>
            </form>
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
