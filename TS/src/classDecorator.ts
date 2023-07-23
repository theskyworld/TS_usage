// 创建三个类

// // 喷墨打印机
// class InkPrinter {
//   paper: B5Paper = new B5Paper();
//   ink: GrayInk = new GrayInk();
//   // 打印
//   prinit() {}
// }

// // 激光打印机
// class LaserPrinter {
//   paper: B5Paper = new B5Paper();
//   // 打印
//   prinit() {}
// }

// // 针式打印机
// class NeedleTypePrinter {
//   paper: A4Paper = new A4Paper();
//   // 打印
//   prinit() {}
// }

// 存在新的需求:需要对以上打印机中的纸张进行切换,例如将InkPrinter中的paper换成A4Paper,A3Paper等
// 解决方案:使用函数工厂,传入纸张的类型作为参数,然后返回相应的纸张类
//          或者列举中所有的纸张类型,并进行保存,需要时直接在保存的内容里面进行获取
// 但是,这些方案都需要对类进行一个一个地修改,扩展性差
// 使用依赖注入很好地解决以上问题
// 依赖注入,依赖的创建和使用分离,注入时通过类外部的方法来给类中的属性进行赋值

// 创建一个纸张类型的父类
class PrinterPaper { }
// 创建一个油墨类型的父类
class PrinterInk {}
// 喷墨打印机
class InkPrinter extends PrinterPaper {
  paper!: PrinterPaper;
  ink!: PrinterInk;
  // 打印
  prinit() {}
}

// 激光打印机
class LaserPrinter extends PrinterPaper {
  paper!: PrinterPaper;
  // 打印
  prinit() {}
}

// 针式打印机
class NeedleTypePrinter extends PrinterPaper {
  paper!: PrinterPaper;
  // 打印
  prinit() {}
}
