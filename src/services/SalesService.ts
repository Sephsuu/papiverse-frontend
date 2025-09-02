import { IMPORTATION_URL } from "@/lib/utils";

const URL = `${IMPORTATION_URL}/api`;

export class SalesService {
    static async readPaidOrders(file: File) {
        console.log(`${URL}/read-paid-orders`);
        console.log(file);
        
        const formData = new FormData();
        formData.append('file', file);
        console.log(formData);
        
        const res = await fetch(`${URL}/read-paid-orders`, {
            method: 'POST',
            body: formData,
        })

        console.log(res);

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || error.message || "Bad Response");
        }

        return res.json();
    }
}