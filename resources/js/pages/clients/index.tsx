import AppLayout from '@/layouts/app-layout';
import clients from '@/routes/clients';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ClientTable from './datatable/client-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: clients.index().url,
    },
];

const Index = () => {
    return (
        <>
            <Head title="Clients" />
            <div className="p-4">
                <ClientTable />
            </div>
        </>
    );
};

Index.layout = (page: React.ReactNode) => (
    <AppLayout children={page} breadcrumbs={breadcrumbs} />
);

export default Index;
