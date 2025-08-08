export function formatToPeso(amount: number): string {
    const formatted = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `₱${formatted}`;
}

export function formatDateToWords(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
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
