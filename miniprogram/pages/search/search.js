// import {get} from "../../utils/db.js"
const db=wx.cloud.database();
Page({
  data:{
    keyword:"",
    arr:[],//近期搜索
    hotArr:[]//热门搜索
  },
  //获取输入值
  myInput(e){
      this.data.keyword=e.detail.value
  },
  doSearch(){
    //存储缓存
    var keyword=this.data.keyword
    var arr=wx.getStorageSync('keyword')||[]
    var index=arr.findIndex(item=>{
      return item==keyword
    })
    if(index!==-1){
      arr.splice(index,1)
    }
    arr.unshift(keyword);
    wx.setStorageSync('keyword', arr)
    //页面跳转
    wx.navigateTo({
      url:"../recipelist/recipelist?keyword="+this.data.keyword
    })
  },
  //点击热门搜索，跳转去详情
  toDetail(e){
    let menuId = e.currentTarget.id;
    wx.navigateTo({
      url: '../recipeDetail/recipeDetail?id=' + menuId,
    })
  },
   //点击近期搜索，跳转去详情
   torecipelist(e){
    let keyword = e.currentTarget.id;
    wx.navigateTo({
      url: '../recipelist/recipelist?keyword=' + keyword,
    })
  },
  onShow(){
    var arr=wx.getStorageSync('keyword')||[];
    this.setData({
      arr
    })
  },
  async onLoad(){
    //热门搜索
    var result=await db.collection("menu")
    .orderBy("views","desc").limit(10).get();
    var hotArr=result.data.map((v)=>{
      return {_id:v._id,menuName:v.menuName}
    })
    this.setData({
      hotArr
    })
  }
})