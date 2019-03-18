// page/component/new-pages/user/user.js
const app = getApp();
const headUrl = app.globalData.headUrl;
const imageHeadUrl = app.globalData.imageHeadUrl;
let userId = app.globalData.userId;

Page({
  data: {
    prompt: {
      hidden: true,
      icon: '../image/icon5.png',
      title: '还没有订单呢',
      text: '暂时没有相关数据',
    },
    thumb: '../image/user-head.png',
    nickname: '点击头像登录',
    isAuth: false,//是否授权头像信息
    orders: [],
    imageHeadUrl: imageHeadUrl
  },

  //（待做：自动刷新）
  onLoad() {
    userId = getApp().globalData.userId;
    const userInfo = getApp().globalData.userInfo;
    if (userInfo != null){
      this.setData({
        thumb: userInfo.avatarUrl,
        nickname: userInfo.nickName,
        isAuth: true
      })
    }else{
      app.userInfoReadyCallback = res => {
        if (res.userInfo){
          this.setData({
            thumb: res.userInfo.avatarUrl,
            nickname: res.userInfo.nickName,
            isAuth: true
          })
        }
      }
    }
    // var self = this;
    /**
     * 获取用户信息
     */
    // wx.getUserInfo({
    //   success: function (res) {
    //     self.setData({
    //       thumb: res.userInfo.avatarUrl,
    //       nickname: res.userInfo.nickName
    //     })
    //   }
    // })

      /**
       * 发起请求获取订单列表信息（待做：自动刷新）
       */
      // setTimeout(function () {//用延迟执行的方式避免因为事务冲突得到刚刚删除空的数据库而得不到数据
      //   wx.request({
      //     url: 'http://localhost:8080/yMybatis/order/get_all',
      //     success(res) {
      //       console.log(res.data)
      //       self.setData({
      //         orders: res.data
      //       })
      //     }
      //   });
      // }, 1000)
  },
  onShow() {
    var self = this;
    //订单信息
    wx.request({
      url: headUrl + '/mallOrderController/getOrderByUserIdAndOrderStatus.do?method=doWx&userId=' + userId,
      success(res) {
        if (res.data.code == "0") {
          wx.hideToast();
          if (res.data.data.length > 0){
            self.setData({
              orders: res.data.data
            });
          } else {
            self.setData({
              ['prompt.hidden']: !self.data.prompt.hidden
            })
          }
        }
      }
    });
  },
  /**
   * 发起支付请求
   */
  payOrders(e) {
    wx.navigateTo({
      url: '../orders/orders?orders=' + ("[" + JSON.stringify(e.currentTarget.dataset.orderinfo) + "]")
    })
  },
  getUserInfo: function (e) {
    let userInfo = e.detail.userInfo;
    this.setData({
      thumb: userInfo.avatarUrl,
      nickname: userInfo.nickName,
      isAuth: true
    })
  }
})