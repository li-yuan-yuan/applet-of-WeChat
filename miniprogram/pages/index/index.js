import {get,getList} from "../../utils/db.js"
Page({
  data:{
    meunList:[],//热门菜谱
    list:[
      {
        id:1,
        tit:"儿童菜谱",
        src:"/static/index/ertong.png"
      },
      {
        id:2,
        tit:"养生菜谱",
        src:"/static/index/yangsheng.png"
      },
      {
        id:3,
        tit:"推荐菜谱",
        src:"/static/index/tuijian.png"
      }
    ],
    pageSize:4,
    page:0,
    keywordsou:""//搜索的关键字
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
  //点击图片 跳转到详情
  toDetail(e){
    let menuId = e.currentTarget.id;
    wx.navigateTo({
      url: '../recipeDetail/recipeDetail?id=' + menuId,
    })
  },
  //点击菜单分类
  toTypelist(){
    wx.navigateTo({
      url: '../typelist/typelist',
    })
  },
   //点击儿童菜谱
   async tolist(e){
     let keyword=e.currentTarget.id
    let res=await get("menuType",{typeName:keyword})
     wx.navigateTo({
      url: '../recipelist/recipelist?id=' + res.data[0]._id+"&tit="+keyword,
    })
  },
  async onLoad(){
    let {page,pageSize}=this.data
    let meunList=await getList(page,pageSize)
    this.setData({
      meunList
    })
  },
  //触底加载更多
  async onReachBottom(){
    this.data.page+=1;
    var pageSize=this.data.pageSize;
    let meunList=await getList(this.data.page,pageSize)
    this.setData({
      meunList:this.data.meunList.concat(meunList)
    })
  }
  ,
  async onShow(){
    this.data.page=0
    let {page,pageSize}=this.data
    let meunList=await getList(page,pageSize)
    this.setData({
      meunList
    })
  }
})