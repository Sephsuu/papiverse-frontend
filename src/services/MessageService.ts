
const BASE_URL = 'http://localhost:8080/api/messages'; 

const MessageService = {

    getAllMessage: async () => {
        const response = await fetch(`${BASE_URL}/get-message`, {
            method: 'GET',
            headers: {'Content-Type' : 'application/json' }
        });

        if(!response.ok){
            throw new Error("Registration Failed");
        }

        const data = await response.json();
        return data;
    },

    createMessage: async ( message: object ) => {
        const response = await fetch(`${BASE_URL}/create`, {
            method: 'POST',
            headers: {'Content-Type' : 'application/json' },
            body: JSON.stringify(message)
        });

        if(!response.ok){
            throw new Error("Registration Failed");
        }

        const data = await response.json();
        return data;
    },

    findConvo: async (id: number) => {
        const response = await fetch(`${BASE_URL}/conversation/${id}`, {
            method: 'GET',
            headers: {'Content-Type' : 'application/json' }
        });
        
        if (response.ok) {
            return await response.json();
        }
    },

};

export default MessageService;
