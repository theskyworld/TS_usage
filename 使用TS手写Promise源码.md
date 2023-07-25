## 使用TS手写Promise源码

### 实现Promise回调

#### 实现actionType

```ts
type ResolveType = (value: any) => any;
type RejectType = (reason: any) => any;
type Executor = (resovle: RejectType, reject: RejectType) => any;


export {
    ResolveType, 
    RejectType,
    Executor,
}
```

#### 实现executor执行器

```ts
import { Executor, RejectType, ResolveType } from "./actionType/actionType";
type ResolvedThenFunc = (value: any) => any;
type RejectedThenFunc = (reason: any) => any;
export default class MyPromise<T = any> {
  public resolve: ResolveType;
  public reject: RejectType;
  // promise状态
  public status: string;
  // resolve函数执行后传递的value值
  public resolvedValue: any;
  // reject函数执行后传递的reason值
  public rejectedReason: any;

  // 接收executor执行器函数作为唯一的参数
  constructor(executor: Executor) {
    // 初始状态为pending
    this.status = "pending";
    // executor执行器函数内执行的参数函数
    this.resolve = (value: any) => {
      // 执行器内，只有状态为pending时才能继续执行resolve或者reject函数
      // 只有pending -> fulfilled 或者 pending -> rejected
      if (this.status === "pending") {
        // 修改状态
        this.status = "fulfilled";
        // 传递value值
        this.resolvedValue = value;
      }
    };
    this.reject = (reason: any) => {
      if (this.status === "pending") {
        // 修改状态
        this.status = "rejected";
        // 传递reason值
        this.rejectedReason = reason;
      }
    };

      executor(this.resolve, this.reject);
  }
}

```

#### 实现then方法

```ts
import { Executor, RejectType, ResolveType } from "./actionType/actionType";
type ResolvedThenFunc = (value: any) => any;
type RejectedThenFunc = (reason: any) => any;
export default class MyPromise<T = any> {
  public resolve: ResolveType;
  public reject: RejectType;
  // promise状态
  public status: string;
  // resolve函数执行后传递的value值
  public resolvedValue: any;
  // reject函数执行后传递的reason值
  public rejectedReason: any;

  // 接收executor执行器函数作为唯一的参数
  constructor(executor: Executor) {
    // 初始状态为pending
    this.status = "pending";
    // executor执行器函数内执行的参数函数
    this.resolve = (value: any) => {
      // 执行器内，只有状态为pending时才能继续执行resolve或者reject函数
      // 只有pending -> fulfilled 或者 pending -> rejected
      if (this.status === "pending") {
        // 修改状态
        this.status = "fulfilled";
        // 传递value值
        this.resolvedValue = value;
      }
    };
    this.reject = (reason: any) => {
      if (this.status === "pending") {
        // 修改状态
        this.status = "rejected";
        // 传递reason值
        this.rejectedReason = reason;
      }
    };

      executor(this.resolve, this.reject);
  }
  // then方法
     // resolvedThenFunc和rejectedThenFunc用于处理接收到的数据，并向后传递新的或旧数据，类似于resolve和reject
  then(resolvedThenFunc: ResolveType, rejectedThenFunc: RejectType) : any {
    if (this.status === "fulfilled") {
      return resolvedThenFunc(this.resolvedValue);
    } else if (this.status === "rejected") {
      return rejectedThenFunc(this.rejectedReason);
    }
  }
}
```

捕获并处理`resolve`函数执行过程中的错误

```ts
try {
      executor(this.resolve, this.reject);
    } catch (err: any) {
      // 修改状态
      this.status === "pending";
      // 传递错误的reason
      this.reject(err.toString());
      // 终止后续代码的执行
      throw new Error(err);
    }
```

实现`then`的级联调用

```ts
// then方法
  // resolvedThenFunc和rejectedThenFunc用于处理接收到的数据，并向后传递新的或旧数据，类似于resolve和reject
  then(resolvedThenFunc: ResolveType, rejectedThenFunc: RejectType): MyPromise {
    // 实现then的级联调用
    return new MyPromise((resolve, reject) => {
      let result;
      console.log("this:", this); // this的值为上一个promise
      if (this.status === "fulfilled") {
        result = resolvedThenFunc(this.resolvedValue);
        //   传递value
        resolve(result);
      } else if (this.status === "rejected") {
        result = rejectedThenFunc(this.rejectedReason);
        // 传递reason
        reject(result);
      }
    });
  }
```

#### 实现单级异步

