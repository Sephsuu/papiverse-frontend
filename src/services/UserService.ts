
const BASE_URL = 'http://localhost:8080/api/v1/user'; 

const UserService = {
    getAllUser: async () => {
        const response = await fetch(`${BASE_URL}/get-users`, {
            method: 'GET',
            headers: {'Content-Type' : 'application/json' }
        });

        if (response.ok) {
            return await response.json();
        }
    },

    findUser: async (id: number) => {
        const response = await fetch(`${BASE_URL}/find-user?id=${id}`, {
            method: 'GET',
            headers: {'Content-Type' : 'application/json' }
        });
        
        if (response.ok) {
            return await response.json();
        }
    },

    deleteUser: async (id: number) => {
        const response = await fetch(`${BASE_URL}/delete-user?id=${id}`, {
            method: 'POST',
            headers: {'Content-Type' : 'application/json' }
        });
        
        if (response.ok) {
            const text = await response.text();
            return text ? JSON.parse(text) : null;
        }
    },

    updateUser: async (user: object) => {
        const response = await fetch(`${BASE_URL}/update`, {
            method: 'POST',
            headers: {'Content-Type' : 'application/json' },
            body: JSON.stringify(user)
        });
        
        if(!response.ok){
            throw new Error('Failed to Update User');
        }
        return await response.json();
    }
};

export default UserService;
