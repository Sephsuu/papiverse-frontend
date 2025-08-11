import { BASE_URL, getTokenFromLocalStorage } from "@/lib/utils";
import { Inventory } from "@/types/inventory";

const URL = `${BASE_URL}/inventory`;

export class InventoryService {
	static async getInventoryByBranch(id: number,page : number, size : number ) {
		const res = await fetch(`${URL}/get-by-branch?id=${id}&page=${page}&size=${size}`, {
			method: 'GET',
			headers: { 
				'Content-Type': 'application/json', 
				'Authorization' : `Bearer ${getTokenFromLocalStorage()}`,
			},
		})

		if (!res.ok) {
			const err = await res.json();
			throw new Error(err.message || 'Something went wrong.')
		}

		return res.json();
	}

	static async getInventoryAudits(id: number, page : number, size : number) {
		const res = await fetch(`${URL}/get-audits?branchId=${id}&page=${page}&size=${size}`, {
			method: 'GET',
			headers: { 
				'Content-Type': 'application/json', 
				'Authorization' : `Bearer ${getTokenFromLocalStorage()}`,
			},
		})

		if (!res.ok) {
			const err = await res.json();
			throw new Error(err.message || 'Something went wrong.')
		}

		return res.json();
	}

	static async createInventory(inventory: Inventory) {
		const res = await fetch(`${URL}/create`, {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json', 
				'Authorization' : `Bearer ${getTokenFromLocalStorage()}`,
			},
			body: JSON.stringify(inventory),
		})

		if (!res.ok) {
			const err = await res.json();
			throw new Error(err.message || 'Something went wrong.')
		}

		return res.json();
	}

	static async deleteInventory(id: number) {
		const res = await fetch(`${URL}/delete?id=${id}`, {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json', 
				'Authorization' : `Bearer ${getTokenFromLocalStorage()}`,
			},
		})

		if (!res.ok) {
			const err = await res.json();
			throw new Error(err.message || 'Something went wrong.')
		}

		return res.json();
	}

	static async createInventoryInput(inventory: Inventory, branchId: number) {
		console.log(branchId);
		
		const payload = {
			...inventory,
			changedQuantity: Number(inventory.changedQuantity),
			type: "IN",
			source: "INPUT",
			branchId: branchId
		}
		console.log(JSON.stringify(payload));
		
		const res = await fetch(`${URL}/process-transaction-input`, {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json', 
				'Authorization' : `Bearer ${getTokenFromLocalStorage()}`,
			},
			body: JSON.stringify(payload),
		})
		console.log(res);
		

		if (!res.ok) {
			const err = await res.json();
			throw new Error(err.message || 'Something went wrong.')
		}

		return res.json();
	}

	static async createInventoryOrder(inventory: Inventory) {
		const res = await fetch(`${URL}/process-transaction-order`, {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json', 
				'Authorization' : `Bearer ${getTokenFromLocalStorage()}`,
			},
			body: JSON.stringify(inventory),
		})
		
		if (!res.ok) {
			const err = await res.json();
			throw new Error(err.message || 'Something went wrong.')
		}

		return res.json();
	}

}