单级异步（只有执行器中存在异步）+单个`then`方法

```ts
import { Executor, RejectType, ResolveType } from "./actionType/actionType";

export default class MyPromise<T = any> {
  static thencalledTimes: number = 0;
  public resolve: ResolveType;
  public reject: RejectType;
  // promise状态
  public status: string;
  // resolve函数执行后传递的value值
  public resolvedValue: any;
  // reject函数执行后传递的reason值
  public rejectedReason: any;
  // 保存异步执行中，之后要执行的resolvedThen和rejectedThen方法
  public resolvedThenCallbacks: (() => void)[] = [];
  public rejectedThenCallbacks: (() => void)[] = [];

  // 接收executor执行器函数作为唯一的参数
  constructor(executor: Executor) {
    console.log("执行executor...");
    // 初始状态为pending
    this.status = "pending";
    // executor执行器函数内执行的参数函数
    this.resolve = (value: any) => {
      // 执行器内，只有状态为pending时才能继续执行resolve或者reject函数
      // 只有pending -> fulfilled 或者 pending -> rejected
      if (this.status === "pending") {
        // 修改状态
        this.status = "fulfilled";
        // 传递value值
        this.resolvedValue = value;
        // 执行保存的异步resolvedThenCallbacks
        this.resolvedThenCallbacks.forEach((cb) => cb());
      }
    };
    this.reject = (reason: any) => {
      if (this.status === "pending") {
        // 修改状态
        this.status = "rejected";
        // 传递reason值
        this.rejectedReason = reason;
        // 执行保存的异步rejectedThenCallbacks
        this.rejectedThenCallbacks.forEach((cb) => cb());
      }
    };

    try {
      executor(this.resolve, this.reject);
    } catch (err: any) {
      // 修改状态
      this.status === "pending";
      // 传递错误的reason
      this.reject(err.toString());
      // 终止后续代码的执行
      throw new Error(err);
    }
  }
  // then方法
  // resolvedThenFunc和rejectedThenFunc用于处理接收到的数据，并向后传递新的或旧数据，类似于resolve和reject
  then(resolvedThenFunc: ResolveType, rejectedThenFunc: RejectType): MyPromise {
    MyPromise.thencalledTimes++;
    console.log(`+++++++++++++++++++++++++
    执行第${MyPromise.thencalledTimes}个then方法
    `);
    // 实现then的级联调用
    return new MyPromise((resolve, reject) => {
      let result;
      console.log("this:", this); // this的值为上一个promise
      if (this.status === "fulfilled") {
        result = resolvedThenFunc(this.resolvedValue);
        //   传递value
        resolve(result);
      } else if (this.status === "rejected") {
        result = rejectedThenFunc(this.rejectedReason);
        // 传递reason
        reject(result);
        // 异步执行中
        // 先将要执行的resolvedThen和rejectedThen函数进行保存
        // 等到promise的执行器中的resolve或者reject函数执行完毕，获取到数据之后再执行
      } else if (this.status === "pending") {
        this.resolvedThenCallbacks.push(() => {
          // 异步执行resolvedThenFunc
          console.log("异步执行resolvedThenFunc");
          result = resolvedThenFunc(this.resolvedValue);
          //   传递value
          resolve(result);
        });
        this.rejectedThenCallbacks.push(() => {
          // 异步执行rejectedThenFunc
          console.log("异步执行rejectedThenFunc");
          result = rejectedThenFunc(this.rejectedReason);
          // 传递reason
          reject(result);
        });
      }
    });
  }
}
```

单级异步+多个`then`方法

