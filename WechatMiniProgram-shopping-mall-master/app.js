App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.globalData.loginCode = res.code
        wx.request({
          url: this.globalData.headUrl + '/wxInterfaceController/getWxLoginInfo.do?method=doWx&code=' + this.globalData.loginCode,
          success(res) {
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.switchTab({
            url: '/page/component/index',
          })

          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.log(res)
              wx.request({
                url: this.globalData.headUrl + '/wxInterfaceController/decodeUserInfo.do?method=doWx&loginCode=' + this.globalData.loginCode,
                data: res,
                header: {
                  'Content-Type': 'application/json'
                },
                method: "GET",
                success(res){
                }
              })
              
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })          
        }else{
          if (this.isShowLoginPageCallback){
            this.isShowLoginPageCallback(true);
          }
        }
      }
    })
  },
  onLoad: function(){
    app.userInfoReadyCallback = userInfo =>{
      if(userInfo){
        this.globalData.userInfo = userInfo
      }
    }
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
    imageHeadUrl: "http://image.jfy.com",//全局图片地址头
    userId: 0,//全局用户标识
    isShowLoginPage: null,//判断是否显示确认登录页面
    userInfo: null,//用户信息
    loginCode: null,//用户登录凭证,用于换取 openid 和 session_key 等信息
    thirdSessionId: null, //openid 和 session_key 等信息
    encryptedData: null,//包括敏感数据在内的完整用户信息的加密数据,用于解密数据
    iv: null,//加密算法的初始向量,用于解密数据
  }
})
