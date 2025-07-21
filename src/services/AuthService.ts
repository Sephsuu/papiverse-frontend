import { BASE_URL } from "@/lib/utils";

const URL = `${BASE_URL}/auth`

export class AuthService {
	static async authenticateUser(credentials: object) {
		const res = await fetch(`${URL}/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(credentials),
		})

		if (!res.ok) {
			const error = await res.json();
			throw new Error(error.error || error.message || "Bad Response");
		}

		const data = await res.json();
		return data.token;
	}

	static async registerUser(user: object) {
		const res = await fetch(`${URL}/register`, {
			method: 'POST',
			headers: {'Content-Type' : 'application/json' },
			body: JSON.stringify(user)
		});

		if (!res.ok) throw new Error('Bad Response');

		return res.json();
	}
}



// const AuthService = {
// 	authenticateUser: async (credentials: object) => {
// 		const response = await fetch(`${BASE_URL}/login`, {
// 		method: 'POST',
// 		headers: { 'Content-Type': 'application/json' },
// 		body: JSON.stringify(credentials),
// 		});

// 		if (!response.ok) {
// 		throw new Error('Login failed');
// 		}

// 		const data = await response.json();
// 		return data.token;
// 	},

// updateCredentials : async (newCredentials : object ) => {
// 	const response = await fetch(`${BASE_URL}/update-credentials`, {
// 	method: 'POST',
// 	headers : {'Content-Type' : 'application/json'},
// 	body : JSON.stringify(newCredentials)
// 	})

// 	if(!response.ok){
// 		throw new Error("Registration Failed");
// 	}

// 	const data = response.json;
// 	return 'Update Successful' + data;
// }


// };
