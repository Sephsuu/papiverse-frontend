import { MESSAGING_URL } from "@/lib/utils"

const URL = `${MESSAGING_URL}/messaging`

export class MessagingService {
    static async getConversations(id: number) {
        const res = await fetch(`${URL}/conversations/${id}?page=1&limit=20`, {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
            },
        });
        console.log(res);
        

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || err.error || 'Something went wrong.')
        }

        return res.json();
    }

   static async getMessages(conversationId: number, userId: number) {
        const res = await fetch(`${URL}/conversations/${conversationId}/messages?userId=${userId}&page=1&limit=20`, {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
            },
        });
        console.log(res);
        

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || err.error || 'Something went wrong.')
        }

        return res.json();
   } 
}