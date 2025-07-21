const BASE_URL = 'http://localhost:8080/api/v1/supply-order'; 

const SupplyOrderService = {
    getAllSupply: async () => {
        const response = await fetch(`${BASE_URL}/get-all`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error('Error adding snow order');
        }

        const data = await response.json();
        return data;
    },

    getSupplyOrderById: async (orderId: number) => {
        const response = await fetch(`${BASE_URL}/get-by-orderId?orderId=${orderId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error('Error adding snow order');
        }

        const data = await response.json();
        return data;
    },

    getSupplyOrderByBranch: async (branchId: number) => {
        const response = await fetch(`${BASE_URL}/get-by-branch?id=${branchId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error('Error adding snow order');
        }

        const data = await response.json();
        return data;
    },

    createSupplyRequest: async (order: object) => {
        const response = await fetch(`${BASE_URL}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        return data;
    },

    updateOrderStatus: async (id: number, newStatus: string, meatApproved: boolean, snowApproved: boolean) => {
        console.log(meatApproved, snowApproved, newStatus, id);
        
        
        const response = await fetch(`${BASE_URL}/update-status?id=${id}&newStatus=${newStatus}&meatApproved=${meatApproved}&snowApproved=${snowApproved}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error('Update failed');
        }

        const data = await response.json();
        return data;
    }
};

export default SupplyOrderService;