export interface InventoryLog {
    id: number;
    inventoryId: number;
    rawMaterialCode: string;
    rawMaterialName: string;
    branchId: string;
    quantityChanged: number;
    type: string;
    source: string;
    orderId: number;
    dateTime: string;
}