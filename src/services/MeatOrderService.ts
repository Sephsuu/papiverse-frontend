const BASE_URL = 'http://localhost:8080/api/v1/meat-order'; 

const MeatOrderService = {
    createMeatOrder: async (meat: object) => {
        const response = await fetch(`${BASE_URL}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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