"use strict"

class CustomPromise {
  #state;
  #result;
  constructor(handler) {
    this.#state = 'pending'; // fulfilled, rejected
    this.#result = undefined

    const resolve = (value) => {
      if (this.#state === 'pending') {
        this.#state = 'fulfilled';
        this.#result = value;
      }
    }

    const reject = (value) => {
      if (this.#state === 'pending') {
        this.#state = 'rejected';
        this.#result = value;
      }
    }

    try {
      handler(resolve, reject);
    } catch (err) {
      console.log(err.message);
    }
  }

  then(onFulfilled, onRejected) {
    try {
      if (this.#state === 'fulfilled')
        onFulfilled(this.#result);
      else if (this.#state === 'rejected') {
        onRejected(this.#result);
      }
    }
    catch (err) {
      console.log(err.message);
    }
  }

  catch(onRejected) {
    try {
      onRejected(this.#result);
    }
    catch (err) {
      console.log(err.message);
    }
  }
}