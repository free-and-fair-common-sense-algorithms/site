export function format(str) { return str.toLowerCase().replace(/ /g, '_') }

export function getMaxKey(obj) {
    return Object.keys(obj).reduce((a, b) => (obj[a] > obj[b] ? a : b))
}

export function getRandomInt(_min, _max) {
    const min = Math.ceil(_min)
    const max = Math.floor(_max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function convertNum(num) {
    return Number(num.replace(/[^0-9.-]+/g, ''))
}
