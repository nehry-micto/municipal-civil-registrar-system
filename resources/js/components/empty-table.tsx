import { FilePlus2Icon, FileText } from 'lucide-react';

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
                    <Button asChild variant="outline">
                        <Link href={buttonLink}>
                            <FilePlus2Icon />
                            {buttonLabel}
                        </Link>
                    </Button>
                </div>
            </EmptyContent>
        </Empty>
    );
}
