// pages/my_investment/statistics_content/index.js
import * as echarts from '../../../ec-canvas/echarts';

const app = getApp();
const tools = app.tools;

let data = [], x_data = [];
let chart;

function initChart(canvas, width, height) {
    chart = echarts.init(canvas, null, {
        width: width,
        height: height
    });
    canvas.setChart(chart);

    var option = {
        backgroundColor: '#fff',
        legend: {
            data
        },
        grid: {
            left: '3%',
            right: '10%',
            bottom: '3%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            interval: 1,
            type: 'category',
            boundaryGap: false,
            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#666',
                    fontSize: 10
                }
            },
            splitLine: { //网格线
                show: true,
                lineStyle: {
                    color: ['#afafaf'],
                    type: 'solid'
                }
            },
            data: x_data
        },
        yAxis: {
            axisTick: {
                show: false
            },
            axisLine: {
                show: false,
                //    onZero:false
            },
            axisLabel: {
                textStyle: {
                    color: '#666',
                    fontSize: 10
                }
            },
            splitLine: { //网格线
                show: true,
                lineStyle: {
                    color: ['#afafaf'],
                    type: 'solid'
                }
            }
        },
        series: [
            {
                type: 'line',
                smooth: true,
                symbolSize: 8,
                color: ["#f69626"],
                data,
                label: {
                    normal: {
                        show: false,
                        position: 'top',//值显示

                    }
                },
                markArea: {
                    silent: true,
                    data: [[{
                        yAxis: '60'
                    }, {
                        yAxis: '120'
                    }]],
                    itemStyle: {
                        color: '#c4eee9',
                        opacity: '0.6'
                    },

                },

            }]
    };

    chart.setOption(option);
    return chart;
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: ['日', '月', '年'],
        o_index: 0,
        type_date: ['day', 'month', 'year'],
        ec: {
            onInit: initChart
        },
        form: {
            startTime: '',
            endTime: ''
        },
        countList: [],
        money: '',
        day: {
            minDate:  '2010-01-01',
            maxDate: '',
        }
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
        this.setData({
            'day.maxDate': tools.format(new Date().getTime(),'Y-m-d')
        })
        console.log(this.data.day)
    },
    listeningEvent(e){
        this.onShow();
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.init();
    },
    init() {
        console.log(this.options.type)
        this.setData({
            type: this.options.type || ''
        })
        let url;
        switch (this.options.type) {
            case 'investShare':
                url = '/api/investorIncome/queryShareCount';
                break;
            case 'withdraw':
                url = '/api/withdrawRecord/queryWithdrawCount';
                this.setData({
                  'form.userType': '1'
                })
                break;
          case 'withdrawShop':
            url = '/api/withdrawRecord/queryWithdrawCount';
            this.setData({
              'form.userType': '2'
            })
            break;
            case 'shopOrder':
                url = '/api/order/queryStoreOrderDataCount';
                break;
            case 'shopRevenue':
                url = '/api/store/queryStoreRevenueCount';
                break;
            case 'shopShare':
                url = '/api/store/queryStoreShareCount';
                break;
        }
        tools.showLoading();
        app.wxRequest(
            url,
            {
                type: this.data.o_index*1 + 1,
                ...this.data.form
            },
            res => {
                tools.hideLoading();
                if (res.data.code == 1) {
                    let money;
                    switch (this.options.type) {
                        case 'investShare':
                            money=res.data.data.money;
                            break;
                        case 'withdraw':
                            money=res.data.data.money;
                            break;
                      case 'withdrawShop':
                            money = res.data.data.money;
                            break
                        case 'shopOrder':
                            money=res.data.data.orderTotal;
                            break;
                        case 'shopRevenue':
                            money=res.data.data.revenueSumMoney;
                            break;
                        case 'shopShare':
                            money=res.data.data.shareSumMoney;
                            break;
                    }
                    const countList = (res.data.data.countList).reverse()
                    this.setData({
                        countList ,
                        money
                    })
                    x_data = [];
                    data = [];
                    if(countList.length > 0){
                        countList.forEach((item, index) => {
                            x_data.push(item.ctime);
                            if(this.options.type == 'shopOrder'){
                                data.push(item.orderCount);
                            }else{
                                data.push(item.money);
                            }

                        })
                        chart.setOption({
                            xAxis: {
                                data: x_data
                            },
                            series: [{
                                data: data
                            }]
                        });
                    }
                } else {
                    tools.showToast(res.data.msg)
                }
            }
        )
    },
    tab_click(e) {
        const {index} = e.currentTarget.dataset;
        if (this.data.o_index == index) return;
        const form = {
            startTime: '',
            endTime: ''
        };
        this.setData({
            o_index: index,
            form
        });
        this.init();
    },
    bindDateChange(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        const form = {
            startTime: e.detail.value,
            endTime: ''
        };
        this.setData({
            form
        })
    },
    bindDateEndChange(e){
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            'form.endTime': e.detail.value
        })
        this.init();
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
