/* 
一.1、获取收货地址，存入本地存储\缓存
  （1） **.wxml绑定点击事件
  （2） 错误流程：仅调用微信小程序内置api即wx.chooseAddress({})，获取用户的收货地址 

  （2） 微信官方9.25之前版接口授权的正确流程：获取用户对小程序所授予的“获取地址的权限状态scope”，并分情况处理
      I、获取用户对小程序所授予的“获取地址的权限状态scope”
      II、判断 权限状态scope，然后调用 获取收货地址的 api
        情景1： 用户点击“**需要访问你的通讯地址提示框的确定按钮”
            操作步骤
               菜单栏》点击清缓存》
               使用wx.chooseAddress({})，注释wx.getSetting({})；用户点击“**需要访问你的通讯地址提示框的确定按钮”》选择地址页面>选择地址>点击确定》
               注释wx.chooseAddress({})，使用wx.getSetting({})》scope 值 true》
            解决方案
                III、调用 获取收货地址的 api
        情景2： 用户从未点击过“**需要访问你的通讯地址提示框的确定按钮”
            操作步骤
               菜单栏》点击清缓存》
               注释wx.chooseAddress({})，使用wx.getSetting({})》scope 值 undefined》
            解决方案
                III、调用 获取收货地址的 api
        情景3： 用户点击“**需要访问你的通讯地址提示框的取消按钮”
            操作步骤
               菜单栏》点击清缓存》
               使用wx.chooseAddress({})，注释wx.getSetting({})；用户点击“**需要访问你的通讯地址提示框的取消按钮”》
               注释wx.chooseAddress({})，使用wx.getSetting({})；点击获取收货地址》scope 值 false 》
            解决方案
                1 诱导用户 自己 打开 授权设置页面(wx.openSetting) 当用户重新给与 获取地址权限的时候 
                III、调用 获取收货地址的 api
      III、调用 获取收货地址的 api
      IV、把获取到的收货地址， 存入到 本地存储\缓存中
一.2、页面加载完毕后；获取本地存储\缓存中信息，并在页面显示 收货地址信息
  （1） 判断选择使用onLoad  onShow ；由于购物车页面被频繁的打开、隐藏，期望购物车页面每次被打开都做初始化，因此选择使用onShow。
  （2） 获取本地存储\缓存中的收货地址信息
  （3） 把收货地址信息数据，设置给data中的一个变量（即填充到data中）
二.2、页面加载完毕后；获取本地存储\缓存中信息，并在页面显示 购物车内容
  （1） 判断选择使用onLoad  onShow ；由于购物车页面被频繁的打开、隐藏，期望购物车页面每次被打开都做初始化，因此选择使用onShow。
  （2） 回到了商品详情页面》点击 加入购物车按钮》 第一次添加商品的时候 手动添加了属性
      1 num=1;
      2 checked=true;
  （3） 获取本地存储\缓存中的购物车数组
  （4） 把购物车数据，设置给data中的一个变量（即填充到data中） 
4 全选的实现 数据的展示
  （1） onShow() {中获取缓存中的购物车数组cart}
  （2） 根据购物车数组cart中的属性，所有的商品都被选中 即checked=true
    const allChecked=cart.length?cart.every(v=>v.checked):false;
5 总价格和总数量
  1 都需要商品被选中 我们才拿它来计算
  2 获取购物车数组
  3 遍历
  4 判断商品是否被选中
  5 总价格 += 商品的单价 * 商品的数量
  5 总数量 +=商品的数量
  6 把计算后的价格和数量 设置回data中即可
6 商品的选中
  1 绑定change事件
  2 获取到被修改的商品对象
  3 商品对象的选中状态 取反
  4 重新填充回data中和缓存中
  5 重新计算全选。总价格 总数量。。。
7 全选和反选
  1 全选复选框绑定事件 change
  2 获取 data中的全选变量 allChecked
  3 直接取反 allChecked=!allChecked
  4 遍历购物车数组 让里面 商品 选中状态跟随  allChecked 改变而改变
  5 把购物车数组 和 allChecked 重新设置回data 把购物车重新设置回 缓存中 
8 商品数量的编辑
  1 "+" "-" 按钮 绑定同一个点击事件 区分的关键 自定义属性 
    1 “+” "+1"
    2 "-" "-1"
  2 传递被点击的商品id goods_id
  3 获取data中的购物车数组 来获取需要被修改的商品对象
  4 当 购物车的数量 =1 同时 用户 点击 "-"
    弹窗提示(showModal) 询问用户 是否要删除
    1 确定 直接执行删除
    2 取消  什么都不做 
  4 直接修改商品对象的数量 num
  5 把数组cart 重新设置回 缓存中 和data中 this.setCartFun(cart)
三、底部工具栏  
9 点击结算
  1 判断有没有收货地址信息
  2 判断用户有没有选购商品
  3 经过以上的验证 跳转到 支付页面！ 
 */
