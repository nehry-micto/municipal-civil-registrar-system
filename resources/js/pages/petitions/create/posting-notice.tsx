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
import certificateGenerator from '@/routes/certificate-generator';
import petitions from '@/routes/petitions';
import { Petition } from '@/types';
import { useForm } from '@inertiajs/react';
import { DialogClose } from '@radix-ui/react-dialog';

import { toast } from 'sonner';

const PostingNotice = ({
    selectedRecord,
    setSelectedRecord,
}: {
    selectedRecord: Petition | null;
    setSelectedRecord: (record: Petition | null) => void;
}) => {
    const { data, post, errors, setData, processing } = useForm({
        notice_date: new Date().toISOString().split('T')[0],
    });

    const onSubmit = () => {
        post(
            petitions.changeStep.url({
                id: selectedRecord?.id ?? '',
            }),
            {
                onSuccess: () => {

                    toast.success(
                        'Notice of posting date has been successfully recorded.',
                    );
                   
                    window.open(
                        certificateGenerator.notice.url({
                            petition: selectedRecord?.id ?? '',
                        }),
                        '_blank',
                    );
                    setSelectedRecord(null);
                },
            },
        );
    };

    return (
        <Dialog
            open={selectedRecord?.next_step === 'Notice of Posting'}
            onOpenChange={(open) =>
                setSelectedRecord(open ? selectedRecord : null)
            }
        >
            <DialogContent className="w-[400px]">
                <DialogTitle>Notice of Posting</DialogTitle>
                <DialogDescription>Please fill the date</DialogDescription>
                <div className="w-fit items-center space-y-2 ">
                    <Label htmlFor="notice_date">Date</Label>
                    <Input
                        name="notice_date"
                        value={data.notice_date}
                        className="mt-1 block w-full"
                        id="notice_date"
                        aria-invalid={errors.notice_date ? true : false}
                        aria-describedby="notice_date-error"
                        onChange={(e) => setData('notice_date', e.target.value)}
                        type="date"
                    />
                    <InputError message={errors.notice_date} />
                </div>
                <DialogFooter className="">
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

export default PostingNotice;
