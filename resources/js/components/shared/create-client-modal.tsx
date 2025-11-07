import clients from '@/routes/clients';
import { useForm } from '@inertiajs/react';
import { DialogDescription } from '@radix-ui/react-dialog';
import { AlertCircle, Loader2, Phone, User } from 'lucide-react';
import { Alert } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const CreateClientModal = ({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) => {
    const {
        data: formData,
        setData,
        reset,
        processing,
        errors,
        post,
    } = useForm({
        first_name: '',
        last_name: '',
        middle_name: '',
        suffix: '',
        contact_number: '',
    });

    const handleSubmit = async () => {
        post(clients.store.url(), {
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
            preserveScroll: true,
        });
    };

    const handleClose = () => {
        onOpenChange(false);
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent aria-description="" className="sm:max-w-[600px]">
                {/* Success State Overlay */}
                {/* {submitSuccess && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center rounded-lg bg-green-50/95 backdrop-blur-sm">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-green-500">
                                <Check className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-green-900">
                                Client Created!
                            </h3>
                            <p className="text-green-700">{getFullName()}</p>
                        </div>
                    </div>
                )} */}

                <DialogHeader>
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle>Create New Client</DialogTitle>
                            <div className="mt-1 text-sm text-primary/70">
                                Add a new client to the system
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-4">
                    <DialogDescription></DialogDescription>
                    <Alert className="mb-6 border-blue-200 bg-blue-50">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <div className="text-wrap text-blue-800">
                            <strong>Note:</strong> Fields marked with{' '}
                            <span className="text-red-500">*</span> are
                            required. The client code will be automatically
                            generated.
                        </div>
                    </Alert>

                    <div className="space-y-6">
                        {/* Name Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b pb-2 text-sm font-semibold text-gray-700">
                                <User className="h-4 w-4" />
                                <span>Personal Information</span>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                {/* First Name */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="first_name"
                                        className="flex items-center gap-1"
                                    >
                                        First Name{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="first_name"
                                        placeholder="e.g., Juan"
                                        value={formData.first_name}
                                        onChange={(e) =>
                                            setData(
                                                'first_name',
                                                e.target.value,
                                            )
                                        }
                                        disabled={processing}
                                    />
                                    {errors.first_name && (
                                        <p className="flex items-center gap-1 text-xs text-red-600">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.first_name}
                                        </p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="last_name"
                                        className="flex items-center gap-1"
                                    >
                                        Last Name{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="last_name"
                                        placeholder="e.g., Dela Cruz"
                                        value={formData.last_name}
                                        onChange={(e) =>
                                            setData('last_name', e.target.value)
                                        }
                                        className={
                                            errors.last_name
                                                ? 'border-red-500'
                                                : ''
                                        }
                                        disabled={processing}
                                    />
                                    {errors.last_name && (
                                        <p className="flex items-center gap-1 text-xs text-red-600">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.last_name}
                                        </p>
                                    )}
                                </div>

                                {/* Middle Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="middle_name">
                                        Middle Name
                                        <span className="ml-1 text-xs text-gray-400">
                                            (Optional)
                                        </span>
                                    </Label>
                                    <Input
                                        id="middle_name"
                                        placeholder="e.g., Santos"
                                        value={formData.middle_name}
                                        onChange={(e) =>
                                            setData(
                                                'middle_name',
                                                e.target.value,
                                            )
                                        }
                                        disabled={processing}
                                    />
                                </div>

                                {/* Suffix */}
                                <div className="space-y-2">
                                    <Label htmlFor="suffix">
                                        Suffix
                                        <span className="ml-1 text-xs text-gray-400">
                                            (Optional)
                                        </span>
                                    </Label>
                                    <Input
                                        id="suffix"
                                        placeholder="e.g., Jr., Sr., III"
                                        value={formData.suffix}
                                        onChange={(e) =>
                                            setData('suffix', e.target.value)
                                        }
                                        disabled={processing}
                                    />
                                </div>
                            </div>

                            {/* Full Name Preview */}
                            {/* {hasRequiredFields() && (
                                <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            Full Name:
                                        </span>
                                        <span className="font-semibold text-gray-900">
                                            {getFullName()}
                                        </span>
                                    </div>
                                </div>
                            )} */}
                        </div>

                        {/* Contact Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b pb-2 text-sm font-semibold text-gray-700">
                                <Phone className="h-4 w-4" />
                                <span>Contact Information</span>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="contact_number"
                                    className="flex items-center gap-2"
                                >
                                    Contact Number
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        Optional
                                    </Badge>
                                </Label>
                                <Input
                                    id="contact_number"
                                    type="tel"
                                    placeholder="e.g., 09XX XXX XXXX"
                                    value={formData.contact_number}
                                    onChange={(e) =>
                                        setData(
                                            'contact_number',
                                            e.target.value,
                                        )
                                    }
                                    className={
                                        errors.contact_number
                                            ? 'border-red-500'
                                            : ''
                                    }
                                    disabled={processing}
                                />
                                {errors.contact_number && (
                                    <p className="flex items-center gap-1 text-xs text-red-600">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.contact_number}
                                    </p>
                                )}
                                {!errors.contact_number && (
                                    <p className="text-xs text-gray-500">
                                        Philippine mobile number format (09XX
                                        XXX XXXX)
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={processing}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <User className="h-4 w-4" />
                                Create Client
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateClientModal;
