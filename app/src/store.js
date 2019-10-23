import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      uid: "",
      username: "",
      firstname: "",
      lastname: "",
      picture: "",
      email: "",
      list: [],
      token: "",
      lang: "",
      strategy: "",
      bookmarks: [],
      follows: []
    },
    defaultUser: {
      uid: "",
      username: "",
      firstname: "",
      lastname: "",
      picture: "",
      email: "",
      list: [],
      token: "",
      bookmarks: [],
      lang: "",
      follows: []
    },
    isLog: false,
    isSearch: false
  },
  mutations: {
    SET_USER: (state, val) => { state.user = val },
    SET_ISSEARCH: (state, val) => { state.isSearch = val },
    SET_UID: (state, val) => { state.user.uid = val },
    SET_USERNAME: (state, val) => { state.user.username = val },
    SET_FIRSTNAME: (state, val) => { state.user.firstname = val },
    SET_LASTNAME: (state, val) => { state.user.lastname = val },
    SET_PICTURE: (state, val) => { state.user.picture = val },
    SET_EMAIL: (state, val) => { state.user.email = val },
    SET_LIST: (state, val) => { state.user.list = val },
    SET_TOKEN: (state, val) => { state.user.token = val },
    SET_LANG: (state, val) => { state.user.lang = val },
    SET_ISLOG: (state, val) => { state.isLog = val },
    SET_BOOKMARKS: (state, val) => { state.user.bookmarks = val },
    SET_FOLLOWS: (state, val) => { state.user.follows = val}
  },
  actions: {
    
  },
  getters: {
    isSearch: state => state.isSearch,
    user: state => state.user,
    strategy: state => state.user.strategy,
    defaultUser: state => state.defaultUser,
    isLog: state => state.isLog,
    picture: state => state.user.picture,
    token: state => state.user.token,
    uid: state => state.user.uid,
    bookmarks: state => state.user.bookmarks,
    lang: state => state.user.lang,
    follows: state => state.user.follows
  },
  plugins: [createPersistedState()]
})
