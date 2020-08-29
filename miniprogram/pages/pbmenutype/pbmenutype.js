import {add,get,delById,upDataById} from "../../utils/db.js"
Page({
  data:{
    isAdd:false,
    isUpdata:false,
    type:"",
    dataType:[],//分类列表
    upid:"",
    typeName:''
  },
  //点击添加
  addType(e){
    this.setData({
      isAdd:true
    })
  },
  //添加
  async add(){
    wx.showLoading({
      title: '正在添加',
    })
    let nowTime=new Date().getTime()
      await add("menuType",{
        "typeName":this.data.type,
        "addtime":nowTime
      })
    this.setData({
      isAdd:false,
      type:""
    })
    wx.hideLoading()
    this.reqlist()//请求列表
    wx.showToast({
      title: '添加成功'
    })
    
  },
  //点击修改
  updataType(e){
    this.setData({
      isUpdata:true,
      upid:e.currentTarget.id
    })
  },
  //点击修改
  async updata(){
    let {upid,typeName}=this.data;
    console.log(upid,typeName)
    var result=await upDataById("menuType",upid,{typeName})
    this.setData({
      isUpdata:false,
    })
    this.reqlist()//请求列表
  },
  //点击删除
  del(e){
    let {id,index}=e.currentTarget.dataset
    console.log(id,index)
    wx.showModal({
      title:"你确定要删除吗？",
      success:res=>{
        if(res.confirm){
          delById("menuType",id)
          this.data.dataType.splice(index,1)
          this.setData({
            dataType:this.data.dataType
          })
        }
      }
    })
  },
   onLoad(){
    this.reqlist()//请求列表
  },
  //请求列表
  async reqlist(){
    var result=await get("menuType")
    this.setData({
      dataType:result.data
    })
  }
  
})