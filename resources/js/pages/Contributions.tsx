import React, { useState } from 'react';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import InputError from '@/components/input-error';
import { useToast } from '@/components/use-toast';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

interface Contribution {
    id: number;
    user: { id: number; name: string };
    amount: string;
    contributed_at: string;
    notes: string | null;
    creator: { id: number; name: string };
}

interface User {
    id: number;
    name: string;
}

export default function Contributions() {
    const { auth, contributions, users, canManageContributions } = usePage<
        PageProps<{
            contributions: {
                data: Contribution[];
                links: any[];
                meta: any;
            };
            users: User[];
            canManageContributions: boolean;
        }>
    >().props;
    const { toast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContribution, setEditingContribution] =
        useState<Contribution | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        user_id: editingContribution?.user.id || '',
        contributed_at: editingContribution?.contributed_at || format(new Date(), 'yyyy-MM-dd'),
        amount: editingContribution?.amount || '4000.00',
        notes: editingContribution?.notes || '',
    });

    React.useEffect(() => {
        if (editingContribution) {
            setData({
                user_id: editingContribution.user.id,
                contributed_at: editingContribution.contributed_at,
                amount: editingContribution.amount,
                notes: editingContribution.notes || '',
            });
        } else {
            setData({
                user_id: '',
                contributed_at: format(new Date(), 'yyyy-MM-dd'),
                amount: '4000.00',
                notes: '',
            });
        }
    }, [editingContribution]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingContribution) {
            put(route('contributions.update', editingContribution.id), {
                onSuccess: () => {
                    toast({
                        title: 'Success!',
                        description: 'Contribution updated successfully.',
                    });
                    setIsModalOpen(false);
                    setEditingContribution(null);
                    reset();
                },
                onError: (err) => {
                    toast({
                        title: 'Error!',
                        description: 'Failed to update contribution.',
                        variant: 'destructive',
                    });
                    console.error(err);
                },
            });
        } else {
            post(route('contributions.store'), {
                onSuccess: () => {
                    toast({
                        title: 'Success!',
                        description: 'Contribution added successfully.',
                    });
                    setIsModalOpen(false);
                    reset();
                },
                onError: (err) => {
                    toast({
                        title: 'Error!',
                        description: 'Failed to add contribution.',
                        variant: 'destructive',
                    });
                    console.error(err);
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this contribution?')) {
            return;
        }

        router.delete(route('contributions.destroy', id), {
            onSuccess: () => {
                toast({
                    title: 'Success!',
                    description: 'Contribution deleted successfully.',
                });
            },
            onError: (err) => {
                toast({
                    title: 'Error!',
                    description: 'Failed to delete contribution.',
                    variant: 'destructive',
                });
                console.error(err);
            },
        });
    };

    const columns: ColumnDef<Contribution>[] = [
        {
            accessorKey: 'user.name',
            header: 'User',
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue('amount'));
                const formatted = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'VUV',
                    minimumFractionDigits: 2,
                }).format(amount);
                return <div className="font-medium">{formatted}</div>;
            },
        },
        {
            accessorKey: 'contributed_at',
            header: 'Contributed At',
            cell: ({ row }) => {
                const date = new Date(row.getValue('contributed_at'));
                return <div>{format(date, 'PPP')}</div>;
            },
        },
        {
            accessorKey: 'notes',
            header: 'Notes',
            cell: ({ row }) => {
                const notes: string = row.getValue('notes');
                return <div className="max-w-[200px] truncate">{notes || '-'}</div>;
            },
        },
        {
            accessorKey: 'creator.name',
            header: 'Created By',
            cell: ({ row }) => (
                <div>{row.original.creator ? row.original.creator.name : 'N/A'}</div>
            ),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <>
                    {canManageContributions && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setEditingContribution(row.original);
                                    setIsModalOpen(true);
                                }}
                                className="mr-2"
                            >
                                Edit
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(row.original.id)}
                            >
                                Delete
                            </Button>
                        </>
                    )}
                </>
            ),
        },
    ];

    return (
        <AppLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Contributions</h2>}
        >
            <Head title="Contributions" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Contribution History</h3>
                            {canManageContributions && (
                                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button onClick={() => setEditingContribution(null)}>Add Contribution</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>{editingContribution ? 'Edit Contribution' : 'Add New Contribution'}</DialogTitle>
                                            <DialogDescription>
                                                {editingContribution ? 'Edit the details of the contribution.' : 'Fill in the details for a new contribution.'}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={submit} className="grid gap-4 py-4">
                                            {/* User Selection (only for admin/treasurer) */}
                                            {canManageContributions && (
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="user_id" className="text-right">
                                                        User
                                                    </Label>
                                                    <Select
                                                        onValueChange={(value) => setData('user_id', value)}
                                                        value={String(data.user_id)}
                                                    >
                                                        <SelectTrigger className="col-span-3">
                                                            <SelectValue placeholder="Select a user" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {users.map((user) => (
                                                                <SelectItem key={user.id} value={String(user.id)}>
                                                                    {user.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError message={errors.user_id} className="col-span-4" />
                                                </div>
                                            )}

                                            {/* Contributed At Date Picker */}
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="contributed_at" className="text-right">
                                                    Date
                                                </Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={'outline'}
                                                            className={cn(
                                                                'col-span-3 justify-start text-left font-normal',
                                                                !data.contributed_at && 'text-muted-foreground'
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {data.contributed_at ? format(new Date(data.contributed_at), 'PPP') : <span>Pick a date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={data.contributed_at ? new Date(data.contributed_at) : undefined}
                                                            onSelect={(date) => setData('contributed_at', date ? format(date, 'yyyy-MM-dd') : '')}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <InputError message={errors.contributed_at} className="col-span-4" />
                                            </div>

                                            {/* Amount (fixed) */}
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="amount" className="text-right">
                                                    Amount
                                                </Label>
                                                <Input
                                                    id="amount"
                                                    value={data.amount}
                                                    className="col-span-3"
                                                    disabled
                                                />
                                                <InputError message={errors.amount} className="col-span-4" />
                                            </div>

                                            {/* Notes */}
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="notes" className="text-right">
                                                    Notes
                                                </Label>
                                                <Textarea
                                                    id="notes"
                                                    value={data.notes || ''}
                                                    onChange={(e) => setData('notes', e.target.value)}
                                                    className="col-span-3"
                                                />
                                                <InputError message={errors.notes} className="col-span-4" />
                                            </div>

                                            <DialogFooter>
                                                <Button type="submit" disabled={processing}>
                                                    {editingContribution ? 'Update Contribution' : 'Add Contribution'}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                        <DataTable columns={columns} data={contributions.data} filterableColumnId="user.name" />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}