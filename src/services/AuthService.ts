import { BASE_URL, getTokenFromLocalStorage } from "@/lib/utils";
import { User } from "@/types/user";

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

	static async getCookie() {
		const res = await fetch('/api/get-token', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
		});

		return res.json();
	}

	static async setCookie(token: string) {
		const res = await fetch('/api/set-token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token }),
		});

		if (res.ok) {
			return 'Logged in successfully! Please wait patiently.';
		}

		return 'Something went wrong. Please try again.';
	}

	static async registerUser(user: User) {
		delete user.branch
		console.log(JSON.stringify(user));
		
		const res = await fetch(`${URL}/register`, {
			method: 'POST',
			headers: {
				'Content-Type' : 'application/json',
				'Authorization' : `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJGUkFOQ0hJU09SIl0sImJyYW5jaCI6eyJpc0ludGVybmFsIjp0cnVlLCJicmFuY2hJZCI6MX0sInVzZXJJZCI6Miwic3ViIjoic2VwaHN1dSIsImlhdCI6MTc1MzI1ODAxOCwiZXhwIjoxNzUzMjU5NDU4fQ.cqwAHtCDsi-4tvQXHcA1VM9ks3YBEK8dbkp5mfzriIY"}`
			},
			body: JSON.stringify(user)
		});
		console.log(res);
		

		console.log();
		

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
