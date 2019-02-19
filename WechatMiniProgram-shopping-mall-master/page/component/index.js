//获取应用实例
const app = getApp();
const headUrl = app.globalData.headUrl;
const imageHeadUrl = app.globalData.imageHeadUrl;
Page({
  data: {
    imgUrls: [
      '/image/b1.jpg',
      '/image/b2.jpg',
      '/image/b3.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    odd_goods: ["nae", "john"],
    even_goods: [],
    title_goods:[],
    productGoods:[],
    new_even: "jjfdsafsdafsdafasf",
    interval: 3000,
    duration: 800,
    imageHeadUrl: imageHeadUrl
  },

  onReady() {//获取奇数商品详情    
    wx.showToast({
      title: "加载中...",
      icon: "loading",
      duration: 10000
    });
    var self = this;
    // wx.request({
    //   url: 'http://localhost:8080/yMybatis/good/get_all_odd',
    //   success(res) {
    //     self.setData({
    //       odd_goods: res.data,
    //       //new_even:res.data[2].goodName.substr(3,6)//good      
    //     });
    //   }
    // });
    // wx.request({
    //   url: 'http://localhost:8080/yMybatis/good/get_all_even',
    //   success(res) {
    //     self.setData({
    //       even_goods: res.data,
    //     });
    //   },
    // });
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
    console.log(e.currentTarget.dataset.productid)
  }
})