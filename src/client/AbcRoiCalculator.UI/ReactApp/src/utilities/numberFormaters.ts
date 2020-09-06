interface FormatFunc {
    (number: number): string
}
interface Formatter {
    format: FormatFunc,
}

export class CurrencyFormatter implements Formatter {
    private formatter: Function;

    constructor(locale: string, currency: string) {
        this.formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format;
    }

    format(number: number) {
        return this.formatter(number)
    }
};

export class PercentageFormatter implements Formatter {
    format(number: number) { return `% ${number.toFixed(2)}` };
}