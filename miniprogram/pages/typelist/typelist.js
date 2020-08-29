
import {
  get
} from "../../utils/db.js"
Page({
  data:{
    typelist:[],
    keywordsou:""//搜索的关键字
  },
  //点击跳转到类列表
  tomenulist(e){
    // console.log(e)
    let menutypeId = e.currentTarget.dataset.id;
    let menutypetit = e.currentTarget.dataset.tit;
    wx.navigateTo({
      url: '../recipelist/recipelist?id=' + menutypeId+"&tit="+menutypetit,
    })
  },
    //获取输入值
    myInput(e){
      this.data.keywordsou=e.detail.value
  },
  doSearch(){
    //存储缓存
    var keywordsou=this.data.keywordsou
    //页面跳转
    wx.navigateTo({
      url:"../recipelist/recipelist?keyword="+keywordsou
    })
  },
  async onLoad(){
    let result = await get("menuType")
    this.setData({
      typelist: result.data
    })}
})