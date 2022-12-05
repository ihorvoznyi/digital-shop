class Format {
  format (price: number) {
    price = Math.abs(price);
    return new Intl.NumberFormat('ua-UA', {
      style: 'currency',
      currency: 'UAH',
      maximumFractionDigits: 0,
    }).format(price)
      .replace('UAH', '')
      .replaceAll(',', ' ')
      .trim();
  }

  formatEstimates (estimates: number) {
    const strRooms = String(estimates);

    const singleRule = estimates % 10 === 0 || estimates === 11;

    if (['5', '6', '7', '8', '9'].includes(strRooms.slice(-1)) || singleRule) {
      return `${estimates} оцінок`;
    }

    if (strRooms.slice(-1) === '1') {
      return `${estimates} оцінка`;
    }

    if (['2', '3', '4'].includes(strRooms.slice(-1))) {
      return `${estimates} оцінки`;
    }

    return `${estimates} оцінок`;
  }

  convertToDollar (price: number) {
    return Math.ceil(price / 40)
  }

  toPhoneNumber (phone: string) {
    return phone.replace(/(\d{1})(\d{2})(\d{3})(\d{2})(\d{2})/, '+38$1 ($2) $3 $4 $5');
  }
}

export default new Format();