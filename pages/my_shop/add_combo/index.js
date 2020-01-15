const app = getApp();
const tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form:{
      device_type: '',
      deviceCategoryId: '',
      useNum: '',
      remark: '',
      price: '',
      usableDay: '',
      useTime: '',
      device_index: -1,
      count_index: -1
    },
    device_type_show: false,
    count_show: false,
    device_list: [],
    list: [],
    count_list: ['1', '2', '3', '4', '5'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: this.options.id || ''
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  listeningEvent(e){
    this.onShow();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCategoryList();
  },
  getCategoryList(){
    tools.showLoading();
    app.wxRequest(
        '/api/deviceCategory/queryCategoryList',
        {},
        res => {
          tools.hideLoading();
          if(res.data.code == 1){
            const result = res.data.data;
            let device_list = new Array();
            result.forEach(item => {
              device_list.push(item.name);
            });
            this.setData({
              list: result,
              device_list
            })
            if(this.options.id){//编辑
              this.init();
            }
          }else{
            tools.showToast(res.data.msg)
          }
        }
    )
  },
  init(){
    const { list } = this.data;
    app.wxRequest(
        '/api/combo/getComboDetail',
        {
          id: this.options.id
        },
        res => {
          if(res.data.code == 1){
            const result = res.data.data;
            let { remark, price,usableDay,useTime, useNum, name} = result;
            list.forEach(item => {
              if(item.id == result.deviceCategoryId){
                console.log(result.deviceCategoryId)
                this.setData({
                  'form.deviceCategoryId': (result.deviceCategoryId).toString(),
                  'form.device_type': item.name,
                })
              }
            });
            this.setData({
              'form.remark': remark,
              'form.price': price,
              'form.usableDay': usableDay,
              'form.useTime': useTime,
              'form.name': name,
              'form.useNum': useNum.toString()
            })
          }else{
            tools.showToast(res.data.msg)
          }
        }
    )
  },
  chose_device_type(){
    this.setData({
      device_type_show: true
    })
  },
  chose_count(){
    this.setData({
      count_show: true
    })
  },
  pickerDeviceValue(e){
    console.log(e)
    const { list } = this.data;
    this.setData({
      'form.deviceCategoryId':(list[e.detail.index].id).toString(),
      'form.device_type': e.detail.value,
      'form.device_index':e.detail.index
    })
    this.setData({
      device_type_show: false
    })
  },
  pickerDeviceCancel(){
    this.setData({
      device_type_show: false
    })
  },
  pickerCountValue(e){
    console.log(e)
    this.setData({
      'form.useNum':e.detail.value,
      'form.count_index':e.detail.index
    })
    this.setData({
      count_show: false
    })
  },
  pickerCountCancel(){
    this.setData({
      count_show: false
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    const {
      deviceCategoryId,
      useNum
    } = this.data.form;
    console.log(deviceCategoryId)
    const {remark, price,usableDay,useTime, name} = e.detail.value;
    if (tools.isNull(deviceCategoryId)) {
      tools.showToast('请选择设备类型');
    }else if (tools.isNull(name)) {
      tools.showToast('请输入套餐名称');
    }else if (tools.isNull(remark)) {
      tools.showToast('请输入套餐内容说明');
    }else if (tools.isNull(useNum)) {
      tools.showToast('请选择使用次数');
    }else if (tools.isNull(price)) {
      tools.showToast('请输入价格');
    } else if (tools.isNull(usableDay)) {
      tools.showToast('请输入有效天数');
    } else if (tools.isNull(useTime)) {
      tools.showToast('请输入使用时长');
    }else{
      tools.showLoading();
      let form = {
        storeId: tools.globalData.storeId,
        ...e.detail.value,
        deviceCategoryId,
        useNum
      };
      let url = '/api/combo/saveStoreCombo';
      if(this.options.id){//编辑
        url = '/api/combo/editCombo';
        form.id = this.options.id;
      }
      app.wxRequest(
          url,
          form,
          res => {
            tools.hideLoading();
            if(res.data.code == 1){
              tools.showModal('提交成功',flag => {
                if(flag){
                  tools.navigateBack();
                }
              },false)
            }else{
              tools.showToast(res.data.msg)
            }
          }
      )
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    let userInfo = tools.getStorage("userInfo");
    if (userInfo.headImgUrl.indexOf("http") == -1) {
      userInfo.headImgUrl = tools.globalData.url + userInfo.headImgUrl
    }
    var shareObj = {
      path: '/pages/userSide/main/my/index/index?extendCode=' + userInfo.extendCode, // 默认是当前页面，必须是以‘/’开头的完整路径
      imgUrl: '', //转发时显示的图片路径，支持网络和本地，不传则使用当前页默认截图。
      success: function (res) { // 转发成功之后的回调　　　　　
        if (res.errMsg == 'shareAppMessage:ok') {}
      },
      fail: function () { // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
      complete: function () {
        // 转发结束之后的回调（转发成不成功都会执行）
      }
    };
    // 来自页面内的按钮的转发
    if (options.from == 'button') {
      var dataid = options.target.dataset; //上方data-id=shareBtn设置的值
      // 此处可以修改 shareObj 中的内容
      shareObj.path = '/pages/userSide/main/my/index/index?extendCode=' + dataid.id;
    }
    // 返回shareObj
    return shareObj;
  }
})
