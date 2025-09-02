export interface PaidOrder {
    orderId: string;
    type: string;
    status: string;
    table: string;
    takeUpNumber: number;
    totalPaid: number;
    products: {
        productName: string;
        qty: number;
    }[];
    abnormalQuantity: number;

    productQty: number;
    productAmount: number;
    productNeeding: number;
    serviceCharge: number;
    additionalCharge: number;
    temporaryCharge: number;
    packingCharge: number;
    dishesDiscount: number;
    orderDiscount: number;
    discountVoucher: number;
    deliveryCharge: number;
    cash: number;
    gCash: number;
    transactionFee: number;
    receivedAmount: number;

    source: string;
    cashier: string;
    paymentTime: string; 

}