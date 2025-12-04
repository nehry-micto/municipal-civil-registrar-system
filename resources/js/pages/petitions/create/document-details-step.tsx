import InputError from '@/components/input-error';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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
import {
    Client,
    DocumentType,
    PetitionForm,
    PetitionType,
    Priority,
} from '@/types';
import { FormDataErrors } from '@inertiajs/core';
import { ChevronRight, FileText, Info } from 'lucide-react';

const DocumentDetailsStep = ({
    formData,
    errors,
    selectedClient,
    setData,
    documentTypes,
    petitionTypes,
    priorities,
    onNext,
    onPrevious,
}: {
    formData: PetitionForm;
    selectedClient: Client | null;
    setData: (field: string, value: string) => void;
    documentTypes: DocumentType[];
    petitionTypes: PetitionType[];
    priorities: Priority[];
    onNext: () => void;
    onPrevious: () => void;
    errors: FormDataErrors<PetitionForm>;
}) => {
    const canProceed =
        formData.document_type !== '' &&
        formData.petition_number.trim() !== '' &&
        formData.registry_number.trim() !== '' &&
        formData.date_of_filing.trim() !== '' &&
        formData.document_owner.trim() !== '' &&
        formData.petition_type !== '' &&
        formData.petition_nature.trim() !== '';

    return (
        <Card className="border-1">
            <CardHeader className="border-b">
                <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle>Document Details</CardTitle>
                </div>
                <CardDescription className="mb-2">
                    Provide information about the civil registry document that
                    needs correction
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-500">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-blue-800 dark:text-blue-500">
                        <strong>Note:</strong> The document owner is the person
                        whose name appears on the civil registry document. This
                        may be different from the petitioner filing this
                        request.
                    </AlertDescription>
                </Alert>

                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="petition_number">
                            Petition Number{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="petition_number"
                            placeholder="e.g., CCE-0157-2025"
                            value={formData.petition_number}
                            onChange={(e) =>
                                setData('petition_number', e.target.value)
                            }
                            className=""
                            aria-invalid={
                                errors?.petition_number ? true : false
                            }
                        />
                        <InputError message={errors?.petition_number} />
                        <p className="text-xs text-muted-foreground">
                            The petition number of the document to be corrected
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="registry_number">
                            Registry Number{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="registry_number"
                            placeholder="e.g., 2022-193"
                            value={formData.registry_number}
                            onChange={(e) =>
                                setData('registry_number', e.target.value)
                            }
                            className=""
                            aria-invalid={
                                errors?.registry_number ? true : false
                            }
                        />
                        <InputError message={errors?.registry_number} />
                        <p className="text-xs text-muted-foreground">
                            The registry number of the document to be corrected
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date_of_filing">
                            Date of Filing{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="date_of_filing"
                            type="date"
                            value={formData.date_of_filing}
                            onChange={(e) =>
                                setData('date_of_filing', e.target.value)
                            }
                            className=""
                            aria-invalid={errors?.date_of_filing ? true : false}
                        />
                        <InputError message={errors?.date_of_filing} />
                        <p className="text-xs text-muted-foreground">
                            When was this petition filed?
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="document_type">
                            Type of Document
                            <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.document_type}
                            onValueChange={(value) => {
                                setData('document_type', value);
                            }}
                            aria-invalid={errors?.document_type ? true : false}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select document type" />
                            </SelectTrigger>
                            <SelectContent>
                                {documentTypes.map((type: DocumentType) => (
                                    <SelectItem
                                        key={type.value}
                                        value={type.value}
                                    >
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors?.document_type} />
                        <p className="text-xs text-muted-foreground">
                            Type of civil registry document
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="petition_type">
                            Type of Petition
                            <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.petition_type}
                            onValueChange={(value) => {
                                setData('petition_type', value);
                            }}
                            aria-invalid={errors?.petition_type ? true : false}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {petitionTypes.map(
                                    (petitionType: PetitionType) => (
                                        <SelectItem
                                            key={petitionType.value}
                                            value={petitionType.value}
                                        >
                                            <div className="flex items-center gap-2">
                                                {petitionType.label}
                                            </div>
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>
                        <InputError message={errors?.petition_type} />
                        <p className="text-xs text-muted-foreground">
                            Type of petition to be filed
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="priority">Priority Level</Label>
                        <Select
                            value={formData.priority}
                            onValueChange={(value) => {
                                setData('priority', value);
                            }}
                            aria-invalid={errors?.priority ? true : false}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {priorities.map((priority: Priority) => (
                                    <SelectItem
                                        key={priority.value}
                                        value={priority.value}
                                    >
                                        <div className="flex items-center gap-2">
                                            {priority.label}
                                            {Number(priority.value) === 1 && (
                                                <Badge
                                                    variant="destructive"
                                                    className="text-xs"
                                                >
                                                    Urgent
                                                </Badge>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors?.priority} />
                        <p className="text-xs text-muted-foreground">
                            Set as urgent if time-sensitive
                        </p>
                    </div>
                    <div className="col-span-full space-y-2">
                        <Label htmlFor="document_owner">
                            Document Owner Name
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="document_owner"
                            placeholder="e.g., Juan Dela Cruz"
                            value={formData.document_owner}
                            onChange={(e) =>
                                setData('document_owner', e.target.value)
                            }
                            aria-invalid={errors?.document_owner ? true : false}
                            className=""
                        />
                        <InputError message={errors?.document_owner} />
                        <div className="flex items-center">
                            <Checkbox
                                className="mr-2"
                                id="same_as_petitioner"
                                onCheckedChange={(value: boolean) => {
                                    setData(
                                        'document_owner',
                                        value
                                            ? (selectedClient?.full_name ?? '')
                                            : '',
                                    );
                                }}
                            />
                            <Label
                                htmlFor="same_as_petitioner"
                                className="text-sm hover:cursor-pointer"
                            >
                                Same as petitioner
                            </Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            The name that appears on the document (may differ
                            from petitioner)
                        </p>
                    </div>

                    <div className="col-span-full space-y-2">
                        <Label htmlFor="petition_nature">
                            Type and Nature of Petition
                            <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="petition_nature"
                            placeholder="Describe the nature and reason for this petition..."
                            rows={4}
                            value={formData.petition_nature}
                            onChange={(e) =>
                                setData('petition_nature', e.target.value)
                            }
                            aria-invalid={
                                errors?.petition_nature ? true : false
                            }
                            className="resize-none"
                        />
                        <InputError message={errors?.petition_nature} />
                        <p className="text-xs text-muted-foreground">
                            Explain why this correction is needed and the legal
                            basis
                        </p>
                    </div>
                </div>

                <div className="flex justify-between border-t pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onPrevious}
                    >
                        <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
                        Back
                    </Button>
                    <Button
                        type="button"
                        onClick={onNext}
                        disabled={!canProceed}
                        className="cursor-pointer"
                    >
                        Continue to Corrections
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default DocumentDetailsStep;
