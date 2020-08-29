const db=wx.cloud.database();
import {
  get,
  delById
} from "../../utils/db.js"
const app = getApp()
Page({
  data: {
    userInfo: {}, //用户公开信息
    isLogin: false,
    list: [{
        id: 0,
        name: "菜单"
      },
      {
        id: 1,
        name: "菜谱"
      },
      {
        id: 2,
        name: "关注"
      }
    ],
    clickList: "0", //默认选中菜单
    menu: [], //菜谱分类
    menus: [], //菜单列表,
    followList: [] ,//关注,
    pageSize:4,
    page:0,
  },
  //点击头像
  relMenuCate() {
    wx.navigateTo({
      url: '../pbmenutype/pbmenutype',
    })
  },
  //点击列表
  clickList(e) {
    this.setData({
      clickList: e.target.id
    })
    switch (e.target.id) {
      case "0":
        this.reqmenus()
        break;
      case "1":
        this.reqmeun();
        break;
      case "2":
        this.reqfollow();
        break;

      default:
        break;
    }
  },
  //点击登录
  myInfo(e) {
    this.setData({
      userInfo: e.detail.rawData,
      isLogin: true
    })
  },
  //点击了菜谱
  async reqmeun() {
    let {
      openid
    } = app.globalData
    let result = await get("menuType", {
      _openid: openid
    })
    this.setData({
      menu: result.data
    })
  },
  //点击菜谱跳转去详情
  tolistDetail(e) {
    let menutypeId = e.currentTarget.dataset.id;
    let menutypetit = e.currentTarget.dataset.tit;
    wx.navigateTo({
      url: '../recipelist/recipelist?id=' + menutypeId+"&tit="+menutypetit,
    })
  },
  //点击了关注
  async reqfollow() {
    let {
      openid
    } = app.globalData
    let result = await get("follow", {
      _openid: openid
    });
    var menuIdArr=result.data.map(item=>{
      return item.menuId
    })
    //根据menuId数组获取menu详情
    var followList=await db.collection("menu").where({
      _id:db.command.in(menuIdArr)
    }).get()
  //  console.log(followList)
    this.setData({
      followList:followList.data
    })
  },
  //点击了菜单
  async reqmenus() {
    let {
      openid
    } = app.globalData
    let {page,pageSize}=this.data;
    let result = await get("menu", {
      _openid: openid
    },page*pageSize,pageSize)
    this.setData({
      menus: this.data.menus.concat(result.data)
    })
  },
  //触底刷新
  //触底加载更多
  async onReachBottom(){
    this.data.page+=1;
    this.reqmenus();
  },
  //点击菜单添加
  pbmenu() {
    //跳转
    wx.navigateTo({
      url: '../pbmenu/pbmenu',
    })
  },
  //点击菜单跳转去详情
  toDetail(e) {
    let menuId = e.currentTarget.id;
    wx.navigateTo({
      url: '../recipeDetail/recipeDetail?id=' + menuId,
    })
  },
  //点击菜单删除
  async delmenu(e) {
    console.log(e.currentTarget.id)
    let id=e.currentTarget.id
    wx.showModal({
      title: '确定删除吗',
      success: async res=>{
        if(res.confirm){
          wx.showLoading({
            title: '正在删除',
          })
          let aaa = await get("menu", {
            _id: id
          });
          // 删除图片
          wx.cloud.deleteFile({
            fileList: aaa.data[0].fileIds
          })
          //删除数据库
          await delById("menu", id)
          // 关注删除
          wx.cloud.callFunction({
            name: "del",
            data: {
              params: "follow",
              id: {
                menuId: id
              }
            },
            success: res => {
              if (res.errMsg == 'cloud.callFunction:ok') {
                wx.hideLoading()
                this.data.page=0;
                this.data.menus=[];
                this.reqmenus()
                wx.showToast({
                  title: '删除成功',
                  icon: "success"
                })
              }
            }
          })
        }
      }
    })
   
    //刷新列表
    
  },
  onLoad() {
    if (app.globalData.userInfo != null) {
      //渲染用户
      this.setData({
        userInfo: app.globalData.userInfo,
        isLogin: true
      })
    } else {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          isLogin: true
        })
      }
    }
    // this.reqmenus()
  },
  onShow() {
    this.reqmenus()
  }
})