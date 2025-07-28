export interface Expense {
    id?: number;
    spenderId: number;
    firstName: string;
    lastName: string;
    paymentMode: string;
    expense: number;
    purpose: string;
    date: string;
    branchId: number;
}