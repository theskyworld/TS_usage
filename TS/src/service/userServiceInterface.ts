import {UserServiceImplement} from "./userServiceImplement";

// UserServiceImplement实现类的接口
export  class UserServiceInterface {
  static getUserServiceImplement() {
    return UserServiceImplement;
  }
}