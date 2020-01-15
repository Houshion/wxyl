// components/datetime-picker/index.js
const app = getApp();
const tools = app.tools;
let column1 = [],column2 = [];
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type_date:{
      type:String,
      value:'date',
    },
    is_show: {
      type:Boolean,
      value:false,
      observer: function(newVal, oldVal) {
        // 属性值变化时执行
        console.log(newVal,oldVal)
        if(newVal){
          this.setData({
            type_date:this.properties.type_date
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    type_date: 'date',
    show: true,
    end_show: false,
    minDate: new Date(1970,0,1).getTime(),
    maxDate: new Date().getTime(),
    currentDate: new Date().getTime(),
    endDate: new Date().getTime(),
    columns: [
      {
        values: column1,
        className: 'column1'
      },
      {
        values: column2,
        className: 'column2',
        defaultIndex: 2
      }
    ],
    yearDate: ''
  },
  observers:{

  },
  ready: function() {
    if(this.data.type_date == 'year'){
      let year = tools.format(Number(new Date()),'Y');
      for(let i = 10; i > 0; i --){
        column1.push(year  + 1 - i);
        column2.push(year  + 1 - i);
      }
      this.setData({
          'columns[0].values': column1,
          'columns[1].values': column2,
      })
    }
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {

    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    confirm(){
      this.setData({
        show: false,
        end_show: true,
        endDate: this.data.currentDate
      })
    },
    cancel(){
      this.setData({
        show: false
      })
      setTimeout(()=>{
        this.triggerEvent('myeventCancel',false);
      },500)
    },
    onInput(event) {
      this.setData({
        currentDate: event.detail
      });
    },
    endConfirm(){
      let start,end;
      switch (this.data.type_date) {
        case 'date':
          start = tools.format(this.data.currentDate,'Y-m-d');
          end = tools.format(this.data.endDate,'Y-m-d');
          break;
        case 'year-month':
          start = tools.format(this.data.currentDate,'Y-m');
          end = tools.format(this.data.endDate,'Y-m');
          break;
      }
      this.triggerEvent('myevent', {
        start:{
          date: start,
          ctime: this.data.currentDate,
        },
        end: {
          date: end,
          ctime: this.data.endDate
        },
        type_date: this.data.type_date
      });
      this.setData({
        end_show: false
      })
      setTimeout(()=>{
        this.triggerEvent('myeventCancel',false);
      },500)
    },
    endCancel(){
      this.setData({
        end_show: false
      })
      setTimeout(()=>{
        this.triggerEvent('myeventCancel',false);
      },500)
    },
    endOnInput(event) {
      this.setData({
        endDate: event.detail
      });
    },
    closeSheet(){
      this.setData({
        show: false
      })
      setTimeout(()=>{
        this.triggerEvent('myeventCancel',false);
      },500)
    },
    endCloseSheet(){
      this.setData({
        end_show: false
      })
      setTimeout(()=>{
        this.triggerEvent('myeventCancel',false);
      },500)
    },
    pickerConfirm(){
      const startCtime =  Number(new Date(this.data.yearDate[0],11,31,23,59,59));
      const endCtime =  Number(new Date(this.data.yearDate[1],11,31,23,59,59));
      this.triggerEvent('myevent', {
        start:{
          date: this.data.yearDate[0],
          ctime: startCtime,
        },
        end: {
          date: this.data.yearDate[1],
          ctime: endCtime
        },
        type_date: this.data.type_date
      });
      this.setData({
        show: false
      })
      setTimeout(()=>{
        this.triggerEvent('myeventCancel',false);
      },500)
    },
    pickerCancel(){
      this.setData({
        show: false
      })
      setTimeout(()=>{
        this.triggerEvent('myeventCancel',false);
      },500)
    },
    onChange(event){
      const { picker, value} = event.detail;
      const columnIndex1 =picker.getColumnIndex(0);
      const columnIndex2 =picker.getColumnIndex(1);
      if(columnIndex1 >= columnIndex2){
        picker.setIndexes([columnIndex2,columnIndex2])
      }
      this.setData({
        yearDate: value
      })
    }
  }
})
