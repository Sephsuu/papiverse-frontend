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

	static async deleteCookie() {
		const res = await fetch('/api/delete-token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		});

		if (res.ok) {
			return 'Logged out successfully! Please wait patiently.';
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
				'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
			},
			body: JSON.stringify(user)
		});
		console.log(res);

		if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || err.error || 'Something went wrong.')
        }

		return res.json();
	}

	static async updateCredentials(newCredentials : object ) {
		const response = await fetch(`${URL}/update-credentials`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 
					'Authorization' : `Bearer ${getTokenFromLocalStorage()}`
		},
		body : JSON.stringify(newCredentials)
		})

		if(!response.ok){
		   	const err = await response.json();
            throw new Error(err.message || err.error || 'Something went wrong.')
		}
		return response.json();
 	}
}
