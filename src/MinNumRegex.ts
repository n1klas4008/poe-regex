export function generateRegularExpression(number: string, optimize: boolean, quantity: boolean): string | null {
    let input = parseFloat(number);
    // input not a number
    if (isNaN(input)) {
        return null;
    }
    // if input is 0 before optimization ignore
    if (input === 0) return null;
    if (optimize) input = Math.floor(input / 10) * 10;
    // zero does not have to be optimized
    if (input === 0) {
        return "";
    }

    // anything past this point requires a regex

    let tens = Math.floor((input % 100) / 10);
    let digit = input % 10;

    if (input >= 200) {
        // actual regex to capture 200 and higher would be '[2-9]\d{2}'
        return "2..";
    } else if (input === 199) {
        return "199";
    } else if (input > 100) {
        if (digit == 0) {
            return `1[${tens}-9].`;
        } else if (tens === 0) {
            return `(\\d0[${digit}-9]|\\d[1-9].)`
        } else {
            if (tens === 9) {
                return digit != 8 ? `19[${tens}-9]` : "19[89]";
            }
            // these won't match above 200, if we want a true match we would have to replace the start with \d
            return `1([${tens}-9][${digit}-9]|[${tens + 1}-9].)`;
        }
    } else if (input === 100) {
        return "\\d{3}"
    } else if (input >= 10) {
        if (digit === 0) {
            let base: string;
            if (tens === 9) base = "9.";
            else if (tens === 8) base = "[89].";
            else base = `[${tens}-9].`;
            return quantity ? `(${base}|1..)` : base;
        } else if (tens === 9) {
            return quantity ? `(${tens}[${digit}-9]|1..)` : `(${tens}[${digit}-9])`;
        } else {
            return quantity ? `(${tens}[${digit}-9]|[${tens + 1}-9].|1..)` : `(${tens}[${digit}-9]|[${tens + 1}-9].)`;
        }
    } else if (input < 10) {
        if (input === 9) return "(9|\\d..?)"
        else if (input === 8) return "([89]|\\d..?)"
        else if (input > 1) return `([${input}-9]|\\d..?)`
        else return ""; // no need to specify a number for 1 since the .* will match anything anyway
    }
    return number;
}