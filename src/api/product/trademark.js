import request from "@/utils/request";

export default {
  // DELETE / admin / product / baseTrademark / remove / { id };
  // 删除BaseTrademark;
  delete(id) {
    return request.delete(`/admin/product/baseTrademark/remove/${id};`);
  },

  // POST / admin / product / baseTrademark / save;
  // 新增BaseTrademark;
  // PUT / admin / product / baseTrademark / update;
  // 修改BaseTrademark;
  addOrUpdate(id, product) {
    return request.post(`/admin/product/baseTrademark/save`);
  },
  // GET / admin / product / baseTrademark / { page } / { limit };
  getPageList(page, limit) {
    return request.get(`/admin/product/baseTrademark/${page}/${limit}`);
  }
};
