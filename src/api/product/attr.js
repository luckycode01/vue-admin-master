// 这个文件是专门写和平台属性相关的接口请求函数
import request from '@/utils/request'
export default {
  // GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  // attrInfoList
  // 根基选中的123级分类id获取平台属性列表
  getList(category1Id,category2Id,category3Id){
    return request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },
  
  // DELETE /admin/product/deleteAttr/{attrId}
  // deleteAttr
  // 删除某个平台属性
  delete(attrId){
    return request.delete(`/admin/product/deleteAttr/${attrId}`)
  },

  // 增加或者修改平台属性
  // POST /admin/product/saveAttrInfo
  addOrUpdate(attr){
    return request.post('/admin/product/saveAttrInfo',attr)
  }
}
