import { BASE_URL, getTokenFromLocalStorage } from "@/lib/utils";
import { Product } from "@/types/products";
import { Supply } from "@/types/supply";

const URL = `${BASE_URL}/products`; 

export class ProductService {
    static async getAllProducts() {
        const res = await fetch(`${URL}/get-all`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
            },
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Something went wrong.');
        }

        return res.json();
    }

    static async getProductById(id: number) {
        const res = await fetch(`${URL}/get-by-code?code=${id}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
            },
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Something went wrong.');
        }

        return res.json();
    }

    static async addProduct(product: Product) {
        const payload = {
            ...product,
            name: product.name.toUpperCase(),
            category: product.category.toUpperCase()
        }
        const res = await fetch(`${URL}/create`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
            },
            body: JSON.stringify(payload)
        });
        console.log(res);
        

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Something went wrong.');
        }

        return res.json();
    }

    static async updateProduct(supply: Supply) {
        const payload = {
            ...supply,
            name: supply.name?.toUpperCase(),
            unitQuantity: Number(supply.unitQuantity),
            unitPriceInternal: Number(supply.unitPriceInternal),
            unitPriceExternal: Number(supply.unitPriceExternal)
        }

        const res = await fetch(`${URL}/update`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Something went wrong.');
        }

        return res.json();
    }

    static async deleteProduct(code: string) {
        const res = await fetch(`${URL}/delete-by-code?code=${code}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Something went wrong.');
        }
    }
}
