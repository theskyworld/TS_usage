## TS基本使用

### TS概念

一种融合了后端面向对象思想，进行面向接口编程的JS语言的超集

环境搭建：

```shell
npm init -y
npm i typescript -D
tsc --init
```

TS的优势：

- 在代码编译阶段进行变量静态类型的检测。当函数传参或者变量赋值类型不匹配时，将出现编译错误提示。相较于JS的可能在代码执行阶段进行错误提示，能够更及时和更方便地发现代码中的错误

  ```ts
  // let str: string = 'hello';
  // str = 1; // 报错，类型不匹配
  
  const arr: number[] = [1, 2, 3];
  arr.forEach(() => { });
  arr.toUpperCase(); // 报错，方法不存在
  ```

  ```ts
  let userName: string = 'Alice2';
  
  // 解决同一个变量不能在不同文件中进行重复声明的问题
  // demo1.ts中也同时声明了userName变量
  // 通过以下代码声明，上述代码只属于当前作用域
  export { };
  ```

- 在编译时，更加清晰明确地代码提示。例如能够快速、明确地识别出已有对象中的已有属性，在调用对象的属性时进行友好地提示

  ```ts
  const person = {
      name: 'Alice',
      age: 12,
      gender : 'female',
  }
   
  console.log(person.age); // 访问对象的属性时，进行友好的提示
  ```

  <img src="C:\Users\ycx\AppData\Roaming\Typora\typora-user-images\image-20230703144921600.png" alt="image-20230703144921600" style="zoom:67%;" />

  相较于JS：

  <img src="C:\Users\ycx\AppData\Roaming\Typora\typora-user-images\image-20230703145129397.png" alt="image-20230703145129397" style="zoom:67%;" />

- 引入了泛型和大量TS特有的类型

- 通过`.d.ts`声明文件，清晰直观地展示了依赖库文件的接口、type类型、类、函数、变量等声明

- 能够轻松编译成JS文件

- `any`类型和`as any`断言提高了TS的灵活度

### 类型注解和类型推导

```ts
// 类型注解
// 手动为声明的变量注解类型
// 首次赋值以及以后赋值时只能赋与变量的类型相匹配的值
let data: number = 1;
data = 2;
// data = 'hello'; //报错

// 类型推导
// 在定义变量时，根据当前所赋的值，自动推到出当前变量的类型
// 首次赋值时，能够赋任意类型的值，然后根据该值进行类型推导
let money = 12; //money的类型被推导为number
// money = 'hello'; //报错

```

### 代码编译和编译优化

使用`tsc xxx.ts`命令，将一个TS文件编译成一个JS文件，并将编译后的文件输出

编译优化

- 优化编译后文件的输出路径

  ```json
  {
       // 指定要被编译的.ts文件的根目录
      "rootDir": "./src",  
       // 指定所有编译后的文件的输出目录
      "outDir": "./dist", 
  }
  ```

  ```shell
  tsc
  ```

- 代码存在错误时不进行任何编译

  ```json
  {
      // 代码存在错误时，不进行任何编译
      "noEmitOnError": true, 
  }
  ```

- 编译代码后同时执行代码（不进行文件的输出）

  ```shell
  ts-node demo1.ts
  ```


### 常用数据类型

##### 基本类型

`number`、`string`、`boolean`、`symbol`、`null`、`undefined`

```ts
// undefined和null
// 可以为一个变量值当它不想赋初始值时，添加一个undefined类型
let str: string | undefined; // 此时str可以不赋初始值
let str : string;
console.log(str);
str = "hello";
str = undefined;

// 将undefined或者null值赋值给一个非undefined且非null类型的值时，默认情况下报错
// 在配置文件中配置'"strictNullChecks": false'后可以使其不报错
// let mname: string = null;

// 在函数中使用undefined
// param?，可选参数param表示该参数的类型为string | undefined，并且该参数可有可无
function test(param?: string) {
  if (param) console.log(param.toUpperCase());
}
test();

// 只有any、unknown和undefined类型的值可以接收undefined值
// 只有any、unknown和null类型的值可以接收null值
let data: unknown = undefined;
```

