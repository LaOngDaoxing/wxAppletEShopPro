import {promiseRequestVar2} from "../../request/promiseRequest2.js";
import {loginVar} from "../../request/promiseRequestAsyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  /**
   * @Description：获取用户信息
   */
  async handleGetUserInfo(e) {
    try {
      // 1 获取用户信息
      const { encryptedData, rawData, iv, signature } = e.detail;
      // 2 获取小程序登录成功后的code
      const { code } = await loginVar();
      const loginParams={ encryptedData, rawData, iv, signature ,code};
      // 3 发送请求 获取用户的token
      const {token}=await promiseRequestVar2({url:"/users/wxlogin",data:loginParams,method:"post"});
      // 4 把token存入缓存中 同时跳转回上一个页面
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error);
    }
  }
})