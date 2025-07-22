import { Container, Store, UserRound } from "lucide-react";

export const adminRoute = [
    { 
        title: 'Users', 
        icon: UserRound,
        children: [
            { title: 'All Users', href: '/admin/users' },
            { title: 'Add User', href: '/admin/users/add-user' },
        ]
    },
    { 
        title: 'Branches', 
        icon: Store,
        children: [
            { title: 'All Branches', href: '/admin/branches' },
            { title: 'Add Branch', href: '/admin/branches/add-branch' },
        ]
    },
    { 
        title: 'Supplies', 
        icon: Container,
        children: [
            { title: 'Add User', href: '' },
            { title: 'Users Table', href: '' },
        ]
    },
]