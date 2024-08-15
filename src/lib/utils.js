export const SimpleId = () => {
    const buffer = crypto.getRandomValues(new Uint8Array(8))
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('')
}

export function formatJSON(input) {
    const regex = /^{.*$/
    if (regex.test(input)) {
        if (input === '{') {
            return '{}'
        }
        if (input[input.length - 1] !== '}') {
            return input + '"}'
        }
    }
    return input
}
export function markdownImageChecker(str) {
    return str.includes('![');
}