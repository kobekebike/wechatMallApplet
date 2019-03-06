//获取应用实例
const app = getApp();
const headUrl = app.globalData.headUrl;
const imageHeadUrl = app.globalData.imageHeadUrl;
let userId = app.globalData.userId;
Page({
  data: {
    goods: {//前端调用貌似不需要加，但网络请求调用的时候要加
      productId: 0,
      productDetail: '',
      productPrice: '',
      productTitle: '',
      productType: '',
      productFilePath:'',
      productDescribe: '',
      service: '如果有质量问题请联系客户人员。欢迎下次光临！'
    },
    num: 1,
    totalNum: 0,
    hasCarts: false,
    curIndex: 0,
    show: false,
    scaleCart: false,
    imageHeadUrl: imageHeadUrl
  },
  //获取从首页或购物车传过来的数据,这样就可以取出json数组中里面的字符串再放到一个数组中，解决了首页就处理数组字符串的问题
  onLoad: function (options) {
    userId = getApp().globalData.userId;
    this.setData({
      productId: options.productId,
      productTitle: options.productTitle,
      productPrice: options.productPrice,
      productType: options.productType,
      productFilePath: options.productFilePath,
      productDescribe:options.productDescribe,
    })
    var self = this;
    wx.request({
      url: headUrl + '/productController/getProductDetail.do?method=doWx&productId=' + options.productId,
      success(res) {
        if (res.data.code == "0") {
          self.setData({
            productDetail: res.data.data.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ')
          });
        }
      }
    });
  },
  click: function (e) {
    wx.request({
      url: headUrl + "/mallOrderController/saveMallOrder.do?method=doWx&productId=" + this.data.productId + "&productNum=1&userId=" + userId + "&orderStatus=1&orderAmount=" + this.data.productPrice,
      header: {
        "Content-Type": "application/json;charset=utf-8",
      },
      method: "POST"
    }); 

    wx.showToast({
      title: '已添加到购物车',
      icon: 'success',
      duration: 2000,
      mask: true//防止触摸穿透
    })
  },

  addCount() {
    let num = this.data.num;
    num++;
    this.setData({
      num: num
    })
  },

  // addToCart() {
  //   const self = this;
  //   const num = this.data.num;
  //   let total = this.data.totalNum;

  //   self.setData({
  //     show: true
  //   })
  //   setTimeout(function () {
  //     self.setData({
  //       show: false,
  //       scaleCart: true
  //     })
  //     setTimeout(function () {
  //       self.setData({
  //         scaleCart: false,
  //         hasCarts: true,
  //         totalNum: num + total
  //       })
  //     }, 200)
  //   }, 300)

  // },

  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  }

})