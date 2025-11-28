import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import clients from '@/routes/clients';
import petitions from '@/routes/petitions';
import { BreadcrumbItem, Client } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit2, FileText, TrashIcon, User } from 'lucide-react';
import { toast } from 'sonner';

const Show = ({ client }: { client: Client & { petitions?: any[] } }) => {
 

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this client?')) {
            router.delete(clients.destroy.url(client.id), {
                onSuccess: () => {
                    toast.success('Client deleted successfully!');
                    router.visit(clients.index().url);
                },
            });
        }
    };

    return (
        <>
            <Head title={client.full_name} />
            <div className="container mx-auto px-10 py-10 space-y-8">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" asChild>
                        <Link href={clients.index().url}>
                            <ArrowLeft className="size-4" /> Back to Clients
                        </Link>
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={clients.edit.url(client.id)}>
                                <Edit2 className="size-4" /> Edit
                            </Link>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <TrashIcon className="size-4" /> Delete
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Client Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <User className="size-4" /> Client Information
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Personal details and contact information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Client Code
                                        </p>
                                        <Badge variant="default">
                                            {client.client_code}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Contact Number
                                        </p>
                                        <p className="text-sm">
                                            {client.contact_number || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">
                                            First Name
                                        </p>
                                        <p className="text-sm font-medium">
                                            {client.first_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Last Name
                                        </p>
                                        <p className="text-sm font-medium">
                                            {client.last_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Middle Name
                                        </p>
                                        <p className="text-sm">
                                            {client.middle_name || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Suffix
                                        </p>
                                        <p className="text-sm">{client.suffix || 'N/A'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Petitions */}
                        {client.petitions && client.petitions.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <FileText className="size-4" /> Petitions
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        List of petitions filed by this client
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-md border">
                                        <Table className="text-xs">
                                            <TableHeader>
                                                <TableRow className="bg-muted/50">
                                                    <TableHead>Petition No.</TableHead>
                                                    <TableHead>Document Type</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Date Filed</TableHead>
                                                    <TableHead></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {client.petitions.map((petition: any) => (
                                                    <TableRow key={petition.id}>
                                                        <TableCell>
                                                            <Badge variant="default">
                                                                {petition.petition_number}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {petition.document_type}
                                                        </TableCell>
                                                        <TableCell>
                                                            {petition.next_step || 'Completed'}
                                                        </TableCell>
                                                        <TableCell>
                                                            {petition.date_of_filing}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={petitions.show.url(
                                                                        petition.id,
                                                                    )}
                                                                >
                                                                    View
                                                                </Link>
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Statistics</CardTitle>
                                <CardDescription className="text-xs">
                                    Client activity summary
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Total Petitions
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {client.petitions?.length || 0}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Created At
                                    </p>
                                    <p className="text-sm">{client.created_at}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Last Updated
                                    </p>
                                    <p className="text-sm">{client.updated_at}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Clients',
            href: clients.index().url,
        },
        {
            title: 'Show',
            href: '#',
        },
    ];

Show.layout = (page: React.ReactNode) => {
   
    
    return <AppLayout children={page} breadcrumbs={breadcrumbs} />;
};


export default Show;
