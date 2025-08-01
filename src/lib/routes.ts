import { ChartNoAxesCombined, Container, Store, UserRound, UsersRound, Wallet } from "lucide-react";

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
            { title: 'Inventory Logs', href: '/admin/inventory/logs' },
            { title: 'Order Request', href: '/admin/inventory/order-request' },
        ]
    },
    { 
        title: 'Sales', 
        icon: ChartNoAxesCombined,
        children: [
            { title: 'Products', href: '/admin/sales/products' },
        ]
    },
]

export const franchiseeRoute = [
    { 
        title: 'Employees', 
        icon: UsersRound,
        href: '/franchisee/employees',
        children: []
    },
    { 
        title: 'Expenses', 
        icon: Wallet,
        href: '/franchisee/expenses',
        children: []
    },
    { 
        title: 'Inventory', 
        icon: Container,
        children: [
            { title: 'Inventories', href: '/franchisee/inventory/inventories' },
            { title: 'Supply Orders', href: '/franchisee/inventory/supply-orders/' },
            { title: 'Inventory Logs', href: '/franchisee/inventory/inventory-logs' },
        ]
    },
]