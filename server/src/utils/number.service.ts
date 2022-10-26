export class NumberService {
  static round(value: number, precision): number {
    return parseFloat(value.toFixed(precision));
  }
}
