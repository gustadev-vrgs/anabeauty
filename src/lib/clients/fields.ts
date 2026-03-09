const PHONE_DIGITS_LENGTH = 11;

export function getPhoneDigits(value: string) {
  return value.replace(/\D/g, '').slice(0, PHONE_DIGITS_LENGTH);
}

export function formatPhone(value: string) {
  const digits = getPhoneDigits(value);

  if (!digits) {
    return '';
  }

  if (digits.length <= 2) {
    return `(${digits}`;
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function isValidPhoneFormat(value: string) {
  return /^\(\d{2}\) \d{5}-\d{4}$/.test(value) && getPhoneDigits(value).length === PHONE_DIGITS_LENGTH;
}

export function normalizeInstagram(value: string) {
  const username = value.trim().replace(/^@+/, '');

  if (!username) {
    return '';
  }

  return `@${username}`;
}