```ts
// const obj: object = {
//     userName: "Alice",
//     age : 12,
// }
// console.log(obj.userName); // 报错

// 问题解决
//使用对象接口，声明该对象上存在的属性
interface Obj {
  userName: string;
  age: number;
}
const obj: Obj = {
  userName: "Alice",
  age: 12,
};
console.log(obj.userName); // "Alice"
```

```ts
let obj = {
  userName: "Alice",
  age: 12,
};
// let userName = "userName";
// console.log(obj[userName]); // 报错

// 问题解决
const userName = 'userName';
console.log(obj[userName]); // "Alice"
```

##### 根类型

`Object`（`{}`）。是其它所有类型的父类型，可以将其它所有类型的值赋给根类型的变量，除`null`和`undefined`外

```ts
let rootObj: Object = { name: 'Alice' };
rootObj = 1;
rootObj = 'hello';
rootObj = [1, 2];
rootObj = new Set<string>();
// rootObj = undefined; // 报错
// rootObj = null; // 报错
```

##### 对象类型

`Array`、`object`、`function`

- `function`

  ```ts
  //函数返回值的自动推导
  function info1(name: string, age: number) {
    console.log(name, age);
    return 1;
  }
  
  // 函数表达式
  const info2 = function (name: string, age: number) {
    console.log(name, age);
    return 1;
  };
  
  // 手动指定函数的参数和返回值类型
  // const info3: (name: string, age: number) => number = function (
  //   name: string,
  //   age: number
  // ): number {
  //   console.log(name, age);
  //   return 1;
  // };
  type InfoFunc = (name: string, age: number) => number;
  const info3: InfoFunc = function (name: string, age: number): number {
    console.log(name, age);
    return 1;
  };
  
  
  
  //rest参数
  function info(name: string, age: number, ...rest: any[]) {
    console.log(name, age, rest);
    return 1;
  }
  info("Alice", 23, "female", 3);
  
  ```

  ```ts
  // 参数解构
  // 定义函数参数类型
  type InfoFuncParam = {
    username: string;
    age: number;
    phone: number;
  };
  
  function info(params: InfoFuncParam): number {
    console.log(params.age, params.username, params.phone);
    return 1;
  }
  // 函数参数
  const params: InfoFuncParam = {
    username: "Alice",
    age: 12,
    phone: 11111,
  };
  info(params);
  
  // 或者使用参数解构
  function info2({ username, age } : InfoFuncParam) {
      console.log(username, age);
      return 1;
  }
  info2(params);
  
  ```

- `Array`

  ```ts
  // 一个只读的数组，数组本身和数组元素均只读
  const arr = [1, 2, 3] as const;
  ```

  

##### 枚举：`enum`

相较于使用常量：

```ts
function getAduitStatus(status: number): void {
  if (status === Status.NO_ADULT) {
    console.log("无审核");
  } else if (status === Status.MANAGER_ADULT_SUCCESS) {
    console.log("经理审核通过");
  } else if (status === Status.FINAL_ADULT_SUCCESS) {
    console.log("财务审核通过");
  }
}

// 解决以上根据元素审核情况进行相应处理的逻辑问题
// 使用常量
// const Status = {
//   MANAGER_ADULT_FAIL: -1,
//   NO_ADULT: 0,
//   MANAGER_ADULT_SUCCESS: 1,
//   FINAL_ADULT_SUCCESS: 2,
// };

// getAduitStatus(1);

// 使用枚举
// 相较于使用常量的方式，使用数字枚举时，不需要将每个数字值写出，书写起始值之后会进行数字的自动递增和赋值
// 同时枚举还支持除数值和字符串之外的其它类型
// 还支持方括号([])取值和双重映射（由键取值和由值取键/反向取值）
enum Status {
  MANAGER_ADULT_FAIL = -1,
  NO_ADULT,
  MANAGER_ADULT_SUCCESS,
  FINAL_ADULT_SUCCESS,
}

getAduitStatus(1);


//语义更清晰、可读性更强
function getAduitStatus(status: Status): void {
  if (status === Status.NO_ADULT) {
    console.log("无审核");
  } else if (status === Status.MANAGER_ADULT_SUCCESS) {
    console.log("经理审核通过");
  } else if (status === Status.FINAL_ADULT_SUCCESS) {
    console.log("财务审核通过");
  }
}

enum Status {
  MANAGER_ADULT_FAIL = -1,
  NO_ADULT,
  MANAGER_ADULT_SUCCESS,
  FINAL_ADULT_SUCCESS,
}

getAduitStatus(Status.MANAGER_ADULT_SUCCESS);
```

