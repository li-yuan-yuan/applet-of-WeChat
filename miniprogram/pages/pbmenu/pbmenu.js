import {
  get,
  add
} from "../../utils/db.js"
const app = getApp();
Page({
  data: {
    menuName: '',
    menuType: [],
    desc: '' //菜品做法
    // files:[]
  },
  onLoad() {
    this.reqlist()
  },
  //选择图片，把临时路径渲染到页面
  bindselect(e) {
    var tempFilePaths = e.detail.tempFilePaths;
    var files = tempFilePaths.map(item => {
      return {
        url: item
      }
    })
    this.setData({
      files
    })
  },
  //上传图片
  async bindUpload() {
    var arr = []
    this.data.files.forEach(item => {
      var nowtime = new Date().getTime()
      var ext = item.url.split(".").pop()
      var promise = wx.cloud.uploadFile({
        cloudPath: nowtime + "." + ext,
        filePath: item.url
      })
      arr.push(promise)
    })
    let result=await Promise.all(arr);
    var fileds=result.map(item=>{
      return item.fileID
    })
    return fileds
  },
  //点击发布
  async publish(e) {
    wx.showLoading({
      title: '正在发布',
    })
    let formdata = e.detail.value
    let addtime = new Date().getTime()
    let {
      nickName,
      avatarUrl
    } = app.globalData.userInfo; //用户名，头像
    let fileIds = await this.bindUpload()
    //添加到数据库
    await add("menu", {
      menuName: formdata.menuName,
      fileIds, //图片
      desc: formdata.desc,
      addtime,
      nickName,
      avatarUrl,
      follows: 0,
      views: 0,
      typeId: formdata.recipeTypeid
    })
    this.empty();
    wx.showToast({
      title: '发布成功',
    })
    wx.hideLoading()
  },
  empty() {
    this.setData({
      menuName: '',
      desc: '' ,
      files:[]
    })
  },
  //请求列表
  async reqlist() {
    var result = await get("menuType")
    this.setData({
      menuType: result.data
    })
  }
})