
export function sum(array: number[]) {
    return array.reduce((partial_sum, a) => partial_sum + a, 0);
}

export function avg(array: number[]) {
    return sum(array) / array.length;
}

export function standardDeviation(numbers: number[]) {
    const mean = sum(numbers) / numbers.length;
    let std_dev = 0;
    if (numbers.length > 1) {
        std_dev = Math.sqrt(numbers.reduce((acc, n) => (n - mean) ** 2) / (numbers.length - 1));
    }
    return std_dev;
}

export function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}