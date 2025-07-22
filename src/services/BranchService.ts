import { BASE_URL, getTokenFromLocalStorage } from "@/lib/utils";

const URL = `${BASE_URL}/branches`; 

export class BranchService {
	static async getAllBranches() {
		const res = await fetch(`${URL}/get-branches`, {
			method: 'GET',
			headers: {'Content-Type' : 'application/json' }
		});
		
		if (!res.ok) throw new Error('Bad Response');

		return res.json();
	}

	static async addBranch(branch: object) {
		const res = await fetch(`${URL}/add`, {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json', 
                'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
        	},
        	body: JSON.stringify(branch),
		});

		if (!res.ok) throw new Error('Bad Response');

		return res.json();
	}
}

// {"branchName":"Krispy Papi Jupiter","streetAddress":"asss","barangay":"www","city":"sww","province":"ssss","zipCode":"sss","branchStatus":"Open","isInternal":false}
// {"branchName":"Krispy Papi Jupiter","streetAddress":"asss","barangay":"www","city":"sww","province":"ssss","zipCode":"sss","branchStatus":"Open","isInternal":false}

// const BranchService = {
//     addBranch: async (branch  : object) => {
//       const response = await fetch(`${BASE_URL}/add`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json'},
//         body: JSON.stringify(branch),
//       });
      
//       if (!response.ok) {
//         throw new Error('Cannot be added');
//       }

  
//       const data = await response.json();
//       return data;
//     },
  


//     getBranchById: async (branchId: number) => {
//       const response = await fetch(`${BASE_URL}/find-branch?id=${branchId}`, {
//           method: 'GET',
//           headers: {'Content-Type' : 'application/json' }
//       });
  
//       if(!response.ok){
//           throw new Error("Query Failed");
//       }
      
//       const data = await response.json();
//       return data;
//     },

    


//   };

//   export default BranchService;