// page/component/orders/orders.js
const app = getApp();
const headUrl = app.globalData.headUrl;
const imageHeadUrl = app.globalData.imageHeadUrl;
const userId = app.globalData.userId;

Page({
  data: {
    address: {},
    hasAddress: false,
    total: 0,
    orders: [],
    ma: "happy",
    imageHeadUrl: imageHeadUrl
  },

  //从服务器获取订单数据,onShow比onReady先执行
  onLoad(e) {
    this.setData({
      orders: JSON.parse(e.orders)
    })
    this.getTotalPrice();
  },

  onShow: function () {
    const self = this;
    // wx.getStorage({
    //   key: 'address',
    //   success(res) {
    //     self.setData({
    //       address: res.data,
    //       hasAddress: true
    //     })
    //   }
    // });

    wx.request({
      url: headUrl + '/addressController/getAddressListByUserId.do?method=doWx&userId=' + userId + '&isDefault=true',
      success(res) {
        if (res.data.code == "0") {
          console.log(res.data.data)
          if (res.data.data.length > 0 && res.data.data[0] != null){
            self.setData({
              address: res.data.data[0],
              hasAddress: true
            });
          }
        }
      }
    });
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
    wx.showModal({
      title: '提示',
      content: '本系统只做演示，支付系统已屏蔽',
      text: 'center',
      complete() {
        wx.switchTab({
          url: '/page/component/user/user'
        })
      }
    })
  },
  updateAddressInfo: function(){
    wx.navigateTo({
      url: '../address/address?address=' + JSON.stringify(this.data.address)
    })
  }
})