import { InventoryLog } from "@/types/inventory-log";

export function formatToPeso(amount: number): string {
    const formatted = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `₱${formatted}`;
}

export function formatDateToWords(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
}

export function formatDateTime(dateStr: string): string {
    const date = new Date(dateStr);
    
    const optionsDate: Intl.DateTimeFormatOptions = {
        month: 'long',    // full month name, e.g. March
        day: 'numeric',   // numeric day, e.g. 30
        year: 'numeric',  // full year, e.g. 2024
    };

    // Format date part: "March 30, 2024"
    const formattedDate = date.toLocaleDateString('en-US', optionsDate);

    // Format time part: e.g. "4:09AM"
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert 24h to 12h
    hours = hours % 12;
    if (hours === 0) hours = 12; // midnight or noon

    // Pad minutes with leading zero if needed
    const minutesStr = minutes.toString().padStart(2, '0');

    const formattedTime = `${hours}:${minutesStr}${ampm}`;

    return `${formattedDate} ${formattedTime}`;
}


export function getWeekday(dateString: string) {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

export function capitalizeWords(str: string): string {
    if (!str) return '';
    return str
        .split(' ')               
        .map(word =>                   
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() 
        )
        .join(' ');                   
}

export function flattenGroupedLogsWithOrders(
        groupedLogsByDateOrder: Record<string, Record<string, InventoryLog[]>>
    ): { date: string; orders: { orderId: string | null; logs: InventoryLog[] }[] }[] {
    const result: { date: string; orders: { orderId: string | null; logs: InventoryLog[] }[] }[] = [];

    const sortedDates = Object.keys(groupedLogsByDateOrder).sort((a, b) => (a < b ? 1 : -1));

    for (const date of sortedDates) {
        const orders = groupedLogsByDateOrder[date];
        const ordersList: { orderId: string | null; logs: InventoryLog[] }[] = [];

        const sortedOrderKeys = Object.keys(orders).sort((a, b) => {
            const aNum = Number(a);
            const bNum = Number(b);
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return bNum - aNum; 
            }
            return a < b ? 1 : -1;
        });

        for (const orderId of sortedOrderKeys) {
            const parsedOrderId = orderId === "null" ? null : orderId;
            ordersList.push({ orderId: parsedOrderId, logs: orders[orderId] });
        }

        result.push({ date, orders: ordersList });
    }
    return result;
}
