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
import { Spinner } from '@/components/ui/spinner';
import petitions from '@/routes/petitions';
import { Petition } from '@/types';
import { useForm } from '@inertiajs/react';
import { DialogClose } from '@radix-ui/react-dialog';
import { useEffect } from 'react';

import { toast } from 'sonner';

const PostingCertificate = ({
    selectedRecord,
    setSelectedRecord,
}: {
    selectedRecord: Petition | null;
    setSelectedRecord: (record: Petition | null) => void;
}) => {
    const { data, post, errors, setData, processing, reset } = useForm({
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
    });

    useEffect(() => {
        if (data.start_date) {
            const startDate = new Date(data.start_date);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 10);
            setData('end_date', endDate.toISOString().split('T')[0]);
        }
    }, [data.start_date]);

    const onSubmit = () => {
        post(
            petitions.changeStep.url({
                id: selectedRecord?.id ?? '',
            }),
            {
                onSuccess: () => {
                    reset();
                    toast.success('Certificate of posting period has been successfully set.');
                    window.open(
                        `/petitions/${selectedRecord?.id}/generate-certificate-of-posting`,
                        '_blank',
                    ); 
                    setSelectedRecord(null);
                },
            },
        );
    };

    return (
        <Dialog
            open={selectedRecord?.next_step === 'Certificate of Posting'}
            onOpenChange={(open) =>
                setSelectedRecord(open ? selectedRecord : null)
            }
        >
            <DialogContent className="max-w-md">
                <DialogTitle>Certificate of Posting</DialogTitle>
                <DialogDescription>
                    Please set the posting period. The end date is automatically calculated (10 days).
                </DialogDescription>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="start_date">Start Date</Label>
                        <Input
                            name="start_date"
                            value={data.start_date}
                            className="block w-full"
                            id="start_date"
                            aria-invalid={errors.start_date ? true : false}
                            onChange={(e) => setData('start_date', e.target.value)}
                            type="date"
                        />
                        <InputError message={errors.start_date} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="end_date">End Date</Label>
                        <Input
                            name="end_date"
                            value={data.end_date}
                            className="block w-full bg-muted"
                            id="end_date"
                            readOnly
                            disabled
                            type="date"
                        />
                        <InputError message={errors.end_date} />
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
                        onClick={() =>
                            window.open(
                                `/petitions/${selectedRecord?.id}/generate-certificate-of-posting`,
                                '_blank',
                            )
                        }
                        variant="secondary"
                        type="button"
                    >
                        Download
                    </Button>
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

export default PostingCertificate;
