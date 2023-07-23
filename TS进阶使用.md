## TS进阶使用

### 类型守卫

#### 类型断言

```ts
// 伪代码
// let b: B;
// let c: C = b as C;
// 将b的类型断言为C，同时绕过此处的类型检查
```

案例：

```ts
// 汽车类
export class Car {
  count: number = 3;
  brand: string; // 汽车品牌
  carNo: string; // 车牌号
  rentDays: number; // 租赁天数
  totalRental: number = 0; //总租金
  constructor(brand: string, carNo: string, rentDays: number) {
    this.brand = brand;
    this.carNo = carNo;
    this.rentDays = rentDays;
  }

  // 打印租赁信息
  logRentalInfo() {
    console.log(this.brand + "车牌号为:" + this.carNo + "开始被租");
  }
}

// 小轿车类
// 继承子Car类
class Sedan extends Car {
  sedanType: string; //小轿车型号
  constructor(
    brand: string,
    carNo: string,
    rentDays: number,
    sedanType: string
  ) {
    super(brand, carNo, rentDays);
    this.sedanType = sedanType;
  }

  // 根据小轿车的型号来返回单日的租金
  public getDayRentalBySedanType() {
    let dayRental: number = 0;
    if (this.sedanType === "大圣") {
      dayRental = 800;
    } else if (this.sedanType === "捷途") {
      dayRental = 400;
    } else if (this.sedanType === "冰淇淋") {
      dayRental = 200;
    }
    return dayRental;
  }

  // 根据租赁天数以及单日租金来计算总的租金
  getCalculatedTotalRental(): number {
    super.logRentalInfo();
    console.log(
      "小轿车租金，型号为：" + this.sedanType + ",租赁天数为：" + this.rentDays
    );
    return this.rentDays * this.getDayRentalBySedanType();
  }
}

// 顾客类
class Customer {
  // 进行租赁
  rent(car: Car) {
    console.log("sedanType" in car);
    let sedan = car as Sedan;
    console.log("sedan.type:", sedan.sedanType);
    return this.getTotalRentalTobePaid(sedan);
  }
  // 计算顾客应付的租金数
  getTotalRentalTobePaid(sedan: Sedan) {
    return sedan.getCalculatedTotalRental();
  }
}

const customer = new Customer();
const car: Car = new Sedan("奇瑞", "沪A888", 18, "冰淇淋");
console.log(customer.rent(car));

// 类型断言
// const sedan: Sedan = car as Sedan;
// 等价于
// 类型转换，将一种类型强制转换为另一种类型
const sedan: Sedan = <Sedan>car;
console.log(sedan.getCalculatedTotalRental());
```

#### `typeof`的局限性和替代方案

`typeof`可检测出的类型包括："string"、"number"、"bigint"、"boolean"、"symbol"、"undefined"、"object"、"function"

其局限性为，对于例如Array、Set和Map类型的数据，其检测出的结果为`"object"`

```js
console.log(typeof new Array()); //"object"
console.log(typeof new Set()); //"object"
console.log(typeof new Map()); //"object"
```

替代方案：

```js
console.log(Object.prototype.toString.call(new Array())); // [object Array]
console.log(Object.prototype.toString.call(new Set())); // [object Set]
console.log(Object.prototype.toString.call(new Map())); // [object Map]
```

#### 类型守卫（类型收窄）

通过`instanceof`、`in`、`typeof`、`==`、`===`、!==、`!===`等对多种类型的情况进行收窄

```ts
class Customer {
  pay(payMethod: BankPay | MobilePay) {
    // 进行类型收窄
    // 使用instanceof判断
    // if (payMethod instanceof BankPay) {
    // } else if (payMethod instanceof MobilePay) {
    // }

    // 使用in判断
    if ("appId" in payMethod) {
    } else if ("bankCardType" in payMethod) {
    }
  }
}
```

自定义类型守卫

