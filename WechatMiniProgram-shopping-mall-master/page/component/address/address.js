// page/component/new-pages/user/address/address.js
const app = getApp();
const headUrl = app.globalData.headUrl;
const userId = app.globalData.userId;

Page({
  data:{
    address:{
      addressee:'',
      phone:'',
      detailAddress:''
    }
  },
  onLoad(e){
    if(e.address.length != 0){
      this.setData({
        address: JSON.parse(e.address)
      })
    }
    // var self = this;
    // wx.getStorage({
    //   key: 'address',
    //   success: function(res){
    //     self.setData({
    //       address : res.data
    //     })
    //   }
    // })
  },
  formSubmit(e){
    const value = e.detail.value;
    if (value.addressee && value.phone && value.detailAddress){
      // wx.setStorage({
      //   key: 'address',
      //   data: value,
      //   success(){
      //     wx.navigateBack();
      //   }
      // })
      wx.request({
        url: headUrl + "/addressController/saveAddress.do?method=doWx&&userId=" + userId + '&isDefault=true',
        data: value,
        header: {
          "Content-Type": "application/json;charset=utf-8",
        },
        success(res) {
          if (res.data.code == "0") {
            wx.showToast({
              title: '已添加地址',
              icon: 'success',
              duration: 2000,
              mask: true//防止触摸穿透
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

    }else{
      wx.showModal({
        title:'提示',
        content:'请填写完整资料',
        showCancel:false
      })
    }
  }
})