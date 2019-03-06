//获取应用实例
const app = getApp();
const headUrl = app.globalData.headUrl;
const imageHeadUrl = app.globalData.imageHeadUrl;
let userId = app.globalData.userId;
Page({
  data: {
    imgUrls: [
      '/image/b1.jpg',
      '/image/b2.jpg',
      '/image/b3.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    odd_goods: [],
    title_goods:[],
    productGoods:[],
    new_even: "jjfdsafsdafsdafasf",
    interval: 3000,
    duration: 800,
    imageHeadUrl: imageHeadUrl
  },
  onLoad(){
    userId = getApp().globalData.userId;
  },
  onReady() {//获取奇数商品详情   
    wx.showToast({
      title: "加载中...",
      icon: "loading",
      duration: 10000
    });
    var self = this;

    // wx.request({
    //   url: 'http://localhost:8080/yMybatis/good/get_title',
    //   success(res) {
    //     self.setData({
    //       title_goods: res.data,
    //     });
    //   },
    // });
    //获取商品列表 yjf
    wx.request({
      url: headUrl +'/productController/getProductListByCriteria.do?method=doWx',
      success(res) {
        if (res.data.code == "0"){
          wx.hideToast();
          console.log(res.data.data);
          self.setData({
            odd_goods: res.data.data
          });
        }
      }
    });
  },
  search: function (e) {
    console.log(headUrl + '/productController/getProductListByCriteria.do?method=doWx&searchText=' + e.detail.value);
    wx.showToast({
      title: "加载中...",
      icon: "loading",
      duration: 10000
    });
    var that = this;
    wx.request({
      url: headUrl + '/productController/getProductListByCriteria.do?method=doWx&searchText=' + e.detail.value,
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        wx.hideToast();
        if (res.data.code == "0") {
          console.log(res.data.data);
          that.setData({
            odd_goods: res.data.data
          });
        }
      }
    });
  },
  addToCart:function(e){
    wx.request({
      url: headUrl + "/mallOrderController/saveMallOrder.do?method=doWx&productId=" + e.currentTarget.dataset.productid + "&productNum=1&userId=" + userId + "&orderStatus=1&orderAmount=" + e.currentTarget.dataset.price,
      header: {
        "Content-Type": "application/json;charset=utf-8",
      },
      method: "POST",
      success(res) {
        if (res.data.code == "0") {
          wx.showToast({
            title: '已添加到购物车',
            icon: 'success',
            duration: 2000,
            mask: true//防止触摸穿透
          })
        }else{
          wx.showToast({
            title: '添加失败',
            icon: 'loading',
            image: 'image/error.png',
            duration: 2000,
            mask: true//防止触摸穿透
          })
        }
      }
    });
  }
})