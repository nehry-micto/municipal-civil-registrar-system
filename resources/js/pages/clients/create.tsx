import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import clients from '@/routes/clients';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: clients.index().url,
    },
    {
        title: 'Create Client',
        href: '#',
    },
];

const Create = () => {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        middle_name: '',
        suffix: '',
        contact_number: '',
    });

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(clients.store().url, {
            onSuccess: () => {
                toast.success('Client created successfully!');
            },
        });
    };

    return (
        <>
            <Head title="Create Client" />
            <div className="container mx-auto px-10 py-10">
                <div className="mb-6">
                    <Button variant="ghost" asChild>
                        <Link href={clients.index().url}>
                            <ArrowLeft className="size-4" /> Back to Clients
                        </Link>
                    </Button>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Create New Client</CardTitle>
                        <CardDescription>
                            Add a new client to the system. Client code will be auto-generated.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">
                                        First Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="first_name"
                                        value={data.first_name}
                                        onChange={(e) =>
                                            setData('first_name', e.target.value)
                                        }
                                        placeholder="Juan"
                                        className={errors.first_name ? 'border-red-500' : ''}
                                    />
                                    {errors.first_name && (
                                        <p className="text-xs text-red-500">
                                            {errors.first_name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="last_name">
                                        Last Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="last_name"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        placeholder="Dela Cruz"
                                        className={errors.last_name ? 'border-red-500' : ''}
                                    />
                                    {errors.last_name && (
                                        <p className="text-xs text-red-500">
                                            {errors.last_name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="middle_name">Middle Name</Label>
                                    <Input
                                        id="middle_name"
                                        value={data.middle_name}
                                        onChange={(e) =>
                                            setData('middle_name', e.target.value)
                                        }
                                        placeholder="Santos"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="suffix">Suffix</Label>
                                    <Input
                                        id="suffix"
                                        value={data.suffix}
                                        onChange={(e) => setData('suffix', e.target.value)}
                                        placeholder="Jr., Sr., III"
                                    />
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="contact_number">Contact Number</Label>
                                    <Input
                                        id="contact_number"
                                        value={data.contact_number}
                                        onChange={(e) =>
                                            setData('contact_number', e.target.value)
                                        }
                                        placeholder="09123456789"
                                        maxLength={11}
                                        className={
                                            errors.contact_number ? 'border-red-500' : ''
                                        }
                                    />
                                    {errors.contact_number && (
                                        <p className="text-xs text-red-500">
                                            {errors.contact_number}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit(clients.index().url)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Client'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

Create.layout = (page: React.ReactNode) => (
    <AppLayout children={page} breadcrumbs={breadcrumbs} />
);

export default Create;