枚举的使用 

```ts 
// 数字枚举
// 定义枚举
enum Week {
  Monday = 1,
  Tuesday,
  Wensday,
  Thirsday,
  Friday,
  Sarturday,
  Sunday,
}

// 取值
console.log(Week.Wensday); // 3
console.log(Week["Friday"]); // 5

// 反向取值
console.log(Week[3]); // "Wensday"

```

```ts
// 字符串枚举
// 定义枚举
enum Week {
  Monday = "monday",
  Tuesday = "tuesday",
  Wensday = "wensday",
  Thirsday = "thirsday",
  Friday = "friday",
  Sarturday = "sarturday",
  Sunday = 'sunday',
}

// 取值
console.log(Week.Wensday); // 'wensday'
console.log(Week["Friday"]); // 'friday'

// 不支持反向取值
```

底层原理：

```ts
//将键和值封装在一个自执行函数中
//枚举声明的变量实质为一个对象

//数字枚举
var Week;
(function (Week) {
    //通过两次赋值实现双重映射
    Week[Week["Monday"] = 1] = "Monday";
    Week[Week["Tuesday"] = 2] = "Tuesday";
    Week[Week["Wensday"] = 3] = "Wensday";
    Week[Week["Thirsday"] = 4] = "Thirsday";
    Week[Week["Friday"] = 5] = "Friday";
    Week[Week["Sarturday"] = 6] = "Sarturday";
    Week[Week["Sunday"] = 7] = "Sunday";
})(Week || (Week = {}));
// 取值
console.log(Week.Wensday); // 3
console.log(Week["Friday"]); // 5
// 反向取值
console.log(Week[3]); // "Wensday"


//字符串枚举
var Week;
(function (Week) {
    Week["Monday"] = "monday";
    Week["Tuesday"] = "tuesday";
    Week["Wensday"] = "wensday";
    Week["Thirsday"] = "thirsday";
    Week["Friday"] = "friday";
    Week["Sarturday"] = "sarturday";
    Week["Sunday"] = "sunday";
})(Week || (Week = {}));
// 取值
console.log(Week.Wensday); // 'wensday'
console.log(Week["Friday"]); // 'friday'
```

##### 其它特殊类型

`any`、`unknown`、`never`、`void`、`tuple`（元组）、可变元组

- `never`的使用场景：

  ```ts
  // never的使用场景
  type DataFlow = string | number;
  // type DataFlow = string | number | boolea| symbol;
  
  function dataFlowAnalysis(dataFlow: DataFlow) {
    // 对dataFlow的类型为不同值的判断和处理
    if (typeof dataFlow === "string") {
      console.log(dataFlow.toLowerCase());
    } else if (typeof dataFlow === "number") {
      console.log(dataFlow.toFixed(2));
      // 预留一条处理分支，避免dataFlow出现新的类型时，没有相应的处理分支而报错
    } else {
      // 此时data和dataFlow的类型为never
      let data = dataFlow;
    }
  }
  
  dataFlowAnalysis("Hello");
  dataFlowAnalysis(12.212121);
  
  ```

