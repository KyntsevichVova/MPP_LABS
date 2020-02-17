const months_in_year = 12;

const days_in_month = [
    [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
];

export function isLeapYear(year: number): boolean {
    return (year % 400 == 0) || ((year % 4 == 0) && (year % 100 != 0));
}

export function padLeft(s: string, length: number, padder: string = ' '): string {
    while (s.length < length) {
        s = `${padder}${s}`;
    }
    return s;
}

export function parseDate(s: string): string {
    const parts = s
        ?.split('.')
        ?.map((value) => Number(value))
        ?.filter((value) => value > 0);

    if (parts?.length !== 3) {
        return undefined;
    }

    const [ day, month, year ] = parts;

    if (month > months_in_year || day > days_in_month[Number(isLeapYear(year))][month - 1]) {
        return undefined;
    }

    return [
        padLeft(String(year), 4, '0'),
        padLeft(String(month), 2, '0'),
        padLeft(String(day), 2, '0'),
    ].join('-');
}

export function printDate(d: Date): string {
    const [ day, month, year ] = [d.getDate(), d.getMonth() + 1, d.getFullYear()];
    return [
        padLeft(String(day), 2, '0'),
        padLeft(String(month), 2, '0'),
        padLeft(String(year), 4, '0'),
    ].join('.');
}