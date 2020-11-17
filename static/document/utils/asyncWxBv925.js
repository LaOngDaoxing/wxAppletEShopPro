/**
 * @Description：一、获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。
 * @Reference：
      1、微信官方9.25之前版接口授权
 * @Grammer规则：
      使用请求Promise((resolve,reject)=>{wx.getSetting({});})
 */
export const getSettingBv925Var=()=>{
  return new Promise((resolve,reject)=>{
    // 获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。
    wx.getSetting({
      // 接口调用成功的回调函数
      success: (result) => {
        resolve(result);
      },
      // 接口调用失败的回调函数
      fail: (err) => {
        reject(err);
      }
    });
  })
}
/**
 * @Description：二、获取用户收货地址。调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址。
 * @Grammer规则：
      使用请求Promise((resolve,reject)=>{wx.chooseAddress({});})
 */
export const chooseAddressBv925Var=()=>{
  return new Promise((resolve,reject)=>{
    // 获取用户收货地址。调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址。
    wx.chooseAddress({
      // 接口调用成功的回调函数
      success: (result) => {
        resolve(result);
      },
      // 接口调用失败的回调函数
      fail: (err) => {
        reject(err);
      }
    });
  })
}

/**
 * 
 * promise是异步的，“点击行为允许调用”openSetting这个机制要求是同步的
 */
export const openSettingBv925Var=()=>{
  return new Promise((resolve,reject)=>{
    wx.openSetting({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}

/**
 *  promise 形式  showModal
 * @param {object} param0 参数
 */
export const showModalBv925Var=({content})=>{
  return new Promise((resolve,reject)=>{
    wx.showModal({
      title: '提示',
      content: content,
      success :(res) =>{
        resolve(res);
      },
      fail:(err)=>{
        reject(err);
      }
    })
  })
}


/**
 *  promise 形式  showToast
 * @param {object} param0 参数
 */
export const showToastBv925Var=({title})=>{
  return new Promise((resolve,reject)=>{
    wx.showToast({
      title: title,
      icon: 'none',
      success :(res) =>{
        resolve(res);
      },
      fail:(err)=>{
        reject(err);
      }
    })
  })
}

/**
 * promise 形式  login
 */
export const loginBv925Var=()=>{
  return new Promise((resolve,reject)=>{
    wx.login({
      timeout:10000,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}

/**
 * promise 形式的 小程序的微信支付
 * @param {object} pay 支付所必要的参数
 */
export const requestPaymentBv925Var=(pay)=>{
  return new Promise((resolve,reject)=>{
   wx.requestPayment({
      ...pay,
     success: (result) => {
      resolve(result)
     },
     fail: (err) => {
       reject(err);
     }
   });
  })
}