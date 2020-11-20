// 同时发送异步请求的次数，用于实现全局正在“加载中”效果
let ajaxTimes=0;
export const promiseRequestVar2=(params)=>{
   /**
   * // header将只有header["Authorization"]
   * let header={};
   * // header将除了header["Authorization"]，还可以有其他请求头信息
   * let header={...params.header};
    */ 
  let header={...params.header};
  // 判断 url中是否带有 /my/ 请求的是私有的路径 带上header token
  if(params.url.includes("/my/")){
    // 拼接请求头header中，带上token
    header["Authorization"]=wx.getStorageSync("token");
  }
  // 每发送异步请求，次数+1
  ajaxTimes++;
  // 每次发送请求过程中显示提示框“加载中”，获得响应后关闭提示框“加载中”
  wx.showLoading({
    title: "加载中",
    mask: true
  });
  /**
   * @Description：二、使用请求Promise((resolve,reject)=>{wx.request({});})，根据定义公共的后台接口请求url，调用后台接口并获取数据 
   * @API文档：https://www.showdoc.com.cn/128719739414963?page_id=2513235043485226
   */
  // 定义公共的后台接口请求url
  const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1";
  return new Promise((resolve,reject)=>{
    wx.request({
      // 请求参数对象params、header
      ...params,
      header:header,
      url:baseUrl+params.url,
      success:(result)=>{
        resolve(result.data.message);
      },
      fail:(err)=>{
        reject(err);
      },
      complete:()=>{
        ajaxTimes--;
        // promiseRequest.js应在最后一个请求返回响应后，再关闭提示框“加载中”；
        if(ajaxTimes===0){
          //  关闭正在等待的图标
          wx.hideLoading();
        }
      }
    });
  })
}