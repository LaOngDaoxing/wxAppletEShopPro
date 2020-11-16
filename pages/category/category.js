import { promiseRequestVar } from "../../request/promiseRequest.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContentList: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0
  },
  // 定义全局变量：接口的返回“商品分类”数据
  productClassifyList: [],

  onLoad: function (options) {
    // 使用本地缓存，渲染商品分类界面数据
    this.renderProductClassifyData();
  },
  /**
   * @Description：商品分类界面左侧菜单的点击事件
   * @CodeSteps：
      1 获取被点击的标题身上的索引
      2 给data中的currentIndex赋值就可以了
      3 根据不同的索引来渲染右侧的商品内容
   */
  leftMenuClickEventFun(e) {
    const { index } = e.currentTarget.dataset;
    // 构造右边的内容数据
    let rightContentList = this.productClassifyList[index].children;
    this.setData({
      currentIndex: index,
      rightContentList,
      // 重新设置 右侧内容的scroll-view标签的距离顶部的距离
      scrollTop: 0
    })
  },
  /**
   * @Description：获取“商品分类”数据——方式1-使用请求Promise((resolve,reject)=>{wx.request({});})，简化返回值
   */
  gainProductClassifyDataFun1() {
    promiseRequestVar({
      url: "/productClassifyData"
    })
    .then(res => {
      // console.log(res);
      this.productClassifyList = res;
      // 把接口的数据存入到本地存储中
      wx.setStorageSync("cates", { time: Date.now(), data: this.productClassifyList });
      // 构造左侧的大菜单数据
      let leftMenuList = this.productClassifyList.map(v => v.cat_name);
      // 构造右侧的商品数据
      let rightContentList = this.productClassifyList[0].children;
      this.setData({
        leftMenuList,
        rightContentList
      })
    })
  },
  /**
   * @Description：获取“商品分类”数据——方式2-使用请求Promise((resolve,reject)=>{wx.request({});})、es7的async await，简化返回值
   * @Remark：
      async await就是Promise的语法糖，async await本质是异步请求
   */
  async gainProductClassifyDataFun2() {
    // 1 使用es7的async await来发送请求
    const res = await promiseRequestVar({ url: "/productClassifyData" });
    // console.log(res);
    this.productClassifyList = res;
    // 把接口的数据存入到本地存储中
    wx.setStorageSync("cates", { time: Date.now(), data: this.productClassifyList });
    // 构造左侧的大菜单数据
    let leftMenuList = this.productClassifyList.map(v => v.cat_name);
    // 构造右侧的商品数据
    let rightContentList = this.productClassifyList[0].children;
    this.setData({
      leftMenuList,
      rightContentList
    })
  },
  /**
   * @Description：使用本地缓存，渲染商品分类界面数据
   * @CodeSteps：
      1、 web中的本地存储和 小程序中的本地存储的区别
        （1）写代码的方式不一样了 
          web中: localStorage.setItem("key","value") localStorage.getItem("key")
          小程序中: wx.setStorageSync("key", "value"); wx.getStorageSync("key");
        （2）存的时候 有没有做类型转换
          web中: 不管存入的是什么类型的数据，最终都会先调用以下 toString(),把数据变成了字符串 再存入进去
          小程序中: 不存在 类型转换的这个操作 存什么类似的数据进去，获取的时候就是什么类型
      2、 判断本地存储中有没有旧的数据
          {time:Date.now(),data:[...]}
        （1）若没有旧数据，则直接发送新请求，以获取数据
        （2）有旧的数据 同时 旧的数据也没有过期 就使用 本地存储中的旧数据即可；定义过期时间  10s 改成 5分钟
   */
  renderProductClassifyData(){
    // 1、 获取本地存储中的数据  (小程序中也是存在本地存储 技术)
    const productClassifyList = wx.getStorageSync("cates");
    // 2、 判断本地存储中有没有旧的数据
    if (!productClassifyList) {
      // 若没有旧数据，则直接发送新请求，以获取数据
      this.gainProductClassifyDataFun1();
    } else {
      // 有旧的数据 同时 旧的数据也没有过期 就使用 本地存储中的旧数据即可；定义过期时间  10s 改成 5分钟
      if (Date.now() - productClassifyList.time > 1000 * 10) {
        // 重新发送请求
        this.gainProductClassifyDataFun1();
      } else {
        // 可以使用旧的数据
        this.productClassifyList = productClassifyList.data;
        // 构造左边的菜单数据
        let leftMenuList = this.productClassifyList.map(v => v.cat_name);
        // 构造右边的内容数据
        let rightContentList = this.productClassifyList[0].children;
        this.setData({
          leftMenuList,
          rightContentList
        })
      }
    }
  }
})