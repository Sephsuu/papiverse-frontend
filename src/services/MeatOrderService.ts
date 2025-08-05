import { BASE_URL, getTokenFromLocalStorage } from "@/lib/utils";

const URL = `${BASE_URL}/meat-order`; 

const MeatOrderService = {
    createMeatOrder: async (meat: object) => {
        console.log(JSON.stringify(meat));
        
        const res = await fetch(`${URL}/create`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getTokenFromLocalStorage()}`
        },
            body: JSON.stringify(meat),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || err.error || 'Something went wrong.')
        }

        const data = await res.json();
        return data;
    }
}

export default MeatOrderService;