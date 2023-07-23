import { Userinfo } from "../userInfo";
import {UserDaoImplement} from "./userDaoImplement";

export  class UserServiceImplement {
  // 增加UserDaoImplement类中的功能
  userInfoDaoImplement: UserDaoImplement = new UserDaoImplement();
  static userServiceImplement: UserServiceImplement;
  constructor() {
    console.log("创建类UserServiceImplement的实例");
  }
  // 通过getInstance控制类实例的创建
  static getInstance(): UserServiceImplement {
    if (!this.userServiceImplement) {
      this.userServiceImplement = new UserServiceImplement();
    }
    return this.userServiceImplement;
  }
  login(username: string, pwd: string, role?: string): Userinfo | null {
    console.log("login进入service,username : ", username);
    return this.userInfoDaoImplement.GetUserByUsername(username, pwd) || null;
  }
  register(username: string, pwd: string) {
    this.userInfoDaoImplement.GetUserByUsername(username, pwd);
    console.log("UserService-register...");
  }
}
console.log(UserServiceImplement);
