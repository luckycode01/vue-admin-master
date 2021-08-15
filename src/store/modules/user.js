import { login, logout, getInfo } from "@/api/acl/user";
import { getToken, setToken, removeToken } from "@/utils/auth";

import {
  resetRouter,
  allAsyncRoutes,
  anyRoutes,
  constantRoutes
} from "@/router";
import router from "@/router";

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

import cloneDeep from "lodash/cloneDeep";

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
  SET_USERINFO(state, userinfo) {
    state.name = userinfo.name;
    state.avatar = userinfo.avatar;
    state.roles = userinfo.roles;
    state.buttons = userinfo.buttons;
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

          let asyncRoutes = filterAsyncRoutes(
            cloneDeep(allAsyncRoutes),
            data.routes
          );
          let routes = constantRoutes.concat(asyncRoutes, anyRoutes);
          commit("SET_ROUTES", routes);

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
