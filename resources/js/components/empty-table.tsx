import { FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { Link } from '@inertiajs/react';

export function EmptyTable({
    title,
    description,
    buttonLabel,
    buttonLink,
}: {
    title: string;
    description: string;
    buttonLabel: string;
    buttonLink: string;
}) {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <FileText />
                </EmptyMedia>
                <EmptyTitle>{title}</EmptyTitle>
                <EmptyDescription>{description}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className="flex gap-2">
                    <Button>
                        <Link href={buttonLink}>{buttonLabel}</Link>
                    </Button>
                </div>
            </EmptyContent>
        </Empty>
    );
}
