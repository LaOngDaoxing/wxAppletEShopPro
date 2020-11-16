Component({
  /**
   * 子组件的属性列表
   */
  properties: {
    navtabsDList:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * @Description：（6）获得并处理子组件属性properties中的数据 ——> 子向父传递数据
     */
    changeSonTabEventFunD(e){
      // 1 获取点击的索引
      const {index}=e.currentTarget.dataset;
      // 2 触发 父组件中的事件 自定义
      this.triggerEvent("fatherComponentCusEventName",{index});
    }
  }
})
