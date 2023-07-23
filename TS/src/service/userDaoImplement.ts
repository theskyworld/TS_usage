import userinfosdb from "../userInfo";

export  class UserDaoImplement {
  public GetUserByUsername(username: string, pwd: string) {
    return userinfosdb.find((userinfo) => {
      return username === userinfo.username && pwd === userinfo.password;
    });
  }
}
