// 解决ts中，将一个类赋值给另外一个类时彼此之间不兼容而报错的问题
// class Test1 {
//   name: string = "Alice";
//   age: number = 12;
// }

// class Test2 {
//   gender: string = "female";
// }

// 尝试赋值1，报错，因为Test1为一个类，不能将一个类赋值给另外一个非变量的值
// Test1 = Test2;
// 现将Test1赋值给一个Test1Copy变量之后再尝试赋值
// let Test1Copy = Test1;
// 尝试赋值，报错，因为两个类中的属性不兼容，Test2中缺少name和age属性
// Test1Copy = Test2;

// 现在通过继承的方式，使用Test2来继承Test1，从而Test2中存在Test1中的属性
class Test1 {
  name: string = "Alice";
  age: number = 12;
}

class Test2 extends Test1 {
  gender: string = "female";
}
let Test1Copy = Test1;
Test1Copy = Test2;
// 赋值成功
console.log(Test1Copy);
