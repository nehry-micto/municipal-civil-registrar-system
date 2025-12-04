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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PetitionForm } from '@/types';
import {
    AlertCircle,
    CheckCircle2Icon,
    ChevronRight,
    Info,
    Plus,
    X,
} from 'lucide-react';

const ErrorCorrectionsStep = ({
    formData,
    addErrorCorrection,
    removeErrorCorrection,
    updateErrorCorrection,
    onPrevious,
    onSubmit,
}: {
    formData: PetitionForm;
    addErrorCorrection: () => void;
    removeErrorCorrection: (index: number) => void;
    updateErrorCorrection: (
        index: number,
        field: string,
        value: string,
    ) => void;
    onPrevious: () => void;
    onSubmit: () => void;
}) => {
    const canSubmit = formData.errors_to_correct.some(
        (e) => e.description && e.current_value && e.corrected_value,
    );

    return (
        <Card className="border-1">
            <CardHeader className="border-b">
                <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    <CardTitle>Errors to Correct</CardTitle>
                </div>
                <CardDescription className="mb-4">
                    Specify all the errors that need to be corrected in the
                    document
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Alert
                    variant={'default'}
                    className="border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-800 dark:bg-amber-900/40 dark:text-amber-500"
                >
                    <Info className="h-4 w-4" />

                    <AlertDescription className="text-amber-800 dark:text-amber-500">
                        <strong>Important:</strong> List each error separately
                        with the current (incorrect) value and the corrected
                        value. Be as specific as possible.
                    </AlertDescription>
                </Alert>

                <div className="space-y-4">
                    {formData.errors_to_correct.map((error, index) => (
                        <div
                            key={index}
                            className="rounded-lg border border-muted bg-card p-4 transition-all hover:border-primary/40"
                        >
                            <div className="mb-4 flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                                        <span className="text-sm font-semibold text-primary">
                                            {index + 1}
                                        </span>
                                    </div>
                                    <span className="font-medium text-primary">
                                        Error #{index + 1}
                                    </span>
                                </div>
                                {formData.errors_to_correct.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            removeErrorCorrection(index)
                                        }
                                        className="text-gray-400 hover:text-red-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>

                            <div className="grid gap-4">
                                <div className="flex gap-4">
                                    <div className="">
                                        <Label htmlFor={`item-${index}`}>
                                            Item Number
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id={`item-${index}`}
                                            placeholder="e.g., 1"
                                            type="number"
                                            value={error.item_number}
                                            onChange={(e) =>
                                                updateErrorCorrection(
                                                    index,
                                                    'item_number',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-24"
                                        />
                                    </div>
                                    <div className="w-full space-y-2">
                                        <Label htmlFor={`description-${index}`}>
                                            Description
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id={`description-${index}`}
                                            placeholder="e.g., First Name, Date of Birth, Place of Birth"
                                            value={error.description}
                                            onChange={(e) =>
                                                updateErrorCorrection(
                                                    index,
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            className=""
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Which description needs correction?
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor={`current-${index}`}
                                            className="flex items-center gap-2"
                                        >
                                            Current Value{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                            <Badge
                                                variant="default"
                                                className="bg-red-600 text-xs dark:bg-red-900 dark:text-red-200"
                                            >
                                                Incorrect
                                            </Badge>
                                        </Label>
                                        <Input
                                            id={`current-${index}`}
                                            placeholder="Current incorrect value"
                                            value={error.current_value}
                                            onChange={(e) =>
                                                updateErrorCorrection(
                                                    index,
                                                    'current_value',
                                                    e.target.value,
                                                )
                                            }
                                            className="border-red-300 focus:border-red-500 dark:border-red-900"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor={`corrected-${index}`}
                                            className="flex items-center gap-2"
                                        >
                                            Corrected Value{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                            <Badge
                                                variant="default"
                                                className="bg-green-600 text-xs dark:bg-green-900 dark:text-green-200"
                                            >
                                                Correct
                                            </Badge>
                                        </Label>
                                        <Input
                                            id={`corrected-${index}`}
                                            placeholder="New correct value"
                                            value={error.corrected_value}
                                            onChange={(e) =>
                                                updateErrorCorrection(
                                                    index,
                                                    'corrected_value',
                                                    e.target.value,
                                                )
                                            }
                                            className="border-green-300 focus:border-green-500 dark:border-green-900"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={addErrorCorrection}
                    className="w-full cursor-pointer border-2 border-dashed transition-all duration-300 hover:border-muted-foreground hover:bg-primary/10"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Errors to Correct
                </Button>

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
                        onClick={onSubmit}
                        disabled={!canSubmit}
                    >
                        <CheckCircle2Icon className="size-4" />
                        Create Petition
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ErrorCorrectionsStep;
