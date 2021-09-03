
const getDigitName = (value: number): string => {
    const digit = Math.floor(value % 10);
    switch (digit) {
        case 9: return `nine`;
        case 8: return `eight`;
        case 7: return `seven`;
        case 6: return `six`;
        case 5: return `five`;
        case 4: return `four`;
        case 3: return `three`;
        case 2: return `two`;
        case 1: return `one`;
        case 0: return `zero`;
        default: return ``;
    }
};

const getTensName = (value: number): string => {
    const digit = Math.floor(value % 10);
    switch (digit) {
        case 9: return `ninety`;
        case 8: return `eighty`;
        case 7: return `seventy`;
        case 6: return `sixty`;
        case 5: return `fifty`;
        case 4: return `fourty`;
        case 3: return `thirty`;
        case 2: return `twenty`;
        case 1: return `ten`;
        default: return ``;
    }
};


const getTeensName = (value: number): string => {
    const digit = Math.floor(value % 10);
    switch (digit) {
        case 9: return `nineteen`;
        case 8: return `eighteen`;
        case 7: return `seventeen`;
        case 6: return `sixteen`;
        case 5: return `fifteen`;
        case 4: return `fourteen`;
        case 3: return `thirteen`;
        case 2: return `twelve`;
        case 1: return `eleven`;
        case 0: return `ten`;
        default: return ``;
    }
};

const getNumberName = (value: number): string => {
    if (value > 999) {
        throw new Error(`Only Numbers 0-999 Supported`);
    }

    const ones = Math.floor(value % 10);
    const tens = Math.floor((value % 100) / 10);
    const hundreds = Math.floor((value % 1000) / 100);

    const hundredText = hundreds > 0 ? `${getDigitName(hundreds)}-hundred` : ``;

    if (tens === 1) {
        return `${hundredText} ${getTeensName(tens * 10 + ones)}`.trim();
    }

    const tensText = getTensName(tens);
    const onesText = ones > 0 ? getDigitName(ones) : ``;

    return `${hundredText} ${tensText}${tensText && onesText ? `-` : ``}${onesText}`.trim();
};

export const numberNames = {
    getNumberName,
    getDigitName,
};
