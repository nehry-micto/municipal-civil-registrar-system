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
import clients from '@/routes/clients';
import { Client } from '@/types';
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
    Columns,
    Edit2,
    EllipsisIcon,
    Eye,
    LucideUndo2,
    PlusCircleIcon,
    Search,
    Trash2Icon,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { usePrevious } from 'react-use';
import { toast } from 'sonner';

const ClientTable = () => {
    const { clients: clientsData, filters } = usePage<{
        clients?: {
            data: Client[];
            meta: {
                links: { url: string | null; label: string; active: boolean }[];
                last_page: number;
            };
        };
        filters?: {
            search?: string;
            sortBy?: string;
            sortDir?: string;
            trashedRecords?: number;
        };
    }>().props;

    const [filterValues, setFilterValues] = useState({
        search: filters?.search || '',
        sortBy: filters?.sortBy || '',
        sortDir: filters?.sortDir || '',
        trashedRecords: filters?.trashedRecords || '',
    });

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: filterValues.sortBy || 'created_at',
            desc: filterValues.sortDir === 'desc',
        },
    ]);

    const [columnVisibility, setColumnVisibility] = useState<
        Record<string, boolean>
    >(() => {
        const saved = localStorage.getItem('clientTableColumnVisibility');
        return saved ? JSON.parse(saved) : {};
    });

    console.log(clientsData);

    const columns = useMemo<ColumnDef<Client, object>[]>(
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
                                    href={clients.show.url(
                                        info.row.original.id,
                                    )}
                                >
                                    <Eye className="size-4" /> View
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link
                                    href={clients.edit.url(
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
                                        href={clients.destroy.url(
                                            info.row.original.id,
                                        )}
                                        onSuccess={() =>
                                            toast.success(
                                                'Client permanently deleted successfully!',
                                            )
                                        }
                                        preserveScroll
                                        preserveState
                                    >
                                        <Trash2Icon className="size-4 text-red-600" />{' '}
                                        Permanent Delete
                                    </Link>
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem asChild>
                                    <Link
                                        className="w-full"
                                        method="delete"
                                        as="button"
                                        href={clients.delete.url(
                                            info.row.original.id,
                                        )}
                                        onSuccess={() =>
                                            toast.success(
                                                'Client deleted successfully!',
                                            )
                                        }
                                        preserveScroll
                                        preserveState
                                    >
                                        <Trash2Icon className="size-4 text-red-600" />{' '}
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
                                        href={clients.restore.url(
                                            info.row.original.id,
                                        )}
                                        onSuccess={() =>
                                            toast.success(
                                                'Client restored successfully!',
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
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
            {
                accessorKey: 'client_code',
                enableSorting: false,
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title="Client Code"
                    />
                ),
                cell: (info) => (
                    <Badge variant="default">
                        {info.getValue().toString()}
                    </Badge>
                ),
            },
            {
                accessorKey: 'full_name',
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Full Name" />
                ),
                cell: (info) => (
                    <div className="flex items-center gap-2 font-medium">
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary text-center text-xs font-normal text-white">
                            <span>
                                {info
                                    .getValue()
                                    .toString()
                                    .slice(0, 2)
                                    .toUpperCase()}
                            </span>
                        </div>
                        <span>{info.getValue().toString()}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'contact_number',
                enableSorting: false,
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title="Contact Number"
                    />
                ),
                cell: (info) => info.getValue() || 'N/A',
            },
            {
                accessorKey: 'petitions_count',
                enableSorting: false,
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Petitions" />
                ),
                cell: (info) => (
                    <Badge variant="secondary">
                        {info.getValue()?.toString() || '0'}
                    </Badge>
                ),
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
        const removeFinishListener = router.on('finish', () => {
            setIsLoading(false);
        });

        return () => {
            removeFinishListener();
        };
    }, []);

    const table = useReactTable({
        data: clientsData?.data || [],
        columns,
        state: { columnVisibility, sorting },
        getCoreRowModel: getCoreRowModel(),
        onColumnVisibilityChange: (updater) => {
            setColumnVisibility((prev) => {
                const newVisibility =
                    typeof updater === 'function' ? updater(prev) : updater;
                localStorage.setItem(
                    'clientTableColumnVisibility',
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
                            placeholder="Search clients..."
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
                    {Object.keys(pickBy(filterValues)).length > 0 && (
                        <Button
                            variant="destructive"
                            onClick={() => router.get(clients.index().url)}
                        >
                            Clear
                        </Button>
                    )}
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
                        <Link href={clients.create().url}>
                            <PlusCircleIcon /> New Client
                        </Link>
                    </Button>
                </div>
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
                            Array.from({ length: 5 }).map((_, index) => (
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
                                            clients.show.url(row.original.id),
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
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-center"
                                >
                                    <EmptyTable
                                        title="No Clients Found"
                                        description="You haven't created any clients yet. Get started by creating your first client."
                                        buttonLabel="Create Client"
                                        buttonLink={clients.create().url}
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {(clientsData?.meta?.last_page ?? 0) > 1 && (
                    <UIPagination links={clientsData?.meta?.links ?? []} />
                )}
            </div>
        </div>
    );
};

export default ClientTable;