```ts
// 创建一个自定义的类型守卫，用于对payMethod的类型为BankPay还是MobilePay的判断
function isMobilePay(payMethod: BankPay | MobilePay): payMethod is MobilePay {
  // 使用instanceof判断
  return payMethod instanceof MobilePay;
}
function isBankPay(payMethod: BankPay | MobilePay): payMethod is BankPay {
  // 使用instanceof判断
  return payMethod instanceof BankPay;
}
class Customer {
  pay(payMethod: BankPay | MobilePay) {
    // 进行类型收窄

    // 使用自定义的类型守卫判断
    if (isBankPay(payMethod)) {
    } else if (isMobilePay(payMethod)) {
    }
  }
}
```

### 泛型

#### 泛型概述

特点

- 定义时不能明确类型，在使用时明确具体类型
- 类型需要被复用，例如在一个接口的多个地方被使用
- 编译期间进行数据类型检查
- 命名时以A-Z之间的任意一个字母或者一个任意的语义化单词来命名

```ts
// 定义时不能明确泛型T的具体类型
interface Ref<T> {
  value: T;
  datas: T[];
}
// 使用时明确
//字符串类型的ref值
// 泛型T的具体类型为string
const ref1: Ref<string> = {
  value: "hello",
  datas: ["hello"],
};

//Person类型的ref值
type Person = {
  name: string;
  age: number;
};
const ref2: Ref<Person> = {
  value: {
    name: "Alice",
    age: 12,
  },
  datas: [
    {
      name: "Alice",
      age: 12,
    },
  ],
};

```

泛型在类中的使用：

```ts
class ArrayList<T> {
    arr: Array<T>;
    constructor() {
        this.arr = [];
    }
    pushValue(val: T) {
        this.arr.push(val);
    }
    popValue() {
        return this.arr.pop();
    }
}

const arrList1 = new ArrayList<string>();
arrList1.pushValue("hello");
console.log(arrList1.popValue()); // "hello"

const arrList2 = new ArrayList<number>();
arrList2.pushValue(2);
console.log(arrList2.popValue()); // 2
```

泛型默认值：

```ts
interface Ref<T = any> {
  value: T;
  datas: T[];
}
```

泛型约束

```ts
// 泛型约束
interface Order {
  orderId: number;
  orderName: string;
}

// 默认情况下，给泛型T传递类型实参时能够传递任意的类型
// 这里通过extends进行泛型约束，传递时只能传递object类型
type GetPropKeysType<T extends object> = keyof T;
// 使用T泛型，并传递类型实参
type OrderPropKeys = GetPropKeysType<Order>;
// OrderPropKeys的值为"orderId" | "orderName"

type PersonPropKeys = GetPropKeysType<{ username: string; age: number }>;
// PersonPropKeys的值为"username" | "age"
```

```ts
// 定义两个泛型，T约束于object，K约束于T的键类型
class ObjectRefImplement<T extends object, K extends keyof T> {
  public readonly __v_isRef: boolean = true;
  // 传入目标对象和键名作为参数
  constructor(private readonly _object: T, private readonly _key: K) {}
  // 根据传入的键名从传入的目标对象中取值
  get value() {
    return this._object[this._key];
  }
  // 根据传入的键名和在传入的目标对象中设置新值
  set value(newVal: T[K]) {
    this._object[this._key] = newVal;
  }
}

type Obj = {
    username: string;
    age: number;
}

// 从目标对象类型上获取指定的键类型
// 先判断的泛型K是否在泛型T对应的对象上，是则返回K，否则返回never(表示目标对象上不存在该键)
type GetPropKeyType<T extends object, K> = K extends keyof T ? K : never;
type ObjPropKey1 = GetPropKeyType<Obj, "username">;
// ObjPropKey1的值为"username"
type ObjPropKey2 = GetPropKeyType<Obj, "age">;
// ObjPropKey2的值为"age"

// 以此可以来获取目标对象上指定键的值类型
type GetPropValueType<T extends object, K> = K extends keyof T ? T[K] : never;
type ObjPropValue1 = GetPropValueType<Obj, 'username'>;
// ObjPropValue1的值为string
type ObjPropValue2 = GetPropValueType<Obj, 'age'>;
// ObjPropValue2的值为number

const obj: Obj = { "username": 'Alice', age: 12 }
const objectRefImplement = new ObjectRefImplement<Obj, "age">(obj, "age");
console.log(objectRefImplement.value); // 12
objectRefImplement.value = 11;
console.log(objectRefImplement.value); // 11

// 泛型的反向推导
// 自动根据"age"推导K出的具体类型为"age"
// 不需要手动指定<Obj, "age">
const obj: Obj = { "username": 'Alice', age: 12 }
const objectRefImplement = new ObjectRefImplement(obj, "age");
console.log(objectRefImplement.value); // 12

export {};
```

