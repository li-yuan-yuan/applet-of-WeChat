import {
  get
} from "../../utils/db.js"
const db = wx.cloud.database();
Page({
  data: {
    list: [],
    pageSize:4,
    page:0,
    id:'',
    keyword:'',
    numstar:0
  },
  async onLoad(e) {
    if (e.id) {
      let id = e.id;  
      this.data.id=id; 
      //查询数据库
      this.getList("typeId",id)
      //设置title
      wx.setNavigationBarTitle({
        title: e.tit,
      })
    } else if (e.keyword) {
      let keyword = e.keyword;
      this.data.keyword=keyword
      //查询数据库
      this.getList("menuName",keyword)
      //设置title
      wx.setNavigationBarTitle({
        title: e.keyword,
      })
    }
  },
  //触底加载更多
  onReachBottom(){
    this.data.page+=1;
    if(this.data.id.length!=0){
      this.getList("typeId",this.data.id)
    }
    if(this.data.keyword.length!=0){
      this.getList("menuName",this.data.keyword)
    }
  },
  //获取列表数据
  async getList(rxp,regexp){
    let {page,pageSize}=this.data;
    var result = await get("menu", {
        [rxp]: db.RegExp({
        regexp: regexp,
        options: 'i'
      })
    },page*pageSize,pageSize)
    
    result.data.map((v)=>{
      if(v.follows<3){
        this.data.numstar=0
      }else if(v.follows<6){
        this.data.numstar=1
      }else if(v.follows<9){
        this.data.numstar=2
      }else if(v.follows<12){
        this.data.numstar=3
      }else if(v.follows<15){
        this.data.numstar=4
      }else{
        this.data.numstar=5
      }
      let stararr=[]
      for(var i=0;i<this.data.numstar;i++){
        stararr.push(i)
      }
      let stararr2=[]
      for(var i=0;i<(5-this.data.numstar);i++){
        stararr2.push(i)
      }
      v.star=stararr
      v.star2=stararr2
      return v
    })
    
    this.setData({
      list: this.data.list.concat(result.data)
    })
    
  }
})