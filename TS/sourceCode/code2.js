"use strict";
// 泛型工厂类继承装饰器
// 运用场景
// 对于一个已经开发好的项目，将其所有的类，增添这样的新功能：
// 在创建类的实例时，打印日志信息，输出哪一个类的实例被创建了，以及相应的参数信息
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b)
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError(
          "Class extends value " + String(b) + " is not a constructor or null"
        );
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
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
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
// 装饰器
// 将targetClass的原来类型any修改为一个更具体的类型(一个继承自类的泛型)
// { new(...args: any): any } 表示一个类的类型
function LogInfoDecorator(targetClass) {
  // 使用类继承来实现
  // 创建一个目标类的子类，继承自目标类
  // 然后在子类中实现所需求的功能，同时调用目标类的构造器
  var TargetClassSon = /** @class */ (function (_super) {
    __extends(TargetClassSon, _super);
    function TargetClassSon() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      var _this = _super.apply(this, args) || this;
      // 添加新的所需求功能,对目标类的功能进行扩展
      //   console.log(
      //     `日志信息
      //     类 ${(targetClass as any).name} 被创建;
      //     传入的参数为[${args}]
      //     `
      //   );
      // 将以上内容封装到一个函数内
      LogInfo.apply(void 0, __spreadArray([targetClass], args, false));
      return _this;
    }
    return TargetClassSon;
  })(targetClass);
  // 将目标类返回，然后将其赋值给目标类
  // 源码中：Test = LogInfoDecorator()
  // 然后让new Test()创建Test的实例时,实际调用的是new TargetClassSon()
  // 这样既可以实现Test中的功能,创建一个Test实例,又可以实现新添加的所需求功能
  return TargetClassSon;
}
function LogInfo(targetClass) {
  var args = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    args[_i - 1] = arguments[_i];
  }
  console.log(
    "\u65E5\u5FD7\u4FE1\u606F\n        \u7C7B "
      .concat(
        targetClass.name,
        " \u88AB\u521B\u5EFA;\n        \u4F20\u5165\u7684\u53C2\u6570\u4E3A:["
      )
      .concat(args, "]\n        ")
  );
}
// 测试类，使用上述的装饰器
var Test = /** @class */ (function () {
  function Test(name, age) {
    this.name = name;
    this.age = age;
  }
  Test.prototype.eat = function () {
    console.log(this.name + "eating...");
  };
  Test = __decorate(
    [LogInfoDecorator, __metadata("design:paramtypes", [String, Number])],
    Test
  );
  return Test;
})();
new Test("Alice", 12);
// 打印的内容为
// 日志信息
//   类 Test 被创建;
//   传入的参数为:[Alice,12]
