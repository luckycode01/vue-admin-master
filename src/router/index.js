import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",

    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "首页", icon: "dashboard" }
      }
    ]
  }

  // 404 page must be placed at the end !!!
  // { path: "*", redirect: "/404", hidden: true }
];
// allAsyncRoutes被称作异步路由（菜单路由），这个是所有的都和权限控制相关的自己配的路由
// 这里面是所有的异步路由，后期用户获取到name信息之后，我们需要根据name信息从这个数组
// 过滤出用户想要看到的页面路由，进行动态展示
export const allAsyncRoutes = [
  //权限数据管理相关的路由
  {
    name: "Acl",
    path: "/acl",
    component: Layout,
    redirect: "/acl/user/list",
    meta: {
      title: "权限管理",
      icon: "el-icon-lock"
    },
    children: [
      {
        name: "User",
        path: "user/list",
        component: () => import("@/views/acl/user/list"),
        meta: {
          title: "用户管理"
        }
      },
      {
        name: "Role",
        path: "role/list",
        component: () => import("@/views/acl/role/list"),
        meta: {
          title: "角色管理"
        }
      },
      {
        name: "RoleAuth",
        path: "role/auth/:id",
        component: () => import("@/views/acl/role/roleAuth"),
        meta: {
          activeMenu: "/acl/role/list",
          title: "角色授权"
        },
        hidden: true
      },
      {
        name: "Permission",
        path: "permission/list",
        component: () => import("@/views/acl/permission/list"),
        meta: {
          title: "菜单管理"
        }
      }
    ]
  },

  // 商品管理相关的
  // 如果一个路由包含了多个二级路由，那么这个路由的redirect没意义
  // 因为会变为包含关系，不会发生跳转

  // 如果一个路由只包含了一个二级路由，那么这个路由redirect是可以跳转的
  // 但是侧边栏不会出现包含关系
  {
    path: "/product",
    component: Layout,
    name: "Product", //name必须写，而且要和这里写的名字一样（后期权限管理要使用）
    meta: { title: "商品管理", icon: "el-icon-s-shop" }, //要在侧边栏显示和面包屑显示
    // redirect:'/product/trademark/list',
    children: [
      {
        path: "trademark/list",
        component: () => import("@/views/product/Trademark/List"),
        name: "Trademark",
        meta: { title: "品牌管理" }
      },
      {
        path: "sku/list",
        component: () => import("@/views/product/Sku/List"),
        name: "Sku",
        meta: { title: "sku管理" }
      },
      {
        path: "spu/list",
        component: () => import("@/views/product/Spu/List"),
        name: "Spu",
        meta: { title: "spu管理" }
      },
      {
        path: "attr/list",
        component: () => import("@/views/product/Attr/List"),
        name: "Attr",
        meta: { title: "平台属性管理" }
      },
      {
        path: "scopedtest/list",
        component: () => import("@/views/product/ScopedTest/List"),
        name: "ScopedTest",
        meta: { title: "Scoped测试" }
      }
    ]
  }
];
// anyRoute被称作是任意路由，一般情况任意路由都是要和404挂钩的，通常访问任意路由返回404页面
// 任意路由后期在注册到路由器的时候，必须放在最后一位
export const anyRoute = { path: "*", redirect: "/404", hidden: true };

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