import { getSettingVar, chooseAddressVar, openSettingVar, showModalVar ,showToastVar} from "../../request/promiseRequestAsyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    // 收货地址数据
    address: {},
    // 添加到购物车的数据
    cart: [],
    // 是否全选
    allChecked: false,
    // 总价格
    totalPrice: 0,
    // 总数量
    totalNum: 0
  },
  /**
   * @Remark：判断选择使用onLoad  onShow ；由于购物车页面被频繁的打开、隐藏，期望购物车页面每次被打开都做初始化，因此选择使用onShow。
   */
  onShow() {
    /*--------------------------------------------- 一二.2、获取本地存储\缓存中信息，并在页面显示 ---------------------------------------------*/
    // 1、获取本地存储\缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 1、获取本地存储\缓存中的购物车数据；当获取数据wx.getStorageSync("cart")为空，直接赋值为 []
    const cart = wx.getStorageSync("cart") || [];
    // 2、把数据 设置给data中的一个变量
    this.setData({ address });
    this.setCartFun(cart);
  },
  /*--------------------------------------------- 一.1、获取收货地址，存入本地存储\缓存 开始---------------------------------------------*/
  /**
   * @Description：点击 收货地址，正确流程演示
   * @CodeSteps：
      1 获取用户的收货地址
        （1） **.wxml绑定点击事件useWxBuiltInApiBv925ToHandleChooseAddressFun1
        （2） 微信官方9.25之前版接口授权的正确流程：调用微信小程序内置api，获取用户对小程序所授予的“获取地址的权限状态scope”，并分情况处理
   */
  useWxBuiltInApiBv925ToHandleChooseAddressFun1() {
    // 获取用户收货地址。调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址。
    // wx.chooseAddress({
    //   // 接口调用成功的回调函数
    //   success:(result)=>{
    //     console.log(result);
    //   }
    // });
    // 获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。
    wx.getSetting({
      // 接口调用成功的回调函数
      success: (result) => {
        // {errMsg: "getSetting:ok", authSetting: {scope.address: true, scope.invoice: true, scope.invoiceTitle: true}}
       console.log(result);
      },
      // 接口调用失败的回调函数
      fail: () => {},
      // 接口调用结束的回调函数（调用成功、失败都会执行）
      complete: () => {}
    });
  },
  /**
   * @Description：点击 收货地址，正确完整流程演示
   * @CodeSteps：
      1 获取用户的收货地址
        （1） **.wxml绑定点击事件useWxBuiltInApiBv925ToHandleChooseAddressFun2
        （2） 微信官方9.25之前版接口授权的正确流程：调用微信小程序内置api，获取用户对小程序所授予的“获取地址的权限状态scope”，并分情况处理
   */
  useWxBuiltInApiBv925ToHandleChooseAddressFun2() {
    // I、获取 权限状态
    wx.getSetting({
      success:(result)=>{
        console.log(result);
        // 只要发现存在怪异属性名（如scope.address），都要使用[]形式获取属性值。
        const scopeAddress = result.authSetting["scope.address"];
        // II、判断 权限状态
        if (scopeAddress ===true|| scopeAddress ===undefined){
          // III、调用 获取收货地址的 api
          wx.chooseAddress({
            success:(result1)=>{
              console.log(result1);
            }
          });
        }else if(scopeAddress === false) {
          // 诱导用户 自己 打开 授权设置页面(wx.openSetting) 当用户重新给与 获取地址权限的时候 
          wx.openSetting({
            success:(result2)=>{
              // III、调用 获取收货地址的 api
              wx.chooseAddress({
                success:(result3)=>{
                  console.log(result3);
                }
              });
            }
          })
        }
      }
    })
  },
  /**
   * @Description：点击 收货地址，优化正确完整流程演示
   * @CodeSteps：
      1 获取用户的收货地址
        （1） **.wxml绑定点击事件useWxBuiltInApiBv925ToHandleChooseAddressFun3
        （2） 微信官方9.25之前版接口授权的正确流程：获取用户对小程序所授予的“获取地址的权限状态scope”，并分情况处理
   */
  async useWxBuiltInApiBv925ToHandleChooseAddressFun3() {
    // 在try中处理Promise((resolve,reject)=>{wx.getSetting({success: (result) => {}});})
    try {
      // I、获取 权限状态
      const res1 = await getSettingVar();
      // 只要发现存在怪异属性名（如scope.address），都要使用[]形式获取属性值。
      const scopeAddress = res1.authSetting["scope.address"];
      console.log(scopeAddress);
      // II、判断 权限状态
      if (scopeAddress === false) {
        // 诱导用户 自己 打开 授权设置页面(wx.openSetting) 当用户重新给与 获取地址权限的时候 
        await openSettingVar();
      }
      // III、调用 获取收货地址的 api
      let address = await chooseAddressVar();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      // IV、把获取到的收货地址， 存入到 本地存储\缓存中
      wx.setStorageSync("address", address);
    } 
    // 在catch中处理Promise((resolve,reject)=>{wx.getSetting({fail: (err) => {}});})
    catch (error) {
      console.log(error);
    }
  },
  /**
   * @Description：点击 收货地址，优化正确完整流程演示
   * @CodeSteps：
      1 获取用户的收货地址
        （1） **.wxml绑定点击事件handleChooseAddress
        （2） 微信官方9.25及之后版接口授权的正确流程：获取用户对小程序所授予的“获取地址的权限状态scope”，并分情况处理
   */
  async handleChooseAddress() {
    // 在try中处理Promise((resolve,reject)=>{wx.getSetting({success: (result) => {}});})
    try {
      // III、调用 获取收货地址的 api
      let address = await chooseAddressVar();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      // IV、把获取到的收货地址， 存入到 本地存储\缓存中
      wx.setStorageSync("address", address);
    } 
    // 在catch中处理Promise((resolve,reject)=>{wx.getSetting({fail: (err) => {}});})
    catch (error) {
      console.log(error);
    }
  },
  /*--------------------------------------------- 一.1、获取收货地址，存入本地存储\缓存 结束---------------------------------------------*/
  /*--------------------------------------------- 二、购物车内容 开始---------------------------------------------*/
  /**
   * @Description：商品的选中
   */
  handeItemChange(e) {
    // 1 获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    // 2 获取购物车数组 
    let { cart } = this.data;
    // 3 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 4 选中状态取反
    cart[index].checked = !cart[index].checked;
    // 把数据 设置给data中的变量
    this.setCartFun(cart);
  },
  /*--------------------------------------------- 二、购物车内容 结束---------------------------------------------*/
  /*--------------------------------------------- 三、底部工具栏 开始---------------------------------------------*/
  /**
   * @Description：设置购物车状态，同时重新计算底部工具栏的数据（全选 总价格 购买的数量） 
   */
  setCartFun(cart) {
    let allChecked = true;
    // 1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    })
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    // 把数据 设置给data中的变量
    this.setData({
      cart,
      totalPrice, totalNum, allChecked
    });
    // 将加入购物车数据，放入本地存储\缓存中
    wx.setStorageSync("cart", cart);
  },
  /**
   * @Description：商品全选功能
   */
  handleItemAllCheck() {
    // 1 获取data中的数据
    let { cart, allChecked } = this.data;
    // 2 修改值
    allChecked = !allChecked;
    // 3 循环修改cart数组 中的商品选中状态
    cart.forEach(v => v.checked = allChecked);
    // 4 把修改后的值 填充回data或者缓存中
    this.setCartFun(cart);
  },
  /**
   * @Description：商品数量的编辑功能
   */  
  async handleItemNumEdit(e) {
    // 1 获取传递过来的参数 
    const { operation, id } = e.currentTarget.dataset;
    // 2 获取购物车数组
    let { cart } = this.data;
    // 3 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 4 判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 4.1 弹窗提示
      const res = await showModal({ content: "您是否要删除？" });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCartFun(cart);
      }
    } else {
      // 4  进行修改数量
      cart[index].num += operation;
      // 5 设置回缓存和data中
      this.setCartFun(cart);
    }
  },
  /**
   * @Description：点击 结算 
   */  
  async handlePay(){
    // 1 判断收货地址
    const {address,totalNum}=this.data;
    if(!address.userName){
      await showToast({title:"您还没有选择收货地址"});
      return;
    }
    // 2 判断用户有没有选购商品
    if(totalNum===0){
      await showToast({title:"您还没有选购商品"});
      return ;
    }
    // 3 跳转到 支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });
      
  }
})