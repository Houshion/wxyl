const app = getApp();
const tools = app.tools;
let interval;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    extendCode: '',
    id: 0, //订单ID
    orderMsg: {},
    form: "",
    time: 0,
    using: false,
    remainNum: 0,
    op: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const form = {
      "deviceNo": options.deviceNo,
      "orderId": options.orderId,
    }
    this.setData({
      form,
      op: options.op,
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
    this.init()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(interval)
    this.setData({
      op: 0,
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(interval)
    this.setData({
      op: 0,
    })
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

  init() {
    app.wxRequest(
      '/api/order/getUseOrder', {
        orderId: this.data.form.orderId
      },
      res => {
        if (res.data.code == 1) {
          let {
            useTime,
            useNum,
            remainNum
          } = res.data.data
          this.setData({
            remainNum
          })
          let time = Number(useTime)
          console.log("时间-------->", time, res.data.data)
          if (time > 0) { //还有剩余时间
            this.setData({
              using: true
            })
            this.intervalTime(time)
          } else { //没有剩余时间
            if (useNum == 0 || this.data.op == 1) { //从未使用过或者从订单页进入
              this.openDevice()
            } else if (useNum > 0 && remainNum != 0) { //使用过
              clearInterval(interval)
              this.setData({
                using: false
              })
            }
          }
        } else {
          tools.showToast(res.data.msg);
        }
      }
    )
  },

  openDevice() {
    app.wxRequest(
      '/api/device/openDevice', this.data.form,
      res => {
        tools.hideLoading();
        tools.showToast(res.data.msg);
        if (res.data.code == 1) {
          let time = Number(res.data.data)
          this.intervalTime(time)
          this.setData({
            using: true
          })
        } else {
          setTimeout(() => {
            wx.navigateBack()
          }, 1500);
        }
      }
    )
  },

  intervalTime(times) {
    const that = this
    interval = setInterval(() => {
      if (times > 0) {
        that.countTime(times)
        times--
      } else {
        clearInterval(interval)
        that.setData({
          using: false
        })
      }
    }, 1000);
  },

  countTime(value, dw) {
    var theTime = parseInt(value)
    var theTime1 = 0
    var theTime2 = 0
    var result
    if (theTime > 60) {
      theTime1 = parseInt(theTime / 60)
      theTime = parseInt(theTime % 60)
      if (theTime1 > 60) {
        theTime2 = parseInt(theTime1 / 60)
        theTime1 = parseInt(theTime1 % 60)
      }
    }
    if (dw && dw == "cn") {
      result = '' + parseInt(theTime) + '秒'
      if (theTime1 > 0) {
        result = '' + parseInt(theTime1) + '分' + result
      }
      if (theTime2 > 0) {
        result = '' + parseInt(theTime2) + '小时' + result
      }
    } else if (dw && dw != "cn") {
      result = '' + parseInt(theTime)
      if (theTime1 > 0) {
        result = '' + parseInt(theTime1) + dw + result
      }
      if (theTime2 > 0) {
        result = '' + parseInt(theTime2) + dw + result
      }
    } else {
      result = '' + (parseInt(theTime) < 10 ? "0" + theTime : parseInt(theTime))
      if (theTime1 > 0) {
        result = '' + (parseInt(theTime1) < 10 ? "0" + theTime1 : parseInt(theTime1)) + ':' + result
      }
      if (theTime2 > 0) {
        result = '' + (parseInt(theTime2) < 10 ? "0" + theTime2 : parseInt(theTime2)) + ':' + result
      }
    }
    this.setData({
      time: result
    })
  },

  goback() {
    wx.navigateBack()
  },

  useAgain() {
    const that = this;
    wx.showModal({
      title: '温馨提示',
      content: '是否继续使用设备？',
      confirmColor: "#5ac2bb",
      success(res) {
        if (res.confirm) {
          that.openDevice()
        }
      }
    })
  }
})