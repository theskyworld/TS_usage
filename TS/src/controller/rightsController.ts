// 权限控制器
import { Request, Response } from "express";
import { get, ControllerDecorator as Controller } from "../decorator/index";



@Controller("/")
export default class RightsControllers {
  
  @get("/rightsmanager")
  rightsShow(req: Request, res: Response) {
    console.log("rightShow");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.write("管理员权限页面");
    res.write("<a href='javascript:history.back()'>返回</a>");
    res.send();
  }
}
