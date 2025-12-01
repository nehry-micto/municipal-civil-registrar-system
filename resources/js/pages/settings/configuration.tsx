import ConfigurationController from '@/actions/App/Http/Controllers/Settings/ConfigurationController';
import { type BreadcrumbItem, type Configuration } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/configuration';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Configuration',
        href: edit().url,
    },
];

interface ConfigurationPageProps {
    configuration: Configuration | null;
}

export default function ConfigurationPage({ configuration }: ConfigurationPageProps) {
    const [flashMessage, setFlashMessage] = useState<string | null>(null);

    useEffect(() => {
        // Check for flash message from server
        const message = (window as any).flash?.success;
        if (message) {
            setFlashMessage(message);
            toast.success(message);
            // Clear the flash message
            delete (window as any).flash?.success;
        }
    }, []);

    const defaultData = configuration?.data || {
        civil_registry_head: {
            name: '',
            position: 'Civil Registry Head',
        },
        mayor: {
            name: '',
            position: 'Mayor',
        },
        municipality: '',
        province: '',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Configuration Settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="System Configuration"
                        description="Manage system-wide settings for documents and certificates"
                    />

                    <Form
                        {...ConfigurationController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                {/* Signatories Section */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Signatories</CardTitle>
                                        <CardDescription>
                                            Configure the signatories that will appear on official
                                            documents and certificates. These names and positions
                                            will be used in petitions and generated certificates.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Civil Registry Head */}
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-muted-foreground">
                                                        Civil Registry Head
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        The head of the civil registry office who
                                                        signs official documents.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="civil_registry_head_name">
                                                        Name
                                                    </Label>
                                                    <Input
                                                        id="civil_registry_head_name"
                                                        name="civil_registry_head.name"
                                                        defaultValue={
                                                            defaultData.civil_registry_head.name
                                                        }
                                                        placeholder="Enter full name"
                                                        required
                                                    />
                                                    <InputError
                                                        message={
                                                            errors['civil_registry_head.name']
                                                        }
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="civil_registry_head_position">
                                                        Position
                                                    </Label>
                                                    <Input
                                                        id="civil_registry_head_position"
                                                        name="civil_registry_head.position"
                                                        defaultValue={
                                                            defaultData.civil_registry_head
                                                                .position
                                                        }
                                                        placeholder="Enter position title"
                                                        required
                                                    />
                                                    <InputError
                                                        message={
                                                            errors['civil_registry_head.position']
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Mayor */}
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-muted-foreground">
                                                        Mayor
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        The municipal mayor who co-signs official
                                                        documents.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="mayor_name">Name</Label>
                                                    <Input
                                                        id="mayor_name"
                                                        name="mayor.name"
                                                        defaultValue={defaultData.mayor.name}
                                                        placeholder="Enter full name"
                                                        required
                                                    />
                                                    <InputError message={errors['mayor.name']} />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="mayor_position">
                                                        Position
                                                    </Label>
                                                    <Input
                                                        id="mayor_position"
                                                        name="mayor.position"
                                                        defaultValue={defaultData.mayor.position}
                                                        placeholder="Enter position title"
                                                        required
                                                    />
                                                    <InputError
                                                        message={errors['mayor.position']}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Location Section */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Location Information</CardTitle>
                                        <CardDescription>
                                            Configure the municipality and province that will
                                            appear on official documents and certificates.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Municipality */}
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-muted-foreground">
                                                        Municipality
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        The name of the municipality or city where
                                                        the civil registry office is located.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="municipality">
                                                    Municipality Name
                                                </Label>
                                                <Input
                                                    id="municipality"
                                                    name="municipality"
                                                    defaultValue={defaultData.municipality}
                                                    placeholder="Enter municipality name"
                                                    required
                                                />
                                                <InputError message={errors.municipality} />
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Province */}
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-muted-foreground">
                                                        Province
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        The name of the province where the
                                                        municipality is located.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="province">Province Name</Label>
                                                <Input
                                                    id="province"
                                                    name="province"
                                                    defaultValue={defaultData.province}
                                                    placeholder="Enter province name"
                                                    required
                                                />
                                                <InputError message={errors.province} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Version Info */}
                                {configuration && (
                                    <div className="rounded-lg border border-muted bg-muted/50 p-4">
                                        <p className="text-sm text-muted-foreground">
                                            Current Version:{' '}
                                            <span className="font-medium text-foreground">
                                                v{configuration.version}
                                            </span>
                                            {' • '}
                                            Last updated:{' '}
                                            <span className="font-medium text-foreground">
                                                {new Date(
                                                    configuration.updated_at,
                                                ).toLocaleString()}
                                            </span>
                                        </p>
                                    </div>
                                )}

                                {/* Save Button */}
                                <div className="flex items-center gap-4">
                                    <Button disabled={processing} size="lg">
                                        Save Configuration
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-emerald-600">Saved</p>
                                    </Transition>
                                </div>

                                <p className="text-xs text-muted-foreground">
                                    Note: Each time you save, a new version will be created for
                                    audit and tracking purposes.
                                </p>
                            </>
                        )}
                    </Form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
