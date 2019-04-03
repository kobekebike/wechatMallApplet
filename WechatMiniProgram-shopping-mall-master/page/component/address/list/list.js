const app = getApp();
const headUrl = app.globalData.headUrl;
const imageHeadUrl = app.globalData.imageHeadUrl;
let userId = app.globalData.userId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: {
      hidden: true,
      icon: '../../image/icon5.png',
      title: '还没有收货地址呢',
      text: '暂时没有相关数据',
    },
    address:{},
    isSelect: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userId = getApp().globalData.userId;
    this.setData({
      isSelect: options.isSelect
    })
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
    this.showAddressInfo();
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
  //选择地址
  selectAddress: function(e){
    if (this.data.isSelect == "true"){
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.setData({
        address: this.data.address[e.currentTarget.id],
        hasAddress: true
      })

      wx.navigateBack({
        delta: 1
      })
    }
  },
  //编辑地址
  editAddress: function(e){
    wx.navigateTo({
      url: '../edit/edit?address=' + JSON.stringify(e.currentTarget.dataset.addressdata)
    })
  },
  //新增地址
  toAddressAdd: function(){
    wx.navigateTo({
      url: '../edit/edit'
    })
  },
  //删除地址
  deleteAddress: function(e){
    const that = this;
    wx.showModal({
      title: '提示',
      content: '确认要删除该地址吗？',
      success(res) {
        if (res.confirm) {
          const addressId = e.currentTarget.dataset.addressid;
          wx.request({
            url: headUrl + '/addressController/deleteAddress.do?method=doWx&addressId=' + addressId,
            success(res) {
              if (res.data.code == "0") {
                that.showAddressInfo();
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000,
                  mask: true//防止触摸穿透
                })
              } else {
                wx.showToast({
                  title: '删除失败',
                  icon: 'loading',
                  image: '../../image/error.png',
                  duration: 2000,
                  mask: true//防止触摸穿透
                })
              }
            }
          });
        } else if (res.cancel) {
        }
      }
    });  
  },
  showAddressInfo: function(){
    const that = this;
    wx.request({
      url: headUrl + '/addressController/getAddressListByUserId.do?method=doWx&userId=' + userId,
      success(res) {
        if (res.data.code == "0") {
          if (res.data.data.length > 0 && res.data.data[0] != null) {
            that.setData({
              address: res.data.data,
              ['prompt.hidden']: true
            });
          } else {
            that.setData({
              address:{},
              ['prompt.hidden']: false
            })
          }
        }
      }
    });
  }
})