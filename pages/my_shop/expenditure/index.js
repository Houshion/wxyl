const app = getApp();
const tools = app.tools;
let pageMsg = {
  page: 1,
  limit: 20
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lock: false,
    list: [],
    is_show: false,
    form: {
      startTime: '',
      endTime: ''
    },
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
  listeningEvent(e){
    this.onShow();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    pageMsg.page = 1;
    this.init();
  },
  init() { //获取列表
    tools.showLoading();
    const form = {
      ...pageMsg,
      ...this.data.form,
      storeId: tools.globalData.storeId
    };
    app.wxRequest('/api/storeCost/queryStoreCostList',form , res => {
      tools.hideLoading();
      if (res.data.code == 1) {
        const result = res.data.data.list;
        this.setData({
          list: pageMsg.page == 1 ? result : this.data.list.concat(result),
          lock: pageMsg.page >= res.data.data.totalPage ? true : false
        })
      } else {
        tools.showToast(res.data.msg);
      }
      if(pageMsg.page == 1){
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    });
  },
  listeningEvent(e){
    console.log(e)
    const {start, end } = e.detail;
    const form = {
      startTime: start.date,
      endTime: end.date
    };
    this.setData({
      form
    });
    pageMsg.page = 1;
    this.init();
  },
  listeningCancel(e){
    this.setData({
      is_show: false
    })
  },
  chose_date(){
    this.setData({
      is_show: true
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
    wx.showNavigationBarLoading();
    pageMsg.page = 1;
    this.init();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    pageMsg.page ++;
    if (!this.data.lock) {
      this.init();
    }
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
