// 创建一个用于收集类实例对象的类
class CollectionInstanceOfClass<T = any> {
  static collection: CollectionInstanceOfClass =
    new CollectionInstanceOfClass();

  private containerMap = new Map<string | symbol, any>();

  private constructor() {
    // console.log("创建CollectionInstanceOfClass类的实例对象...");
  }
  private static test() {
    console.log("test...");
  }

  public set(id: string | symbol, value: T): void {
    this.containerMap.set(id, value);
  }
  public get(id: string | symbol): T {
    return this.containerMap.get(id);
  }
}
// 获取CollectionInstanceOfClass类的实例
const collectionInstance = CollectionInstanceOfClass.collection;
export default collectionInstance;
