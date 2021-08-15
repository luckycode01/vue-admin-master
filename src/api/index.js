// index.js是为了把所有的api模块文件当中的对象整合，一起分别暴露出去

// import trademark from './trademark'  先引入
// export trademark 再分别暴露

// import attr from './attr'  先引入
// export attr 
// 上面的写法先引入进来，然后再分别暴露出去是理解，写法是错的
// 下面才是真正的引入并暴露的写法
export {default as trademark} from './product/trademark'
export {default as category} from './product/category'
export {default as attr} from './product/attr'
export {default as spu} from './product/spu'
export {default as sku} from './product/sku'
export {default as permission} from './acl/permission'
export {default as role} from './acl/role'
export * as user from './acl/user'


// 相当于
// import trademark from './trademark'  先引入
// export trademark 再分别暴露
// 那么今后暴露出这个index.js文件就是这个对象
// {
//   trademark:{},
  // attr:{}
  // spu:{}
  // sku:{}
// }
