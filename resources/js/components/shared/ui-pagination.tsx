import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

function UIPagination({
    links,
}: {
    links: Array<{ active: boolean; label: string; url: string | null }>;
}) {
    return (
        <Pagination className="mt-8">
            <PaginationContent className="flex flex-wrap">
                {links.map((link, index) => (
                    <PaginationItem key={index}>
                        {link.label.includes('Previous') ? (
                            <Link
                                href={link.url ?? '#'}
                                preserveState
                                preserveScroll
                                className={cn(
                                    'inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
                                    'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
                                    'h-9 px-3',
                                    !link.url &&
                                        'pointer-events-none opacity-50',
                                )}
                            >
                                <ArrowLeft className="mr-2 size-4" />
                                Previous
                            </Link>
                        ) : link.label.includes('Next') ? (
                            <Link
                                href={link.url ?? '#'}
                                preserveState
                                preserveScroll
                                className={cn(
                                    'inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
                                    'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
                                    'h-9 px-3',
                                    !link.url &&
                                        'pointer-events-none opacity-50',
                                )}
                            >
                                Next
                                <ArrowRight className="ml-2 size-4" />
                            </Link>
                        ) : (
                            <Link
                                href={link.url ?? '#'}
                                preserveState
                                preserveScroll
                                className={cn(
                                    'inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
                                    link.active
                                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                        : 'hover:bg-accent hover:text-accent-foreground',
                                    'h-9 w-9',
                                )}
                            >
                                {link.label}
                            </Link>
                        )}
                    </PaginationItem>
                ))}
            </PaginationContent>
        </Pagination>
    );
}

export default UIPagination;

UIPagination.displayName = 'UIPagination';