- `any`和`unknown`的区别和应用场景

  - `any`和`unknown`可以是任意类型的父类型，任意类型的值都可以赋值给`any`或者`unknown`类型的变量

  - `any`也可以是任意类型的子类型，但是`unknown`不可以。`any`类型的值可以赋值给其它任意类型的变量

  - `any`的应用场景：自定义守卫；需要进行`as any`断言的场景；通过`any`获取`any`类型的属性和`any`类型的方法，例如获取从后端获取到的响应值中的数据（`any`类型）

  - `unknown`的应用场景：接收任意类型的变量实参，但是在函数内不进行获取该实参属性的操作，只用于传递或者输出

    ```ts
    let num: Array<number> = [1, 2, 3];
    let data: any = num;
    data = 'hello';
    data = null;
    data = undefined;
    
    let data1: any = 'hello';
    data1 = 1;
    data1 = false;
    let num1: number = data1;
    
    //使用any获取后端返回的any类型的数据
    const data = fetch();
    const books : Books[] = data;
    ```

    ```ts
    let data: unknown = [1, 2, 3];
    data = 'hello';
    
    // let name: string = data; //报错
    
    
    function logData(data: any) {
        console.log(data.name);
    }
    // 不可以通过unknown来获取任意类型的属性或方法
    function logData(data: unknown) {
    //   console.log(data.name); // 报错
    }
    //可以用于值的传递
    function getValue(key?: unknown) {
        return doGetValue(key);
    }
    ```
  
- 元组

  - 满足以下三点的为元组：

    - 定义时，每个元素的类型都确定
    - 元素值的类型与定义的类型一一对应
    - 元素的个数和定义时的个数相同

    ```ts
    // 默认元素，元素的个数和类型均固定，且一一对应
    const datas : [string, number, boolean, number] = ['hello', 1, false, 1]
    ```

    ```ts
    // 可变元组
    let dynamicTruple: [string, number, number, ...any[]];
    dynamicTruple = ["hello", 1, 1, "Alice", false, 12];
    console.log(dynamicTruple[0]); // "hello"
    console.log(dynamicTruple[5]); // 12
    
    dynamicTruple = ["hello", 1, 2];
    
    // 解构元组
    const [username, age, phone, ...rest]: [string, number, string, ...any[]] = [
      "Alice",
      12,
      "123",
      "hello",
      false,
      1,
    ];
    console.log(username); // 'Alice'
    console.log(age); // 12
    console.log(phone); // '123'
    console.log(rest); // [ 'hello', false, 1 ]
    ```
    
    ```ts
    // 元组取值的方式（同数组）
    // 根据索引取值，解构取值
    // 索引取值
    const testTruple: [string, number, number, ...any[]] = ["hello", 1, 2, "hi", 3];
    console.log(testTruple[0]); // 'hello'
    console.log(testTruple[3]); // 'hi'
    
    //解构取值
    const [text1, num1, num2, others] = testTruple;
    console.log(text1, num1, num2, others); // 'hello' 1 2 'hi'
    //使用剩余参数
    const [text12, num12, num22, ...others2] = testTruple;
    console.log(text12, num12, num22, others2); // 'hello' 1 2 [ 'hi', 3 ]
    
    ```
    
    ```ts
    // 元组标签
    // 便于代码的阅读和理解
    const [username, age, address, ...rest]: [
      username: string,
      age: number,
      address: string,
      ...rest: any[]
    ] = ["Alice", 12, "some place", 12, "hi"];
    
    ```

##### 合成类型

联合类型、交叉类型

```ts
// 联合类型
let data: string | number = 3;
console.log(data); // data的类型在被赋值3之后会被具体确定为number类型

// 交叉类型
type Obj1 = {
    name: string;
};
type Obj2 = {
    age: number;
};

const obj: Obj1 & Obj2 = {
    name: 'Alice',
    age : 12,
}
```

手写一个通用的交叉类型方法：

```ts
//函数重载
function crossType<T extends Object, U extends Object>(obj1: T, obj2: U): T & U;
function crossType<T extends Object, U extends Object, Z extends object>(
  obj1: T,
  obj2: U,
  obj3: Z
): T & U & Z;
//函数实现
function crossType<T extends Object, U extends Object, Z extends object>(
  obj1: T,
  obj2: U,
  obj3?: Z
): T & U & Z {
  const combine = {} as T & U & Z;
  union(combine, obj1);
  union(combine, obj2);
  union(combine, obj3);
  return combine;
}
function union(combine: any, curobj: any) {
  for (let key in curobj) {
    combine[key] = curobj[key];
  }
  return combine;
}

type Type1 = {
  a: string;
  b: number;
};
type Type2 = {
  c: number;
  d: string;
};
type Type3 = {
  e: boolean;
};

const obj1: Type1 = { a: "hello", b: 1 };
const obj2: Type2 = { c: 2, d: "hi" };
const obj3: Type3 = { e: false };
console.log(crossType(obj1, obj2)); // { a: 'hello', b: 1, c: 2, d: 'hi' }
console.log(crossType(obj1, obj2, obj3)); // { a: 'hello', b: 1, c: 2, d: 'hi', e: false }
```



