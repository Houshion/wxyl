const app = getApp();
const tools = app.tools;
let column1 = [],column2 = [];
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    is_show: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    columns: [
      {
        values: column1,
        className: 'column1'
      },
      {
        values: column2,
        className: 'column2'
      }
    ],
  },
  ready: function() {
    for(let i = 0; i < 24;i ++ ){
      if(i%2==0){
        column1.push((i<=9?'0'+i:i)+':'+(i%2==0?'00':'30'));
        column1.push((i<=9?'0'+i:i)+':'+(i%2==0?'30':'00'));
        if(i==0){
          column2.push((i<=9?'0'+i:i)+':'+(i%2==0?'30':'00'));
        }else{
          column2.push((i<=9?'0'+i:i)+':'+(i%2==0?'00':'30'));
          column2.push((i<=9?'0'+i:i)+':'+(i%2==0?'30':'00'));
        }
      }else{
        column1.push((i<=9?'0'+i:i)+':'+(i%2==0?'03':'00'));
        column1.push((i<=9?'0'+i:i)+':'+(i%2==0?'00':'30'));
        column2.push((i<=9?'0'+i:i)+':'+(i%2==0?'03':'00'));
        column2.push((i<=9?'0'+i:i)+':'+(i%2==0?'00':'30'));
      }
    }
    this.setData({
      'columns[0].values': column1,
      'columns[1].values': column2,
    })

  },
  /**
   * 组件的方法列表
   */
  methods: {
    pickerConfirm(event){
      const { picker, value,index} = event.detail;
      console.log(value,index)
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const date = now.getDate()
      const startCtime =  Number(new Date(year,month,date,value[0].split(':')[0]*1,value[0].split(':')[1]*1,0));
      const endCtime =  Number(new Date(year,month,date,value[1].split(':')[0]*1,value[1].split(':')[1]*1,0));
      console.log(startCtime)
      console.log(endCtime)
      this.triggerEvent('myevent', {
        start:{
          date: value[0],
          ctime: startCtime,
        },
        end: {
          date: value[1],
          ctime: endCtime
        }
      });
      this.setData({
        is_show: false
      })
     setTimeout(() => {
       this.triggerEvent('myeventCancel',false);
     },500)
    },
    pickerCancel(){
      this.setData({
        is_show: false
      })
      setTimeout(() => {
        this.triggerEvent('myeventCancel',false);
      },500)
    },
    closeSheet(){
      this.setData({
        is_show: false
      })
      setTimeout(() => {
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
    }
  }
})