泛型在函数中使用：

```ts
// 在函数中使用泛型
// 一个快速排序法的函数
function quickSort<E>(arr: Array<E>): Array<E> {
  if (arr.length < 2) return arr;
  let left: Array<E> = [];
  let right: Array<E> = [];
  let middle: E = arr.splice(Math.floor(arr.length / 2), 1)[0];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < middle) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return quickSort(left).concat(middle, quickSort(right));
}

const unorderedNums = [3, 1, 7, 9, 5, 45, 23, 10, 50, 20, 22, 13];
console.log(quickSort<number>(unorderedNums));

const unorderedStrs = ["hello", "hi", "text", "come"];
const orderedStrs = quickSort<string>(unorderedStrs);
console.log(orderedStrs);

```

### 映射类型

```ts
// 映射类型
// 使用in关键字
// 基本使用
interface Person {
  name: string;
  age: number;
}

type KeysValuesOfPerson = {
  [P in "name" | "age"]: Person[P];
};
// KeysValuesOfPerson的值为
// {
//   name: string;
//   age: number;
// }

// 结合条件类型使用，排除不需要的属性
interface Todo {
  title: string;
  completed: boolean;
  description: string;
}
// E表示要排除的属性
type MyOmit<T, E extends keyof T> = {
    // 先取出T中所有的键类型,如果该键类型继承自E,表示要排除的,则将其断言为never
    // 否则,保持其类型为P
  [P in keyof T as P extends E ? never : P]: T[P];
  // 或者
  // [P in keyof T as Exclude<P, E>]: T[P];
};
type MyOmitForTodo = MyOmit<Todo, "title">;
// MyOmitForTodo的值为
// {
//   completed: boolean;
//   description: string;
// }

```

### 函数重载

使用函数重载来解决函数参数或返回值多情况的问题：

```ts
type Message = {
  id: string;
  type: MessageType;
  content: string;
};
enum MessageType {
  "Image" = 1,
  "Audio" = 2,
}

const messages: Message[] = [
  {
    id: "1",
    type: MessageType.Image,
    content: "content1",
  },
  {
    id: "2",
    type: MessageType.Image,
    content: "content2",
  },
  {
    id: "3",
    type: MessageType.Audio,
    content: "content3",
  },
];

function getMessage(
  key: MessageType | string
): Message | undefined | Message[] {
  // 根据id进行获取，返回唯一的message
  if (typeof key === "string") {
    return messages.find((message) => message.id === key);
    // 根据type进行获取，返回一个或多个message
  } else {
    return messages.filter((message) => message.type === key);
  }
}
console.log(getMessage(MessageType.Image));
// [
//   { id: 1, type: 1, content: "content1" },
//   { id: 2, type: 1, content: "content2" },
// ];

console.log(getMessage("1"));
// { id: '1', type: 1, content: 'content1' }

```

使用函数重载：

```ts
// 现在创建一个函数来搜索指定的message并返回
// 使用函数重载
// 重载签名
// 每个重载签名维护当前情况分支的参数和返回值类型
// 根据type来进行搜索的情况
function getMessage(key: MessageType): Message[];
// 根据id来进行搜索的情况
function getMessage(key: number): Message | undefined;

// 实现签名
// 根据上面维护的不同情况，进行全部的具体函数逻辑实现
// 实现签名的参数类型和返回值类型要与所有重载签名的兼容
function getMessage(
  key: MessageType | number
): Message | undefined | Message[] {
  // 根据id来搜索
  //自动对应其相应的重载签名
  if (typeof key === "string") {
    return messages.find((message) => message.id === key);
    // 根据type来搜索
    // 自动对应其相应的重载签名
  } else {
    return messages.filter((message) => message.type === key);
  }
}

// 自动根据重载签名判断出当前返回值的类型为Message[]
getMessage(MessageType.Image).forEach((message) => console.log(message));

// 自动根据重载签名判断出当前返回值的类型为Message | undefined
console.log(getMessage('1'));
```

