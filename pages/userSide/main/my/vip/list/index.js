const app = getApp();
const tools = app.tools;
let form = {
  page: 1,
  limit: 20,
}

Page({

  /**
   * 页面的初始数据
   */
  data: {extendCode:'',
    show: false,
    columns: ['充值', '提现', '推荐人收益', '推荐订单收益' ,'推荐店铺收益'],
    typeList: [{
        title: "充值",
        value: 1,
      },
      {
        title: "提现",
        value: 2,
      },
      {
        title: "推荐人收益",
        value: 3,
      },
      {
        title: "推荐订单收益",
        value: 4,
      },
      {
        title: "推荐店铺收益",
        value: 5,
      },
    ],
    type: 0,
    lock: false,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      // deviceNo: macno
      extendCode: options.extendCode
    })
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
    this.init();
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
    wx.showNavigationBarLoading();
    form.page = 1;
    this.init();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // form.page++;
    // if (!this.data.lock) {
    //   this.init();
    // }
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

  init() {
    form.type = this.data.typeList[this.data.type].value
    app.wxRequest(
      '/api/user/bills', form,
      res => {
        if (res.data.code == 1) {
          let list = [...this.data.list, ...res.data.data.list]
          this.setData({
            list
          })
        } else {
          tools.showToast(res.data.msg)
        }
      }
    )
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  onChange(e) {
    this.setData({
      type: e.detail.index,
      list: []
    })
    this.init()
  },
  closeWin() {
    this.setData({
      show: false,
    })
  },

  chooseType() {
    this.setData({
      show: true
    })
  }
})