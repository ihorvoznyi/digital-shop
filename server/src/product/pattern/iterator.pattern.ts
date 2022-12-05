import { Product } from 'src/database/entities';

interface Iterator<T> {
  // Return the current element
  current(): T;

  // Return the current element and move forward to next element
  next(): T;

  // Checks if current position is valid
  hasNext(): boolean;

  // Return the key of the current element
  key(): number;

  // Rewind the Iterator to the first position
  rewind(): void;
}

export class TypeProductIterator implements Iterator<Product> {
  private collection: Product[];
  private position = 0;
  private reverse = false;

  constructor(collection: Product[], reverse = false) {
    this.collection = collection;
    this.reverse = reverse;

    if (reverse) {
      this.position = collection.length - 1;
    }
  }

  public rewind() {
    this.position = this.reverse ? this.collection.length - 1 : 0;
  }

  public current(): Product {
    return this.collection[this.position];
  }

  public key(): number {
    return this.position;
  }

  public next(): Product {
    const item = this.collection[this.position];
    this.position += this.reverse ? -1 : 1;

    return item;
  }

  public hasNext(): boolean {
    if (this.reverse) {
      return this.position < 0;
    }

    return this.position >= this.collection.length;
  }
}
