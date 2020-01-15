const app = getApp();
const tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      account: '',
      password: '',
      logoImgUrl: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.init();
  },
  init(){
    tools.showLoading();
    app.wxRequest(
        '/api/user/aboutUs',
        {},
        res => {
          tools.hideLoading();
          if(res.data.code == 1){
            const result = res.data.data;
            this.setData({
              logoImgUrl: tools.globalData.url + result.logoImgUrl,
            })
          }else{
            tools.showToast(res.data.msg)
          }
        }
    )
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const operation_login = tools.getStorage('operation_login');
    console.log(operation_login)
    if(operation_login){
      const form ={
        account: operation_login.account,
        password: operation_login.password
      };
      this.setData({
        form
      })
    }
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    const { account, password} = e.detail.value;
    console.log(account)
    if(tools.isNull(account)){
      tools.showToast('请输入账号');
    }else if(tools.isNull(password)){
      tools.showToast('请输入密码');
    }else{
      tools.showLoading();
      app.wxRequest(
          '/api/platformUser/queryPlatformLogin',
          {
            ...e.detail.value
          },
          res => {
            tools.hideLoading();
            if(res.data.code == 1){
              tools.setStorage('operation_login',e.detail.value);
              tools.setStorage('operationToken',res.data.data.token);
              tools.showToast('登录成功');
              setTimeout(() => {
                tools.reLaunch('/pages/operation/index/index');
              },1500)
            }else{
              tools.showToast(res.data.msg)
            }
          },false
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
