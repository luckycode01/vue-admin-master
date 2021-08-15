import { login, logout, getInfo } from "@/api/acl/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import {
  resetRouter,
  allAsyncRoutes,
  anyRoutes,
  constantRoutes
} from "@/router";
import router from "@/router";

function filterAsyncRoutes(allAsyncRoutes, routeNames) {
  const asyncRoutes = allAsyncRoutes.filter(item => {
    if (routeNames.indexOf(item.name) !== -1) {
      if (item.children && item.children.length)
        item.children = filterAsyncRoutes(item.children, routeNames);
      return true;
    }
  });
  return asyncRoutes;
}

const getDefaultState = () => {
  return {
    token: getToken(),
    name: "",
    avatar: "",
    buttons: [],
    roles: [],
    routes: []
  };
};

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
    state.roles = userInfo.roles;
    state.name = userInfo.name;
    state.avatar = userInfo.avatar;
    state.buttons = userInfo.buttons;
  },
  SET_ROUTES(state, routes) {
    state.routes = routes;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          const { data } = response;
          commit("SET_TOKEN", data.token);
          setToken(data.token);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response;

          if (!data) {
            return reject("Verification failed, please Login again.");
          }

          // const { name, avatar } = data;

          // commit("SET_NAME", name);
          // commit("SET_AVATAR", avatar);
          commit("SET_USERINFO", data);

          // 过滤异步路由，显示返回数据中包含的路由 //根据返回的由name组成的routes数组
          const asyncRoutes = filterAsyncRoutes(allAsyncRoutes, data.routes);
          console.log(asyncRoutes);
          // 构建自己的路由
          const routes = constantRoutes.concat(asyncRoutes, anyRoutes);
          // 保存到state 遍历生成菜单
          commit("SET_ROUTES", routes);
          console.log(routes);
          // 动态添加路由
          router.addRoutes([...asyncRoutes, anyRoutes]);

          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken(); // must remove  token  first
          resetRouter();
          commit("RESET_STATE");
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
