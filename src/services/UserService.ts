import { BASE_URL, getTokenFromLocalStorage } from "@/lib/utils";
import { User } from "@/types/user";

const URL = `${BASE_URL}/user`; 

export class UserService {
    static async getAllUsers(page: number, size: number) {
        const res = await fetch(`${URL}/get-users?page=${page}&size=${size}`, {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json' ,
                'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
            }
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || err.error || 'Something went wrong.')
        }

        return res.json();
    }

    static async getUserById(id: number) {
        const res = await fetch(`${URL}/find-user?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json' ,
                'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
            }
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || err.error || 'Something went wrong.')
        }

        return res.json();
    }

    static async updateUser(user: object) {
        const res = await fetch(`${URL}/update`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${getTokenFromLocalStorage()}` 
            },
            body: JSON.stringify(user)
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || err.error || 'Something went wrong.')
        }

        return res.json();
    }

    static async adminUpdate(user : object) {
        console.log(JSON.stringify(user))
        const res = await fetch(`${URL}/update-admin`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${getTokenFromLocalStorage()}` 
            },
            body: JSON.stringify(user)
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || err.error || 'Something went wrong.')
        }

        return res.json();
    }

    static async deleteUser(id: number) {        
        const res = await fetch(`${URL}/delete-user?id=${id}`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json', 
                'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
            }
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || err.error || 'Something went wrong.')
        }
    }

    static async fileUpload(file : File, userId : number ){
        const formdata = new FormData();
        formdata.append("file", file);
        const res = await fetch(`${URL}/${userId}/profile-picture`, {
            method: 'POST',
            headers : {
                'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
            },
            body: formdata
        })

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || err.error || 'Something went wrong.')
        }

        return res.json();

    } 

}
