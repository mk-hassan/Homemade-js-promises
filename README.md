# Promises (Reinventing the gears)

I got confused lots of times with this concept, so I will try to reinvent the build it myself. I do so to make it as a guide for me to remember that concept when forget it again.
> Take a tour in this [article](https://javascript.info/promise-basics) before reading this implementation.

## Simple Implementation
```javascript
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
      if(this.#state === 'rejected')
        onRejected(this.#result);
    }
    catch (err) {
      console.log(err.message);
    }
  }
}
```

> [!NOTE] Notes on the previous implementation
> 1. The `state` and `result` of the promise are private.
> 2. `resolve` and `reject` function are responsible for changing the state and result of the promise.
> 3. Which functoion should be executed depends on the logic by the handler, wheter the async operations done perfectly or an error occurs.
> 4. `then` method takes 2 arguments: function to run on success, and function to run on failure.
> 5. the `result` of the promise is passed to the 2 argument functions.
> 6. `catch` arument has the same logic as 2nd argument of `then`.

> [!CAUTION] Problems with this implementation
> 1. Doesn't handle async operations.
> 2. Chaining isnot supported.

```javascript
// calling put CustomPromise (trace it)
let promise = new CustomPromise((resolve, reject) => {
  resolve("okay"); // the promise has no async operations and it resolves immediately (not the common case)
});

promise.then(console.log); // okay
```

```javascript
let handler = resolve, reject) => {
  setTimeout(() => resolve("okay"), 1000);
};

let promise = new CustomPromise(handler);

promise.then(console.log); // undefined
```
> [!NOTE]
> setTimeout is an asyn operation handled by the browser or libuv in nodejs, and the rest of sync code continues.
> So "then" will be executed before even the setTimeout callback function is executed so the state of the promise 
> when "then" is called is "pending" and the result of the promise is undefined as the resolve function is not executed till that time.

> [!TIP]
> To solve this problem we need like a waiting list that queue the handlers passed by `then` and `catch` function to be executed later when the promise is `resolved` or `rejected`, in other words: when the `state` and `result` of the promise is changed.\
> We need to support `Async code`.

## Async code support

If you don't know a js script runs all its sync statements first then the async ones. The async code is managed by the js runtime environment which could be the browser or nodejs. That's what happened on the previous code snippt! 