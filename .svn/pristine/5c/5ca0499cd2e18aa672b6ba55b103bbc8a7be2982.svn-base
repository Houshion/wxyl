const app = getApp();
const tools = app.tools;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    extendCode: '',
    type: "",
    userInfo: '',
    codeText: "获取验证码",
    changePhoneForm: {
      phone: '',
      code: ''
    },
    getCodeStatus: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const type = options.type
    this.setData({
      type,
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
    const userInfo = tools.getStorage("userInfo");
    if (userInfo.headImgUrl.indexOf("http") == -1) {
      userInfo.headImgUrl = tools.globalData.url + userInfo.headImgUrl
    }
    this.setData({
      userInfo
    })
    console.log(userInfo)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

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

  changePhone(e) {
    this.setData({
      'changePhoneForm.phone': e.detail.value
    })
  },
  getCodeInput(e) {
    this.setData({
      'changePhoneForm.code': e.detail.value
    })
  },
  getp1(e) {
    this.setData({
      'changePhoneForm.password': e.detail.value
    })
  },
  getp2(e) {
    this.setData({
      'changePhoneForm.passwordAgain': e.detail.value
    })
  },

  getCode() {
    if (this.data.getCodeStatus) {
      if (!this.data.changePhoneForm.phone) return tools.showToast("手机号码不能为空")
      app.wxRequest(
        '/api/login/getCode', {
          phone: this.data.changePhoneForm.phone
        },
        res => {
          tools.hideLoading();
          if (res.data.code == 1) {
            tools.showToast("发送成功")
            let time = 60;
            let interval = setInterval(() => {
              time--
              if (time > 0) {
                this.setData({
                  codeText: time + "S",
                  getCodeStatus: false,
                })
              } else {
                this.setData({
                  codeText: "重新获取",
                  getCodeStatus: true,
                })
                clearInterval(interval)
              }
            }, 1000);
          } else {
            tools.showToast(res.data.msg)
          }
        }
      )
    }
  },

  getPhone(e) {
    console.log(e)
  },

  submit(e) {
    let email = e.detail.value.email
    if (!tools.isEmail(email) && this.data.type == 'email') return tools.showToast("邮箱格式不正确")
    if (this.data.type == 'phone') {
      app.wxRequest(
        '/api/user/updatePhone', this.data.changePhoneForm,
        res => {
          tools.hideLoading();
          tools.showToast(res.data.msg)
          if (res.data.code == 1) {
            setTimeout(() => {
              wx.navigateBack()
            }, 1500);
          }
        }
      )
    } else if (this.data.type == 'changePass') {
      console.log('修改密码')
      if (this.data.changePhoneForm.passwordAgain != this.data.changePhoneForm.password) return tools.showToast("两次输入密码不一致")

      app.wxRequest(
        '/api/user/updatePwd', this.data.changePhoneForm,
        res => {
          tools.hideLoading();
          tools.showToast(res.data.msg)
          this.getUserInfo()
          if (res.data.code == 1) {
            setTimeout(() => {
              wx.navigateBack()
            }, 1500);
          }
        }
      )
    } else {
      const form = e.detail.value
      app.wxRequest(
        '/api/user/updateUser', form,
        res => {
          tools.hideLoading();
          tools.showToast(res.data.msg)
          this.getUserInfo()
          if (res.data.code == 1) {
            setTimeout(() => {
              wx.navigateBack()
            }, 1500);
          }
        }
      )
    }
  },
  getUserInfo() {
    app.wxRequest(
      '/api/user/userInfo', {},
      res => {
        tools.hideLoading();
        if (res.data.code == 1) {
          console.log(res.data.data)
          const userInfo = res.data.data;
          if (userInfo.headImgUrl.indexOf("http") == -1) {
            userInfo.headImgUrl = tools.globalData.url + userInfo.headImgUrl
          }
          this.setData({
            userInfo
          })
          tools.setStorage('userInfo', userInfo);
        }
      }
    )
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      'userInfo.birthdayStr': e.detail.value
    })
  },
})