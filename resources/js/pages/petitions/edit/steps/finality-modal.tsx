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
import { Textarea } from '@/components/ui/textarea';
import { formatDateForInput } from '@/lib/utils';
import petitions from '@/routes/petitions';
import { Petition } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface FinalityModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    petition: Petition;
}

interface FinalityFormData {
    step: string;
    certificate_number: string;
    released_at: string;
    notes: string;
}

const FinalityModal = ({
    open,
    onOpenChange,
    petition,
}: FinalityModalProps) => {
    const getFormData = () => ({
        step: 'finality',
        certificate_number: petition.finality?.certificate_number || '',
        released_at: formatDateForInput(petition.finality?.released_at),
        notes: petition.finality?.notes || '',
    });

    const { data, setData, put, processing, errors } = useForm<FinalityFormData>(getFormData());

    useEffect(() => {
        if (open) {
            setData(getFormData());
        }
    }, [open, petition]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(petitions.updateStep(petition.id).url, {
            onSuccess: () => {
                toast.success('Certificate of finality updated successfully');
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Certificate of Finality</DialogTitle>
                    <DialogDescription>
                        Update certificate details
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="certificate_number">
                            Certificate Number
                        </Label>
                        <Input
                            id="certificate_number"
                            value={data.certificate_number}
                            onChange={(e) =>
                                setData('certificate_number', e.target.value)
                            }
                        />
                        <InputError message={errors.certificate_number} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="released_at">Released Date</Label>
                        <Input
                            id="released_at"
                            type="date"
                            value={data.released_at}
                            onChange={(e) =>
                                setData('released_at', e.target.value)
                            }
                        />
                        <InputError message={errors.released_at} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                        />
                        <InputError message={errors.notes} />
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

export default FinalityModal;
