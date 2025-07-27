import { BASE_URL, getTokenFromLocalStorage } from "@/lib/utils";

const URL = `${BASE_URL}/supply-order`;

export class SupplyOrderService {
    static async getAllSupply() {
        const res = await fetch(`${URL}/get-all`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
            },
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Something went wrong.');
        }

        return res.json();
    }

    static async getSupplyOrderById(id: number) {
        const res = await fetch(`${URL}/get-by-orderId?orderId=${id}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
            },
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Something went wrong.');
        }

        return res.json();
    }

    static async getSupplyOrderByBranch(id: number) {
        const res = await fetch(`${URL}/get-by-branch?id=${id}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
            },
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Something went wrong.');
        }

        return res.json();
    }

    static async createSupplyOrder(order: object) {
        const res = await fetch(`${BASE_URL}/create`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization' : `Bearer ${getTokenFromLocalStorage()}`,
            },
            body: JSON.stringify(order),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Something went wrong.');
        }

        return res.json();
    }

    static async updateOrderStatus(id: number, newStatus: string, meatApproved: boolean, snowApproved: boolean) {
        console.log(id, newStatus, meatApproved, snowApproved);
        
        const res = await fetch(`${URL}/update-status?id=${id}&newStatus=${newStatus}&meatApproved=${meatApproved}&snowApproved=${snowApproved}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
            },
        });
        console.log(res);
        

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Something went wrong.');
        }

        return res.json();
    }

    
}
