const app = getApp();
const tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {title: '姓名',placeholder: '请输入',name: 'name',type: 'text'},
      {title: '手机号',placeholder: '请输入',name: 'phone',type: 'number'},
      {title: '部门',placeholder: '请输入',name: 'deptName',type: 'text'},
      {title: '职位',placeholder: '请输入',name: 'position',type: 'text'},
      {title: '备注',placeholder: '选填',name: 'remark',type: 'text'},
    ],
    list_data: {
      name: '',
      phone: '',
      deptName: '',
      position: '',
      remark: '',
    },
    headImgUrl: '',
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
    if(this.options.id) {
      this.init();
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: this.options.id  ? '编辑店员' : '添加店员'
    })
  },
  init(){
    tools.showLoading();
    app.wxRequest(
        '/api/storeEmployee/queryStoreEmpById',
        {
          empId: this.options.id
        },
        res => {
          tools.hideLoading();
          if(res.data.code == 1){
            const result = res.data.data;
            this.setData({
              list_data: result,
              headImgUrl: tools.globalData.url + result.headImgUrl,
              lispic_path: result.headImgUrl
            })
          }else{
            tools.showToast(res.data.msg)
          }
        }
    )
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    const {name, phone, deptName, position,remark} = e.detail.value;
    const { lispic_path } = this.data;
    if(tools.isNull(lispic_path)){
      tools.showToast('请选择头像');
    }else if (tools.isNull(name)) {
      tools.showToast('请输入姓名');
    }else if (tools.isNull(phone)) {
      tools.showToast('请输入手机号');
    }else if (!tools.checkPhone(phone)) {
      tools.showToast('手机号有误');
    }else if (tools.isNull(deptName)) {
      tools.showToast('请输入部门');
    }else if (tools.isNull(position)) {
      tools.showToast('请输入职位');
    }else{
      tools.showLoading();
      let form = {
        storeId: tools.globalData.storeId,
        ...e.detail.value,
        headImgUrl: lispic_path
      };
      const url = this.options.id ? '/api/storeEmployee/editStoreEmp' : '/api/storeEmployee/saveStoreEmp';
      if(this.options.id){
        form.id = this.options.id;
      }
      app.wxRequest(
          url,
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
          headImgUrl: res
        });
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
