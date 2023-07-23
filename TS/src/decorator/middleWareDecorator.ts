// 中间件装饰器
import { RequestHandler } from "express";
import "reflect-metadata";
export function middleWareDecorator(middleware: RequestHandler) {
  return function (targetPrototype: any, methodname: string) {
    // 使用该中间件装饰器执行第一个中间件函数时
    // let middlewares = Reflect.getMetadata(
    //   "middlewares",
    //   targetPrototype,
    //   methodname
    // );
    // if (!middlewares) {
    //   middlewares = [];
    // }

    const middlewares =
      Reflect.getMetadata("middlewares", targetPrototype, methodname) || [];
    // 将每次的middleware中间件函数假如middlewares数组中
    middlewares.push(middleware);
    // 将middlewares定义在元数据上
    Reflect.defineMetadata(
      "middlewares",
      middlewares,
      targetPrototype,
      methodname
    );
  };
}
