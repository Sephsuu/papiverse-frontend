import { BASE_URL, getTokenFromLocalStorage } from "@/lib/utils";

const URL = `${BASE_URL}/snow-order`; 

const SnowOrderService = {
    createSnowOrder: async (snow: object) => {
        const response = await fetch(`${URL}/create`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getTokenFromLocalStorage()}` 
            },
            body: JSON.stringify(snow),
        });

        if (!response.ok) {
            throw new Error('Error adding snow order');
        }

        const data = await response.json();
        return data;
    }
}

export default SnowOrderService;