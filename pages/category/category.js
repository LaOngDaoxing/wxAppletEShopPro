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
  // 接口的返回“商品分类”数据
  productClassifyList: [],

  onLoad: function (options) {
    // 渲染商品分类界面数据
    this.renderProductClassifyData();
  },
  // 商品分类界面左侧菜单的点击事件
  leftMenuClickEventFun(e) {
    /* 
    1 获取被点击的标题身上的索引
    2 给data中的currentIndex赋值就可以了
    3 根据不同的索引来渲染右侧的商品内容
      */
    const { index } = e.currentTarget.dataset;

    let rightContentList = this.productClassifyList[index].children;
    this.setData({
      currentIndex: index,
      rightContentList,
      // 重新设置 右侧内容的scroll-view标签的距离顶部的距离
      scrollTop: 0
    })
  },
  // 获取“商品分类”数据
  async gainProductClassifyData() {
    // promiseRequestVar({
    //   url: "/productClassifyData"
    // })
    //   .then(res => {
    //     this.productClassifyList = res.data.infoList;

    //     // 把接口的数据存入到本地存储中
    //     wx.setStorageSync("cates", { time: Date.now(), data: this.productClassifyList });


    //     // 构造左侧的大菜单数据
    //     let leftMenuList = this.productClassifyList.map(v => v.cat_name);
    //     // 构造右侧的商品数据
    //     let rightContentList = this.productClassifyList[0].children;
    //     this.setData({
    //       leftMenuList,
    //       rightContentList
    //     })
    //   })

    // 1 使用es7的async await来发送请求
    const res = await promiseRequestVar({ url: "/productClassifyData" });
    // this.productClassifyList = res.data.message;
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
   * @Description：渲染商品分类界面数据
   */
  renderProductClassifyData(){
    /* 
    0 web中的本地存储和 小程序中的本地存储的区别
      （1）写代码的方式不一样了 
        web中: localStorage.setItem("key","value") localStorage.getItem("key")
        小程序中: wx.setStorageSync("key", "value"); wx.getStorageSync("key");
      （2）存的时候 有没有做类型转换
        web中: 不管存入的是什么类型的数据，最终都会先调用以下 toString(),把数据变成了字符串 再存入进去
        小程序中: 不存在 类型转换的这个操作 存什么类似的数据进去，获取的时候就是什么类型
    1 判断本地存储中有没有旧的数据
      {time:Date.now(),data:[...]}
    2 若没有旧数据，则直接发送新请求，以获取数据
    3 有旧的数据 同时 旧的数据也没有过期 就使用 本地存储中的旧数据即可；定义过期时间  10s 改成 5分钟
     */

    //  1 获取本地存储中的数据  (小程序中也是存在本地存储 技术)
    const productClassifyList = wx.getStorageSync("cates");
    // 2 判断本地存储中有没有旧的数据
    if (!productClassifyList) {
      // 若没有旧数据，则直接发送新请求，以获取数据
      this.gainProductClassifyData();
    } else {
      // 有旧的数据 同时 旧的数据也没有过期 就使用 本地存储中的旧数据即可；定义过期时间  10s 改成 5分钟
      if (Date.now() - productClassifyList.time > 1000 * 10) {
        // 重新发送请求
        this.gainProductClassifyData();
      } else {
        // 可以使用旧的数据
        this.productClassifyList = productClassifyList.data;
        // 获取左边的菜单数据
        let leftMenuList = this.productClassifyList.map(v => v.cat_name);
        // 获取右边的内容数据
        let rightContentList = this.productClassifyList[0].children;
        // 渲染数据
        this.setData({
          leftMenuList,
          rightContentList
        })
      }
    }
  }
})