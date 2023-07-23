import "reflect-metadata";

type MyMethodDecoratorType = (
  targetClassPrototype: any,
  methodName: string,
  methodDecoription: PropertyDescriptor
) => void;

function RequestDecorator(methodType: string) {
  return function (reqPath: string): MyMethodDecoratorType {
    return function (targetClassPrototype, methodName, methodDecoription) {
      console.log("进入get请求方法装饰器。path:", reqPath);
      const targetClas = targetClassPrototype.constructor;
      const targetClasInstance = new targetClas();
      // 定义请求路径和请求类型元数据
      Reflect.defineMetadata("path", reqPath, targetClassPrototype, methodName);
      Reflect.defineMetadata(
        "methodType",
        methodType,
        targetClassPrototype,
        methodName
      );
    };
  };
}

// get请求
export const get = RequestDecorator("get");
// post请求
export const post = RequestDecorator("post");
