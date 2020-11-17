/**
 * @Description：一、获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。
 * @Reference：
      1、微信官方9.25之前版接口授权
 * @Grammer规则：
      1、使用构造函数实例化对象var pVar=new Promise((resolve,reject)=>{wx.getSetting({});})，实现异步请求。
          @Param：excutor(resolve,reject) 单元函数
          @Param：resolve 静态方法
          @Param：reject  静态方法    
          执行构造函数实例化对象new Promise((resolve,reject)=>{wx.getSetting({});})时，立即将构造函数中的两个参数函数resolve、reject，作为参数传递给单元函数excutor(resolve,reject)。
          （1）单元函数excutor，调用静态方法resolve、reject
              在单元函数excutor(resolve,reject){中调用resolve方法时，Promise的状态就变成fulfilled，即操作成功状态}
              在单元函数excutor(resolve,reject){中调用reject方法时，Promise的状态就变成rejected，即操作失败状态}
          （2）然后进入原型Promise.prototype(then,catch)
          （3）Promise实例调用then方法
              当Promise的状态就变成fulfilled时，pVar.then(onfulfilled,onrejected)中，执行onfulfilled
              当Promise的状态就变成rejected时，pVar.catch(onfulfilled,onrejected)中，执行onrejected

      2、Promise.resolve(value)方法返回一个以给定值解析后的Promise对象，从而控制异步流程。
 */
export const getSettingBv925Var=()=>{
  // 实例化对象new Promise，返回是一个对象，不是一个函数。
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
 * @Description：二、调起客户端小程序设置界面，返回用户设置的操作结果。设置界面只会出现小程序已经向用户请求过的权限。
 */
export const openSettingBv925Var=()=>{
  return new Promise((resolve,reject)=>{
    // 调起客户端小程序设置界面，返回用户设置的操作结果。设置界面只会出现小程序已经向用户请求过的权限。
    wx.openSetting({
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
 * @Description：三、获取用户收货地址。调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址。
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