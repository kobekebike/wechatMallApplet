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
    ip: '',
    isDiscount: false,//是否有折扣
    discountTotal: 0, //折扣前的总金额
    discountMoney: 0 //折扣金额
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
    let carts = this.data.orders;
    let total = 0;
    let discountTotal = 0;
    let discountMoney = 0;
    let isDiscount = false;
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].selected) {                     // 判断选中才会计算价格
        if (carts[i].productDiscount != null && carts[i].productDiscount != 0) {
          //有折扣
          total += carts[i].productNum * carts[i].productPrice * (carts[i].productDiscount / 10);
          discountMoney += carts[i].productNum * carts[i].productPrice * (1 - carts[i].productDiscount / 10)
        } else {
          //没有折扣
          total += carts[i].productNum * carts[i].productPrice;   // 所有价格加起来
        }
        discountTotal += carts[i].productNum * carts[i].productPrice;
      }
    }
    if (discountMoney != 0) {
      isDiscount = true;
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      total: total.toFixed(2),
      isDiscount: isDiscount,
      discountTotal: discountTotal.toFixed(2),
      discountMoney: discountMoney.toFixed(2)
    });
  },

  toPay() {
    if (userId == 0){
      userId = getApp().globalData.userId;
      if (userId == 0) {
        wx.showToast({
          title: '当前网络异常，请稍后再试',
          icon: 'success',
          duration: 2000,
          mask: true
        })
        return;
      }
    }

    if(!this.data.address.addressId){
      wx.showModal({
        title: '提示',
        content: '请选择收货地址',
        showCancel: false
      })
      return;
    }
    let orders = this.data.orders;
    if (orders.length == 0){
      wx.navigateBack({
        delta: 1, // 回退前(默认为1) 页面
        success: function (res) {
          wx.showModal({
            title: '提示',
            content: '请选择商品',
            showCancel: false
          })
        }
      })
      return;
    }
    let str = "&orderId=";
    let idArr = "";
    for (let i = 0; i < orders.length; i++) {
      idArr += str + orders[i].orderId;
    }
    let obj = new Object();
    obj.userId = userId;
    obj.cip = this.data.ip;
    obj.total = this.data.total * 100;
    obj.discountTotal = this.data.discountTotal;
    obj.addressId = this.data.address.addressId

    wx.request({
      url: headUrl + '/weChatPayController/weChatPay.do?method=doWx' + idArr,
      data: obj,
      header: {
        "Content-Type": "application/json;charset=utf-8",
      },
      success: function (e) {
        if(e.data.code == "0"){
          wx.requestPayment({
            'timeStamp': e.data.data.timeStamp + "",
            'nonceStr': e.data.data.nonceStr,
            'package': e.data.data.package,
            'signType': e.data.data.signType,
            'paySign': e.data.data.paySign,
            'success': function (res) {
              wx.showLoading({
                title: '支付中...',
                mask: true
              })
              wx.request({
                url: headUrl + "/mallOrderController/updateOrderStatusInMoneyReceipt.do?method=doWx" + idArr,
                header: {
                  "Content-Type": "application/json;charset=utf-8",
                },
                method: "POST",
                success(res) {
                  if (res.data.code == "0") {
                    wx.hideLoading();
                    wx.showToast({
                      title: '支付成功',
                      icon: 'success',
                      duration: 2000,
                      mask: true,
                      success: function (res) {
                        wx.navigateBack({
                          delta: 1, // 回退前(默认为1) 页面
                        })
                      }
                    })
                  }
                }
              });
            },
            'fail': function (res) {
              wx.showModal({
                title: '提示',
                content: '支付失败',
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
  },
  onPullDownRefresh() {//监听下拉刷新
    wx.stopPullDownRefresh();//停止刷新
  }
})