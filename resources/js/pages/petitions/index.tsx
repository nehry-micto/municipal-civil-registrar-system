import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import petitions from '@/routes/petitions';
import { BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import { PlusCircleIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Petitions',
        href: petitions.index().url,
    },
];

const Index = () => {
    return (
        <div className="p-4">
            <div>
                <Button variant={'outline'} size={'sm'} asChild>
                    <Link href={petitions.create().url}>
                        <PlusCircleIcon /> Create Petition
                    </Link>
                </Button>
            </div>
        </div>
    );
};

Index.layout = (page: React.ReactNode) => (
    <AppLayout children={page} breadcrumbs={breadcrumbs} />
);

export default Index;
