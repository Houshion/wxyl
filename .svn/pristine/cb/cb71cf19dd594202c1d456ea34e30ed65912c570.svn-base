const app = getApp();
const tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {name: 'bankNo',title: '银行卡号',type: 'number'},
      {name: 'bankName',title: '银行名称',type: 'text'},
      {name: 'realName',title: '卡号实名',type: 'text'},
    ],
    form: {
      money: "",
      type: ''
    },
    money: 0,
    serverCharge: 0,
    limit: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      money: this.options.money,
      'form.type': this.options.type == 'shop' ? 2: 1
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  listeningEvent(e){

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.init();
  },
  init() {
    app.wxRequest(
        '/api/aboutUs/getAbout', this.data.form,
        res => {
          if (res.data.code == 1) {
            console.log(res.data.data)
            this.setData({
              serverCharge: res.data.data.withdraw_ratio,
              limit: res.data.data.withdraw_limit,
            })
          } else {
            tools.showToast(res.data.msg)
          }
        }
    )
  },
  getNum(e) {
    console.log(e.detail)
    this.setData({
      'form.money': e.detail.value *1
    })
  },
  formSubmit: function (e) {
    const { limit, money} = this.data;
    let withdrawMoney;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    console.log(this.data.form.money > money*1)
    if(!this.data.form.money){
      return tools.showToast("请输入提现金额");
    } else if(this.data.form.money > money*1){
       return tools.showToast('提现金额大于余额')
    }else if(this.data.form.money < limit){
      return tools.showToast("未达最小提现金额");
    }else if (this.data.form.money % limit > 0) {
      withdrawMoney = this.data.form.money - (this.data.form.money % limit)
      wx.showModal({
        title: '温馨提示',
        content: '此次最大提现金额为' + withdrawMoney + "元，是否继续？",
        confirmColor: "#5ac2bb",
        success:res=> {
            if (res.confirm) {
              this.setData({
                'form.money': withdrawMoney
              })
              this.submit(e)
            }
        }
      })
    } else {
      this.submit(e)
    }
  },

  submit(e){
    const { bankNo, bankName, realName} = e.detail.value;
    if (tools.isNull(bankNo)) {
      tools.showToast('请输入银行卡号');
    }else if (tools.isNull(bankName)) {
      tools.showToast('请输入银行名称');
    }else if (tools.isNull(realName)) {
      tools.showToast('请输入卡号实名');
    }else{
        tools.showLoading();
        app.wxRequest(
            '/api/withdrawRecord/saveWithdrawRecord', {
              ...this.data.form,
              ...e.detail.value
            },
            res => {
              if (res.data.code == 1) {
                tools.showModal('操作成功，等待审核...',flag => {
                  if(flag){
                    tools.navigateBack();
                  }
                },false)
              } else {
                tools.showToast(res.data.msg)
              }
            }
        )
    }
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
