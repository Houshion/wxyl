const app = getApp();
const tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {name: 'name',title: '店铺名称',type: 'text'},
      {name: 'businessHours',title: '营业时间',type: 'text'},
      {name: 'phone',title: '联系电话',type: 'text'},
      {name: 'leadingOfficial',title: '负责人',type: 'text'},
      {name: 'remark',title: '店铺描述',type: 'text'},
    ],
    list_data: {
      name: '',
      businessHours: '',
      phone: '',
      leadingOfficial: '',
      remark: '',
    },
    is_show: false,
    lispic_path: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  listeningEvent(e){
    this.onReady();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.init();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  init(){
    tools.showLoading();
    app.wxRequest(
        '/api/store/queryStoreById',
        {
          storeId: tools.globalData.storeId
        },
        res => {
          tools.hideLoading();
          if(res.data.code == 1){
            const result = res.data.data;
            this.setData({
              list_data: result,
              shopUrl: result.logoImgUrl ? tools.globalData.url + result.logoImgUrl : '/images/img0.png'
            })
          }else{
            tools.showToast(res.data.msg)
          }
        }
    )
  },
  chose_timer(e){
    if(e.currentTarget.dataset.name == 'businessHours'){
      this.setData({
        is_show: true
      })
    }
  },
  listeningEvent(e){
    console.log(e)
    this.setData({
      'list_data.businessHours':e.detail.start.date+'-'+e.detail.end.date,
    })
  },
  listeningCancel(e){
    this.setData({
      is_show: false
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    const { list_data, lispic_path} = this.data;
    const {name, businessHours, phone, leadingOfficial,remark} = e.detail.value;
    if (tools.isNull(name)) {
      tools.showToast('请输入店铺名称');
    }else if (tools.isNull(businessHours)) {
      tools.showToast('请输入营业时间');
    }else if (tools.isNull(phone)) {
      tools.showToast('请输入联系电话');
    }else if (tools.isNull(leadingOfficial)) {
      tools.showToast('请输入负责人姓名');
    }else if (tools.isNull(remark)) {
      tools.showToast('请输入临时通告');
    }else{
      tools.showLoading();
      let form = {
        id: tools.globalData.storeId,
        ...e.detail.value,
      };
      if(lispic_path){
        form.logoImgUrl = lispic_path
      };
      app.wxRequest(
          '/api/store/editStoreById',
          form,
          res => {
            tools.hideLoading();
            if(res.data.code == 1){
              tools.showModal('保存成功',flag => {
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
   * 上传图片
   */
  choice() {
    let that = this;
    app.uploadFile('', function(flag, idx, msg, data) {
      if (flag == 1) {
        let res = msg.tempFilePaths[0];
        that.setData({
          shopUrl: res
        });
        console.log(that.data.shopUrl)
      } else if (flag == 2) {
        tools.hideLoading();
        that.setData({
          lispic_path: msg
        });
      }
    }, {token:tools.getStorage('token')}, 1)
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
