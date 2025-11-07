import CreateClientModal from '@/components/shared/create-client-modal';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Client, PetitionForm } from '@/types';
import { router, SetDataAction } from '@inertiajs/react';
import {
    AlertCircle,
    ChevronRight,
    Info,
    Plus,
    Search,
    User,
    X,
} from 'lucide-react';
import { useState } from 'react';

const ClientSelectionStep = ({
    formData,
    setData,
    clients,
    setSelectedClient,
    onNext,
}: {
    formData: PetitionForm;
    setData: SetDataAction<PetitionForm>;
    setSelectedClient: (client: Client | null) => void;
    clients: Client[];
    onNext: () => void;
}) => {
    const [createClientModalOpen, setCreateClientModalOpen] = useState(false);

    const selectedClient = clients.find((c) => c.id === formData.client_id);

    const canProceed = formData.client_id !== '';

    return (
        <Card className="border-1">
            <CardHeader className="border-b">
                <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <CardTitle>Select Petitioner (Client)</CardTitle>
                </div>
                <CardDescription className="mb-2">
                    Choose an existing client or create a new one who will be
                    filing this petition
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                        <strong>Tip:</strong> The petitioner is the person
                        requesting the correction. This might be different from
                        the document owner.
                    </AlertDescription>
                </Alert>

                {!formData.client_id ? (
                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by name or client code..."
                                className="pl-10"
                                // value={searchTerm}
                                onChange={(e) => {
                                    router.visit(
                                        window.location.pathname +
                                            '?search=' +
                                            e.target.value,
                                        {
                                            replace: true,
                                            preserveState: true,
                                            preserveScroll: true,
                                            async: true,
                                            // showProgress: true,
                                        },
                                    );
                                }}
                            />
                        </div>

                        <div className="grid max-h-96 gap-3 overflow-y-auto">
                            {clients.map((client: Client) => (
                                <button
                                    key={client.id}
                                    type="button"
                                    onClick={() => {
                                        setData('client_id', client.id);
                                        setSelectedClient(client);
                                    }}
                                    className="group rounded-lg border-2 border-gray-200 p-4 text-left transition-all hover:border-blue-500 hover:bg-blue-50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold text-gray-900 group-hover:text-blue-700">
                                                {client.full_name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {client.client_code}
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500">
                                    Or
                                </span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => setCreateClientModalOpen(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Create New Client
                        </Button>
                        <CreateClientModal
                            open={createClientModalOpen}
                            onOpenChange={setCreateClientModalOpen}
                        />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="rounded-lg border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                        <User className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="mb-1 text-sm font-medium text-green-600">
                                            Selected Petitioner
                                        </div>
                                        <div className="text-lg font-bold text-gray-900">
                                            {selectedClient?.full_name}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {selectedClient?.client_code}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setData('client_id', '');
                                        setSelectedClient(null);
                                    }}
                                    className="text-gray-500 hover:text-red-600"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <Alert className="border-green-200 bg-green-50">
                            <AlertCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                                Great! You can now proceed to enter the document
                                details.
                            </AlertDescription>
                        </Alert>
                    </div>
                )}

                <div className="flex justify-end border-t pt-4">
                    <Button
                        type="button"
                        onClick={onNext}
                        disabled={!canProceed}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Continue to Document Details
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ClientSelectionStep;
