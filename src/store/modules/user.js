import { login, logout, getInfo } from "@/api/acl/user";
import { getToken, setToken, removeToken } from "@/utils/auth";

import {
  allAsyncRoutes,
  resetRouter,
  constantRoutes,
  anyRoute
} from "@/router";
import router from "@/router";
import cloneDeep from "lodash/cloneDeep";

const getDefaultState = () => {
  return {
    // token: getToken(),
    token: localStorage.getItem('token_key'),
    name: "",
    avatar: "",
    buttons: [],
    routes: [],
    roles: []
  };
};

function filterAllAsyncRoutes(allAsyncRoutes, routeNames) {
  return allAsyncRoutes.filter(item => {
    if (routeNames.indexOf(item.name) !== -1) {
      if (item.children && item.children.length)
        item.children = filterAllAsyncRoutes(item.children, routeNames);
      return true;
    }
  });
}

const state = getDefaultState();

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  // SET_NAME: (state, name) => {
  //   state.name = name;
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar;
  // }
  SET_USERINFO(state, userInfo) {
    state.name = userInfo.name;
    state.avatar = userInfo.avatar;
    state.buttons = userInfo.buttons;
    state.roles = userInfo.roles;
  },
  SET_ROUTES(state, routes) {
    state.routes = routes;
  }
};

const actions = {
  // user login
  // login({ commit }, userInfo) {
  //   const { username, password } = userInfo;
  //   return new Promise((resolve, reject) => {
  //     login({ username: username.trim(), password: password })
  //       .then(response => {
  //         const { data } = response;
  //         commit("SET_TOKEN", data.token);
  //         setToken(data.token);
  //         resolve();
  //       })
  //       .catch(error => {
  //         reject(error);
  //       });
  //   });
  // },
  async login({ commit }, userInfo) {
    const { username, password } = userInfo;
    const res = await login({
      username: username.trim(),
      password: password.trim()
    });
    if (res.code === 200 || res.code === 20000) {
      // 保存token到vueX中
      commit("SET_TOKEN", res.data.token);
      // 保存token到本地存储
      // setToken(res.data.token);
      localStorage.setItem("token_key", res.data.token);
      return "ok";
    } else {
      return Promise.reject(new Error("failed"));
    }
  },

  // get user info
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getInfo(state.token)
  //       .then(response => {
  //         const { data } = response;

  //         if (!data) {
  //           return reject("Verification failed, please Login again.");
  //         }
  //         const { name, avatar } = data;
  //         commit("SET_NAME", name);
  //         commit("SET_AVATAR", avatar);
  //         resolve(data);
  //       })
  //       .catch(error => {
  //         reject(error);
  //       });
  //   });
  // },

  async getInfo({ commit, state }) {
    const res = await getInfo(state.token);
    const { data } = res;
    if (res.code === 200 || res.code === 20000) {
      if (!data) return reject("Verification failed, please Login again.");
      // const { name, avatar } = data;
      // commit("SET_NAME", name);
      // commit("SET_AVATAR", avatar);
      commit("SET_USERINFO", data);

      // 过滤异步路由，返回的routes串中有的路由
      const asyncRoutes = filterAllAsyncRoutes(
        cloneDeep(allAsyncRoutes),
        data.routes
      );
      // 组成新的路由
      const routes = constantRoutes.concat(asyncRoutes, anyRoute);

      commit("SET_ROUTES", routes);

      // 动态添加路由
      router.addRoutes([...asyncRoutes, anyRoute]);

      return data;
    } else {
      return Promise.reject(new Error("field"));
    }
  },

  // user logout
  // logout({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     logout(state.token)
  //       .then(() => {
  //         removeToken(); // must remove  token  first
  //         resetRouter();
  //         commit("RESET_STATE");
  //         resolve();
  //       })
  //       .catch(error => {
  //         reject(error);
  //       });
  //   });
  // },
  async logout({ commit, state }) {
    const res = await logout(state.token);
    if (res.code === 200 || res.code === 20000) {
      // 删除本地存储的token
      // removeToken(); // must remove  token  first
      localStorage.removeItem("token_key");
      // 重置路由器
      resetRouter();
      // 重置store中的用户信息
      commit("RESET_STATE");
      return "ok";
    } else {
      return Promise.reject(new Error("field"));
    }
  },

  // remove token
  // resetToken({ commit }) {
  //   return new Promise(resolve => {
  //     removeToken(); // must remove  token  first
  //     commit("RESET_STATE");
  //     resolve();
  //   });
  // }
  async resetToken({ commit }) {
    // await removeToken(); // must remove  token  first
    await localStorage.removeItem("token_key");
    await commit("RESET_STATE");
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
