// page/component/orders/orders.js
const app = getApp();
const headUrl = app.globalData.headUrl;
const imageHeadUrl = app.globalData.imageHeadUrl;
let userId = app.globalData.userId;

Page({
  data: {
    address: {},
    hasAddress: false,
    total: 0,
    orders: [],
    ma: "happy",
    imageHeadUrl: imageHeadUrl,
    ip: ''
  },

  //从服务器获取订单数据,onShow比onReady先执行
  onLoad(e) {
    userId = getApp().globalData.userId;
    this.setData({
      orders: JSON.parse(e.orders)
    })
    this.getTotalPrice();
    const self = this;
    //获取地址信息
    wx.request({
      url: headUrl + '/addressController/getAddressListByUserId.do?method=doWx&userId=' + userId + '&isDefault=true',
      success(res) {
        if (res.data.code == "0") {
          if (res.data.data.length > 0 && res.data.data[0] != null) {
            self.setData({
              address: res.data.data[0],
              hasAddress: true
            });
          }
        }
      }
    });
    //获取ip
    wx.request({
      url: 'https://pv.sohu.com/cityjson?ie=utf-8',
      success: function (e) {
        let arr = e.data.split(" = ");
        let returnCitySN = JSON.parse(arr[1].replace(";", ""));
        self.setData({
          ip: returnCitySN.cip
        })
      }
    })
  },

  onShow: function () {
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let orders = this.data.orders;
    let total = 0;
    for (let i = 0; i < orders.length; i++) {
      total += orders[i].productNum * orders[i].productPrice;
    }
    this.setData({
      total: total.toFixed(2)
    })
  },

  toPay() {
    wx.request({
      url: headUrl + '/weChatPayController/weChatPay.do?method=doWx&userId=' + userId + '&cip=' + this.data.ip,
      success: function (e) {
        if(e.data.code == "0"){
          console.log(e);
          console.log(e.data.data.package)
          wx.requestPayment({
            'timeStamp': e.data.data.timeStamp + "",
            'nonceStr': e.data.data.nonceStr,
            'package': e.data.data.package,
            'signType': e.data.data.signType,
            'paySign': e.data.data.paySign,
            'success': function (res) {
              
              console.log(res)
            },
            'fail': function (res) {
              console.log(res)
              wx.showModal({
                title: '支付提示',
                content: e.data.data.signType,
                showCancel: false
              })
            },
            'complete': function (res) {
              console.log(res)
            }
          })
        }
      }
    })
  },
  updateAddressInfo: function(){
    wx.navigateTo({
      url: '../address/list/list?isSelect=true'
    })
  }
})