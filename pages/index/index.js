//重新初始化index.js：先清空index.js》再输入wx-page》选择下拉框提示的wx-page
// 0 引入 用来发送请求的 方法 一定要把路径补全
import { request } from "../../backEndInterface/promiseRequest.js";
Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航 数组
    catesList:[],
    // 楼层数据
    floorList:[]
  },
  // 页面开始加载 就会触发
  onLoad: function (options) {
    // 一、使用原生请求wx.request({});调用后台接口，获取轮播图数据
    // this.useMulitWxRequestInOneFunMayBug();
    // 二、使用请求Promise(wx.request({});)调用后台接口，获取轮播图数据 
    this.getSwiperList();
    // this.getCateList();
    // this.getFloorList();
      
  },
  /**
  * @Description：一、使用原生请求wx.request({});调用后台接口，获取轮播图数据 
  * @Bug
      注意，套娃使用原生请求wx.request({});可能会出现异步回调地狱。
   */
  useMulitWxRequestInOneFunMayBug(){
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
        {"slideshowList":[{"open_type":"navigate","navigator_url":"/pages/goods_detail/goods_detail?goods_id=1002","goods_id":1002,"image_src":"https://laongdaoxing.com/file/saveFile/wxPic002.jpg"},{"open_type":"navigate","navigator_url":"/pages/goods_detail/goods_detail?goods_id=1003","goods_id":1003,"image_src":"https://laongdaoxing.com/file/saveFile/wxPic003.jpg"},{"open_type":"navigate","navigator_url":"/pages/goods_detail/goods_detail?goods_id=1004","goods_id":1004,"image_src":"https://laongdaoxing.com/file/saveFile/wxPic004.jpg"},{"open_type":"navigate","navigator_url":"/pages/goods_detail/goods_detail?goods_id=1005","goods_id":1005,"image_src":"https://laongdaoxing.com/file/saveFile/wxPic005.jpg"}],"rstMap":{"rstCode":200,"rstMsg":"获取成功"}}
       */
      url: 'https://laongdaoxing.com/NewEmployeesLearnNotes/wxAppletEShop/slideshowData',
      success: (result) => {
        console.log(result);
        this.setData({
          swiperList: result.data.slideshowList
        })
      }
    });
  },
  /**
   * @Description：二、使用请求Promise(wx.request({});)调用后台接口，获取轮播图数据 
   */
  getSwiperList(){
    request({ url: "/slideshowData" })
    .then(result => {
      this.setData({
        swiperList: result
      })
    })
  },
  // 获取 分类导航数据
  getCateList(){
    request({ url: "/home/catitems" })
    .then(result => {
      this.setData({
        catesList: result
      })
    })
  },
  // 获取 楼层数据
  getFloorList(){
    request({ url: "/home/floordata" })
    .then(result => {
      this.setData({
        floorList: result
      })
    })
  },
})