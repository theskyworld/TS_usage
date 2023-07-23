import "reflect-metadata";
import collectionInstance from "../collection";
import {UserServiceImplement} from "../service/userServiceImplement";

type MyAttrDecorator = (
  targetClassPrototype: object,
  propKey: string | symbol
) => void;
export function AutoWired(injectId: string): MyAttrDecorator {
  return (targetClassPrototype, propKey) => {
    let userServiceImplementInstance;
    // 获取SingletonDecorator装饰器中转交过来的数据
    const userServiceImplementInstanceOrClass = Reflect.getMetadata(
      "userServiceImplementInstanceOrClass",
      targetClassPrototype,
      propKey
    );
    // metaSingleton控制是否走单例模式
    // 来自于@SingletonDecorator装饰器中的定义（传递）
    const metaSingleton = Reflect.getMetadata(
      "singleton",
      targetClassPrototype,
      propKey
    );
    // 单例模式
    // userServiceImplementInstanceOrClass的值为一个实例对象
    if (metaSingleton) {
      console.log("单例模式获取");
      userServiceImplementInstance = userServiceImplementInstanceOrClass;
      // 构造函数创建
      // userServiceImplementInstanceOrClass的值为一个类
    } else {
      console.log("构造函数获取");
      userServiceImplementInstance = new userServiceImplementInstanceOrClass();
    }
    Reflect.defineProperty(targetClassPrototype, propKey, {
      value: userServiceImplementInstance,
    });
  };
}