泛型函数重载：

```ts
// 实现中文字符数组排序
const unorderedCities = [
  "武汉",
  "石家庄",
  "郑州",
  "太原",
  "济南",
  "沈阳",
  "大连",
];

// 对以上的数组进行排序
function sortCities(cities: Array<string>): Array<string> {
  return cities.sort(function (prevCity, curCity) {
    return prevCity.localeCompare(curCity, "zh-CN");
  });
}

console.log(sortCities(unorderedCities));
// ["大连", "济南", "沈阳", "石家庄", "太原", "武汉", "郑州"];

// 判断是否为中文字符数组
function isChineseStrs(arr: Array<string>): boolean {
  const pattern = /[\u4e00-\u9fa5]+/g;
  return arr.some(function (item) {
    return pattern.test(item);
  });
}

// 实现字符串自排序
function strSelfSort(str: string): string {
  const strArr = str.split("");
  const orderedStrArr = quickSort<string>(strArr);
  return orderedStrArr.join("");
}
console.log(strSelfSort("dewewfewoieqw"));

function quickSort<E>(arr: Array<E>): Array<E> {
  if (arr.length < 2) return arr;
  let left: Array<E> = [];
  let right: Array<E> = [];
  let middle: E = arr.splice(Math.floor(arr.length / 2), 1)[0];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < middle) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return quickSort(left).concat(middle, quickSort(right));
}


// 实现中英文字符串数组、字符串自排序
// 根据以上不同函数的结合，进行函数重载
function comprehensiveSort1<T>(data: T): string | undefined;
function comprehensiveSort1<T>(data: T): Array<any> | undefined;
function comprehensiveSort1<T>(data: T): Array<any> | string | undefined {
  if (data instanceof Array) {
    // 排序中文字符串数组
    if (isChineseStrs(data)) {
      return sortCities(data);
      // 排序英文字符串数组
    } else {
      return quickSort(data);
    }
    // 排序字符串
  } else if (typeof data === "string") {
    return strSelfSort(data);
  }
}
console.log(comprehensiveSort1(unorderedCities));
console.log(comprehensiveSort1(["hello", "hi", "text", "come"]));
console.log(comprehensiveSort1<string>("deqodysoxsyep"));

```

### `infer`关键字

使用`infer`获取一个函数的参数和返回值类型

```ts
// 使用infer关键字获取一个函数的参数或者返回值类型
interface Person {
  name: string;
  age: number;
}
type PersonFunc = (param: Person) => number;


// 获取PersonFunc类型中参数的类型
// infer P为一个占位符，表示获取param的类型，并将其赋值给P
// 先进行条件判断PersonFunc extends (param: infer P) => number
// 判断(param: infer P) => number类型是否与PersonFunc类型相匹配
// 匹配则返回P，参数param的类型；否则，返回PersonFunc类型
type PersonFuncPram1 = PersonFunc extends (param: infer P) => number
  ? P
  : PersonFunc;
// 条件判断为true
// PersonFuncPram1的值为Person

// 获取PersonFunc类型中参数的类型
type PersonFuncPram2 = PersonFunc extends (param: infer P) => string
  ? P
  : PersonFunc;
// 条件判断为false
// PersonFuncPram2的值为 (param: Person) => number


// 同理，获取上述PersonFunc函数中返回值的类型
type PersonFuncPram2 = PersonFunc extends (param: infer R) => string
  ? R
  : PersonFunc;
// 条件判断为false
// PersonFuncPram2的值为 (param: Person) => number

// 通用式写法
type GetReturnType<T> = T extends (param: any) => infer R ? R : never;
type PersonReturn = GetReturnType<PersonFunc>;
// GetReturnType的值为number
```

使用`infer`获取一个数组中元素的类型

```ts
// 先进行条件判断，确保泛型T类型为一个数组，然后再进行元素类型的获取
type GetArrayElementType<T> = T extends Array<infer E> ? E : never;

type ArrayElement1 = GetArrayElementType<Array<number>>;
// ArrayElement1的值为number
type ArrayElement2 = GetArrayElementType<Array<{name : string, age : number}>>;
// ArrayElement2的值为
// {
//   name: string;
//   age: number;
// }
```

