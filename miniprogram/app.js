//app.js
App({
  onLaunch: function () {
    
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          //同意授权
          wx.getUserInfo({
            lang: "zh_CN",
            success: res => {
              this.globalData.userInfo = res.userInfo;
              //回调
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'test-6qz9f',
        traceUser: true,
      })
    }
    wx.cloud.callFunction({
      name:"login",
      success:res=>{
        this.globalData.openid=res.result.openid
      }
    })
    // this.globalData = {
      
    // }


  },
  globalData:{
    userInfo:null,
    openid:null
  }
})