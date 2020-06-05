import { Queue } from './queue';

enum Priority {
  low = 1,
  Middle = 2,
  High = 3
}
export class PriorityQueue<T> {
  private _size = 0;
  private lowQueue = new Queue<T>();
  private middleQueue = new Queue<T>();
  private highQueue = new Queue<T>();

  get size(): number {
    return this._size;
  }

  enqueue(element: T, priority: Priority) {
    if (priority === Priority.low) {
      this.lowQueue.enqueue(element);
    }
    if (priority === Priority.Middle) {
      this.middleQueue.enqueue(element);
    }
    if (priority === Priority.High) {
      this.highQueue.enqueue(element);
    }
    this._size++;
  }

  dequeue(): T | undefined {
    if (this._size === 0) {
      return undefined;
    }
    this._size--;
    if (this.highQueue.size > 0) {
      return this.highQueue.dequeue();
    }
    if (this.middleQueue.size > 0) {
      return this.middleQueue.dequeue();
    }

    return this.lowQueue.dequeue();
  }
}