##### 字面量数据类型

```ts
//  字面量数据类型
type IncreaseFlag = 0 | 1;

function isStartUp(increase: IncreaseFlag) {
  if (increase) {
    console.log("open");
  } else {
    console.log("close");
  }
}
isStartUp(1);
```

##### 接口：`interface`

```ts
// 接口
// 接口中的属性没有具体的值，方法没有具体的实现
interface Product {
  name: string;
  price: number;
  account: number;
  buy(): void;
  buy3(count: number): number;
  buy1: () => void;
  buy2: (count: number) => number;
}


// 接口可以继承
// 但是type不可以进行继承
interface Pet {
  name: string;
  love: number;
  health: number;
  toHospital(): void;
}
interface Dog extends Pet {
  strain: string;
  guardHome(): void;
}


// 可索引签名
interface Person {
  name: string;
  age: number;
  // 索引签名，表示可以额外添加任意个值的类型为any的属性（值的类型要兼容所有已存在属性值的类型），键的类型可以为string或者symbol
  [key: string]: any;
//[key: string]: string | number;
}

const person: Person = {
  name: "Alice",
  age: 12,
  // 可索引签名类型的实现
  loves: 1,
  gender: "female",
  true: 1,
  [Symbol("newAttr")]: "100",
};
```

同名的接口会自动合并：

```ts
interface Person {
  name: string;
  age: number;
}

interface Person {
  gender: string;
}

// 以上等价于
interface Person {
  name: string;
  age: number;
  gender: string;
}

```

索引访问类型：

```ts
const symId = Symbol("productNum");

interface Product {
  [symId]: number | boolean;
  name: string;
  price: number;
  account: number;
  buy(): string;
  1: number | boolean;
  true : boolean;
}

// 索引访问类型
// 通过接口中的键类型来创建新的类型
// 通过接口的键来获取值的类型，并以此来创建一个新类型
type A = Product["price"]; // A的类型为number
type B = Product["price" | "name"]; // B的类型为string | number
//对于symbol类型的键，需要使用typeof来获取类型
type S = Product[typeof symId]; // S的类型为number | boolean
type F = Product["buy"]; // F的类型为() => string
type D = Product["1"]; // D的类型为number | boolean
type E = Product['true']; // E的类型为boolean

//使用keyof迭代Product中的所有键类型
type ProductKeys = keyof Product; //ProductKeys的类型为 "name" | "price" | "account" | "buy" | typeof symId
let prodocuKey1: ProductKeys = "account";
let prodocuKey2: "name" | "price" | "account" | "buy" | typeof symId = "buy";


interface Product {
  name: string;
  [symId]: number | boolean;
  price: number;
  account: number;
  buy(): string;
  "1": number;
  true: boolean;
  // 1: number; //不会被获取
}
type AllKeys<T> = T extends any ? T : never;
type ProductKeys2 = AllKeys<keyof Product>;

// 获取指定接口中所有键的类型
type InterfaceKeys<T> = T extends string | symbol ? T : never;
type ProductKeys = InterfaceKeys<keyof Product>;

// 获取指定对象中string类型键的类型
type InterfaceStringKeys<T> = T extends string ? T : never;
type ProductStringKeys = InterfaceStringKeys<keyof Product>;

```

`interface`和`type`的区别：

- `interface`只能定义对象的类型或者以接口当名字的函数的类型；`type`能够定义任意类型，包括基础类型、联合类型、交叉类型、元组

  ```ts
  type MyNumber = number;
  type BaseType = string | number;
  
  
  interface Person {
      name: string, 
      age : number,
  }
  interface Product {
      num: number,
      price : number,
  }
  // 使用type定义联合类型
  type Union = Person | Product;
  // 使用type定义元组类型
  type Truple = [Person, Product];
  ```

