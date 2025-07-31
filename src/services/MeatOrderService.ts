import { BASE_URL, getTokenFromLocalStorage } from "@/lib/utils";

const URL = `${BASE_URL}/meat-order`; 

const MeatOrderService = {
    createMeatOrder: async (meat: object) => {
        const response = await fetch(`${URL}/create`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getTokenFromLocalStorage()}`
        },
            body: JSON.stringify(meat),
        });

        if (!response.ok) {
            throw new Error('Error adding meat order');
        }

        const data = await response.json();
        return data;
    }
}

export default MeatOrderService;