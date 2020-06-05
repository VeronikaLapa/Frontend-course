class Node<T> {
  constructor(public readonly value: T, public prev?: Node<T>, public next?: Node<T>) {}
}

class LinkedList<T> {
  get size(): number {
    return this._size;
  }
  private head?: Node<T> = undefined;
  private tail?: Node<T> = undefined;
  private _size = 0;

  get(index: number): T | undefined {
    if (index < 0 || index >= this._size) {
      return undefined;
    }
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current?.next;
    }

    return current?.value;
  }
  push(element: T): void {
    const newTail = new Node(element);
    if (this._size === 0) {
      this.head = newTail;
    } else {
      this.tail!.next = newTail;
      newTail.prev = this.tail;
    }
    this.tail = newTail;
    this._size++;
  }
  pop(): T | undefined {
    if (this._size === 0) {
      return undefined;
    }
    const res: T = this.tail!.value;
    this.tail = this.tail!.prev;
    this._size--;
    if (this.tail === undefined) {
      this.head = undefined;
    } else {
      this.tail.next = undefined;
    }

    return res;
  }
  unshift(element: T): void {
    const newHead = new Node(element);
    if (this._size === 0) {
      this.tail = newHead;
    } else {
      this.head!.prev = newHead;
      newHead.next = this.head;
    }
    this.head = newHead;

    this._size++;
  }

  shift(): T | undefined {
    if (this._size === 0) {
      return undefined;
    }
    const res: T = this.head!.value;
    this.head = this.head!.next;
    this._size--;
    if (this.head === undefined) {
      this.tail = undefined;
    } else {
      this.head.prev = undefined;
    }

    return res;
  }
}

export { LinkedList };
