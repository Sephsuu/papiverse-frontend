import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge";

export const BASE_URL = 'https://395z4m7f-8080.asse.devtunnels.ms/api/v1';
export const NEXT_URL = 'https://395z4m7f-8080.asse.devtunnels.ms';;
export const MESSAGING_URL = 'https://x848qg05-3001.asse.devtunnels.ms';
export const IMPORTATION_URL = 'https://x848qg05-5000.asse.devtunnels.ms';

export function getTokenFromLocalStorage() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}