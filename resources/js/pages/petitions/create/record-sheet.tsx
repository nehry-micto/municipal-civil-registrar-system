import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import petitions from '@/routes/petitions';
import { Petition } from '@/types';
import { useForm } from '@inertiajs/react';
import { DialogClose } from '@radix-ui/react-dialog';
import { toast } from 'sonner';

const RecordSheet = ({
    selectedRecord,
    setSelectedRecord,
}: {
    selectedRecord: Petition | null;
    setSelectedRecord: (record: Petition | null) => void;
}) => {
    const { data, post, errors, setData, processing, reset } = useForm({
        first_published_at: '',
        second_published_at: '',
        rendered_date: new Date().toISOString().split('T')[0],
        remarks: '',
        decision: '1',
    });

    const onSubmit = () => {
        post(
            petitions.changeStep.url({
                id: selectedRecord?.id ?? '',
            }),
            {
                onSuccess: () => {
                    setSelectedRecord(null);
                    reset();
                    toast.success('Record sheet details have been successfully saved.');
                },
            },
        );
    };

    return (
        <Dialog
            open={selectedRecord?.next_step === 'Record Sheet'}
            onOpenChange={(open) =>
                setSelectedRecord(open ? selectedRecord : null)
            }
        >
            <DialogContent className="max-w-md">
                <DialogTitle>Record Sheet</DialogTitle>
                <DialogDescription>
                    Please enter the publication details and decision.
                </DialogDescription>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="first_published_at">
                                1st Publication Date
                            </Label>
                            <Input
                                name="first_published_at"
                                value={data.first_published_at}
                                className="block w-full"
                                id="first_published_at"
                                aria-invalid={
                                    errors.first_published_at ? true : false
                                }
                                onChange={(e) =>
                                    setData('first_published_at', e.target.value)
                                }
                                type="date"
                            />
                            <InputError message={errors.first_published_at} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="second_published_at">
                                2nd Publication Date
                            </Label>
                            <Input
                                name="second_published_at"
                                value={data.second_published_at}
                                className="block w-full"
                                id="second_published_at"
                                aria-invalid={
                                    errors.second_published_at ? true : false
                                }
                                onChange={(e) =>
                                    setData('second_published_at', e.target.value)
                                }
                                type="date"
                            />
                            <InputError message={errors.second_published_at} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="rendered_date">Date Rendered</Label>
                        <Input
                            name="rendered_date"
                            value={data.rendered_date}
                            className="block w-full"
                            id="rendered_date"
                            aria-invalid={errors.rendered_date ? true : false}
                            onChange={(e) =>
                                setData('rendered_date', e.target.value)
                            }
                            type="date"
                        />
                        <InputError message={errors.rendered_date} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="decision">Decision</Label>
                        <Select
                            value={data.decision}
                            onValueChange={(value) => setData('decision', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select decision" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Approved</SelectItem>
                                <SelectItem value="0">Denied</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.decision} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="remarks">Remarks</Label>
                        <Textarea
                            name="remarks"
                            value={data.remarks}
                            className="block w-full"
                            id="remarks"
                            onChange={(e) => setData('remarks', e.target.value)}
                        />
                        <InputError message={errors.remarks} />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            disabled={processing}
                            variant="outline"
                            type="button"
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        disabled={processing}
                        onClick={onSubmit}
                        type="submit"
                    >
                        {processing && <Spinner />}
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RecordSheet;
