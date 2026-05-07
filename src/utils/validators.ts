export function validateNIK(nik: string): boolean {
  return /^\d{16}$/.test(nik);
}

export function validatePhone(phone: string): boolean {
  return /^08\d{8,13}$/.test(phone);
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateSIP(sip: string): boolean {
  return sip.length >= 5;
}
