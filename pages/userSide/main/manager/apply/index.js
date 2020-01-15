const app = getApp();
const tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    extendCode: '',
    list: [{
        name: 'companyName',
        title: '公司名称',
        type: 'text',
        show: true,
        value: ''
      },
      {
        name: 'companyCode',
        title: '社会信用代码/注册号',
        type: 'number',
        show: true,
        value: ''
      },
      {
        name: 'legalPerson',
        title: '法人名称',
        type: 'text',
        show: true,
        value: ''
      },
      {
        name: 'cardNo',
        title: '身份证号',
        type: 'idcard',
        show: true,
        value: ''
      },
      {
        name: 'extendCode',
        title: '我的推荐人',
        type: 'text',
        show: true,
        disabled: true,
        value: ''
      },
    ],
    //图片列表
    cardFrontImg: "",
    cardBackImg: "",
    businessImg: "",
    //图片列表路径
    cardFrontImgPath: "",
    cardBackImgPath: "",
    businessImgPath: "",
    // 页面类型
    type: 2,
    // 店铺选择
    shopShow: false,
    shopList: [],
    shopTotalList: [],
    shopIndex: '',
    // 带店入驻店铺信息
    myShopMsg: {
      storeAddr: '',
      lon: '',
      lat: '',
      province: '',
      city: ''
    },
    showCon: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let type = options.type
    this.setData({
      extendCode: options.extendCode,
      type
    })
    if (type == 2) {
      let list = this.data.list
      list[4].show = false
      console.log(list)
      this.setData({
        list
      })
    }
    if (type == 1) {
      wx.setNavigationBarTitle({
        title: '投资人申请'
      })
    } else if (type == 2) {
      wx.setNavigationBarTitle({
        title: '新店加盟管理'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '加盟店申请'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let userInfo = tools.getStorage("userInfo");
    this.setData({
      'list[4].value': userInfo.inviteCode
    })
    this.init()
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

  /**
   * 初始化
   */
  init() {
    app.wxRequest(
      '/api/store/applyStoreList', {},
      res => {
        tools.hideLoading();
        if (res.data.code == 1) {
          console.log(res.data.data)
          let list = new Array()
          res.data.data.forEach(item => {
            list.push(item.name)
          });
          this.setData({
            shopList: list,
            shopTotalList: res.data.data
          })
        } else {
          tools.showToast(res.data.msg)
        }
      }
    )
  },

  /**
   * 申请
   */
  apply(e) {
    var _this = this;
    var post = e.detail.value;
    const {
      cardFrontImg,
      cardBackImg,
      businessImg
    } = _this.data
    post.cardFrontImg = cardFrontImg
    post.cardBackImg = cardBackImg
    post.businessImg = businessImg
    console.log(post, this.data.type)
    let url = "/api/storeApply/addStoreApply"
    if (this.data.type == 1) {
      url = "/api/investorApply/addInvestorApply"
    } else if (this.data.type == 2) {
      post.type = 1
    } else if (this.data.type == 3) {
      post.type = 2
    }

    if (post.realName && tools.isNull(post.realName)) {
      tools.showToast('请输入真实姓名');
    } else if (post.cardNo && tools.isNull(post.cardNo)) {
      tools.showToast('请输入身份证号');
    } else if (post.cardNo && !tools.checkIdCode(post.cardNo)) {
      tools.showToast('身份证号有误');
    } else if (!cardFrontImg) {
      tools.showToast('请上传身份证正面图片');
    } else if (!cardBackImg) {
      tools.showToast('请上传身份证反面图片');
    } else {
      // tools.showLoading();
      post = {
        ...post,
        ...this.data.myShopMsg
      }
      console.log(post)
      app.wxRequest(
        url,
        post,
        res => {
          tools.hideLoading();
          if (res.data.code == 1) {
            tools.showModal('提交成功', flag => {
              if (flag) {
                tools.navigateBack();
                // console.log("back")
              }
            })
          } else {
            tools.showToast(res.data.msg)
          }
        }
      )
    }
  },

  /**
   * 上传图片
   */
  choice(e) {
    const type = e.currentTarget.dataset.index
    const that = this;
    app.uploadFile('', function (flag, idx, msg, data) {
      if (flag == 1) {
        let res = msg.tempFilePaths[0];
        switch (type) {
          case 'cardFrontImg':
            that.setData({
              cardFrontImgPath: res
            })
            break;
          case 'cardBackImg':
            that.setData({
              cardBackImgPath: res
            })
            break;
          case 'businessImg':
            that.setData({
              businessImgPath: res
            })
            break;
        }
      } else if (flag == 2) {
        tools.hideLoading();
        switch (type) {
          case 'cardFrontImg':
            that.setData({
              cardFrontImg: msg
            })
            break;
          case 'cardBackImg':
            that.setData({
              cardBackImg: msg
            })
            break;
          case 'businessImg':
            that.setData({
              businessImg: msg
            })
            break;
        }
        that.setData({
          'picPathList.type': msg
        });
      }
      console.log(that.data)
    }, {
      token: tools.getStorage('token')
    }, 1)
  },

  /**
   * 选择店铺
   */
  chooseShop() {
    this.setData({
      shopShow: true
    })
  },

  pickerShopValue(e) {
    console.log(e.detail.value, e.detail.index)
    this.setData({
      shopIndex: e.detail.index
    })
    this.pickerShopCancel()
  },

  /**
   * 选择店铺关闭弹窗
   */
  pickerShopCancel() {
    this.setData({
      shopShow: false
    })
  },
  /**
   * 查找店铺位置
   */
  setLocation() {
    const that = this
    // wx.getLocation({
    //   success() {
    //     console.log(123)
    //     //打开提示框，提示前往设置页面
    //     that.setData({
    //       showCon: true
    //     })
    //   }
    // })
    wx.chooseLocation({
      success: res => {
        console.log("res", res)
        this.getcity({
          latitude: res.latitude,
          longitude: res.longitude
        }, addr => {
          console.log("address", addr)
          let myShopMsg = {
            storeAddr: res.address,
            lon: res.longitude,
            lat: res.latitude,
            province: addr.result.ad_info.province,
            city: addr.result.ad_info.city
          }
          this.setData({
            myShopMsg
          })
          console.log(this.data.myShopMsg)
        })
      },
      fail: () => {
        wx.getSetting({
          success: (res) => {
            if (!res.authSetting['scope.userLocation']) {
              console.log(541865)
              // wx.authorize({
              //   scope: 'scope.userLocation',
              //   success() {
              //     console.log(456)
              //打开提示框，提示前往设置页面
              that.setData({
                showCon: true
              })
              //   }
              // })
            }
          }
        })
      }
    })
  },
  getcity(location, cb) {
    var QQMapWX = require('../../../../../utils/qqmap-wx-jssdk.min.js');
    var qqMap = new QQMapWX({
      key: 'H3ABZ-W4UK3-RZY3H-3FPJ3-PNLES-L3BZG'
    });
    qqMap.reverseGeocoder({
      location: {
        longitude: location.longitude,
        latitude: location.latitude
      },
      success: function (data) {
        console.log(data)
        if (typeof cb === "function") cb(data);
      }
    })
  },

  listeningEvent() {
    this.onShow()
  },

  changeModalCancel() {
    this.setData({
      showCon: false
    })
  }
})