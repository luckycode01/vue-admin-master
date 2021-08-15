// 这个文件是专门去写和trademark相关的接口请求函数
import request from '@/utils/request'

export default {
  // DELETE /admin/product/baseTrademark/remove/{id}
  // 删除BaseTrademark
  // axios函数用法
  // axios({
  //   url:'',
  //   method:'get'
  // })
  // axios.get()
  delete(id){
    return request.delete(`/admin/product/baseTrademark/remove/${id}`)
  },
  // GET /admin/product/baseTrademark/{page}/{limit}
  getPageList(page,limit){
    return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
  },

  // 以后我们在添加一个东西的时候,如果是添加不需要id 而如果是修改是需要id的
  // id是数据库再添加数据的时候自动生成的id ，而我们新添加的东西不是从数据库里面而来的，而是
  // 新生成的，新生成的对象不应该有id.而是添加到数据库之后才会有id
  // 修改必然修改的是数据库里面拿到的数据，数据库里面我们去拿的时候就已经有id了,所以修改
  // 数据必然带id
  // POST /admin/product/baseTrademark/save
  // 新增BaseTrademark
  // PUT /admin/product/baseTrademark/update
  // 修改BaseTrademark
  addOrUpdate(trademark){
    if(trademark.id){
      // 代表我是再修改
      return request.put('/admin/product/baseTrademark/update',trademark)
    }else{
      // 代表我再添加
      return request.post('/admin/product/baseTrademark/save',trademark)
    }
  },

  // 获取所有的品牌列表不是分页列表
  // /admin/product/baseTrademark/getTrademarkList
  getList(){
    return request.get('/admin/product/baseTrademark/getTrademarkList')
  }


  
}
