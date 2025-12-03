import { EmptyTable } from '@/components/empty-table';
import UIPagination from '@/components/shared/ui-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import certificateGenerator from '@/routes/certificate-generator';
import { default as petitionsRoute } from '@/routes/petitions';
import { ErrorsToCorrect, Petition } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { debounce, pickBy, startCase } from 'lodash';
import {
    ArrowRight,
    CalendarIcon,
    CheckCircle2Icon,
    Columns,
    DownloadIcon,
    Edit2,
    EllipsisIcon,
    Lock,
    LucideUndo2,
    PlusCircleIcon,
    Search,
    Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { usePrevious } from 'react-use';
import { toast } from 'sonner';
import FinalityCertificate from '../finality-certificate';
import PostingCertificate from '../posting-certificate';
import PostingNotice from '../posting-notice';
import RecordSheet from '../record-sheet';

const tabs = [
    {
        value: 'all',
        label: 'All',
    },
    {
        value: 'encoding',
        label: 'Encoding',
    },
    {
        value: 'posting_notice',
        label: 'Notice of Posting',
    },
    {
        value: 'posting_certificate',
        label: 'Certificate of posting',
    },
    {
        value: 'record_sheet',
        label: 'Record sheet',
    },
    {
        value: 'finality_certificate',
        label: 'Certificate of finality',
    },
];

const PetitionTable = () => {
    const [selectedRecord, setSelectedRecord] = useState<Petition | null>(null);

    const { petitions, filters, petitionSteps } = usePage<{
        petitions?: {
            data: Petition[];
            meta: {
                links: { url: string | null; label: string; active: boolean }[];
                last_page: number;
            };
        };
        filters?: {
            tab?: string;
            search?: string;
            sortBy?: string;
            sortDir?: string;
            trashedRecords?: number;
        };
        petitionSteps: {
            value: number;
            label: string;
            description: string;
        }[];
    }>().props;

    const [filterValues, setFilterValues] = useState({
        search: filters?.search || '',
        trashedRecords: filters?.trashedRecords || '',
        tab: filters?.tab || '',
    });

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: filters?.sortBy || 'created_at',
            desc: filters?.sortDir === 'desc',
        },
    ]);

    const [columnVisibility, setColumnVisibility] = useState<
        Record<string, boolean>
    >(() => {
        const saved = localStorage.getItem('petitionTableColumnVisibility');
        return saved ? JSON.parse(saved) : {};
    });

    const columns = useMemo<ColumnDef<Petition, object>[]>(
        () => [
            {
                id: 'actions',
                header: '',
                enableSorting: false,
                enableHiding: false,
                cell: (info) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <EllipsisIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link
                                    href={petitionsRoute.edit.url(
                                        info.row.original.id,
                                    )}
                                >
                                    <Edit2 className="size-4" /> Edit
                                </Link>
                            </DropdownMenuItem>
                            {info.row.original.deleted_at ? (
                                <DropdownMenuItem asChild>
                                    <Link
                                        className="w-full"
                                        method="delete"
                                        as="button"
                                        href={petitionsRoute.destroy.url(
                                            info.row.original.id,
                                        )}
                                        onSuccess={() =>
                                            toast.success(
                                                'Record deleted successfully!',
                                            )
                                        }
                                        preserveScroll
                                        preserveState
                                    >
                                        <Trash2 className="size-4 text-red-600" />{' '}
                                        Delete
                                    </Link>
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem asChild>
                                    <Link
                                        className="w-full"
                                        method="delete"
                                        as="button"
                                        href={petitionsRoute.delete.url(
                                            info.row.original.id,
                                        )}
                                        onSuccess={() =>
                                            toast.success(
                                                'Record moved to trash successfully!',
                                            )
                                        }
                                        preserveScroll
                                        preserveState
                                    >
                                        <Trash2 className="size-4 text-red-600" />{' '}
                                        To Trash
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            {info.row.original.deleted_at && (
                                <DropdownMenuItem asChild>
                                    <Link
                                        className="w-full"
                                        method="post"
                                        as="button"
                                        href={petitionsRoute.restore.url(
                                            info.row.original.id,
                                        )}
                                        onSuccess={() =>
                                            toast.success(
                                                'Record restored successfully!',
                                            )
                                        }
                                        preserveScroll
                                        preserveState
                                    >
                                        <LucideUndo2 className="size-4" />{' '}
                                        Restore
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>
                                Workflow Steps
                            </DropdownMenuLabel>
                            {petitionSteps.map((step) => {
                                const currentStepLabel =
                                    info.row.original.next_step;
                                const currentStepIndex = currentStepLabel
                                    ? petitionSteps.findIndex(
                                          (s) => s.label === currentStepLabel,
                                      )
                                    : petitionSteps.length; // If next_step is null/undefined, assume finished (all steps completed)

                                const stepIndex = step.value;
                                const isCompleted =
                                    stepIndex < currentStepIndex;
                                const isCurrent =
                                    stepIndex === currentStepIndex;
                                const isFuture = stepIndex > currentStepIndex;

                                return (
                                    <DropdownMenuItem
                                        key={step.value}
                                        disabled={isFuture}
                                        onClick={() => {
                                            if (isCurrent) {
                                                setSelectedRecord(
                                                    info.row.original,
                                                );
                                            } else if (isCompleted) {
                                                if (
                                                    step.label ===
                                                    'Notice of Posting'
                                                ) {
                                                    window.open(
                                                        certificateGenerator.notice.url(
                                                            info.row.original
                                                                .id,
                                                        ),
                                                        '_blank',
                                                    );
                                                } else if (
                                                    step.label ===
                                                    'Certificate of Posting'
                                                ) {
                                                    window.open(
                                                        `/petitions/${info.row.original.id}/generate-certificate-of-posting`,
                                                        '_blank',
                                                    );
                                                } else if (
                                                    step.label ===
                                                    'Record Sheet'
                                                ) {
                                                    window.open(
                                                        `/petitions/${info.row.original.id}/generate-record-sheet`,
                                                        '_blank',
                                                    );
                                                } else if (
                                                    step.label ===
                                                    'Certificate of Finality'
                                                ) {
                                                    window.open(
                                                        `/petitions/${info.row.original.id}/generate-certificate-of-finality`,
                                                        '_blank',
                                                    );
                                                }
                                            }
                                        }}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle2Icon className="size-4 text-green-500" />
                                        ) : isFuture ? (
                                            <Lock className="size-4 text-muted-foreground" />
                                        ) : (
                                            <ArrowRight className="size-4" />
                                        )}

                                        <span
                                            className={
                                                isCompleted
                                                    ? 'text-green-600'
                                                    : ''
                                            }
                                        >
                                            {step.label}
                                        </span>

                                        {isCompleted &&
                                            step.label !== 'Encoding' && (
                                                <DownloadIcon className="ml-auto size-4" />
                                            )}
                                    </DropdownMenuItem>
                                );
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
            {
                accessorKey: 'date_of_filing',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title="Date of Filing"
                    />
                ),
                cell: (info) => (
                    <div className="flex items-center gap-1 text-xs">
                        <CalendarIcon className="size-3" />
                        {info.getValue().toString()}
                    </div>
                ),
            },
            {
                accessorKey: 'petition_number',
                enableSorting: false,
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title="Petition No."
                    />
                ),
                cell: (info) => (
                    <Badge variant="default">
                        {info.getValue().toString()}
                    </Badge>
                ),
            },
            {
                accessorKey: 'registry_number',
                enableSorting: false,
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title="Registry No."
                    />
                ),
                cell: (info) => (
                    <Badge variant="default">
                        {info.getValue().toString()}
                    </Badge>
                ),
            },

            {
                accessorKey: 'document_owner',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title="Document Owner"
                    />
                ),

                cell: (info) => (
                    <div className="flex items-center gap-2 font-bold uppercase">
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary text-center text-xs font-normal text-primary-foreground">
                            <span>
                                {info.getValue().toString().slice(0, 2)}
                            </span>
                        </div>
                        <span>{info.getValue().toString()}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'document_type',
                enableSorting: false,
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title="Document Type"
                    />
                ),
            },
            {
                accessorKey: 'petition_type',
                enableSorting: false,
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title="Petition Type"
                    />
                ),
            },
            {
                accessorKey: 'petition_nature',
                enableSorting: false,
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title="Petition Nature"
                    />
                ),
            },
            {
                accessorKey: 'errors_to_correct',
                enableSorting: false,
                header: 'Errors to Correct',
                cell: (info) => {
                    const errors = info.getValue() as ErrorsToCorrect[];
                    return (
                        <HoverCard>
                            <HoverCardTrigger asChild>
                                <Badge variant="destructive">
                                    {errors[0]?.description || 'No Errors'}
                                    {errors.length > 1 && (
                                        <Badge
                                            variant="secondary"
                                            className="ml-1 size-3.5 text-[10px] text-destructive"
                                        >
                                            {errors.length}
                                        </Badge>
                                    )}
                                </Badge>
                            </HoverCardTrigger>
                            <HoverCardContent className="">
                                <Table className="text-xs">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>#</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Current</TableHead>
                                            <TableHead>Corrected</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {errors.map((error) => (
                                            <TableRow key={error.description}>
                                                <TableCell>
                                                    {error.item_number}
                                                </TableCell>
                                                <TableCell>
                                                    {error.description}
                                                </TableCell>
                                                <TableCell>
                                                    {error.corrected_value}
                                                </TableCell>
                                                <TableCell>
                                                    {error.corrected_value}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </HoverCardContent>
                        </HoverCard>
                    );
                },
            },
            {
                accessorKey: 'priority',
                enableSorting: false,
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Priority" />
                ),

                cell: (info) => {
                    const priority =
                        {
                            0: 'Normal',
                            1: 'Urgent',
                        }[info.getValue().toString()] ?? 'Unknown';

                    return (
                        <Badge
                            variant={
                                (priority === 'Urgent' &&
                                    'destructive') as 'destructive'
                            }
                        >
                            {priority}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: 'created_at',
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Created At" />
                ),
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: 'updated_at',
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Updated At" />
                ),
                cell: (info) => info.getValue(),
            },
        ],
        //ignore
        [],
    );

    const page = usePage();

    const prevValues = usePrevious(filterValues);

    const debounceFilter = useMemo(
        () =>
            debounce((query) => {
                router.get(page.url, query, {
                    preserveScroll: true,
                    replace: true,
                });
            }, 300),
        [page.url],
    );

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (prevValues) {
            const query = Object.keys(
                pickBy({
                    ...filterValues,
                    sortBy: sorting[0]?.id,
                    sortDir: sorting[0]?.desc ? 'desc' : 'asc',
                }),
            ).length
                ? pickBy({
                      ...filterValues,
                      sortBy: sorting[0]?.id,
                      sortDir: sorting[0]?.desc ? 'desc' : 'asc',
                  })
                : {};
            debounceFilter(query);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterValues, sorting]);

    useEffect(() => {
        // const removeStartListener = router.on('start', () => {
        //     setIsLoading(true);
        // });
        const removeFinishListener = router.on('finish', () => {
            setIsLoading(false);
        });

        return () => {
            // removeStartListener();
            removeFinishListener();
        };
    }, []);

    const table = useReactTable({
        data: petitions?.data || [],
        columns,
        state: { columnVisibility, sorting },
        getCoreRowModel: getCoreRowModel(),
        onColumnVisibilityChange: (updater) => {
            setColumnVisibility((prev) => {
                const newVisibility =
                    typeof updater === 'function' ? updater(prev) : updater;
                localStorage.setItem(
                    'locationalTableColumnVisibility',
                    JSON.stringify(newVisibility),
                );
                return newVisibility;
            });
        },
        manualSorting: true,
        onSortingChange: setSorting,
    });

    return (
        <div className="p-4">
            <PostingNotice
                selectedRecord={selectedRecord}
                setSelectedRecord={setSelectedRecord}
            />
            <PostingCertificate
                selectedRecord={selectedRecord}
                setSelectedRecord={setSelectedRecord}
            />
            <RecordSheet
                selectedRecord={selectedRecord}
                setSelectedRecord={setSelectedRecord}
            />
            <FinalityCertificate
                selectedRecord={selectedRecord}
                setSelectedRecord={setSelectedRecord}
            />
            <div className="flex items-center justify-between gap-2">
                <div className="flex w-full items-center gap-2">
                    <div className="relative flex w-full max-w-sm items-center">
                        <Input
                            onChange={(e) =>
                                setFilterValues({
                                    ...filterValues,
                                    search: e.target.value,
                                })
                            }
                            value={filterValues.search}
                            placeholder="Search..."
                        />
                        <Search className="absolute right-3 size-4" />
                    </div>
                    <Select
                        value={filterValues.trashedRecords.toString()}
                        name="trashRecords"
                        onValueChange={(value) => {
                            setFilterValues({
                                ...filterValues,
                                trashedRecords: value,
                            });
                        }}
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Trashed" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">No deleted</SelectItem>
                            <SelectItem value="2">Deleted</SelectItem>
                            <SelectItem value="3">All records</SelectItem>
                        </SelectContent>
                    </Select>
                    {
                        // check if filters are empty and show the clear button
                        Object.keys(pickBy(filterValues)).length > 0 && (
                            <Button
                                variant="destructive"
                                onClick={() =>
                                    router.get(petitionsRoute.index().url)
                                }
                            >
                                Clear
                            </Button>
                        )
                    }
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="flex items-center gap-1"
                            >
                                <Columns className="size-4" /> Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {table.getAllLeafColumns().map(
                                (column) =>
                                    column.getCanHide() && (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            checked={column.getIsVisible()}
                                            onCheckedChange={() =>
                                                column.toggleVisibility()
                                            }
                                        >
                                            {startCase(column.id)}
                                        </DropdownMenuCheckboxItem>
                                    ),
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div>
                    <Button size={'sm'} asChild>
                        <Link href={petitionsRoute.create().url}>
                            <PlusCircleIcon /> Create Petition
                        </Link>
                    </Button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <Tabs
                    onValueChange={(value: string) => {
                        setFilterValues({
                            ...filterValues,
                            tab: value,
                        });
                    }}
                    value={filterValues.tab || 'encoding'}
                    className="mt-8 mb-4"
                >
                    <TabsList className="">
                        {tabs.map((tab) => (
                            <TabsTrigger key={tab.value} value={tab.value}>
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            <div className="mt-4 overflow-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow className="" key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({
                                length: 2,
                            }).map((_, index) => (
                                <TableRow key={index}>
                                    {columns.map((column, index) => (
                                        <TableCell
                                            key={index}
                                            className="m-2 text-center"
                                        >
                                            <Skeleton className="h-4 w-full px-4" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    className="cursor-pointer"
                                    key={row.id}
                                    onDoubleClick={() =>
                                        router.visit(
                                            petitionsRoute.show.url(
                                                row.original.id,
                                            ),
                                        )
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="hover:bg-none">
                                <TableCell colSpan={columns.length}>
                                    <EmptyTable
                                        title="No Petitions Found"
                                        description="You haven't created any petitions yet. Get started by creating your first petition."
                                        buttonLabel="Create Petition"
                                        buttonLink={petitionsRoute.create().url}
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {(petitions?.meta?.last_page ?? 0) > 1 && (
                    <UIPagination links={petitions?.meta?.links ?? []} />
                )}
            </div>
        </div>
    );
};

export default PetitionTable;
