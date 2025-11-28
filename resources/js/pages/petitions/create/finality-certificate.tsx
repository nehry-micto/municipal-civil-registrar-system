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
import { Textarea } from '@/components/ui/textarea';
import certificateGenerator from '@/routes/certificate-generator';
import petitions from '@/routes/petitions';
import { Petition } from '@/types';
import { useForm } from '@inertiajs/react';
import { DialogClose } from '@radix-ui/react-dialog';
import { toast } from 'sonner';

const FinalityCertificate = ({
    selectedRecord,
    setSelectedRecord,
}: {
    selectedRecord: Petition | null;
    setSelectedRecord: (record: Petition | null) => void;
}) => {
    const { data, post, errors, setData, processing, reset } = useForm({
        certificate_number: '',
        released_at: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const onSubmit = () => {
        post(
            petitions.changeStep.url({
                id: selectedRecord?.id ?? '',
            }),
            {
                onSuccess: () => {
                    if (selectedRecord?.id) {
                        window.open(
                            certificateGenerator.certificateOfFinality.url({
                                petition: selectedRecord.id,
                            }),
                            '_blank',
                        );
                    }

                    setSelectedRecord(null);
                    reset();
                    toast.success('Certificate of Finality has been successfully issued.');
                },
            },
        );
    };

    return (
        <Dialog
            open={selectedRecord?.next_step === 'Certificate of Finality'}
            onOpenChange={(open) =>
                setSelectedRecord(open ? selectedRecord : null)
            }
        >
            <DialogContent className="max-w-md">
                <DialogTitle>Certificate of Finality</DialogTitle>
                <DialogDescription>
                    Please enter the certificate details.
                </DialogDescription>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="certificate_number">
                            Certificate Number
                        </Label>
                        <Input
                            name="certificate_number"
                            value={data.certificate_number}
                            className="block w-full"
                            id="certificate_number"
                            aria-invalid={
                                errors.certificate_number ? true : false
                            }
                            onChange={(e) =>
                                setData('certificate_number', e.target.value)
                            }
                        />
                        <InputError message={errors.certificate_number} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="released_at">Date Released</Label>
                        <Input
                            name="released_at"
                            value={data.released_at}
                            className="block w-full"
                            id="released_at"
                            aria-invalid={errors.released_at ? true : false}
                            onChange={(e) =>
                                setData('released_at', e.target.value)
                            }
                            type="date"
                        />
                        <InputError message={errors.released_at} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            name="notes"
                            value={data.notes}
                            className="block w-full"
                            id="notes"
                            onChange={(e) => setData('notes', e.target.value)}
                        />
                        <InputError message={errors.notes} />
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

export default FinalityCertificate;
