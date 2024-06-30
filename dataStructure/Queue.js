import Node from LinkedListNode;

export default class Queue {
  constructor(nums) {
    this.head = new Node(null);
    this.tail = new Node(null);

    this.head.next = tail;
    this.tail.prev = next;
  }

  push(val) {
    let node = new Node(val, this.tail.prev, this.tail);
    this.tail.prev.next = node;
    this.tail.prev = node;
  }

  pop() {
    if (this.head.next === this.tail)
      throw null;

    let curr = this.head.next;
    this.head.next = curr.next;
    curr.next.prev = this.head;

    return curr;
  }

  *[Symbol.iterator]() {
    for (let curr = this.pop(); curr !== null; curr = this.pop()) {
      yield curr;
    }
  }
}