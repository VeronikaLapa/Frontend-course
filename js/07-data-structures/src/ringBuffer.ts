class Node<T> {
  constructor(public readonly value: T, public next?: Node<T>) {}
}
export class RingBuffer<T> {
  private readonly capacity: number;
  private size = 0;
  private head?: Node<T>;
  private tail?: Node<T>;

  constructor(capacity: number) {
    this.capacity = capacity;
  }
  get(index: number): T | undefined {
    if (index < 0 || index >= this.size) {
      return undefined;
    }
    let current = this.head;
    for (let i = 0; i < index; ++i) {
      current = current?.next;
    }

    return current?.value;
  }
  push(element: T): void {
    const newTail = new Node(element);
    if (this.size === this.capacity) {
      this.shift();
    }
    if (this.size === 0) {
      this.head = newTail;
    } else {
      this.tail!.next = newTail;
    }
    this.tail = newTail;
    this.size++;
  }
  shift(): T | undefined {
    if (this.size === 0) {
      return undefined;
    }
    const res: T = this.head!.value;
    this.head = this.head!.next;
    this.size--;
    if (this.head === undefined) {
      this.tail = undefined;
    }

    return res;
  }

  static concat<T>(...buffers: RingBuffer<T>[]): RingBuffer<T> {
    let sumCapacity = 0;
    buffers.forEach(buffer => (sumCapacity += buffer.capacity));
    const res = new RingBuffer<T>(sumCapacity);
    buffers.forEach(buffer => {
      while (buffer.size > 0) {
        res.push(buffer.shift()!);
      }
    });

    return res;
  }
}
