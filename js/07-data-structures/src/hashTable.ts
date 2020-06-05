const MOD = 107;
const MUL = 7;
function hash(key: number | string | object): number {
  if (typeof key !== 'string') {
    return hash(JSON.stringify(key));
  }

  let result = 0;
  for (let i = 0; i < key.length; i++) {
    result = (result * MUL + key.charCodeAt(i)) % MOD;
  }

  return result;
}

class Node<T> {
  constructor(public key: number | string | object, public value: T) {}
}

export class HashTable<T> {
  get size(): number {
    return this._size;
  }
  private table: Node<T>[][] = Array(MOD).fill([]);
  private _size = 0;
  get(key: number | string | object): T | undefined {
    const buck = this.table[hash(key)];
    for (const node of buck) {
      if (node.key === key) {
        return node.value;
      }
    }

    return undefined;
  }

  put(key: number | string | object, value: T): void {
    const buck = this.table[hash(key)];
    for (const node of buck) {
      if (node.key === key) {
        node.value = value;

        return;
      }
    }
    buck.push(new Node<T>(key, value));
    this._size++;
  }
  clear(): void {
    this.table = Array(MOD).fill([]);
    this._size = 0;
  }
}
