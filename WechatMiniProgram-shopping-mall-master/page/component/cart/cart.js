// page/component/new-pages/cart/cart.js
const app = getApp();
const headUrl = app.globalData.headUrl;
const imageHeadUrl = app.globalData.imageHeadUrl;
const userId = app.globalData.userId;

Page({
  data: {
    carts: [],               // 购物车列表
    hasList: false,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
    selectAllStatus: true,    // 全选状态，默认全选
    obj: {
      name: "hello"
    },
    model: '',
    imageHeadUrl: imageHeadUrl
  },

  onShow() {//网络请求从数据库中获取购物车信息,比onReady先执行，实时显示购物车状态   
    wx.showToast({
      title: "加载中...",
      icon: "loading",
      duration: 10000
    });

    var self = this;
    wx.request({
      url: headUrl + '/mallOrderController/getOrderByUserIdAndOrderStatus.do?method=doWx&userId=' + userId + '&orderStatus=1',
      success(res) {
        if (res.data.code == "0") {
          wx.hideToast();
          self.setData({
            carts: res.data.data,
            hasList: (res.data.data.length > 0 && res.data.data[0] != null),
            selectAllStatus: true
          });
          self.getTotalPrice();
        }
      }
    });
  },
  //获取选中的订单,跳转支付页面
  selectOrderData() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    let temp = [];
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].selected) {                     // 判断是否选中
        temp.push(carts[i])
      }
    }
    if(temp.length == 0){
      wx.showToast({
        title: '请选择商品',
        icon: 'none',
        duration: 2000,
        mask: true//防止触摸穿透
      })
    }else{
      wx.navigateTo({
        url: '../orders/orders?orders=' + JSON.stringify(temp)
      })
    }
  },
  /**
   * 当前商品选中事件
   */
  selectList: function(e) {
    const index = e.currentTarget.dataset.index;
    let isAllSelect = true;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected = !selected;

    for (let i = 0; i < carts.length; i++) {
      if(!carts[i].selected){
        isAllSelect = false;
      }
    }

    this.setData({
      carts: carts,
      selectAllStatus: isAllSelect
    });
    this.getTotalPrice();
  },

  /**
   * 删除购物车当前商品
   */
  deleteList: function(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认要删除该商品吗？',
      success(res) {
        if (res.confirm) {
          const index = e.currentTarget.dataset.index;
          const orderId = e.currentTarget.dataset.orderid;
          wx.request({
            url: headUrl + '/mallOrderController/deleteMallOrderByOrderId.do?method=doWx&orderId=' + orderId,
            success(res) {
              if (res.data.code == "0") {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000,
                  mask: true//防止触摸穿透
                })

                let carts = that.data.carts;
                carts.splice(index, 1);
                that.setData({
                  carts: carts
                });
                if (!carts.length) {
                  that.setData({
                    hasList: false
                  });
                } else {
                  that.getTotalPrice();
                }
              }else{
                wx.showToast({
                  title: '删除失败',
                  icon: 'loading',
                  image: '../image/error.png',
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

  /**
   * 购物车全选事件
   */
  selectAll: function(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCount: function(e) {
    const index = e.currentTarget.dataset.index;
    const orderId = e.currentTarget.dataset.orderid;
    const price = e.currentTarget.dataset.price;
    let carts = this.data.carts;
    let num = carts[index].productNum;
    num = num + 1;
    carts[index].productNum = num;
    this.updateOrderNum(num, orderId, price);
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定减数量事件
   */
  minusCount: function(e) {
    const index = e.currentTarget.dataset.index;
    const orderId = e.currentTarget.dataset.orderid;
    const price = e.currentTarget.dataset.price;
    const obj = e.currentTarget.dataset.obj;
    let carts = this.data.carts;
    let num = carts[index].productNum;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    carts[index].productNum = num;
    this.updateOrderNum(num, orderId, price);
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 计算总价
   */
  getTotalPrice: function() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].selected) {                     // 判断选中才会计算价格
        total += carts[i].productNum * carts[i].productPrice;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  },
  updateOrderNum: function(num, orderId, price){// 修改订单的数量
    wx.showToast({
      title: "加载中...",
      icon: "loading",
      duration: 10000
    });

    wx.request({
      url: headUrl + '/mallOrderController/updateOrderNum.do?method=doWx&orderId=' + orderId + '&productNum=' + num + "&orderAmount=" + price,
      success(res) {
        if (res.data.code == "0") {
          wx.hideToast();
        }
      }
    });
  }
})