```ts
// 使用infer来确定unref函数的返回值类型
// T extends Ref<infer V> ? V : T
// 如果传入给unref的数据（参数）为一个Ref类型（为一个ref对象），T extends Ref<infer V>判断为true，则返回值类型为该ref对象的.value值的类型
// 否则，就直接为该传入的参数的类型
function unref<T>(ref: T): T extends Ref<infer V> ? V : T {
  return isRef(ref) ? (ref.value as any) : ref;
}
```

### 泛型递归

```ts
// P in keyof Interface1 递归Interface1中所有的键类型，然后将其赋值给P
interface Person {
  name: string,
  age : number,
}
type PersonKeyValue = {
  // P in keyof Person递归获取Person中所有键类型
  // Person[P]获取对应键的值类型
  [P in keyof Person]: Person[P];
};
// PersonKeyValue的值为
// {
//   name: string,
//   age : number,
// }
```

扁平模块化属性名：

```ts
type Methods = {
  menu: {
    setActiveIndex: (index: string) => string;
    setCollapse: (index: string) => string;
  };

  tabs: {
    setEditableTabsValue: (editable: string) => void;
    setTabs: (index: string) => void;
    setTabList: (index: string) => void;
  };
};

// 封装一个类型，能够获取指定的嵌套类型中所有的类型，并使用指定的字符串格式来进行显示
// 使用模板字符串进行值的拼接，形成指定的字符串格式
// P代表父类型，C代表子类型
type SpliceValues<P, C> = `${P & string}/${C & string}`; // 最后的结果为例如："menu/setActiveIndex"
type GetNestedValueTypesForMenu = SpliceValues<
  "menu",
  "setActiveIndex" | "setCollapse"
>;
// GetNestedValueTypesForMenu的值为"menu/setActiveIndex" | "menu/setCollapse"



// 封装成通用的写法
// [keyof T]表示在SpliceValues<K, keyof T[K]>最后的结果中只取keyof T[K]部分
type GetNestedTypesForMethodsValue<T> = {
  [K in keyof T]: SpliceValues<K, keyof T[K]>;
}[keyof T];

type GetNestedTypes<T> = {
    [K in keyof T] : SpliceValues<K, keyof T[K]>
}
type GetNestedTypesForMethods = GetNestedTypes<Methods>;
// GetNestedTypesForMethods的值为
// {
//   menu: "menu/setActiveIndex" | "menu/setCollapse";
//   tabs: "tabs/setEditableTabsValue" | "tabs/setTabs" | "tabs/setTabList";
// }
// 对应上面Methods类型中属性扁平化后的结果
```

### 条件类型

```ts
type Cond<T> = T extends string | number ? T : never;
type ForTest = string | number | boolean;

type Test = Cond<ForTest>;
// Test的值为string | number
// 以上等价于
// type Test = Cond<string> | Cond<number> | Cond<boolean>;

type Test1 = string | number | boolean extends string | number ? string : never;
// Test1的值为never

```

抽离相同的条件类型判断逻辑：

```ts
function crossType<T extends object, U extends object>(obj1: T, obj2: U): T & U;
function crossType<T extends object, U extends object, Z extends object>(
  obj1: T,
  obj2: U,
  obj3: Z
): T & U & Z;
function crossType<T extends object, U extends object, Z extends object>(
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

// 将上述判断T、U和Z泛型是否继承自objec的代码进行抽离
type CrossType<T> = T extends object ? T : never;
function crossType1<T, U>(obj1: CrossType<T>, obj2: CrossType<U>): T & U;
function crossType1<T, U, Z>(
  obj1: CrossType<T>,
  obj2: CrossType<U>,
  obj3: CrossType<Z>
): T & U & Z;
function crossType1<T, U, Z>(obj1: T, obj2: U, obj3?: Z): T & U & Z {
  const combine = {} as T & U & Z;
  union(combine, obj1);
  union(combine, obj2);
  union(combine, obj3);
  return combine;
}

```

向一个已有的接口中添加新属性：

