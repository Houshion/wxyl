const app = getApp();
const tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {image: '/images/icon4.png',class_name: 'icon4',title: '激活设备'},
      {image: '/images/icon5.png',class_name: 'icon5',title: '故障维修'},
      {image: '/images/icon6.png',class_name: 'icon6',title: '设备调试'},
    ]
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  hangle_click(e){
    console.log(e.currentTarget.dataset.index);
    const { index } = e.currentTarget.dataset;
    if(index == 1){
      tools.navigateTo('/pages/operation/feedback_list/index')
    }else{
      wx.scanCode({
        success(res) {
          console.log(res)
          const macno = tools.getUrlParam('macno','',res.result);
          if(res.result.indexOf('macno') != -1 && macno){
            tools.navigateTo(index==0 ?"/pages/operation/activtion_device/index?macno="+macno: "/pages/operation/device_info/index?macno="+macno);
          }else{
            tools.showToast('二维码无效');
          }
        }
      });
    }
  },
  exit_login(){
    tools.showModal('是否退出登录？',flag => {
      if(flag){
        tools.removeStorage('operation_login');
        tools.reLaunch('/pages/operation/login/index');
      }
    })
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
