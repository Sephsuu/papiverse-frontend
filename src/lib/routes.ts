import { ChartNoAxesCombined, Container, MessageCircleMore, Store, UserRound, UsersRound, Wallet } from "lucide-react";
import { hrtime } from "process";

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
        title: 'Messages', 
        icon: MessageCircleMore,
        href: '/admin/messages',
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
            { title: 'Overview', href: '/admin/sales' },
            { title: 'Products', href: '/admin/sales/products' },
            { title: 'Paid Orders', href: '/admin/sales/paid-orders' },
            { title: 'Branch Sales', href: '/admin/sales/branches' },
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
            { title: 'Overview', href: '/franchisee/inventory' },
            { title: 'Inventories', href: '/franchisee/inventory/inventories' },
            { title: 'Supply Orders', href: '/franchisee/inventory/supply-orders/' },
            { title: 'Inventory Logs', href: '/franchisee/inventory/logs' },
        ]
    },
     { 
        title: 'Messages', 
        icon: MessageCircleMore,
        children: [
            { title: 'Users', href: '/admin/messages/' },
            { title: 'Group', href: '/admin/messages/' },
        ]
    },
]