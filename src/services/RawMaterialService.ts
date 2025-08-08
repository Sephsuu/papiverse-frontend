import { capitalizeWords } from "@/lib/formatter";
import { BASE_URL, getTokenFromLocalStorage } from "@/lib/utils";
import { Supply } from "@/types/supply";

const URL = `${BASE_URL}/raw-materials`; 

export class SupplyService {
	static async getAllSupplies() {
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

	static async getSupplyByCode(code: string) {
		const res = await fetch(`${URL}/get-by-code?code=${code}`, {
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

	static async addSupply(supply: Supply) {
		const payload = {
			...supply,
			name: capitalizeWords(supply.name!),
			unitQuantity: Number(supply.unitQuantity),
			unitPriceInternal: Number(supply.unitPriceInternal),
			unitPriceExternal: Number(supply.unitPriceExternal)
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

	static async updateSupply(supply: Supply) {		
		const payload = {
			...supply,
			name: capitalizeWords(supply.name!),
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

	static async deleteSupply(code: string) {
		console.log(code);
		
		const res = await fetch(`${URL}/delete-by-code?code=${code}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json'},
		});
		console.log(res);
		

		if (!res.ok) {
			const err = await res.json();
			throw new Error(err.message || 'Something went wrong.');
		}
	}
}

// const RawMaterialService = {
  

//      getRawMaterialByCode: async (code: String) => {
//       const response = await fetch(`${BASE_URL}/get-by-code?code=${code}`, {
//           method: 'GET',
//           headers: {'Content-Type' : 'application/json' }
//       });
  
//       if(!response.ok){
//           throw new Error("Query Failed");
//       }
      
//       const data = await response.json();
//       return data;
//     },


//     deleteRawMaterial: async (code: string) => {
//       const response = await fetch(`${BASE_URL}/delete-by-code?code=${code}`, {
//           method: 'POST',
//           headers: {'Content-Type' : 'application/json' }
//       });
      
//       if (response.ok) {
//           const text = await response.text();
//           return text ? JSON.parse(text) : null;
//       }
//     },    


//   };

  
//   export default RawMaterialService;