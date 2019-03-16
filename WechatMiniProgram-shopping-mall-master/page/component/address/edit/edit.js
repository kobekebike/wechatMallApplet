// page/component/new-pages/user/address/address.js
const app = getApp();
const headUrl = app.globalData.headUrl;
let userId = app.globalData.userId;

Page({
  data:{
    address:{
      addressee:'',
      phone:'',
      detailAddress:''
    },
    region: ['广东省', '广州市', '天河区'],
    province: true,//是否显示'所在地区'
    cityCode: '',//所在地区编码
    cityName: '',//所在地区名称
    isSaveOrUpdate: true //保存还是修改
  },
  onLoad(e){
    userId = getApp().globalData.userId;
    if (e.address && e.address.length != 0){
      let addressArr = JSON.parse(e.address);
      this.setData({
        address: addressArr,
        region: addressArr.cityName.split("-"),
        province: false,
        cityCode: addressArr.cityCode,
        cityName: addressArr.cityName,
        isSaveOrUpdate: false
      })
    }
  },
  formSubmit(e){
    const value = e.detail.value;
    if (value.addressee && value.phone && value.detailAddress && this.data.cityName != ''){
      if (!(/^1[3456789]\d{9}$/.test(value.phone))) {
        wx.showModal({
          title: '提示',
          content: '请填写正确的手机号码',
          showCancel: false
        })
        return false;
      }
      value.cityCode = this.data.cityCode;
      value.cityName = this.data.cityName;
      var url = '';
      if (this.data.isSaveOrUpdate){
        url = headUrl + "/addressController/saveAddress.do?method=doWx&&userId=" + userId;
      }else{
        value.addressId = this.data.address.addressId;
        url = headUrl + "/addressController/updateDefaultAddress.do?method=doWx&&userId=" + userId;
      }
      wx.request({
        url: url,
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
            //跳转回上页
            wx.navigateBack({
              delta: 1
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
  },
  //省市区三级联
  bindRegionChange: function (e) {
    let valueArr = e.detail.value;
    this.setData({
      region: valueArr,
      province: false,
      cityCode: e.detail.code[2],
      cityName: valueArr[0] + "-" + valueArr[1] + "-" + valueArr[2]
    })
  }
})