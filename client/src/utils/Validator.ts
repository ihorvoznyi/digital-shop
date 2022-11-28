class Validator {
  private readonly reEmail = RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  validateEmail(email: string): boolean {
    return this.reEmail.test(email.toLocaleLowerCase());
  }

  validatePhone(phoneNumber: string): boolean {
    return phoneNumber.length === 10;
  }
}

export default new Validator();