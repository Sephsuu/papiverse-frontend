import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge";

export const BASE_URL = 'http://localhost:8080/api/v1';

export function getTokenFromLocalStorage() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
