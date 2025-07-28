import { BASE_URL, getTokenFromLocalStorage } from "@/lib/utils";
import { Employee } from "@/types/employee";

const URL = `${BASE_URL}/employees`;

export class EmployeeService {
  	static async getEmployeesByBranch(id: number) {
		console.log(id);
		
		const res = await fetch(`${URL}/get-by-branch?branchId=${id}`, {
			method: 'GET',	
			headers: { 
				'Content-Type': 'application/json',
				'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
			}
		});
		console.log(res);
		

		if (!res.ok) {
			const err = await res.json();
			throw new Error(err.message || 'Something went wrong.');
		}

		return res.json();
	}

	static async getEmployeeById(id: number) {
		const res = await fetch(`${URL}/get-by-id?id=${id}`, {
			method: 'GET',	
			headers: { 
				'Content-Type': 'application/json',
				'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
			}
		});

		if (!res.ok) {
			const err = await res.json();
			throw new Error(err.message || 'Something went wrong.');
		}

		return res.json();
	}

	static async createEmployee(employee: Employee, id: number) {
		const payload = {
			...employee,
			branchId: id
		}
		const res = await fetch(`${URL}/create`, {
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

	static async updateEmployee(employee: Employee) {
		const res = await fetch(`${URL}/update`, {
			method: 'POST',	
			headers: { 
				'Content-Type': 'application/json',
				'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
			},
			body: JSON.stringify(employee)
		});

		if (!res.ok) {
			const err = await res.json();
			throw new Error(err.message || 'Something went wrong.');
		}

		return res.json();
	}

	static async deleteEmployee(id: number) {
		const res = await fetch(`${URL}/delete-by-id?id=${id}`, {
			method: 'POST',	
			headers: { 
				'Content-Type': 'application/json',
				'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
			}
		});

		if (!res.ok) {
			const err = await res.json();
			throw new Error(err.message || 'Something went wrong.');
		}
	}
}