```ts
interface Person {
    name: string;
    age: number;
}

// 向以上的接口新增属性

// 创建一个用于向指定接口中新增属性的类型
// T表示指定的目标接口，K表示新属性键的类型，V表示新属性的值
type NewAttrToInterface<T, K extends string | symbol, V> = {
    // 取出目标接口和新属性的键
    // 如果取出的键为目标接口中已有的键，则给该键赋值为目标接口中已有的对应的值（T[P]）
    // 如果取出的键为新属性的键，则给该键赋值为对应的新属性的值（V）
    [P in keyof T | K]: P extends keyof T ? T[P] : V;
}
type NewPerson = NewAttrToInterface<Person, "address", 'new address'>;
// NewPerson的值为：
// {
//   address: "new address";
//   name: string;
//   age: number;
// }
```

`Extract`和`Exclude`

```ts
// Extract为底层提供的一个基本条件类型的简写
// 可以理解为从前者提取出所有后者中存在的类型
// type Extract<T, U> = T extends U ? T : never;
type TestExtract = Extract<string | number | boolean, string | number>; // TestExtract的值为string | number

// 即
type TestExtract1 =
  | Extract<string, string | number>
  | Extract<number, string | number>
  | Extract<boolean, string | number>;
// TestExtract1的值为string | number

// 以上等价于
type TestExtract2 =
  | (string extends string | number ? string : never)
  | (number extends string | number ? number : never)
  | (boolean extends string | number ? boolean : never);
// TestExtract2的值为string | number



// Exclude也是底层提供的一个基本条件类型的简写，并且其刚好相反于Extract
// 可以理解为从前者提取出所有后者中不存在的类型
// type Exclude<T, U> = T extends U ? never : T;
type TestExclude = Exclude<string | number | boolean, string | number>; // TestExclude的值为boolean
```

优化`keyof`

```ts
// 优化keyof
interface Person {
    name: string,
    age: number,
    gender : string,
}
// 默认情况下，无法直接显示KeysOfPerson的具体的类型
type KeysOfPerson = keyof Person;
// KeysOfPerson的值为keyof Person

// 现在进行优化
type GetObviousKeysTypes<T> = T extends string | symbol ? T : never;
type GetObviousKeysTypesForPerson = GetObviousKeysTypes<keyof Person>;
//  现在可以直接看到GetObviousKeysTypesForPerson的值为"name" | "age" | "gender"
```

### Record类型

基本使用：

```ts
// Record类型的运用场景
// type Record<K extends keyof any, T> = {
    // [P in K]: T;
// };

function showObj(obj: object) {
  console.log(obj);
}
// 存在上面一个函数showObj，要求传入的参数obj的类型为object
// 但是由于类型object太过于广泛，不能进行例如要求obj键的类型只能为"name" | " age"或者值的类型只能为string | number的限制
// 现在使用Record类型进行以上限制，在这里Record类型为object类型的一个优化
function showObj(obj1: Record<"name" | "age", string | number>) {
    console.log(obj1.age);
    console.log(obj1.name);
}
// 以上等价于
// function showObj(obj1: { name: string | number, age: string | number }) { };
showObj({ name: 'Alice', age: 12 }); // 12 "Alice"
showObj({name : 12, age : 'I am 12'}) // "I am 12" 12


// 能够要求的键的类型为symbol或者string或者number
// function showObj1(obj: Record<string, string | number>) {}
// function showObj1(obj: Record<number, string | number>) {}
// function showObj1(obj: Record<symbol, string | number>) {}
```

```ts
// 判断是否为一个纯对象
function isPlainObject(data: Record<string | symbol, any>): boolean {
    return Object.prototype.toString.call(data) === "[object Object]";
}
console.log(isPlainObject([1, 2, 3])); // false
console.log(isPlainObject(new Set())); // false
console.log(isPlainObject({ name: "Alice" })); // true
console.log(isPlainObject({ [Symbol('attr')]: "Alice" })); // true
```

### Pick类型

```ts
// Pick类型
// 抓取一个接口或者类中指定属性的键类型
// type Pick<T, K extends keyof T> = {
//   [P in K]: T[P];
// };

interface Person {
  name: string;
  age: number;
}
type SubPerson1 = Pick<Person, "name">;
// SubPerson1的值为
// {
//   name: string;
// }

type SubPerson2 = Pick<Person, "name" | "age">;
// SubPerson2的值为
// {
//   name: string;
//   age: number;
// }

```

