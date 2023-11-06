export function formatCurrency(amount: number): string {
    const formatter = new Intl.NumberFormat('en-PH',{
        style: 'currency',
        currency:'PHP',
        minimumFractionDigits: 0,
    })
    return formatter.format(amount)
}