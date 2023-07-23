import {
  AutoWired,
  ControllerDecorator,
  SingletonDecorator,
  get as GetDecorator,
  post as PostDecorator,
} from "../decorator";
import { UserServiceImplement, UserServiceInterface } from "../service";
import { Request, Response } from "express";
import { getSession } from "../utils/sessionUtil";
import { Userinfo } from "../userInfo";

@ControllerDecorator("/")
class UserController {
  @AutoWired("userServiceImplement")
  @SingletonDecorator(true)
  private userServiceImplement!: UserServiceInterface;

  @GetDecorator("/login")
  login(req: Request, res: Response): void {
    const htmlStr = `<div><form method="post" 
    action = "/loginprocess"><div>用户名: 
    <input type='text' name = 'username'/> </div><div>
     密码: <input type='password' name = 'pwd'/> </div>
     <div><input type="submit" value = "提交" /> </div>
     </form></div>`;
    res.send(htmlStr);
  }

  @GetDecorator("/")
  index(req: Request, res: Response): void {
    // 如果用户登录
    if (getSession(req).userinfosdb) {
      let htmlstr = `<div><a href='/searchFoodHistory'
       style='text-decoration:none;color:red'> 搜索美食历史信息 </a></div><div><a href = '/orderInfo'  style='text-decoration:none;color:red'> 订单信息 </a></div><div><a href="/loginout" style='text-decoration:none;color:red'>注销</a></div>`;
      res.send(htmlstr);
      // 用户未登录
    } else {
      res.redirect("/login");
    }
  }

  @PostDecorator("/loginprocess")
  loginProcess(req: Request, res: Response): void {
    console.log("loginprocess=this:", this);
    let session = getSession(req);

    let userServiceImplement: UserServiceImplement =
      Reflect.getOwnPropertyDescriptor(
        UserController.prototype,
        "userServiceImplement"
      ).value; //S100
    let userinfosdb: Userinfo = userServiceImplement.login(
      req.body.username,
      req.body.pwd
    );
    if (userinfosdb && userinfosdb.username) session.userinfosdb = userinfosdb;
    // 基础复习：req.send只能发送一次,如果想发送多次,就必须使用res.write
    res.setHeader("Content-Type", "text/html;charset=UTF-8");
    let outputhtml = "";
    if (userinfosdb.role === "admin") {
      outputhtml += `<div>管理员:${userinfosdb.role}</div>`;
      outputhtml += `<div><a href="/rightsmanager">进入管理员权限页面</a></div>`;
    }
    res.write(outputhtml);
    res.write(`<div>登录成功,欢迎你:${userinfosdb.username}</div>`);
    res.write(`<div><a  href="/login">进入首页</a></div>`);
    // 跳转路由时传递参数
    res.write(
      `<div><a  href="/showFood/xiaolongxia/chengdu">进入美食首页</a></div>`
    );
    res.end();
  }
}