### 综合案例

案例一：

```ts
interface Todo {
  title: string;
  completed: boolean;
  description: string;
  add(): number;
  delete(): number;
  update(): number;
}

// 获取上面接口中的函数类型的属性
type GetValuesFunctionType<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K];
};
type GetValuesFunctionTypeForTodo = GetValuesFunctionType<Todo>;
// GetValuesFunctionTypeForTodo的值为
// {
//     add: () => number;
//     delete: () => number;
//     update: () => number;
// }


// 在所有获取到的函数类型属性的键名前添加"do"
// 并通过Capitalize类型进行首字母大写
type GetValuesFunctionType<T> = {
  [K in keyof T as T[K] extends Function ? `do${Capitalize<K & string>}` : never]: T[K];
};
type GetValuesFunctionTypeForTodo = GetValuesFunctionType<Todo>;
// GetValuesFunctionTypeForTodo的值为
// {
//   doAdd: () => number;
//   doDelete: () => number;
//   doUpdate: () => number;
// }
```

使用Record类型进行优化：

```ts
type GetFunctionAttrs<T extends Record<string, any>> = {
  [P in keyof T as T[P] extends Function
    ? `do${Capitalize<P & string>}`
    : never]: T[P];
};
type GetFunctionAttrsFromTodo = GetFunctionAttrs<Todo>;
```

案例二：

```ts
type MyMouseEvent = {
  eventType: "click";
  x: number;
  y: number;
};
type KeyEvent = {
  eventType: "keyup";
  key: number;
};

// 获取MyMouseEvent和KeyEvent相同键名的键类型
type Keys = keyof (MyMouseEvent | KeyEvent); // "eventType"

// 通过使用EventFunction类型函数，使得EventRec的值为
// {
//   click: (event: MyMouseEvent) => any;
//   keyup: (event: KeyEvent) => any;
// }
type EventRec = EventFunction<MyMouseEvent | KeyEvent, "eventType">;
type EventFunction<
  Events extends Record<string, any>,
  EventKey extends keyof Events
  > = {
    [Event in Events as Event extends Events ? Event[EventKey] : never]: (event: Event) => any;
};
```

### 辅助类型

```ts
interface Todo {
  readonly title: string;
  completed: boolean;
  description: string;
  date?: Date;
  publisher?: string;
}
// 根据上面的接口创建一个新类型
// -?表示去除属性后面的?
// +?表示在属性后面增加一个?
// -readonly表示去除属性前面的readonly
// +readonly表示在属性前面增加一个readonly
type NewInterface<T> = {
  // 其中的可选属性全部变为必要属性
  // [K in keyof T]-?: T[K];

  // 所有的属性变可选属性
  // [K in keyof T]+?: T[K];

  // 所有的只读属性变不是只读属性
  // -readonly [K in keyof T]: T[K];

  // 所有属性变为只读属性
  +readonly [K in keyof T]: T[K];

  // +readonly [K in keyof T]+?: T[K];
};
type NewTodo = NewInterface<Todo>;

// 使用系统提供的方法实现
type NewTodo1 = Required<Todo>;
type NewTodo2 = Partial<Todo>;
type NewTodo3 = Readonly<Todo>;

```

### 练习

1：

![image-20230705224610700](C:\Users\ycx\AppData\Roaming\Typora\typora-user-images\image-20230705224610700.png)

2：F:\BaiduNetdiskDownload\第9章 在真实应用中深入掌握 TS 高阶技能

```ts
const arr = [
  {
    stuNo: 100,
    stuName: "王五",
    stuClass: 1,
    teacherNo: 5,
    teacherName: "王涛",
  },
  {
    stuNo: 102,
    stuName: "卡特",
    stuClass: 1,
    teacherNo: 6,
    teacherName: "陈萍",
  },
  {
    stuNo: 103,
    stuName: "周鹏",
    stuClass: 2,
    teacherNo: 5,
    teacherName: "沈腾",
  },
]
```

