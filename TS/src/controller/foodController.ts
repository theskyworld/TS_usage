import { Request, Response } from "express";
import {
  get,
  middleWareDecorator as middleware,
  ControllerDecorator as Controller,
} from "../decorator";
import { isValidUser, SecondMiddleAware } from "../middleaware/middleWare";
@Controller("/")
class FoodController {
  // 路由器接收参数
  @get("/showFood/:foodname/:address")
  // 使用中间件装饰器，执行isValidUser中间件函数的逻辑，用于判断用户是否合法
  // 执行完之后执行@get装饰器，进行路由的跳转，然后执行showFood展示页面中的内容
  @middleware(SecondMiddleAware)
  @middleware(isValidUser)
  showFood(req: Request, res: Response): void {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.write("大混沌");
    res.write("一锅炖");
    // 使用参数
    res.write(req.params.foodname + req.params.address)
    res.end();
  }
}
