import request from "@/utils/request";
export default {
  // GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  // attrInfoList
  attrInfoList(category1Id, category2Id, category3Id) {
    return request.get(
      `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
    );
  },
  // DELETE /admin/product/deleteAttr/{attrId}
  // deleteAttr
  deleteAttr(attrId) {
    return request.delete(`/admin/product/deleteAttr/${attrId}`);
  },
  // GET /admin/product/getAttrValueList/{attrId}
  // getAttrValueList
  // POST /admin/product/saveAttrInfo
  saveAttrInfo(attr) {
    return request.post(`/admin/product/saveAttrInfo`,attr)
  }
};
