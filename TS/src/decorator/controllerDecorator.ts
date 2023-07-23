import { RequestHandler } from "express";
import "reflect-metadata";
import { router } from "../utils/routerUtil";
type MethodType = "get" | "post";
type MyClassDecorator = <T extends { new (...args: any): any }>(
  targetClass: T
) => any;
export function ControllerDecorator(reqRootPath?: string): MyClassDecorator {
  return function (targetClass: any) {
    for (let methodName in targetClass.prototype) {
      // 获取请求路径和请求类型元数据
      const reqPath = Reflect.getMetadata(
        "path",
        targetClass.prototype,
        methodName
      );
      console.log("🚀 ~ file: controllerDecorator.ts:16 ~ reqPath:", reqPath);
      const reqType: MethodType = Reflect.getMetadata(
        "methodType",
        targetClass.prototype,
        methodName
      );

      const reqMethodHandler = targetClass.prototype[methodName];
      // router.get(reqPath, reqMethodHandler);

      // 获取中间件函数
      // 当存在多个中间件函数执行时，获取的是一个中间件函数数组
      const middleWareFuncs: RequestHandler[] = Reflect.getMetadata(
        "middlewares",
        targetClass.prototype,
        methodName
      );
      // if (reqPath && reqType) {
      //   router[reqType](reqPath, reqMethodHandler);
      // }
      if (reqPath && reqType) {
        // 如果使用了中间件装饰器
        // 走中间件函数的逻辑
        if (middleWareFuncs) {
          // 先解构middleWareFuncs，执行多个中间件函数，再执行reqMethodHandler
          router[reqType](reqPath, ...middleWareFuncs, reqMethodHandler);
          // 不走中间件
        } else {
          router[reqType](reqPath, reqMethodHandler);
        }
      }
    }
  };
}
