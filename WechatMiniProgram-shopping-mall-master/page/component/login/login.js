// page/component/login/login.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowLoginPage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断是用户是否绑定了
    if (app.globalData.isShowLoginPage != null) {
      this.setData({
        isShowLoginPage: getApp().globalData.isShowLoginPage
      });
    } else {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.isShowLoginPageCallback = isShowLoginPage => {
        if (isShowLoginPage) {
          this.setData({
            isShowLoginPage: isShowLoginPage
          });
        }
      }
    }
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
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    wx.switchTab({
      url: '../index',
    })
  }
})