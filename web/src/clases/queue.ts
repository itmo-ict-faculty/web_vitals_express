type QueueConstructor = {
  maxSize?: number;
};

class Queue {
  arr: number[] = [];
  maxSize: number = 10;
  constructor({ maxSize }: QueueConstructor) {
    this.arr = [];
    if (maxSize) {
      this.maxSize = maxSize;
    }
  }

  push(element: number) {
    this.arr.push(element);
    if (this.arr.length > this.maxSize) {
      this.arr = this.arr.splice(1);
    }
  }

  get() {
    return this.arr;
  }

  getAverage() {
    const summ = this.arr.reduce((acc, curr) => acc + curr, 0);
    return summ / this.arr.length;
  }
}

export default Queue;
