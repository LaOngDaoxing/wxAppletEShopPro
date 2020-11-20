/* 
--------------------------------------------- 一、收货地址 ---------------------------------------------
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

--------------------------------------------- 二、购物车内容 ---------------------------------------------
二.2、页面加载完毕后；获取本地存储\缓存中信息，并在页面显示 购物车内容
  （1） 判断选择使用onLoad  onShow ；由于购物车页面被频繁的打开、隐藏，期望购物车页面每次被打开都做初始化，因此选择使用onShow。
  （2） 回到了商品详情页面》点击 加入购物车按钮》 第一次添加商品的时候 手动添加了属性
      1 num=1;
      2 checked=true;
  （3） 获取本地存储\缓存中的购物车数组
  （4） 把购物车数据，设置给data中的一个变量（即填充到data中） 

--------------------------------------------- 三、底部工具栏 ---------------------------------------------
三.3、设置购物车中商品行的选中状态，同时重新设置底部工具栏的显示数据（是否全选、合计金额、结算总数量） 
  （1） 判断购物车数组cart是否为空
  （2） 遍历购物车数组cart
      I、推荐   cart.forEach(v => {})
      II、不推荐 
        根据购物车数组cart中的属性，所有的商品都被选中 即checked=true
        const allChecked=cart.length?cart.every(v=>v.checked):false;
  （3） 判断购物车中商品行的选中状态，选中/未选中
  （4） 把计算后的价格和数量，设置给data中的变量
  （5） 将加入购物车数据，放入本地存储\缓存中
三.4、购物车页面的商品行复选框，选中/取消选中
  （1） 购物车页面的商品行复选框，绑定change事件
  （2） 获取被修改的商品对象的id
  （3） 根据商品对象的id，找到被修改的商品对象
  （4） 商品对象的选中状态 取反
   三.3、设置购物车中商品行的选中状态，同时重新设置底部工具栏的显示数据（是否全选、合计金额、结算总数量） 
三.5、购物车页面的全选复选框，全选/反选
  （1） 购物车页面的全选复选框，绑定change事件
  （2） 获取 data中数据，购物车数组cart、全选变量allChecked
  （3） 修改值（直接取反 allChecked=!allChecked）
  （4） 遍历修改购物车数组cart中的，商品选中状态
  三.3、设置购物车中商品行的选中状态，同时重新设置底部工具栏的显示数据（是否全选、合计金额、结算总数量）    
三.6、编辑购物车页面的商品行数量
  （1） "+" "-" 按钮，绑定同一个点击事件；而区分的关键是自定义属性data-operation 
        I、 “+”，使用data-operation="{{1}}"来实现"+1"
        II、"-"，使用data-operation="{{-1}}"来实现"-1"
  （2） 获取被点击的商品id
  （3） 获取 data中数据，购物车数组cart
  （4） 根据被点击的商品id，找到需要修改的商品对象的索引index
  （5.1） 当购物车商品行编辑的数量=1，同时用户点击按钮"-"》弹窗提示(showModal) 询问用户"您是否要删除？"》判断是否要执行删除》
        I、 确定 直接执行删除
            三.3、设置购物车中商品行的选中状态，同时重新设置底部工具栏的显示数据（是否全选、合计金额、结算总数量） 
        II、取消  什么都不做 
  （5.2） 当购物车商品行编辑的数量为其他情况》
        直接修改商品对象的数量 num
        三.3、设置购物车中商品行的选中状态，同时重新设置底部工具栏的显示数据（是否全选、合计金额、结算总数量） 
三.7、购物车页面的底部工具栏》点击“结算”按钮
  （1） 获取 data中数据
  （2） 判断有没有收货地址信息
  （3） 判断用户有没有选购商品
  （4） 经过以上的验证 跳转到 支付页面！ 
 */
