import AppLayout from '@/layouts/app-layout';
import petitions from '@/routes/petitions';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import PetitionTable from './create/datatable/petition-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Petitions',
        href: petitions.index().url,
    },
];

const Index = () => {
    return (
        <>
            <Head title="Petitions" />
            <div className="p-4">
                <PetitionTable />
            </div>
        </>
    );
};

Index.layout = (page: React.ReactNode) => (
    <AppLayout children={page} breadcrumbs={breadcrumbs} />
);

export default Index;
