// eslint-disable-next-line @typescript-eslint/naming-convention
export type PhoneNumber = string & { __type: 'PhoneNumber'; format: '+19785551234' };
// eslint-disable-next-line @typescript-eslint/naming-convention
export type PhoneNumberFormatted = string & { __type: 'PhoneNumber'; format: '(###) ###-####' };

function formatPhoneNumber_UsaCanada(text: string): PhoneNumberFormatted {
  return phoneNumberMask_UsaCanada(text).corrected as PhoneNumberFormatted;
}

function toStandardPhoneNumber(text: string): PhoneNumber {
  return `+1${phoneNumberMask_UsaCanada(text).digitsNo1}` as PhoneNumber;
}

function toStandardPhoneNumber_optional(text: string | null | undefined): PhoneNumber | undefined {
  if (!text) {
    return undefined;
  }
  return `+1${phoneNumberMask_UsaCanada(text).digitsNo1}` as PhoneNumber;
}

function phoneNumberMask_UsaCanada(x: string | null | undefined) {
  const numberMask = `(###) ###-####`;
  const digits =
    x
      ?.replace(/^(\+1|1)/, ``)
      .replace(/\D/g, ``)
      .split(``) ?? [];
  const letters = numberMask.split(``);
  let iDigit = 0;
  let iLast = -1;
  for (let i = 0; i < letters.length; i++) {
    if (letters[i] === `#` && iDigit < digits.length) {
      letters[i] = digits[iDigit];
      iDigit++;
      iLast = i;
    }
  }
  const full = letters.join(``);
  const corrected = letters.slice(0, iLast + 1).join(``);
  return { corrected, full, digitsNo1: digits.join(``) };
}

export const phoneNumber = {
  formatPhoneNumber_UsaCanada,
  toStandardPhoneNumber,
  toStandardPhoneNumber_optional,
  phoneNumberMask_UsaCanada,
};
