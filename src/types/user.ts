export interface User {
    id?: number;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    dateOfBirth: string;
    gender: string;
    contactNumber: string;
    branchId: string | undefined;
    role: string;

    confirmPassword?: string;
    branch?: {
        branchId: number;
        branchName: string;
    }
}

export const userInit: User = {
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    contactNumber: "",
    branchId: "",
    role: "",
    branch: {
        branchId: 0,
        branchName: ""
    }
};

export const userFields: (keyof User)[] = [
    "email",
    "username",
    "password",
    "firstName",
    "lastName",
    "dateOfBirth",
    "gender",
    "contactNumber",
    "branchId",
    "role"
];