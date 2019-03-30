// page/component/new-pages/user/user.js
const app = getApp();
const headUrl = app.globalData.headUrl;
const imageHeadUrl = app.globalData.imageHeadUrl;
let userId = app.globalData.userId;

Page({
  data: {
    prompt2: {
      hidden: true,
      icon: '../image/icon5.png',
      title: '还没有待付款的订单呢',
      text: '暂时没有相关数据',
    },
    prompt: {
      hidden: true,
      icon: '../image/icon5.png',
      title: '还没有已付款的订单呢',
      text: '暂时没有相关数据',
    }, 
    prompt3: {
      hidden: true,
      icon: '../image/icon5.png',
      title: '还没有待收货的订单呢',
      text: '暂时没有相关数据',
    },
    thumb: '../image/user-head.png',
    nickname: '点击头像登录',
    isAuth: false,//是否授权头像信息
    obligation: [], //待付款
    orders: [], //已付款
    receiving: [],//待收货
    imageHeadUrl: imageHeadUrl,
    curIndex: 0,
    totalPrice: 0,           // 总价，初始为0
    selectAllStatus: true,    // 全选状态，默认全选
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
  },
  onShow() {
    wx.showToast({
      title: "加载中...",
      icon: "loading",
      duration: 10000
    });
    this.setData({
      curIndex: 0
    })
    var self = this;
    //订单信息
    wx.request({
      url: headUrl + '/mallOrderController/getOrderByUserIdAndOrderStatus.do?method=doWx&userId=' + userId,
      success(res) {
        if (res.data.code == "0") {
          if (res.data.data.length > 0){
            let obligationflag = false;
            let promptflag = false;
            let receivingflag = false;

            let obligation = [];//待付款
            let orders = [];//已付款
            let receiving = [];//待收货
            let arr = res.data.data;
            for (let i = 0; i < arr.length; i++){
              if (arr[i].orderStatus == 1) {//待付款
                arr[i].selected = true;
                obligation.push(arr[i]);
                obligationflag = true;
              } else if (arr[i].orderStatus == 2) {//已付款
                orders.push(arr[i]);
                promptflag = true;
              } else if (arr[i].orderStatus == 3) {//待收货
                receiving.push(arr[i]);
                receivingflag = true;
              }
            }
            self.setData({
              obligation: obligation,
              orders: orders,
              receiving: receiving,
              ['prompt2.hidden']: obligationflag,
              ['prompt.hidden']: promptflag,
              ['prompt3.hidden']: receivingflag
            });
            self.getTotalPrice();
          } else {
            self.setData({
              obligation:[],
              orders:[],
              receiving: [],
              ['prompt2.hidden']: false,
              ['prompt.hidden']: false,
              ['prompt3.hidden']: false,
              curIndex: 0
            })
          }
          wx.hideToast();
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
  },
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },
  /**
   * 计算总价
   */
  getTotalPrice: function () {
    let carts = this.data.obligation;                  // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].selected) {                     // 判断选中才会计算价格
        total += carts[i].productNum * carts[i].productPrice;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      totalPrice: total.toFixed(2)
    });
  },
  //获取选中的订单,跳转支付页面
  selectOrderData() {
    let carts = this.data.obligation;                  // 获取购物车列表
    let total = 0;
    let temp = [];
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].selected) {                     // 判断是否选中
        temp.push(carts[i])
      }
    }
    if (temp.length == 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none',
        duration: 2000,
        mask: true//防止触摸穿透
      })
    } else {
      wx.navigateTo({
        url: '../orders/orders?orders=' + JSON.stringify(temp)
      })
    }
  },
  /**
   * 当前商品选中事件
   */
  selectList: function (e) {
    const index = e.currentTarget.dataset.index;
    let isAllSelect = true;
    let carts = this.data.obligation;
    const selected = carts[index].selected;
    carts[index].selected = !selected;

    for (let i = 0; i < carts.length; i++) {
      if (!carts[i].selected) {
        isAllSelect = false;
      }
    }

    this.setData({
      obligation: carts,
      selectAllStatus: isAllSelect
    });
    this.getTotalPrice();
  }
})