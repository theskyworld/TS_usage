import MyPromise from "./MyPromise";

// 测试
// const myPromise = new MyPromise((resolve, reject) => {
//   //   resolve([1]);
//   setTimeout(() => {
//     resolve([1]);
//   }, 100);
//   //   reject("error");
// });
// myPromise
//   .then(
//     (value) => {
//       console.log("第一个then方法-value", value);
//       value.push(2);
//       return value;
//     },
//     (reason) => {
//       console.log("第一个then方法-reason", reason);
//       return reason;
//     }
//   )
//   .then(
//     (value) => {
//       console.log("第二个then方法-value", value);
//       value.push(3);
//       return new MyPromise((resolve, reject) => {
//         setTimeout(() => {
//             resolve(value);
//         //   reject("出错啦！！！！！！");
//         }, 100);
//       });
//     },
//     (reason) => {
//       console.log("第二个then方法-reason", reason);
//       return reason;
//     }
//   )
//   .then(
//     (value) => {
//       console.log("第三个then方法-value", value);
//       value.push(4);
//       return value;
//     },
//     (reason) => {
//       console.log("第三个then方法-reason", reason);
//       return reason;
//     }
//   )
//   .then(
//     (value) => {
//       console.log("第四个then方法-value", value);
//       value.push(5);
//       return value;
//     },
//     (reason) => {
//       console.log("第四个then方法-reason", reason);
//       return reason;
//     }
// );

// 测试Promise.all
// const p1 = new MyPromise((resolve,reject) => {
//   resolve("第一个值");
// });
// const p2 = new MyPromise((resolve, reject) => {
//     // reject("出错啦！")
//   setTimeout(() => {
//     resolve("第二个值");
//     //   reject("出粗啦")
//   },100);
// });

// const p3 = new MyPromise((resolve,reject) => {
//   resolve("第三个值");
// });

// MyPromise.all([p1, p2, p3]).then((value) => {
//   console.log(value);
// }, reason => {
//     console.log(reason)
// });
