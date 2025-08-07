import { BASE_URL, getTokenFromLocalStorage } from "@/lib/utils";
import { CompleteOrder, SupplyItem, SupplyOrder } from "@/types/supplyOrder";

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

        console.log(res);
        

        return res.json();
    }

    static async createSupplyOrder(order: CompleteOrder) {
        console.log(JSON.stringify(order));
        const res = await fetch(`${URL}/create`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization' : `Bearer ${getTokenFromLocalStorage()}`,
            },
            body: JSON.stringify(order),
        });
        console.log(res);
        

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Something went wrong.');
        }

        return res.json();
    }

    static async updateOrderStatus(id: number, newStatus: string, meatApproved: boolean, snowApproved: boolean) {
        const res = await fetch(`${URL}/update-status?id=${id}&newStatus=${newStatus}&meatApproved=${meatApproved}&snowApproved=${snowApproved}`, {
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

    static async updateMeatOrder(meatOrder: SupplyItem[], id: number) {
        const payload = {
            id: id,
            categoryItems: meatOrder
        }
        
        const res = await fetch(`${BASE_URL}/meat-order/update`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
            },
            body: JSON.stringify(payload)
        });
        console.log(res);
        

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Something went wrong.');
        }

        return res.json();
    }

    static async updateSnowOrder(snowOrder: SupplyItem[], id: number) {
        const payload = {
            id: id,
            categoryItems: snowOrder
        }
        console.log(payload);
        
        const res = await fetch(`${BASE_URL}/snow-order/update`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
            },
            body: JSON.stringify(payload)
        });
        console.log(res);
        

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Something went wrong.');
        }

        return res.json();
    }
}
