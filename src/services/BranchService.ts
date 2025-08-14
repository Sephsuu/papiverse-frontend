import { BASE_URL, getTokenFromLocalStorage } from "@/lib/utils";
import { Branch } from "@/types/branch";

const URL = `${BASE_URL}/branches`; 

export class BranchService {
	static async getAllBranches(page : number, size : number) {
		const res = await fetch(`${URL}/get-branches?page=${page}&size=${size}`, {
			method: 'GET',
			headers: {
				'Content-Type' : 'application/json',
				'Authorization' : `Bearer ${getTokenFromLocalStorage()}` 
			}
		});
		console.log(res);
		
		
		if (!res.ok) {
			const err = await res.json();
			throw new Error(err.message || 'Something went wrong');
		}

		return res.json();
	}
	
	static async getBranchById(id: number) {
		const res = await fetch(`${URL}/find-branch?id=${id}`, {
			method: 'GET',
			headers: {
				'Content-Type' : 'application/json',
				'Authorization' : `Bearer ${getTokenFromLocalStorage()}` 
			}
		});

		if (!res.ok) {
			const err = await res.json();
			throw new Error(err.message || 'Something went wrong');
		}

		return res.json();
	}
	
	static async addBranch(branch: Branch) {
		const payload = {
			...branch,
			branchName: `Krispy Papi ${branch.branchName}`,
			zipCode: Number(branch.zipCode),
		}
		
		const res = await fetch(`${URL}/add`, {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json', 
                'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
        	},
        	body: JSON.stringify(payload),
		});	
		console.log(res);
		

		if (!res.ok) {
			const err = await res.json();
			throw new Error(err.message || 'Something went wrong');
		}

		return res.json();
	}

	static async updateBranch(branch: Branch) {
		const payload = {
			...branch,
			zipCode: Number(branch.zipCode),
		}
		console.log(payload);
		
		const res = await fetch(`${URL}/update-branch`, {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json', 
                'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
        	},
        	body: JSON.stringify(payload),
		});

		if (!res.ok) {
			const err = await res.json();
			throw new Error(err.message || 'Something went wrong');
		}

		return res.json();
	}

	static async deleteBranch(id: number) {
		const res = await fetch(`${URL}/delete-by-id?id=${id}`, {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json', 
                'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
        	},
		});

		if (!res.ok) {
			const err = await res.json();
			throw new Error(err.message || 'Something went wrong');
		}
	}


}