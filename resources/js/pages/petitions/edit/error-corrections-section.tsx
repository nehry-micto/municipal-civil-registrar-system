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
import { AlertCircle, Plus, X } from 'lucide-react';

interface ErrorCorrectionsSectionProps {
    data: PetitionForm;
    setData: (key: keyof PetitionForm, value: any) => void;
}

const ErrorCorrectionsSection = ({
    data,
    setData,
}: ErrorCorrectionsSectionProps) => {
    const addErrorCorrection = () => {
        setData('errors_to_correct', [
            ...data.errors_to_correct,
            {
                item_number: '',
                description: '',
                current_value: '',
                corrected_value: '',
            },
        ]);
    };

    const removeErrorCorrection = (index: number) => {
        setData('errors_to_correct', [
            ...data.errors_to_correct.slice(0, index),
            ...data.errors_to_correct.slice(index + 1),
        ]);
    };

    const updateErrorCorrection = (
        index: number,
        field: string,
        value: string,
    ) => {
        setData('errors_to_correct', [
            ...data.errors_to_correct.slice(0, index),
            { ...data.errors_to_correct[index], [field]: value },
            ...data.errors_to_correct.slice(index + 1),
        ]);
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <AlertCircle className="size-4" /> Errors to Correct
                </CardTitle>
                <CardDescription className="text-xs">
                    Specify the corrections needed
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    {data.errors_to_correct.map((error, index) => (
                        <div
                            key={index}
                            className="group relative rounded-lg border bg-card p-4"
                        >
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                                onClick={() => removeErrorCorrection(index)}
                            >
                                <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                            </Button>

                            <div className="grid gap-3">
                                <div className="flex gap-2">
                                    <div className="w-20">
                                        <Label className="text-xs">
                                            Item #
                                        </Label>
                                        <Input
                                            value={error.item_number}
                                            onChange={(e) =>
                                                updateErrorCorrection(
                                                    index,
                                                    'item_number',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Label className="text-xs">
                                            Description
                                        </Label>
                                        <Input
                                            value={error.description}
                                            onChange={(e) =>
                                                updateErrorCorrection(
                                                    index,
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-8 text-sm"
                                            placeholder="e.g. First Name"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <Label className="text-xs text-red-600 dark:text-red-400">
                                            Incorrect
                                        </Label>
                                        <Input
                                            value={error.current_value}
                                            onChange={(e) =>
                                                updateErrorCorrection(
                                                    index,
                                                    'current_value',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-8 border-red-200 text-sm dark:border-red-900"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs text-green-600 dark:text-green-400">
                                            Correct
                                        </Label>
                                        <Input
                                            value={error.corrected_value}
                                            onChange={(e) =>
                                                updateErrorCorrection(
                                                    index,
                                                    'corrected_value',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-8 border-green-200 text-sm dark:border-green-900"
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
                    className="w-full border-dashed"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Error
                </Button>
            </CardContent>
        </Card>
    );
};

export default ErrorCorrectionsSection;
