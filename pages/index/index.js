//重新初始化index.js：先清空index.js》再输入wx-page》选择下拉框提示的wx-page
// 0 引入 用来发送请求的 方法 一定要把路径补全
import { promiseRequestVar } from "../../request/promiseRequest.js";
Page({
  data: {
    // 二、轮播图数组
    slideshowList: [],
    // 三、分类导航 数组
    classifyNavList:[],
    // 四、楼层数据
    floorList:[]
  },
  /**
   * @Description：页面开始加载 就会触发
   * @Bug：
      onLoad(){
        // 全局正在“加载中”效果
        promiseRequest.js每次发送请求过程中显示提示框“加载中”，获得响应后关闭提示框“加载中”；
        index.js的onLoad事件方法中，同时发送3个请求；
        promiseRequest.js应在最后一个请求返回响应后，再关闭提示框“加载中”；
      }
   */
  onLoad: function (options) {
    // 二_方式1、使用原生请求wx.request({});调用后台接口，获取轮播图数据
    // this.useMulitWxRequestInOneFunMayBugToGetSlideshowList();
    // 二_方式2、使用请求Promise((resolve,reject)=>{wx.request({});})，根据定义公共的后台接口请求url，调用后台接口并获取轮播图数据 
    this.usePromiseWxRequestToGetSlideshowList();
    // 三、使用请求Promise((resolve,reject)=>{wx.request({});})，根据定义公共的后台接口请求url，调用后台接口并获取分类导航数据
    this.usePromiseWxRequestToGetClassifyNavList();
    // 四、使用请求Promise((resolve,reject)=>{wx.request({});})，根据定义公共的后台接口请求url，调用后台接口并获取楼层数据
    this.usePromiseWxRequestToGetFloorList();
  },
  /**
  * @Description：二_方式1、使用原生请求wx.request({});调用后台接口，获取轮播图数据 
  * @Bug
      注意，套娃使用原生请求wx.request({});可能会出现异步回调地狱。
   */
  useMulitWxRequestInOneFunMayBugToGetSlideshowList(){
    // 1 发送异步请求获取轮播图数据  优化的手段可以通过es6的 promise来解决这个问题 
    wx.request({
      /**
      * @OptSteps
        linux服务器》配置nginx.conf》
          http{
            server{
              # 访问项目外资源
              # 浏览器链接路径https://laongdaoxing.com/file/saveFile/wxPic002.jpg    				
              location / {
                root   /data/website/wxAppletMiniTestPro/static/document;
                index  index.html index.htm;     
              } 
              或
              location /file/saveFile {
                root   /data/website/wxAppletMiniTestPro/static/document;
                index  index.html index.htm;     
              }		  							
            }
          }
      * @远程服务器后台接口返回数据
        {"infoList":[{"open_type":"navigate","navigator_url":"/pages/goods_detail/goods_detail?goods_id=1002","goods_id":1002,"image_src":"https://laongdaoxing.com/file/saveFile/wxPic002.jpg"},{"open_type":"navigate","navigator_url":"/pages/goods_detail/goods_detail?goods_id=1003","goods_id":1003,"image_src":"https://laongdaoxing.com/file/saveFile/wxPic003.jpg"},{"open_type":"navigate","navigator_url":"/pages/goods_detail/goods_detail?goods_id=1004","goods_id":1004,"image_src":"https://laongdaoxing.com/file/saveFile/wxPic004.jpg"},{"open_type":"navigate","navigator_url":"/pages/goods_detail/goods_detail?goods_id=1005","goods_id":1005,"image_src":"https://laongdaoxing.com/file/saveFile/wxPic005.jpg"}],"rstMap":{"rstCode":200,"rstMsg":"获取成功"}}
       */
      url: 'https://laongdaoxing.com/NewEmployeesLearnNotes/wxAppletEShop/slideshowData',
      success: (result) => {
        console.log(result);
        this.setData({
          slideshowList: result.data.infoList
        })
      }
    });
  },
  /**
   * @Description：二_方式2、使用请求Promise((resolve,reject)=>{wx.request({});})，根据定义公共的后台接口请求url，调用后台接口并获取轮播图数据 
   */
  usePromiseWxRequestToGetSlideshowList(){
    promiseRequestVar({ url: "/slideshowData" })
    .then(result => {
      // console.log(result);
      this.setData({
        slideshowList: result
      })
    })
  },
  /**
   * @Description：三、使用请求Promise((resolve,reject)=>{wx.request({});})，根据定义公共的后台接口请求url，调用后台接口并获取分类导航数据
   */
  usePromiseWxRequestToGetClassifyNavList(){
    promiseRequestVar({ url: "/classifyNavData" })
    .then(result => {
      // console.log(result);
      this.setData({
        classifyNavList: result
      })
    })
  },
  /**
   * @Description：四、使用请求Promise((resolve,reject)=>{wx.request({});})，根据定义公共的后台接口请求url，调用后台接口并获取楼层数据
   */
  usePromiseWxRequestToGetFloorList(){
    promiseRequestVar({ url: "/floorData" })
    .then(result => {
      // console.log(result);
      this.setData({
        floorList: result
      })
    })
  },
})