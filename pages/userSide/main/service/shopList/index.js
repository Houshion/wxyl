const app = getApp();
const tools = app.tools;

let data;
let citys = {};
let province = {};
let city = {};
let defaultCity = "北京市";

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
      lon: ''
    },
    searchShopName: '',
    shopsList: [],
    form: '',
    show: false,
    columns: [],
    citys: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      form: JSON.parse(options.form),
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
    this.getData()
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
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        const location = {
          longitude: res.longitude,
          latitude: res.latitude
        }
        this.getcity(location, locatData => {
          console.log(locatData)
          let center = {
            city: locatData.result.address_component.city,
            lat: locatData.result.location.lat,
            lon: locatData.result.location.lng
          }
          this.setData({
            center
          })
          this.init()
        })
      }
    })
  },
  goShop(e) {
    const {
      id
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: "../shopDetail/index?id=" + id
    })
  },

  init() {
    const {
      lat,
      lon,
      city
    } = this.data.center;
    const name = this.data.searchShopName
    this.data.form.name = name
    this.data.form.city = city
    this.data.form.lat = lat
    this.data.form.lon = lon
    console.log("init.form---->", this.data.form)
    app.wxRequest(
      '/api/service/serviceStoreList', this.data.form,
      res => {
        if (res.data.code == 1) {
          let markers = [];
          res.data.data.forEach(item => {
            markers.push({
              iconPath: "/images/marker.png",
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

  getCityLocation(address, cb) {
    var QQMapWX = require('../../../../../utils/qqmap-wx-jssdk.min.js');
    var qqMap = new QQMapWX({
      key: 'H3ABZ-W4UK3-RZY3H-3FPJ3-PNLES-L3BZG'
    });
    qqMap.geocoder({
      address,
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

  showCity() {
    console.log(123)
    this.setData({
      show: true
    })
  },
  onClose() {
    this.setData({
      show: false
    })
  },

  getData() {
    app.wxRequest(
      '/api/location/getLocation', {},
      res => {
        // console.log(JSON.stringify(res.data.data))
        // const citys = {
        //   '浙江': ['杭州', '宁波', '温州', '嘉兴', '湖州'],
        //   '福建': ['福州', '厦门', '莆田', '三明', '泉州']
        // };
        data = res.data.data;
        data.forEach(citem => {
          citys[citem.name] = []
          citem.childrenList.forEach(pitem => {
            province[pitem.name] = []
            pitem.childrenList.forEach(item => {
              city[item.name] = []
              province[pitem.name].push(item.name)
            })
            // console.log(JSON.stringify(province))
          })
          citys[citem.name].push(province)
        });

        let columns = [{
            values: Object.keys(citys),
            className: 'column1'
          },
          {
            values: Object.keys(citys['中国'][0]),
            className: 'column2',
          },
          {
            values: citys['中国'][0]["北京市"],
            className: 'column3',
          },
        ]
        let con = Object.keys(citys)[0]
        let pro = Object.keys(citys[con][0])[0]
        let c = citys[con][0][pro][0]
        this.setData({
          columns,
          citys: c
        })
      }
    )
  },
  onChange(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    console.log(value)
    if (index == 0) {
      picker.setColumnValues(1, citys[value[0]]);
      this.setData({
        citys: citys[value[0]][0][value[1]][0]
      })
    } else if (index == 1) {
      picker.setColumnValues(2, citys[value[0]][0][value[1]]);
      this.setData({
        citys: citys[value[0]][0][value[1]][0]
      })
    } else {
      this.setData({
        citys: value[2]
      })
    }
  },
  onConfirm() {
    this.onClose()
    this.getCityLocation(this.data.citys, loc => {
      let lon = loc.result.location.lng
      let lat = loc.result.location.lat
      console.log({
        'center.city': this.data.citys,
        'center.lon': lon,
        'center.lat': lat,
      })
      this.setData({
        'center.city': this.data.citys,
        'center.lon': lon,
        'center.lat': lat,
      })
      this.init()
    })
  }
})