import {getSettingVar, chooseAddressVar, openSettingVar, showModalVar ,showToastVar} from "../../request/promiseRequestAsyncWx.js";
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
    // 一二.2、获取本地存储\缓存中信息，并在购物车页面显示 初始化购物车界面显示数据
    this.initCartPageShowFun();

  },
  /*--------------------------------------------- 一.1、获取收货地址，存入本地存储\缓存 开始---------------------------------------*/
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
  /*--------------------------------------------- 一.1、获取收货地址，存入本地存储\缓存 结束---------------------------------------*/

  /*--------------------------------------------- 二、购物车内容 开始------------------------------------------------------------*/
  /**
   * @Description：一二.2、获取本地存储\缓存中信息，并在购物车页面显示 初始化购物车界面显示数据
   */
  initCartPageShowFun(){
    // 1、获取本地存储\缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 1、获取本地存储\缓存中的购物车数据；当获取数据wx.getStorageSync("cart")为空，直接赋值为 []
    const cart = wx.getStorageSync("cart") || [];
    // 2、把数据 设置给data中的一个变量
    this.setData({ address });
    this.setCartCheckedAndFootertoolShowFun(cart);
  },
  /*--------------------------------------------- 二、购物车内容 结束------------------------------------------------------------*/

  /*--------------------------------------------- 三、底部工具栏 开始------------------------------------------------------------*/
  /**
   * @Description：三.3、设置购物车中商品行的选中状态，同时重新设置底部工具栏的显示数据（是否全选、合计金额、结算总数量） 
   * @Grammer规则：
      三元运算举例
        // 判断购物车数组是否为空。如果购物车中有商品true、购物车中没有商品false。
        allChecked = cart.length != 0 ? allChecked : false;
        
   */
  setCartCheckedAndFootertoolShowFun(cart) {
    // 全选
    let allChecked = true;
    // 合计金额
    let totalPrice = 0;
    // 结算总数量
    let totalNum = 0;
    // （1） 判断购物车数组cart是否为空
    if(cart!=null || cart.length != 0){
      // （2） 遍历购物车数组cart
      cart.forEach(v => {
        // （3） 判断购物车中商品行的选中状态，选中/未选中
        // 选中
        if (v.checked) {
          // 合计金额 += 商品的单价 * 商品的数量
          totalPrice += v.num * v.goods_price;
          // 结算总数量 +=商品的数量
          totalNum += v.num;
        } 
        // 未选中
        else {
          // 底部工具栏，设置取消全选
          allChecked = false;
        }
      })
    }else{
      // 底部工具栏，设置取消全选
      allChecked = false;
    }
    // （4） 把计算后的价格和数量，设置给data中的变量
    this.setData({
      cart,
      totalPrice, totalNum, allChecked
    });
    // （5） 将加入购物车数据，放入本地存储\缓存中
    wx.setStorageSync("cart", cart);
  },
  /**
   * @Description：三.4、购物车页面的商品行复选框，选中/取消选中
   */
  handeItemChange(e) {
    // （2） 获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    //  获取购物车数组 
    let { cart } = this.data;
    // （3） 根据商品对象的id，找到购物车数组中被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // （4） 商品对象的选中状态 取反
    cart[index].checked = !cart[index].checked;
    // 三.3、设置购物车中商品行的选中状态，同时重新设置底部工具栏的显示数据（是否全选、合计金额、结算总数量） 
    this.setCartCheckedAndFootertoolShowFun(cart);
  },
  /**
   * @Description：三.5、购物车页面的全选复选框，全选/反选

   */
  handleItemAllCheck() {
    // （2） 获取 data中数据，购物车数组cart、全选变量allChecked
    let { cart, allChecked } = this.data;
    // （3） 修改值（直接取反 allChecked=!allChecked）
    allChecked = !allChecked;
    // （4） 遍历修改购物车数组cart中的，商品选中状态
    cart.forEach(v => v.checked = allChecked);
    // 三.3、设置购物车中商品行的选中状态，同时重新设置底部工具栏的显示数据（是否全选、合计金额、结算总数量） 
    this.setCartCheckedAndFootertoolShowFun(cart);
  },
  /**  
   * @Description：三.6、编辑购物车页面的商品行数量
   */  
  async handleItemNumEdit(e) {
    // （2） 获取被点击的商品id
    const { operation, id } = e.currentTarget.dataset;
    // （3） 获取 data中数据，购物车数组cart
    let { cart } = this.data;
    // （4） 根据被点击的商品id，找到需要修改的商品对象的索引index
    const index = cart.findIndex(v => v.goods_id === id);
    // （5.1） 当购物车的数量=1，同时用户点击按钮"-"》
    if (cart[index].num === 1 && operation === -1) {
      // 弹窗提示(showModal) 询问用户"您是否要删除？"》
      const res = await showModalVar({ content: "您是否要删除？" });
      // 判断是否要执行删除》
      if (res.confirm) {
        // I、 确定 直接执行删除
        cart.splice(index, 1);
        // 三.3、设置购物车中商品行的选中状态，同时重新设置底部工具栏的显示数据（是否全选、合计金额、结算总数量） 
        this.setCartCheckedAndFootertoolShowFun(cart);
      }
    } 
    // （5.2） 当购物车商品行编辑的数量为其他情况》
    else {
      // 直接修改商品对象的数量 num
      cart[index].num += operation;
      // 三.3、设置购物车中商品行的选中状态，同时重新设置底部工具栏的显示数据（是否全选、合计金额、结算总数量） 
      this.setCartCheckedAndFootertoolShowFun(cart);
    }
  },
  /**
   * @Description：三.7、购物车页面的底部工具栏》点击“结算”按钮
   */  
  async handlePay(){
    // （1） 获取 data中数据
    const {address,totalNum}=this.data;
    // （2） 判断有没有收货地址信息
    if(!address.userName){
      await showToastVar({title:"您还没有选择收货地址"});
      return;
    }
    // （3） 判断用户有没有选购商品
    if(totalNum===0){
      await showToastVar({title:"您还没有选购商品"});
      return ;
    }
    // （4） 经过以上的验证 跳转到 支付页面！ 
    wx.navigateTo({
      url: '/pages/pay/pay'
    });
  }
})