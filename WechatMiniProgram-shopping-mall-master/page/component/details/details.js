// page/component/details/details.js
Page({
  data: {
    goods: {//前端调用貌似不需要加，但网络请求调用的时候要加
      productId: 0,//id没用到
      productDetail: 'origin',
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
    scaleCart: false
  },


  //获取从首页或购物车传过来的数据,这样就可以取出json数组中里面的字符串再放到一个数组中，解决了首页就处理数组字符串的问题
  onLoad: function (options) {
    this.setData({
      productId: options.productId,
      productTitle: options.productTitle,
      productPrice: options.productPrice,
      productType: options.productType,
      productDetail: options.productDetail,
      productFilePath: options.productFilePath,
      productDescribe:options.productDescribe,
    })
  },

  click: function (e) {//点击‘添加到购物车按钮’：网络请求向数据库中存入购物车信息  
    var model = this.data.productTitle;
    wx.request({
      url: "http://localhost:8080/yijifu/cart/add?productId=" + this.data.productId + "&productTitle=" + this.data.productTitle + "&productPrice=" + this.data.productPrice + "&productType=" + this.data.productType + "&productDetail=" + this.data.productDetail,
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