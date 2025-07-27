export interface Inventory {
    id?: number;
    code?: string;
    name?: string;
    unitPrice?: number;
    unitMeasurement?: string;
    category?: string;
    quantity?: number;
    branchId?: number;

    rawMaterialCode?: string;
    type?: string;
    source?: string;
}

export const inventoryInit: Inventory = {
    rawMaterialCode: "",
    quantity: 0,
    branchId: 1,
    type: "",
    source: "",
};

export const inventoryFields: (keyof Inventory)[] = [
    "rawMaterialCode",
    "quantity",
    "branchId",
];