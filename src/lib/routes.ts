import { Container, Store, UserRound } from "lucide-react";

export const adminRoute = [
    { 
        title: 'Users', 
        icon: UserRound,
        href: '/admin/users',
        children: []
    },
    { 
        title: 'Branches', 
        icon: Store,
        href: '/admin/branches',
        children: []
    },
    { 
        title: 'Inventory', 
        icon: Container,
        children: [
            { title: 'Supplies', href: '/admin/inventory/supplies' },
            { title: 'Inventories', href: '/admin/inventory/inventories' },
            { title: 'Order Request', href: '/admin/inventory/order-request' },
        ]
    },
]