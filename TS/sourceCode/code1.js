"use strict";
// 创建一个__decorate函数，以后使用时，如果存在缓存的值，则使用缓存的值；否则进行新建
var __decorate =
  (this && this.__decorate) ||
  // decorators用于存放当前（类）中使用的装饰器
  // target用于获取当前（类），便于结合后面传入的key参数来获取指定属性的属性描述符，同时用于赋值给r变量
  // desc用于存放属性描述符（传入的或者获取的），然后赋值给变量r
  function (decorators, target, key, desc) {
    // 根据传入的实参的个数来为变量r进行赋值
    // 如果实参个数在3个以下，r的值为target形参的值
    // 否则，如果实参个数大于等于3个，r的值为desc形参的值（如果值为null，则获取Object.getOwnPropertyDescriptor(target, key)后进行赋值）
    var c = arguments.length,
      // 由于类装饰器中传入的参数为2，所有r的值为target，当前类
      //c = 2，装饰器修饰的目标对象为类或者构造函数参数，r的值为target
      // c = 3，装饰器修饰的目标对象为方法参数或属性
      // c = 4，装饰器修饰的目标对象为方法
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    console.log(r);
    // 存在元数据
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    // 不存在元数据
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
// 带参数的装饰器
function FirstClassDecorator(params) {
  // console.log(params)
  return function (targetClass) {
    console.log("".concat(targetClass.name, " : ").concat(params));
  };
}
function SecondClassDecrator(targetClass) {}
// 使用多个装饰器
var CustomerService = /** @class */ (function () {
  function CustomerService() {
    this.name = "下单";
  }
  CustomerService.prototype.buy = function () {
    console.log(this.name + "购买");
  };
  CustomerService.prototype.placeOrder = function () {
    console.log(this.name + "下单购买");
  };
  // 调用__decorate函数，依次传入decorators、target形参的值
  CustomerService = __decorate(
    // 第一个参数为一个数组，方便存放使用的一个或多个装饰器，以及确定使用的装饰器的顺序
    // 该数组，最后一个元素为__metadata元数据
    [
      // 不带参数的装饰器
      // FirstClassDecorator,
      // 带参数的装饰器
      FirstClassDecorator("param for CustomerService"),
      SecondClassDecrator,
      __metadata("design:paramtypes", []),
    ],
    CustomerService
  );
  return CustomerService;
})();
var Person = /** @class */ (function () {
  function Person() {
    this.uname = "Alice";
  }
  Person.prototype.sayHello = function () {
    console.log(this.uname + "say hello");
  };
  Person = __decorate(
    [
      FirstClassDecorator("param for Person"),
      __metadata("design:paramtypes", []),
    ],
    Person
  );
  return Person;
})();
