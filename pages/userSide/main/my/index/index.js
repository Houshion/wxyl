const app = getApp();
const tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: {extendCode:'',
    lists: [{
        title: "我的订单",
        img: '/images/ic_order.png',
        url: '../order/index/index'
      },
      {
        title: "我的会员",
        img: '/images/ic_vip.png',
        url: '../vip/index/index'
      },
      {
        title: "我的评论",
        img: '/images/ic_comment.png',
        url: '../comment/index'
      },
      {
        title: "我的收藏",
        img: '/images/ic_collect.png',
        url: '../collet/index'
      },
      {
        title: "我的推广",
        img: '/images/ic_promotion.png',
        url: '../generalize/index'
      },
      {
        title: "推荐收益",
        img: '/images/ic_income.png',
        url: '../recommend/index/index'
      },
      {
        title: "设置",
        img: '/images/ic_setting.png',
        url: '../setting/index/index'
      },
    ],
    login_status:false,
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const url = decodeURIComponent(options.q)
    const code = url.split("code=")[1]
    this.setData({
      // deviceNo: macno
      extendCode: code
    })
    console.log("extendCode------------------->",code)
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
    this.getUserInfo()
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
      imgUrl: '/images/shareBac.png', //转发时显示的图片路径，支持网络和本地，不传则使用当前页默认截图。
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
  },

  getUserInfo() {
    app.wxRequest(
      '/api/user/userInfo', {},
      res => {
        tools.hideLoading();
        if (res.data.code == 1) {
          console.log(res.data.data)
          let userInfo = res.data.data;
          if (userInfo.headImgUrl.indexOf("http") == -1) {
            userInfo.headImgUrl = tools.globalData.url + userInfo.headImgUrl
          }
          this.setData({
            userInfo
          })
          tools.setStorage('userInfo', userInfo);
          console.log(userInfo)
        }
      }
    )
  },

  goMessage(){
    console.log(123456)
    wx.navigateTo({
      url: "/pages/userSide/main/my/message/index"
    })
  }
})