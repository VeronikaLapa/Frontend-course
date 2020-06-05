import { LinkedList } from './linkedList';

class Node<T> {
  constructor(public readonly value: T, public next?: Node<T>) {}
}
export class Queue<T> {
  get size(): number {
    return this._size;
  }
  private list: LinkedList<T> = new LinkedList<T>();
  private _size = 0;

  get(index: number): T | undefined {
    return this.list.get(index);
  }

  enqueue(element: T): void {
    this._size++;
    this.list.unshift(element);
  }

  dequeue(): T | undefined {
    if (this._size !== 0) {
      this._size--;
    }

    return this.list.pop();
  }
}
