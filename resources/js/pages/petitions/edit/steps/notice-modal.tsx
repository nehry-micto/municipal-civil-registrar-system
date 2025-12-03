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
import { formatDateForInput } from '@/lib/utils';
import petitions from '@/routes/petitions';
import { Petition } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface NoticeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    petition: Petition;
}

const NoticeModal = ({ open, onOpenChange, petition }: NoticeModalProps) => {
    const getFormData = () => ({
        step: 'notice',
        notice_posting_date: formatDateForInput(petition.notice?.notice_posting_date),
    });

    const { data, setData, put, processing, errors, reset } = useForm(getFormData());

    useEffect(() => {
        if (open) {
            setData(getFormData());
        }
    }, [open, petition]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(petitions.updateStep(petition.id).url, {
            onSuccess: () => {
                toast.success('Notice of posting updated successfully');
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Notice of Posting</DialogTitle>
                    <DialogDescription>
                        Update the notice posting date
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="notice_posting_date">Posting Date</Label>
                        <Input
                            className="w-full"
                            id="notice_posting_date"
                            type="date"
                            value={data.notice_posting_date}
                            onChange={(e) =>
                                setData('notice_posting_date', e.target.value)
                            }
                        />
                        <InputError message={errors.notice_posting_date} />
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

export default NoticeModal;