```ts
import { Executor, RejectType, ResolveType } from "./actionType/actionType";

export default class MyPromise<T = any> {
  static thencalledTimes: number = 0;
  public resolve: ResolveType;
  public reject: RejectType;
  // promise状态
  public status: string;
  // resolve函数执行后传递的value值
  public resolvedValue: any;
  // reject函数执行后传递的reason值
  public rejectedReason: any;
  // 保存异步执行中，之后要执行的resolvedThen和rejectedThen方法
  public resolvedThenCallbacks: (() => void)[] = [];
  public rejectedThenCallbacks: (() => void)[] = [];

  // 接收executor执行器函数作为唯一的参数
  constructor(executor: Executor) {
    console.log("执行executor...");
    // 初始状态为pending
    this.status = "pending";
    // executor执行器函数内执行的参数函数
    this.resolve = (value: any) => {
      // 执行器内，只有状态为pending时才能继续执行resolve或者reject函数
      // 只有pending -> fulfilled 或者 pending -> rejected
      if (this.status === "pending") {
        // 修改状态
        this.status = "fulfilled";
        // 传递value值
        this.resolvedValue = value;
        // 执行保存的异步resolvedThenCallbacks
        this.resolvedThenCallbacks.forEach((cb) => cb());
      }
    };
    this.reject = (reason: any) => {
      if (this.status === "pending") {
        // 修改状态
        this.status = "rejected";
        // 传递reason值
        this.rejectedReason = reason;
        // 执行保存的异步rejectedThenCallbacks
        this.rejectedThenCallbacks.forEach((cb) => cb());
      }
    };

    try {
      executor(this.resolve, this.reject);
    } catch (err: any) {
      // 修改状态
      this.status === "pending";
      // 传递错误的reason
      this.reject(err.toString());
      // 终止后续代码的执行
      throw new Error(err);
    }
  }
  // then方法
  // resolvedThenFunc和rejectedThenFunc用于处理接收到的数据，并向后传递新的或旧数据，类似于resolve和reject
  then(resolvedThenFunc: ResolveType, rejectedThenFunc: RejectType): MyPromise {
    MyPromise.thencalledTimes++;
    console.log(`+++++++++++++++++++++++++
    执行第${MyPromise.thencalledTimes}个then方法
    `);
    // 实现then的级联调用
    return new MyPromise((resolve, reject) => {
      let result;
      console.log("this:", this); // this的值为上一个promise
      if (this.status === "fulfilled") {
        result = resolvedThenFunc(this.resolvedValue);
        //   传递value
        resolve(result);
      } else if (this.status === "rejected") {
        result = rejectedThenFunc(this.rejectedReason);
        // 传递reason
        reject(result);
        // 异步执行中
        // 先将要执行的resolvedThen和rejectedThen函数进行保存
        // 等到promise的执行器中的resolve或者reject函数执行完毕，获取到数据之后再执行
      } else if (this.status === "pending") {
        this.resolvedThenCallbacks.push(() => {
          // 异步执行resolvedThenFunc
          console.log("异步执行resolvedThenFunc");
          result = resolvedThenFunc(this.resolvedValue);
          //   传递value
          resolve(result);
        });
        this.rejectedThenCallbacks.push(() => {
          // 异步执行rejectedThenFunc
          console.log("异步执行rejectedThenFunc");
          result = rejectedThenFunc(this.rejectedReason);
          // 传递reason
          reject(result);
        });
      }
    });
  }
}

```

#### 实现多级异步

执行器和`then`方法中出现异步，`then`方法中的`resolvedThen`函数返回一个promise，且该promise中存在异步

