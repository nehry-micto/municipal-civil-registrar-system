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
import { Client, DocumentType, PetitionForm, Priority } from '@/types';
import { ChevronRight, FileText, Info } from 'lucide-react';

const DocumentDetailsStep = ({
    formData,
    selectedClient,
    setData,
    documentTypes,
    priorities,
    onNext,
    onPrevious,
}: {
    formData: PetitionForm;
    selectedClient: Client | null;
    setData: (field: string, value: string) => void;
    documentTypes: DocumentType[];
    priorities: Priority[];
    onNext: () => void;
    onPrevious: () => void;
}) => {
    const canProceed =
        formData.registry_number &&
        formData.document_type &&
        formData.document_owner &&
        formData.petition_nature;

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

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="registry_number">
                            Registry Number{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="registry_number"
                            placeholder="e.g., 2024-001234"
                            value={formData.registry_number}
                            onChange={(e) =>
                                setData('registry_number', e.target.value)
                            }
                            className="0"
                        />
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
                        />
                        <p className="text-xs text-muted-foreground">
                            When was this petition filed?
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="document_type">
                            Document Type{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.document_type}
                            onValueChange={(value) =>
                                setData('document_type', value)
                            }
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
                        <p className="text-xs text-muted-foreground">
                            Type of civil registry document
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="priority">Priority Level</Label>
                        <Select
                            value={formData.priority}
                            onValueChange={(value) => {
                                setData('priority', value);
                            }}
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
                        <p className="text-xs text-muted-foreground">
                            Set as urgent if time-sensitive
                        </p>
                    </div>

                    <div className="space-y-2 md:col-span-2">
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
                            className=""
                        />
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

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="petition_nature">
                            Nature of Petition{' '}
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
                            className="resize-none"
                        />
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
