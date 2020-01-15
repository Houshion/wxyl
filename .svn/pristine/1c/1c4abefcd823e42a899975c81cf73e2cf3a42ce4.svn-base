const app = getApp();
const tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: {extendCode:'',
    lispic: [], //图片列表
    lispic_path: [], //图片列表路径
    orderId: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId,
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

  },
  /**
   * 上传图片
   */
  choice() {
    let that = this;
    app.uploadFile('', function(flag, idx, msg, data) {
      if (flag == 1) {
        let res = msg.tempFilePaths;
        if (that.data.lispic.length < 9) {
          that.setData({
            lispic: that.data.lispic.concat(res)
          });
        } else {
          tools.showModal('最多只能上传9张图片...', () => {}, false);
          return false;
        }

      } else if (flag == 2) {
        tools.hideLoading();
        if (that.data.lispic_path.length < 9) {
          that.data.lispic_path.push(msg);
        }
      }
    }, {token: tools.getStorage('token')}, 9 - that.data.lispic.length)
  },
  indexpic_delete(e) { //删除图片
    const {
      lispic,
      lispic_path
    } = this.data;
    tools.showModal('是否删除图片？', (flag) => {
      if (flag) {
        lispic.splice(e.currentTarget.dataset.index, 1);
        lispic_path.splice(e.currentTarget.dataset.index, 1);
        this.setData({
          lispic,
          lispic_path
        });
      }
    });
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    const {
      lispic_path
    } = this.data;
    const {deviceNo, content} = e.detail.value;
    if (tools.isNull(content)) {
      tools.showToast('请输入评论内容');
    }else{
      tools.showLoading();
      app.wxRequest(
          '/api/order/comment',
          lispic_path.length > 0 ? {
            ...e.detail.value,
            imgs: lispic_path.join(','),
            orderId: this.data.orderId
          } : {
            ...e.detail.value,
            orderId: this.data.orderId
          },
          res => {
            tools.hideLoading();
            if(res.data.code == 1){
             tools.showModal('提交成功', (flag) => {
               if(flag){
                 tools.navigateBack()
               }
             },false)
            }else{
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
  }
})
