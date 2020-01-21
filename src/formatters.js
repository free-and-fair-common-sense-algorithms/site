export function round(num) {
    return Number(num).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function dollar(num) {
    return `$${round(num)}`
}

export function percent(num, positions = 4) {
    return `${(Number(num) * 100).toFixed(positions)}%`
}

export function percent2(num) {
    return percent(num, 2)
}

export function percent4(num) {
    return percent(num, 4)
}
