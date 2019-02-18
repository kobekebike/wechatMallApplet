App({
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    hasLogin: false,
    headUrl: "http://www.jfy.com",//全局地址头
    imageHeadUrl: "http://image.jfy.com"//全局图片地址头
  }
})
