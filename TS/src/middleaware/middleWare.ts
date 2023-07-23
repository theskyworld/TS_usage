// 中间件函数
import { Request, Response, NextFunction } from "express";
import { getSession } from "../utils/sessionUtil";

// 用于判断当前用户是否合法
export const isValidUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("执行isValidUser...");
  let session = getSession(req);
  // 非合法用户，不允许访问
  if (session.userinfosdb && session.userinfosdb.mark === "noallowlogin") {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.write("您是被禁人士，被限制访问");
    res.end();
    // 允许访问
  } else {
    // 如果存在下一个中间件函数或者其它函数，则执行
    // 否则跳转到目标页面
    next();
  }
};

// 第二个中间件函数
export const SecondMiddleAware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("第二个中间件函数....");
  next();
};