- `interface`可以继承（`extends`）或者实现(`implements`)一个或多个其它接口或类，也可以继承`type`；`type`无继承功能

- `type`可以进行交叉合并；`interface`不可以

  ```ts
  type Group = {
    name: string;
    num: number;
  };
  type GroupInfoLog = {
    info: string;
    happen: string;
  };
  //交叉合并类型
  type GroupMember = Group & GroupInfoLog;
  
  const data: GroupMember = {
      name: "001",
      num : 1,
      info: 'xxx',
      happen : 'xxx',
  }
  ```

- `interface`可以进行同名接口的合并声明，`type`不可以

  ```ts
  interface Error {
      name : string,
  }
  interface Error {
      message : string,
  }
  const err: Error = {
      name: 'xxx',
      message : 'xxx',
  }
  ```

### 类和静态属性

TS中的类和ES6中类的区别

```ts
type OrderDetail = string;
// TS中的类
// 添加属性的方式：在类中定义属性字段后，然后在构造函数中通过this赋值
// 或者，直接在构造函数的参数前面添加public关键字，相应的参数就成为类的属性，不需要通过this来赋值
//TS中的类还可以当作一种类型来使用
class Order {
  iphone: number;
  iorderDetailArray: Array<OrderDetail>;
  // 静态属性，专属于类Order本身，通过Order来进行访问或修改，所有的类实例访问进行访问时都是同一个值
  static count: number = 0;
  constructor(
    public iorderId: number,
    public idate: Date,
    public icustomName: string,
    iphone: number,
    iorderDetailArray: Array<OrderDetail>
  ) {
    this.iphone = iphone;
    this.iorderDetailArray = iorderDetailArray;
    // 修改静态属性
    Order.count++;
  }

  get orderId(): number {
    return this.iorderId;
  }
}
console.dir(new Order(1, new Date(), "Alice", 1223, ["hi"]));
```

类中静态成员的应用：

```ts
// 类中静态属性和静态方法的应用
// 存在一个日期格式化工具的类
// 要访问其中的方法时，不管访问多少次，总的就只需要创建一个类的实例即可，通过该实例进行访问
// 实现方式：将类中的内容设置为静态成员，不需要创建类的实例，通过类本身来访问即可，类似于把类当作一个普通对象来访问对象方法
//          或者使用单例模式

class DateUtils {
  static formatDate() {}
  static diffDateByDay() {}
  static timeConvert() {}
  static diffDateByHour() {}
}
// 进行访问
DateUtils.formatDate();
```

使用TS实现一个单例模式：

```ts
//两种方式创建
//创建方式一
//立即创建式
class DateUtils {
  static dateUtils = new DateUtils();
  private constructor() {}
  formatDate() {
    console.log("formatDate");
  }
  diffDateByDay() {}
  timeConvert() {}
  diffDateByHour() {}
}

// 获取该类唯一的一个实例
const dateUtil1 = DateUtils.dateUtils;
const dateUtil2 = DateUtils.dateUtils;
console.log(dateUtil1 === dateUtil2); // true
dateUtil1.formatDate(); // "formatDate"


//创建方式二
class DateUtils {
  static dateUtils: DateUtils;
  static getInstance() {
    console.log("获取类实例");
    if (!this.dateUtils) {
      this.dateUtils = new DateUtils();
    }

    return this.dateUtils;
  }
  private constructor() {}
  formatDate() {
    console.log("formatDate");
  }
  diffDateByDay() {}
  timeConvert() {}
  diffDateByHour() {}
}

// 获取该类唯一的一个实例
const dateUtil1 = DateUtils.getInstance();
const dateUtil2 = DateUtils.getInstance();
console.log(dateUtil1 === dateUtil2); // true
dateUtil1.formatDate(); // "formatDate"

```

getter和setter

```ts
// getter和setter
class Person {
  name: string;
  _age!: number;
  gender: string;
  constructor(name: string, gender: string) {
    this.name = name;
    this.gender = gender;
  }
  get age() {
    return this._age;
  }

  set age(val: number) {
    if (val >= 0 && val <= 200) {
      this._age = val;
    } else {
      throw Error("age值不符合规范");
    }
  }
}

const person = new Person("Alice", "female");
console.log(person.name, person.gender); // "Alice" "female"
person.age = 12;
console.log(person.age);  // 12

```

