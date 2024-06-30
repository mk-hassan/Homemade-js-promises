import Queue from './dataStructure/Queue';

class CustomPromise {
  #state;
  #result;
  #onFilfilledCallbacks;
  #onRejectedCallbacks;
  constructor(handler) {
    this.#state = 'pending'; // fulfilled, rejected
    this.#result = undefined
    this.#onFilfilledCallbacks = new Queue();
    this.#onRejectedCallbacks = new Queue();

    const resolve = (value) => {
      if (this.#state === 'pending') {
        this.#state = 'fulfilled';
        this.#result = value;
        for (let callback of this.#onFilfilledCallbacks) {
          callback(this.#result);
        }
      }
    }

    const reject = (value) => {
      if (this.#state === 'pending') {
        this.#state = 'rejected';
        this.#result = value;
        for (let callback of this.#onRejectedCallbacks) {
          callback(this.#result);
        }
      }
    }

    try {
      handler(resolve, reject);
    } catch (err) {
      reject(err.message);
    }
  }

  then(onFulfilled, onRejected) {
    if (this.#state === 'pending') {
      this.#onFilfilledCallbacks.push(onFulfilled);
      this.#onRejectedCallbacks.push(onFulfilled);
    }
    else if (this.#state === 'fulfilled') {
      try {
        onFulfilled(this.#result);
      } catch (err) {
        console.log(err.message);
      }
    }
    else {
      try {
        onRejected(this.#result);
      } catch (err) {
        console.log(err.message);
      }
    }
  }

  catch(onRejected) {
    if (this.#state === 'pending')
      this.#onRejectedCallbacks.push(onFulfilled);
    else if (this.#state === 'rejected') {
      try {
        onRejected(this.#result);
      } catch (err) {
        console.log(err.message);
      }
    }
  }
}