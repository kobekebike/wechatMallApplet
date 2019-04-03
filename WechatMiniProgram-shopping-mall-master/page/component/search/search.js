// page/component/search/search.js
const app = getApp();
const headUrl = app.globalData.headUrl;
const imageHeadUrl = app.globalData.imageHeadUrl;
var userId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    odd_goods: [],
    imageHeadUrl: imageHeadUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userId = getApp().globalData.userId;
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
  onShareAppMessage: function () {

  },
  search: function (e) {
    if (!e.detail.value){
      this.setData({
        odd_goods: []
      });
      return;
    }
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
          that.setData({
            odd_goods: res.data.data
          });
        }
      }
    });
  },
  addToCart: function (e) {
    const that = this;
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
          that.setData({
            cartNum: ++that.data.cartNum
          })
        } else {
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