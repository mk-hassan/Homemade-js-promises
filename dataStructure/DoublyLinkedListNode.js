export default class DoublyLinkedListNode {
  constructor(val, prev = null, next = null) {
    this.value = val;
    this.prev = prev;
    this.next = next;
  }
}