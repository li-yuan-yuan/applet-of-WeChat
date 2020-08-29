const db = wx.cloud.database();
const app=getApp()
import {
  getById,
  upDataById,
  add,
  delById,
  get
} from "../../utils/db.js"
Page({
  data: {
    detail: {},
    id: '',
    isfollows: false,
    openid:""
  },
  async onLoad(e) {
    this.setData({
      id: e.id
    })
    //云拿openid
    wx.cloud.callFunction({
      name:"login",
      success:res=>{
        this.setData({
          openid:res.result.openid
        })
      }
    })
    //渲染列表
    let result = await getById("menu", e.id)
    this.setData({
      detail: result.data
    })
    //渲染头标题
    wx.setNavigationBarTitle({
      title: result.data.menuName,
    })
    //看是否被关注
    let res =await get("follow", {
      menuId: this.data.id,
      _openid: this.data.openid
    })
    if(res.data.length){
      this.setData({
        isfollows: true
      })
    }
  },
  async onShow() {
    //浏览数自增
    await upDataById("menu", this.data.id, {
      views: db.command.inc(1)
    })
  },
  //点击关注
  async addfollow() {
    let {openid}=app.globalData
    if (this.data.isfollows) {
      //取消

      let result=await get("follow", {
        menuId: this.data.id,
        _openid: openid
      })
      //浏览数自减
      await upDataById("menu", this.data.id, {
        follows: db.command.inc(-1)
      })
      //数据库删除
      await delById("follow",result.data[0]._id)
      //重新渲染页面
      let detail = await getById("menu", this.data.id)
      this.setData({
        detail: detail.data
      })
    } else {
      //关注
      await add("follow", {
        menuId: this.data.id,
        addtime: new Date().getTime()
      })
      //浏览数自增
      await upDataById("menu", this.data.id, {
        follows: db.command.inc(1)
      })
    }
    this.setData({
      isfollows: !this.data.isfollows
    })
  },
  //点击分享
  share(){
    wx.showToast({
      title: '暂未开放',
    })
  }
})