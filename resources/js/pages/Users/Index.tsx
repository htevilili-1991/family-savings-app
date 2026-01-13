import React, { useState } from 'react';
import { Head, usePage, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';
import { useToast } from '@/components/use-toast';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

interface User {
    id: number;
    name: string;
    email: string;
    roles: { id: number; name: string }[];
}

interface Role {
    id: number;
    name: string;
}

export default function UsersIndex() {
    const { users, roles } = usePage<
        PageProps<{
            users: {
                data: User[];
                links: any[];
                meta: any;
            };
            roles: Role[];
        }>
    >().props;
    const { toast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('users.store'), {
            onSuccess: () => {
                toast({
                    title: 'Success!',
                    description: 'User created successfully.',
                });
                setIsModalOpen(false);
                reset();
            },
            onError: (err) => {
                toast({
                    title: 'Error!',
                    description: 'Failed to create user.',
                    variant: 'destructive',
                });
                console.error(err);
            },
        });
    };

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'email',
            header: 'Email',
        },
        {
            accessorKey: 'roles',
            header: 'Role',
            cell: ({ row }) => {
                return (
                    <div>
                        {row.original.roles.map((role) => (
                            <span key={role.id}>{role.name}</span>
                        ))}
                    </div>
                );
            },
        },
    ];

    return (
        <AppLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Users</h2>}
        >
            <Head title="Users" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Users List</h3>
                            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                <DialogTrigger asChild>
                                    <Button>Add User</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Add New User</DialogTitle>
                                        <DialogDescription>
                                            Fill in the details for a new user.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={submit} className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">
                                                Name
                                            </Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="col-span-3"
                                            />
                                            <InputError message={errors.name} className="col-span-4" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="email" className="text-right">
                                                Email
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="col-span-3"
                                            />
                                            <InputError message={errors.email} className="col-span-4" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="password" className="text-right">
                                                Password
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                className="col-span-3"
                                            />
                                            <InputError message={errors.password} className="col-span-4" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="password_confirmation" className="text-right">
                                                Confirm Password
                                            </Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                className="col-span-3"
                                            />
                                            <InputError message={errors.password_confirmation} className="col-span-4" />
                                        </div>

                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="role" className="text-right">
                                                Role
                                            </Label>
                                            <Select
                                                onValueChange={(value) => setData('role', value)}
                                                value={data.role}
                                            >
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roles.map((role) => (
                                                        <SelectItem key={role.id} value={role.name}>
                                                            {role.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.role} className="col-span-4" />
                                        </div>

                                        <DialogFooter>
                                            <Button type="submit" disabled={processing}>
                                                Add User
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <DataTable columns={columns} data={users.data} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}