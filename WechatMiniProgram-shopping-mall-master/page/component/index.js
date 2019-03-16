//获取应用实例
const app = getApp();
const headUrl = app.globalData.headUrl;
const imageHeadUrl = app.globalData.imageHeadUrl;
let userId = app.globalData.userId;
Page({
  data: {
    odd_goods: [],
    title_goods:[],
    productGoods:[],
    interval: 3000,
    duration: 800,
    imageHeadUrl: imageHeadUrl,
    curIndex: 1,
    typeList: {},
    typeWidth: "",
    cartNum: 0
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
    //获取类型列表
    wx.request({
      url: headUrl + '/productTypeController/getAllProductTypeList.do?method=doWx',
      success(res) {
        if (res.data.code == "0" && res.data.data.length > 0) {
          self.setData({
            typeList: res.data.data,
            typeWidth: (100 / res.data.data.length)
          });
        }
      },
    });
    //获取商品列表 yjf
    wx.request({
      url: headUrl +'/productController/getProductListByCriteria.do?method=doWx',
      success(res) {
        if (res.data.code == "0"){
          wx.hideToast();
          self.setData({
            odd_goods: res.data.data
          });
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow(){
    const that = this;
    //获取购物车数量
    wx.request({
      url: headUrl + '/mallOrderController/getCartMallOrderCountByUserId.do?method=doWx&userId='+userId,
      success(res) {
        if (res.data.code == "0") {
          that.setData({
            cartNum: res.data.data
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
  },
  bindTap:function(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },
  //跳转到地址列表
  jumpAddressList: function(){
    wx.navigateTo({
      url: "address/list/list?isSelect=false"
    })
  },
  //跳转到购物车
  jumpCartList: function(){
    wx.switchTab({
      url: 'cart/cart'
    })
  }
})