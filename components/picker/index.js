// components/picker/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    range: {
      type: Array,
      value:[]
    },
    is_show: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    columns: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeSheet(){
      this.setData({
        is_show: false
      });
      setTimeout(()=>{
        this.triggerEvent('pickerCancel',false);
      },500)
    },
    pickerConfirm(event){
      const { picker, value, index } = event.detail;
      this.triggerEvent('pickerValue',{
        value,
        index
      });
      this.setData({
        is_show: false
      });
      setTimeout(()=>{
        this.triggerEvent('pickerCancel',false);
      },500)
    },
    pickerCancel(){
      this.setData({
        is_show: false
      });
      setTimeout(()=>{
        this.triggerEvent('pickerCancel',false);
      },500)
    }
  }
})
