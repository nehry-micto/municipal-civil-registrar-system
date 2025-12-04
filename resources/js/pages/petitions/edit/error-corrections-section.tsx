import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { PetitionForm } from '@/types';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';

interface ErrorCorrectionsSectionProps {
    data: PetitionForm;
    setData: <K extends keyof PetitionForm>(
        key: K,
        value: PetitionForm[K],
    ) => void;
}

const ErrorCorrectionsSection = ({
    data,
    setData,
}: ErrorCorrectionsSectionProps) => {
    const addErrorCorrection = () => {
        setData('errors_to_correct', [
            ...data.errors_to_correct,
            {
                item_number: data.errors_to_correct.length + 1,
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
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <AlertCircle className="size-4" /> Errors to Correct
                </CardTitle>
                <CardDescription className="text-xs">
                    Specify the corrections needed
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">
                                    Item #
                                </TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Current Value</TableHead>
                                <TableHead>Corrected Value</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.errors_to_correct.map((error, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Input
                                            value={error.item_number}
                                            onChange={(e) =>
                                                updateErrorCorrection(
                                                    index,
                                                    'item_number',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-8"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={error.description}
                                            onChange={(e) =>
                                                updateErrorCorrection(
                                                    index,
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-8"
                                            placeholder="Description"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={error.current_value}
                                            onChange={(e) =>
                                                updateErrorCorrection(
                                                    index,
                                                    'current_value',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-8 border-red-200 dark:border-red-900"
                                            placeholder="Incorrect"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={error.corrected_value}
                                            onChange={(e) =>
                                                updateErrorCorrection(
                                                    index,
                                                    'corrected_value',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-8 border-green-200 dark:border-green-900"
                                            placeholder="Correct"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                            onClick={() =>
                                                removeErrorCorrection(index)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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
