export interface JwtPayload {
    branchId: number;
    userId : number;
    sub: string;         
    roles: string[];      
    exp: number;
    iat: number;
}