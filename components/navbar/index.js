const app = getApp();
const tools = app.tools;
// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    index: {
      type: Number,
      value: 0,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    btns: [{
        code: 'ky',
        title: "康养",
        icon1: "/images/ic_kangyang1.png",
        icon2: "/images/ic_kangyang2.png",
        url: '/pages/userSide/main/recuperate/index/index',
        status: true
      },
      {
        code: 'fy',
        title: "服务",
        icon1: "/images/ic_sy1.png",
        icon2: "/images/ic_sy2.png",
        url: '/pages/userSide/main/service/index/index',
        status: false
      },
      {
        code: 'gl',
        title: "管理",
        icon1: "/images/ic_gli1.png",
        icon2: "/images/ic_gli2.png",
        url: '/pages/userSide/main/manager/index/index',
        status: false
      },
      {
        code: 'wd',
        title: "我的",
        icon1: "/images/ic_wd1.png",
        icon2: "/images/ic_wd2.png",
        url: '/pages/userSide/main/my/index/index',
        status: false
      }
    ]
  },
  observers: {
    'index': function (res) {
      console.log(res)
      if (res) {
        let btns = this.data.btns;
        btns.forEach(item => {
          item.status = false
        });
        btns[res].status = true;
        this.setData({
          btns
        })
      }
    }
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {},
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goScan() {
      wx.scanCode({
        success: res => {
          let result = res.result;
          let macno = result.split("=")[1]
          wx.navigateTo({
            url: "/pages/userSide/service/index?macno=" + macno
          })
        }
      })
    },
    changeNav(e) {
      const i = e.currentTarget.dataset.i
      wx.redirectTo({
        url: this.data.btns[i].url
      })
    }
  }
})