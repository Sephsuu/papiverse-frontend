const BASE_URL = 'http://localhost:8080/api/v1/snow-order'; 

const SnowOrderService = {
    createSnowOrder: async (snow: object) => {
        const response = await fetch(`${BASE_URL}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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