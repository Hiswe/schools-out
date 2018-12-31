import isNil from 'lodash.isnil'

const SET_USER = `SET_USER`
const REMOVE_USER = `REMOVE_USER`
const UPDATE_SETTINGS = `UPDATE_SETTINGS`

export const state = () => {
  return {
    current: {},
  }
}

export const mutations = {
  [SET_USER](state, payload) {
    state.current = payload
  },
  [REMOVE_USER](state) {
    state.current = null
  },
  [UPDATE_SETTINGS](state, payload) {
    state.current = payload
  },
}

export const IS_CONNECTED = `IS_CONNECTED`
export const IS_ADMIN = `IS_ADMIN`
export const LOCALE = `LOCALE`

export const getters = {
  [IS_CONNECTED](state) {
    return !isNil(state.current)
  },
  [IS_ADMIN](state) {
    return !isNil(state.current) && state.current.isAdmin
  },
  [LOCALE](state) {
    if (isNil(state.current)) return `en`
    return state.current.lang
  },
}

export const ME = `ME`
export const LOGIN = `LOGIN`
export const LOGOUT = `LOGOUT`
export const REGISTER = `REGISTER`
export const SET_PASSWORD = `SET_PASSWORD`
export const UPDATE_USER = `UPDATE_USER`

export const actions = {
  async [ME](vuexContext) {
    const { commit } = vuexContext
    try {
      const response = await this.$axios.$get(`/account/me`)
      commit(SET_USER, response.current)
    } catch (error) {
      commit(REMOVE_USER)
    }
  },
  async [LOGIN](vuexContext, payload) {
    const { commit, dispatch } = vuexContext
    const { $axios, $router, $cookies } = this

    try {
      const response = await $axios.$post(`/account/login`, payload)
      commit(SET_USER, response.current)
      $cookies.set(COOKIE_NAME, response.access_token)
      $axios.setToken(response.access_token, JWT_FORMAT)
      $router.push(`/`)
    } catch (error) {
      const { data } = error.response
      // wrong email address => not-found
      if (data.status === 404) {
        const payload = {
          type: `error`,
          message: data.message,
        }
        // dispatch(`notifications/${ADD_NOTIFICATION}`, payload, IS_ROOT)
      }
      // unauthorized => bad password
      if (data.status === 401) {
        const payload = {
          key: `password`,
          message: data.message,
        }
        // dispatch(`form-errors/${ADD_ERROR}`, payload, IS_ROOT)
      }
      commit(REMOVE_USER)
    }
  },
  async [REGISTER](vuexContext, payload) {
    const { commit } = vuexContext
    const { $axios, $router } = this
    try {
      const response = await $axios.$post(`/account/register`, payload)
      $router.push(`/account/set-password`)
    } catch (error) {
      commit(REMOVE_USER)
    }
  },
  async [SET_PASSWORD](vuexContext, payload) {
    const { commit } = vuexContext
    const { $axios } = this
    try {
      const response = await $axios.$post(`/account/set-password`, payload)
      commit(SET_USER, response.current)
    } catch (error) {
      commit(REMOVE_USER)
    }
  },
  // https://vuex.vuejs.org/api/#actions
  async [LOGOUT](vuexContext) {
    const { commit } = vuexContext
    const { $axios, $cookies, $router } = this
    try {
      await $axios.$get(`/account/logout`)
    } catch (error) {
      console.log(`something went wrong while disconnecting from API`)
    }
    $cookies.remove(COOKIE_NAME)
    $axios.setToken(false)
    commit(REMOVE_USER)
    this.$router.push(`/account/login`)
  },
  async [UPDATE_USER](vuexContext, payload) {
    const { commit } = vuexContext
    const { $axios } = this
    try {
      const update = await $axios.$post(`/account/settings`, payload)
      commit(UPDATE_SETTINGS, update.current)
    } catch (error) {
      console.log(`something went wrong while updating the current`)
    }
  },
}
