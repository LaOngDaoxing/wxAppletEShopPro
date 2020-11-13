// 同时发送异步代码的次数
let ajaxTimes=0;
export const promiseRequestVar=(params)=>{
  // 判断 url中是否带有 /my/ 请求的是私有的路径 带上header token
  let header={...params.header};
  if(params.url.includes("/my/")){
    // 拼接header 带上token
    header["Authorization"]=wx.getStorageSync("token");
  }


  ajaxTimes++;
  // 显示加载中 效果
  wx.showLoading({
    title: "加载中",
    mask: true
  });
    

  
  /**
   * @Description：二、使用请求Promise((resolve,reject)=>{wx.request({});})，根据定义公共的后台接口请求url，调用后台接口并获取数据 
   */
  // 定义公共的后台接口请求url
  const baseUrl="https://laongdaoxing.com/NewEmployeesLearnNotes/wxAppletEShop";
  return new Promise((resolve,reject)=>{
    wx.request({
     ...params,
     header:header,
     url:baseUrl+params.url,
     success:(result)=>{
       resolve(result.data.infoList);
     },
     fail:(err)=>{
       reject(err);
     },
     complete:()=>{
      ajaxTimes--;
      if(ajaxTimes===0){
        //  关闭正在等待的图标
        wx.hideLoading();
      }
     }
    });
  })
}