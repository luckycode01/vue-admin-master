// 这个文件是专门去写和category三级分类相关的接口请求函数
import request from '@/utils/request'

export default {
  // 直接获取所有一级分类列表
  // GET  /admin/product/getCategory1
  // getCategory1
  getCategory1(){
    return request.get('/admin/product/getCategory1')
  },
  // 根据选中的1及分类的id获取这个1级分类下的所有二级分类列表
  // GET /admin/product/getCategory2/{category1Id}
  // getCategory2
  getCategory2(category1Id){
    return request.get(`/admin/product/getCategory2/${category1Id}`)
  },
  // 根据选中的2级分类的id获取这个2级分类下的所有三级分类列表
  // GET /admin/product/getCategory3/{category2Id}
  // getCategory3
  getCategory3(category2Id){
    return request.get(`/admin/product/getCategory3/${category2Id}`)
  }
}
