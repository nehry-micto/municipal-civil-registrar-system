import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
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
import { Textarea } from '@/components/ui/textarea';
import petitions from '@/routes/petitions';
import { Petition } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface RecordSheetModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    petition: Petition;
}

const RecordSheetModal = ({
    open,
    onOpenChange,
    petition,
}: RecordSheetModalProps) => {
    const { data, setData, put, processing, errors } = useForm({
        step: 'record_sheet',
        first_published_at: petition.record_sheet?.first_published_at || '',
        second_published_at: petition.record_sheet?.second_published_at || '',
        rendered_date: petition.record_sheet?.rendered_date || '',
        decision: petition.record_sheet?.decision?.toString() || '1',
        remarks: petition.record_sheet?.remarks || '',
    });

    useEffect(() => {
        if (open) {
            setData({
                step: 'record_sheet',
                first_published_at:
                    petition.record_sheet?.first_published_at || '',
                second_published_at:
                    petition.record_sheet?.second_published_at || '',
                rendered_date: petition.record_sheet?.rendered_date || '',
                decision: petition.record_sheet?.decision?.toString() || '1',
                remarks: petition.record_sheet?.remarks || '',
            });
        }
    }, [open, petition]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(petitions.updateStep(petition.id).url, {
            onSuccess: () => {
                toast.success('Record sheet updated successfully');
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Record Sheet</DialogTitle>
                    <DialogDescription>
                        Update publication details and decision
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first_published_at">
                                1st Publication
                            </Label>
                            <Input
                                id="first_published_at"
                                type="date"
                                value={data.first_published_at}
                                onChange={(e) =>
                                    setData(
                                        'first_published_at',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError message={errors.first_published_at} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="second_published_at">
                                2nd Publication
                            </Label>
                            <Input
                                id="second_published_at"
                                type="date"
                                value={data.second_published_at}
                                onChange={(e) =>
                                    setData(
                                        'second_published_at',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError message={errors.second_published_at} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="rendered_date">Rendered Date</Label>
                        <Input
                            id="rendered_date"
                            type="date"
                            value={data.rendered_date}
                            onChange={(e) =>
                                setData('rendered_date', e.target.value)
                            }
                        />
                        <InputError message={errors.rendered_date} />
                    </div>
                    <div className="space-y-2">
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
                    <div className="space-y-2">
                        <Label htmlFor="remarks">Remarks</Label>
                        <Textarea
                            id="remarks"
                            value={data.remarks}
                            onChange={(e) => setData('remarks', e.target.value)}
                        />
                        <InputError message={errors.remarks} />
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default RecordSheetModal;
