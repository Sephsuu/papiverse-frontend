import { BASE_URL, getTokenFromLocalStorage } from "@/lib/utils";
import { Expense } from "@/types/expense";

const URL = `${BASE_URL}/financial-logs` ;

export class ExpenseService {
    static async getExpensesByBranch(id: number) {
        const res = await fetch(`${URL}/get-by-branch?branchId=${id}`, {
            method: 'GET',
            headers: {
              'Content-Type' : 'application/json',
			  'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
            }
        });

        if(!res.ok){
            const err = await res.json();
            throw new Error(err.message || "Something went wrong");
        }

        return res.json();
    }

    static async getExpenseById(id: number) {
        const res = await fetch(`${URL}/get-expense?id=${id}`, {
            method: 'GET',
            headers: {
				'Content-Type' : 'application/json',
				'Authorization' : `Bearer ${getTokenFromLocalStorage()}` 
			}
        });

        if(!res.ok){
            const err = await res.json();
            throw new Error(err.message || "Something went wrong");
        }

        return res.json();
    }

    static async createExpense(expense: Expense) {
        const payload = {
            ...expense,
            expense: Number(expense.expense),
            purpose: expense.purpose.toUpperCase(),
            date: new Date().toISOString().split('T')[0],
        }
        const res = await fetch(`${URL}/create`, {
            method: 'POST',
            headers: { 
				'Content-Type': 'application/json',
				'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
			},
            body: JSON.stringify(payload),
        });

        if(!res.ok){
            const err = await res.json();
            throw new Error(err.message || "Something went wrong");
        }
        console.log(res);
        

        return res.json();
    }

    static async updateExpense(expense: Expense) {
        const payload = {
            ...expense,
            expense: Number(expense.expense),
            purpose: expense.purpose.toUpperCase(),
        }
        const res = await fetch(`${URL}/update`, {
            method: 'POST',
            headers: { 
				'Content-Type': 'application/json',
				'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
			},
            body: JSON.stringify(payload),
        });

        if(!res.ok){
            const err = await res.json();
            throw new Error(err.message || "Something went wrong");
        }

        return res.json();
    }

    static async deleteExpense(id: number) {
        await fetch(`${URL}/delete?id=${id}`, {
            method: 'POST',
            headers: {
				'Content-Type' : 'application/json',
				'Authorization' : `Bearer ${getTokenFromLocalStorage()}` 
			}
        });
    }
}