```ts
import { Executor, RejectType, ResolveType } from "./actionType/actionType";

export default class MyPromise<T = any> {
  static thencalledTimes: number = 0;
  public resolve: ResolveType;
  public reject: RejectType;
  // promise状态
  public status: string;
  // resolve函数执行后传递的value值
  public resolvedValue: any;
  // reject函数执行后传递的reason值
  public rejectedReason: any;
  // 保存异步执行中，之后要执行的resolvedThen和rejectedThen方法
  public resolvedThenCallbacks: (() => void)[] = [];
  public rejectedThenCallbacks: (() => void)[] = [];

  // 接收executor执行器函数作为唯一的参数
  constructor(executor: Executor) {
    console.log("执行executor...");
    // 初始状态为pending
    this.status = "pending";
    // executor执行器函数内执行的参数函数
    this.resolve = (value: any) => {
      // 执行器内，只有状态为pending时才能继续执行resolve或者reject函数
      // 只有pending -> fulfilled 或者 pending -> rejected
      if (this.status === "pending") {
        // 修改状态
        this.status = "fulfilled";
        // 传递value值
        this.resolvedValue = value;
        // 执行保存的异步resolvedThenCallbacks
        this.resolvedThenCallbacks.forEach((cb) => cb());
      }
    };
    this.reject = (reason: any) => {
      if (this.status === "pending") {
        // 修改状态
        this.status = "rejected";
        // 传递reason值
        this.rejectedReason = reason;
        // 执行保存的异步rejectedThenCallbacks

        this.rejectedThenCallbacks.forEach((cb) => cb());
      }
    };

    try {
      executor(this.resolve, this.reject);
    } catch (err: any) {
      // 修改状态
      this.status === "pending";
      // 传递错误的reason
      this.reject(err.toString());
      // 终止后续代码的执行
      throw new Error(err);
    }
  }
  // then方法
  // resolvedThenFunc和rejectedThenFunc用于处理接收到的数据，并向后传递新的或旧数据，类似于resolve和reject
  then(resolvedThenFunc: ResolveType, rejectedThenFunc: RejectType): MyPromise {
    MyPromise.thencalledTimes++;
    console.log(`+++++++++++++++++++++++++
    执行第${MyPromise.thencalledTimes}个then方法
    `);
    // 实现then的级联调用
    return new MyPromise((resolve, reject) => {
      let result: any;
      console.log("this:", this); // this的值为上一个promise
      if (this.status === "fulfilled") {
        result = resolvedThenFunc(this.resolvedValue);
        //   传递value
        resolve(result);
      } else if (this.status === "rejected") {
        result = rejectedThenFunc(this.rejectedReason);
        // 传递reason
        reject(result);
        // 异步执行中
        // 先将要执行的resolvedThen和rejectedThen函数进行保存
        // 等到promise的执行器中的resolve或者reject函数执行完毕，获取到数据之后再执行
      } else if (this.status === "pending") {
        this.processAsyncsAndSyncs(
          resolvedThenFunc,
          rejectedThenFunc,
          result,
          resolve,
          reject
        );
      }
    });
  }

  /**
   * 执行异步或同步任务
   * @param resolvedThenFunc
   * @param rejectedThenFunc
   * @param result 要向后传递的value或者reject
   * @param resolve
   * @param reject
   */
  processAsyncsAndSyncs(
    resolvedThenFunc: ResolveType,
    rejectedThenFunc: RejectType,
    result: any,
    resolve: ResolveType,
    reject: RejectType
  ) {
    this.resolvedThenCallbacks.push(() => {
      // 异步执行resolvedThenFunc
      console.log("异步执行resolvedThenFunc");
      result = resolvedThenFunc(this.resolvedValue);
      //   传递value
      // 如果当前resolvedThenFunc返回的值为一个promise值，且该promise中异步返回数据
      // 使用之前单级异步中的逻辑来异步执行resolve(result.resolvedValue);
      if (isMyPromise(result)) {
        result.resolvedThenCallbacks.push(() => {
          resolve(result.resolvedValue);
        });

        // 或者使用定时器异步执行
        // setTimeout(() => {
        //   // 传递promise
        //   // resolve(result);
        //   // 传递promise的value
        //   resolve(result.resolvedValue);
        // }, 100);
      } else {
        resolve(result);
      }
    });
    this.rejectedThenCallbacks.push(() => {
      // 异步执行rejectedThenFunc
      console.log("异步执行rejectedThenFunc");
      result = rejectedThenFunc(this.rejectedReason);
      // 传递reason
      //   reject(result);
      if (isMyPromise(result)) {
        result.rejectedThenCallbacks.push(() => {
          reject(result.rejectedReason);
        });
      } else {
        reject(result);
      }
    });
  }
}

// 判断是否为promise
function isMyPromise(val: any): val is MyPromise {
  return isObject(val) && isFunction(val.then);
}
function isObject(val: any): val is Record<any, any> {
  return val !== null && typeof val === "object";
}
function isFunction(data: any): data is Function {
  return typeof data === "function";
}
```

### 实现`Promise.all`

```ts
/**
   * 实现Promise.all
   * 数据value或者reason向后传递的时机为：所有的value都处理完毕或者遇到reject
   * @param promises
   * @returns
   */
  static all(promises: MyPromise[]): MyPromise {
    // 纪录总共要被处理的value值的数量
    // 当值为0时，所有的value被处理完毕，将promisesValues数组向后传递
    let valueToBeProcessedTimes: number = promises.length;
    return new MyPromise((resolve, reject) => {
      // 保存每个promise的value值
      const promisesValues: any[] = [];
      // 调用每个promise的then方法
      promises.forEach((promise, index) => {
        promise.then(
          (value) => {
            processValue(value, index);
          },
          (reason) => {
            // 如果遇到reject的promise，则直接返回该promise的reason，并向后传递
            reject(reason);
            return;
          }
        );
      });

      /**
       * 将所有的promise的value值按照顺序放入promisesValues数组中
       * @param value
       * @param index
       */
      function processValue(value: any, index: number) {
        promisesValues[index] = value;
        valueToBeProcessedTimes--;
        // 存放最后一个value值之后
        // 将所有的value值（promisesValues数组）向Promise.all的then方法中传递
        if (valueToBeProcessedTimes === 0) {
          resolve(promisesValues);
        }
      }
    });
  }
```

