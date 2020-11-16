/* 
1 用户页面上滑\滚动条触底事件\加载下一页数据
  1 找到滚动条触底事件  微信小程序官方开发文档寻找
  2 判断还有没有下一页数据
    1 获取到总页数  只有总条数
      总页数 = Math.ceil(总条数 /  页容量  pagesize)
      总页数 = Math.ceil( 23 / 10 ) = 3
    2 获取到当前的页码  pagenum
    3 判断一下 当前的页码是否大于等于 总页数 
      表示 没有下一页数据

  3 假如没有下一页数据 弹出一个提示
  4 假如还有下一页数据 来加载下一页数据
    1 当前的页码 ++
    2 重新发送请求
    3 数据请求回来  要对data中的数组 进行 拼接 而不是全部替换！！！
2 下拉刷新页面
  1 触发下拉刷新事件 需要在页面的json文件中开启一个配置项
    找到 触发下拉刷新的事件
  2 重置 数据 数组 
  3 重置页码 设置为1
  4 重新发送请求
  5 数据请求回来 需要手动的关闭 等待效果

 */
import { promiseRequestVar2 } from "../../request/promiseRequest2.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    navtabsDList: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList:[]
  },
  // 接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  // 总页数
  totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid=options.cid||"";
    this.QueryParams.query=options.query||"";
    this.getGoodsList();
  },
  /* 
  * @Description：一、自定义组件（导航标签-页面标题）点击事件，用来接收子组件传递的数据的
  * 1、组件.js 文件中 存放事件回调函数的时候 必须要存在在 methods中！！！
  * 2、页面.js 文件中 存放事件回调函数的时候 存放在data同层级下！！！
  */
  receiveSonComponentData(e){
    // 1 获取被点击的标题索引
    const {index}=e.detail;
    // 2 修改源数组
    let {navtabsDList}=this.data;
    navtabsDList.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 3 赋值到data中
    this.setData({
      navtabsDList
    })
  },
  /**
   * @Description：获取商品列表数据
   * @ResponseData:
      {"message":{"total":10,"pagenum":1,"goods":[{"goods_id":57445,"cat_id":9,"goods_name":"创维（Skyworth）65V9E65英寸25核4KHDR高清智能电视","goods_price":6499,"goods_number":100,"goods_weight":100,"goods_big_logo":"","goods_small_logo":"","add_time":1516663280,"upd_time":1516663280,"hot_mumber":0,"is_promote":false,"cat_one_id":1,"cat_two_id":3,"cat_three_id":9}]},"meta":{"msg":"获取成功","status":200}}
   */
  async getGoodsList(){
    const res=await promiseRequestVar2({url:"/goods/search",data:this.QueryParams});
    // 获取 总条数
    const total=res.total;
    // 计算总页数
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
    // console.log(this.totalPages);
    this.setData({
      // 拼接了数组
      goodsList:[...this.data.goodsList,...res.goods]
    })
    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错  
    wx.stopPullDownRefresh();
  },
  /**
   * @Description：用户页面上滑\滚动条触底事件\加载下一页数据
   */
  onReachBottom(){
  //  1 判断还有没有下一页数据
    if(this.QueryParams.pagenum>=this.totalPages){
      // 没有下一页数据
      // console.log('%c'+"没有下一页数据","color:red;font-size:100px;background-image:linear-gradient(to right,#0094ff,pink)");
      // 显示一会后，这个提示框“没有下一页数据”就会隐藏掉
      wx.showToast({ title: '没有下一页数据' });
    }else{
      // 还有下一页数据
      // console.log('%c'+"有下一页数据","color:red;font-size:100px;background-image:linear-gradient(to right,#0094ff,pink)");
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  /**
   * @Description：下拉刷新事件 
   */
  onPullDownRefresh(){
    // console.log('%c'+"刷新","color:red;font-size:100px;background-image:linear-gradient(to right,#0094ff,pink)");
    // 1 重置数组
    this.setData({
      goodsList:[]
    })
    // 2 重置页码
    this.QueryParams.pagenum=1;
    // 3 发送请求
    this.getGoodsList();
  }
})