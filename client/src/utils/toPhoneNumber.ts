export const toPhoneNumber = (phone: string) => {
  return phone.replace(/(\d{1})(\d{2})(\d{3})(\d{2})(\d{2})/, '+38$1 ($2) $3 $4 $5');
}
