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
import petitions from '@/routes/petitions';
import { Petition } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface CertificateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    petition: Petition;
}

const CertificateModal = ({
    open,
    onOpenChange,
    petition,
}: CertificateModalProps) => {
    const { data, setData, put, processing, errors } = useForm({
        step: 'certificate',
        start_date: petition.certificate?.start_date || '',
        end_date: petition.certificate?.end_date || '',
        posting_date: petition.certificate?.posting_date || '',
    });

    useEffect(() => {
        if (open) {
            setData({
                step: 'certificate',
                start_date: petition.certificate?.start_date || '',
                end_date: petition.certificate?.end_date || '',
                posting_date: petition.certificate?.posting_date || '',
            });
        }
    }, [open, petition]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(petitions.updateStep(petition.id).url, {
            onSuccess: () => {
                toast.success('Certificate of posting updated successfully');
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Certificate of Posting</DialogTitle>
                    <DialogDescription>
                        Update the posting period dates
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="start_date">Start Date</Label>
                            <Input
                                id="start_date"
                                type="date"
                                value={data.start_date}
                                onChange={(e) =>
                                    setData('start_date', e.target.value)
                                }
                            />
                            <InputError message={errors.start_date} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end_date">End Date</Label>
                            <Input
                                id="end_date"
                                type="date"
                                value={data.end_date}
                                onChange={(e) =>
                                    setData('end_date', e.target.value)
                                }
                            />
                            <InputError message={errors.end_date} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="posting_date">Posting Date</Label>
                        <Input
                            id="posting_date"
                            type="date"
                            value={data.posting_date}
                            onChange={(e) =>
                                setData('posting_date', e.target.value)
                            }
                        />
                        <InputError message={errors.posting_date} />
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

export default CertificateModal;
