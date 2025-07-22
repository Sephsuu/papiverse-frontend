import { BASE_URL } from "@/lib/utils";

const URL = `${BASE_URL}/user`; 

export class UserService {
    static async getAllUsers() {
        const res = await fetch(`${URL}/get-users`, {
            method: 'GET',
            headers: {'Content-Type' : 'application/json' }
        });

        if (!res.ok) throw new Error('Bad Response');

        return res.json();
    }

    static async getUserById(id: number) {
        const res = await fetch(`${URL}/find-user?id=${id}`, {
            method: 'GET',
            headers: {'Content-Type' : 'application/json' }
        });

        if (!res.ok) throw new Error('Bad Response');

        return res.json();
    }

    static async updateUser(user: object) {
        console.log(JSON.stringify(user));
        
        const res = await fetch(`${URL}/update`, {
            method: 'POST',
            headers: {'Content-Type' : 'application/json' },
            body: JSON.stringify(user)
        });

        if (!res.ok) throw new Error('Bad Response');

        return res.json();
    }

}
//     updateUser: async (user: object) => {
//         const response = await fetch(`${BASE_URL}/update`, {
//             method: 'POST',
//             headers: {'Content-Type' : 'application/json' },
//             body: JSON.stringify(user)
//         });
        
//         if(!response.ok){
//             throw new Error('Failed to Update User');
//         }
//         return await response.json();
//     }

// const UserService = {
//     getAllUser: async () => {
//         const response = await fetch(`${BASE_URL}/get-users`, {
//             method: 'GET',
//             headers: {'Content-Type' : 'application/json' }
//         });

//         if (response.ok) {
//             return await response.json();
//         }
//     },


//     deleteUser: async (id: number) => {
//         const response = await fetch(`${BASE_URL}/delete-user?id=${id}`, {
//             method: 'POST',
//             headers: {'Content-Type' : 'application/json' }
//         });
        
//         if (response.ok) {
//             const text = await response.text();
//             return text ? JSON.parse(text) : null;
//         }
//     },
// };

// export default UserService;