案例：实现一个方法拦截器：

```ts
class Person {
  name: string;
  _age!: number;
  gender: string;
  constructor(name: string, gender: string) {
    this.name = name;
    this.gender = gender;
  }
  get age() {
    return this._age;
  }
  set age(val: number) {
    if (val >= 0 && val <= 200) {
      this._age = val;
    } else {
      throw Error("age值不符合规范");
    }
  }
  sayHello(times: number) {
    console.log(`${this.name} is saying hello, said ${times} times`);
  }
}

// 对类中的sayHello方法进行拦截，然后进行扩展
interface CalculateExecuteTimeOption {
  startTime: number;
  executeBefore: () => void;
  executeAfter: () => void;
}
//要在原有方法上进行扩展的内容
const calculateExecuteTimeOption: CalculateExecuteTimeOption = {
  startTime: 0,
  //原有方法执行前执行
  executeBefore() {
    console.log("函数开始执行");
    this.startTime = new Date().getTime();
  },
  //原有方法执行后执行
  executeAfter() {
    console.log("函数执行完毕");
    const executeTime = new Date().getTime() - this.startTime;
    console.log(`函数执行总耗时: ${executeTime} ms`);
  },
};

// 通过原型获取类Person中sayHello方法的属性描述符
const dataProp: PropertyDescriptor = Object.getOwnPropertyDescriptor(
  Person.prototype,
  "sayHello"
)!;
// 获取类中初始的的sayHello方法
const targetMethod = dataProp.value;
// 进行方法的扩展
dataProp.value = function (...args: any[]) {
  const option: CalculateExecuteTimeOption = calculateExecuteTimeOption;
  //前置拦截
  option.executeBefore();
  // 执行初始的sayHello方法
  targetMethod.apply(this, args);
  // 后置拦截
  option.executeAfter();
};

// 实现通过调用person.sayHello()也能完成上上面内容的功能（等同于调用dataProp.value()）
// 将Person构造函数的原型属性对象中的sayHello的值改为dataProp.value，然后将其继承给类的实例
Person.prototype.sayHello = dataProp.value;

const person = new Person("Alice", "female");
person.sayHello(9);
// 函数开始执行
// Alice is saying hello, said 9 times
// 函数执行完毕
// 函数执行总耗时: 1 ms

```

类继承的案例：

```ts
//继承的案例
class Pay {
  bankCardNum: string; // 银行卡卡号
  balance: number; // 银行卡余额
  cost: number; // 消费的金额
  tokenId: string; // 用户访问令牌
  constructor(
    bankCardNum: string,
    balance: number,
    cost: number,
    tokenId: string
  ) {
    this.bankCardNum = bankCardNum;
    this.balance = balance;
    this.cost = cost;
    this.tokenId = tokenId;
  }
  pay() {}
}
enum PayType {
  WebChat = 1, // 微信支付
  AliPay = 2, // 支付宝支付
  CloudFlashPayment = 3,
}

// 银行卡支付
class BankPay extends Pay {
  bankNetwork: string = ""; // 银行网点
  bankCardType: string = ""; //银行卡类型
  bankCardPsw: string = ""; // 银行卡密码
  customName: string = ""; //顾客姓名
}

//移动端支付
class MobilePay extends Pay {
  type: PayType; //支付类型
  change: number; // 支付平台零钱
  opendId: string;
  appId: string;
  constructor(
    type: PayType,
    change: number,
    opendId: string,
    appId: string,
    bankCardNum: string,
    balance: number,
    cost: number,
    tokenId: string
  ) {
    super(bankCardNum, balance, cost, tokenId);
    this.type = type;
    this.change = change;
    this.opendId = opendId;
    this.appId = appId;
  }
}
const mobilePay1 = new MobilePay(
  PayType.WebChat,
  1000000,
  "34%#&2&**TYYdeewe",
  "213242314123",
  "09108929831",
  99999999,
  11111,
  "%%2371283wedfewh&^"
);
console.log(mobilePay1);

```

### 配置文件



