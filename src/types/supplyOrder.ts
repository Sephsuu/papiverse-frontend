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

export interface SupplyItem {
    category?: string;        // e.g. "MEAT", "SNOWFROST"
    code?: string;            // e.g. "MT-022", "SF-102"
    name?: string;            // e.g. "Pork Belly", "Frozen Tocino"
    quantity?: number;        // e.g. 1
    unitMeasurement?: string; // e.g. "kg", "packs"
    unitPrice?: number;
    unitQuantity?: number;       // e.g. 260, 125
}

export interface CompleteOrder {
    branchId: number;
    remarks: string;
    meatCategoryItemId: string;
    snowfrostCategoryItemId: string;
}

interface MeatItem {
    rawMaterialCode?: string;
    rawMaterialName?: string;
    quantity?: number;
    unitPrice?: number;
    totalPrice?: number;
}

export interface MeatOrder {
    id: string;
    branchId: number;
    isApproved: boolean;
    totalAmount: number;
    meatItems: MeatItem[];
}

interface SnowItem {
    rawMaterialCode?: string;
    rawMaterialName?: string;
    quantity?: number;
    unitPrice?: number;
    totalPrice?: number;
}

export interface SnowOrder {
    id: string;
    branchId: number;
    isApproved: boolean;
    totalAmount: number;
    snowItems: SnowItem[];
}