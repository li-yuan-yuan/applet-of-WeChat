const db=wx.cloud.database();
//添加数据
async function add(_collection="",_data={}){
  return await db.collection(_collection).add({
    data:_data
  })
}

//删除一条记录
async function delById(_collection,id){
  return await db.collection(_collection).doc(id).remove()
}

//修改一条数据
async function upDataById(_collection,id,_data={}){
  return await db.collection(_collection).doc(id).update({
    data:_data
  })
}

//查询所有数据
async function get(_collection, _where={},_skip=0,_limit=20){
  var result =await db.collection(_collection).skip(_skip).limit(_limit).where(_where).get()
  return result
}

//根据_id查询
async function getById(_collection,id){
  return await db.collection(_collection).doc(id).get()
}
//每次只获取4个数据
async function getList(page,pageSize){
  var result = await db.collection("menu").skip(page*pageSize).limit(pageSize).get()
  return result.data
}
export{
  get,
  getById,
  add,
  upDataById,
  delById,
  getList
}