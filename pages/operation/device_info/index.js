const app = getApp();
const tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {}
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.init();
  },
  init(){
    tools.showLoading();
    app.wxRequest(
        '/api/device/queryDeviceInfo',
        {
          deviceNo: this.options.macno
        },
        res => {
          tools.hideLoading();
          if(res.data.code == 1){
            const result = res.data.data;
            this.setData({
              info: result
            })
          }else{
            tools.showToast(res.data.msg)
          }
        }
    )
  },
  hande_device(e){
    const { type } = e.currentTarget.dataset;
    tools.showModal('是否'+(type == 'open' ? '启动' : '停止') +'设备？',flag => {
      if(flag){
        let form = {
          deviceNo: this.options.macno,
          type: type == 'open' ? '1':'2' ,
        };
        if(type == 'stop'){
          form.openSysNum = tools.getStorage('openSysNum')
        }
        tools.showLoading();
        app.wxRequest(
            '/api/device/openAndStop',
            form,
            res => {
              tools.hideLoading();
              if(res.data.code == 1){
                const result = res.data.data;
                if(type == 'open'){
                  tools.setStorage('openSysNum',result);
                }
                tools.showToast((type == 'open' ? '启动':'停止')+'成功');
              }else{
                tools.showToast(res.data.msg)
              }
            }
        )
      }
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
