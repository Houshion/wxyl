const app = getApp();
const tools = app.tools;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    extendCode: '',
    shopId: 1,
    markers: [],
    center: {
      city: '',
      lat: '',
      lng: ''
    },
    searchShopName: '',
    shopsList: [
      // {
      //   address: "广东省东莞市南城区天安数码城",
      //   distance: "5.2",
      //   time: "9:00-21:00"
      // },
      // {
      //   address: "广东省东莞市南城区天安数码城",
      //   distance: "5.2",
      //   time: "9:00-21:00"
      // },
      // {
      //   address: "广东省东莞市南城区天安数码城",
      //   distance: "5.2",
      //   time: "9:00-21:00"
      // },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      shopId: options.id,
      extendCode: options.extendCode
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getLocation()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
   * 获取地图定位
   */
  getLocation() {
    let map = wx.createMapContext("map")
    map.getCenterLocation({
      success: res => {
        console.log(res)
        let center = {
          lat: res.latitude,
          lng: res.longitude
        }
        // this.setData({
        //   center: center
        // })
        const location = {
          // longitude: res.longitude,
          // latitude: res.latitude
          longitude: 113.71154,
          latitude: 22.995895
        }
        map.moveToLocation(location)
        this.getcity(location, locatData => {
          console.log(locatData)
          let center = {
            city: locatData.result.address_component.city,
            lat: locatData.result.location.lat,
            lng: locatData.result.location.lng
          }
          this.setData({
            center
          })
          this.init()
        })
      }
    })
  },
  markertap(e) {
    wx.navigateTo({
      url: "../shopDetail/index?id=" + e.markerId
    })
  },

  init() {
    const {
      lat,
      lng,
      city
    } = this.data.center;
    const name = this.data.searchShopName
    app.wxRequest(
      '/api/service/serviceStoreList', {
        serviceId: this.data.shopId,
        lon: lng,
        lat,
        city,
        name
      },
      res => {
        if (res.data.code == 1) {
          let markers = [];
          res.data.data.forEach(item => {
            markers.push({
              iconPath: tools.globalData.url + item.logo_img_url,
              width: 50,
              height: 50,
              id: item.id,
              latitude: item.lat,
              longitude: item.lon,
            })
          });

          this.setData({
            shopsList: res.data.data,
            markers
          })
          console.log("shopsList", this.data.shopsList)
        } else {
          tools.showToast(res.data.msg)
        }
      }
    )
  },
  getcity(location, cb) {
    console.log(123)
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
        if (typeof cb === "function") cb(data);
      }
    })
  },

  onChange(e) {
    console.log(e)
    this.setData({
      searchShopName: e.detail
    });
  },
  getCity() {
    // wx.navigateTo({
    //   url: "../city/index"
    // })
  },

  goList() {
    const {
      lat,
      lng,
      city
    } = this.data.center;
    const name = this.data.searchShopName
    const form = {
      serviceId: this.data.shopId,
      lon: lng,
      lat,
      city,
      name
    }
    wx.navigateTo({
      url: "../shopList/index?form=" + JSON.stringify(form)
    })
  },
})