export interface SupplyOrder {
    orderId?: number;
    branchName: string;
    orderDate: string;
    status: string;
    remarks: string;
    completeOrderTotalAmount: number;

    meatCategory?: {
        meatOrderId: number;
        isApproved: boolean;
        categoryTotal: number;
        meatItems: {
            rawMaterialCode: string;
            rawMaterialName: string;
            quantity: number;
            price: number;
        } []
    }

    snowfrostCategory?: {
        snowFrostOrderId: number;
        isApproved: boolean;
        categoryTotal: number;
        snowFrostItems: {
            rawMaterialCode: string;
            rawMaterialName: string;
            quantity: number;
            price: number;
        } []
    }
}