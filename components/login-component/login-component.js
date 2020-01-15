const app = getApp();
const tools = app.tools;
// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    val: {
      type: Boolean,
      value: false,
    },
    extendCode: {
      type: String,
      value: "",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    is_show: false,
    get_phone: false,
    login: true,
    userInfo: {},
  },
  observers: {
    'val': function (res) {
      console.log("value-------->", res)
      if (res) {
        this.show();
      }
    }
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      this.show();
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    show() {
      const that = this;
      tools.hideLoading();
      tools.isToken((flag) => {
        if (flag) {
          wx.showTabBar();
          that.setData({
            is_show: false
          })
        } else {
          wx.hideTabBar();
          this.setData({
            is_show: true
          })
        }
      });
    },
    bindGetUserInfo: function (e) {
      console.log(e)
      const userInfo = e.detail.userInfo;
      const that = this;
      if (userInfo) { //用户授权
        wx.login({
          success: e => {
            console.log(e);
            let code = e.code;

            //连带获取UnionId
            return this.getUnion(code)

            app.wxRequest('/api/login/getOpenIdSmall', {
              wxCode: code
            }, function (res) {
              tools.hideLoading();
              if (res.data.code == 1) {

                const info = {
                  headImgUrl: userInfo.avatarUrl,
                  nickName: userInfo.nickName,
                  openId: res.data.data.openId,
                };

                that.getUserInfoMsg(info)
              } else {
                tools.showToast(res.data.msg);
              }
            })

            // that.setData({
            //   userInfo: info,
            //   get_phone: true,
            //   login: false
            // })

          }
        })
      } else { //用户取消授权
        tools.hideLoading();
      }
    },

    cancel: function () {
      wx.showModal({
        title: '提示',
        content: '取消授权将无法使用该功能',
        confirmColor: "#5ac2bb",
        success: res => {
          if (res.confirm) {
            this.setData({
              is_show: false
            })
          }
        }
      })
    },

    getUnion: function (wxCode) {
      // return tools.showToast(this.properties.extendCode)
      wx.getUserInfo({
        success: res => {
          const {
            encryptedData,
            iv
          } = res
          console.log("properties.extendCode--------->", this.properties)
          const userInfo = res.userInfo
          app.wxRequest('/api/login/smallLogin', {
            wxCode,
            encryptedData,
            iv,
            extendCode: this.properties.extendCode
          }, op => {
            const token = op.data.data.token;
            tools.setStorage('token', token);
            this.getUserInfoMsg()
          })
        }
      })
    },

    getUserInfoMsg: function () {
      app.wxRequest(
        '/api/user/userInfo', {},
        res => {
          tools.hideLoading();
          if (res.data.code == 1) {
            console.log(res.data.data)
            const userInfoSys = res.data.data;
            this.setData({
              userInfo: userInfoSys,
              is_show: false
            })
            tools.setStorage('userInfo', userInfoSys);
            this.triggerEvent('myevent', true);
            wx.startLocationUpdateBackground({
              success: () => {
                wx.onLocationChange({
                  success: () => {
                    console.log("成功打开定位")
                  }
                })
              }
            })
          }
        }
      )
    },
  }
})