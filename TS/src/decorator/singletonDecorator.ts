import "reflect-metadata";
import {UserServiceImplement} from "../service/userServiceImplement";
// 单例模式装饰器
// 用于实现@Autowired装饰器的单例模式功能
// 如果为单例模式，则获取userServiceImplementInstance实例对象时，
// 通过调用UserServiceImplement类中的getInstance方法来获取该类中单例模式下的实例对象
// 然后将该实例对象转交给@Aurowired装饰器（定义在元数据中）
// 否则，直接将获取到的UserServiceImplement类转交给@Aurowired装饰器，让其通过构造函数创建实例的方式来获取userServiceImplementInstance实例对象
type MyAttrDecorator = (
  targetClassPrototype: object,
  propKey: string | symbol
) => void;
export  function SingletonDecorator(
  isSingleton: boolean
): MyAttrDecorator {
  return (targetClassPrototype, propKey) => {
    const PropType = Reflect.getMetadata(
      "design:type",
      targetClassPrototype,
      propKey
    );
    const UserServiceImplement =
      PropType.getUserServiceImplement();
    const metaSingleton = Reflect.getMetadata(
      "singleton",
      targetClassPrototype,
      propKey
    );
    let userServiceImplementInstanceOrClass;
    // 通过单例模式获取userServiceImplementInstance实例对象
    if (isSingleton) {
      // metaSingleton中没保存
      if (!metaSingleton) {
        // 定义一个metaSingleton元数据，以便在@Autowired装饰器中控制是否为单例模式
        Reflect.defineMetadata(
          "singleton",
          isSingleton,
          targetClassPrototype,
          propKey
        );
        userServiceImplementInstanceOrClass =
          UserServiceImplement.getInstance();
      } else {
        console.log("单例模式，使用上一次创建的实例对象");
      }
      // 通过构造函数获取
    } else {
      userServiceImplementInstanceOrClass = UserServiceImplement;
    }
    // 将userServiceImplementInstanceOrClass实例对象或者类转交给@Autowired装饰器
    Reflect.defineMetadata(
      "userServiceImplementInstanceOrClass",
      userServiceImplementInstanceOrClass,
      targetClassPrototype,
      propKey
    );
  };
}
