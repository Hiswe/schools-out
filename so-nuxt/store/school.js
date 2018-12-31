export const state = () => {
  return {
    current: {},
    list: [],
  }
}

const SET_ALL = `SET_ALL_SCHOOLS`

export const mutations = {
  [SET_ALL](state, payload = []) {
    state.list = payload
  },
}

export const ALL_SCHOOLS = `ALL_SCHOOLS`

export const actions = {
  async [ALL_SCHOOLS](vuexContext) {
    const { commit } = vuexContext
    try {
      const response = await this.$axios.$get(`/schools`)
      commit(SET_ALL, response)
    } catch (error) {
      commit(SET_ALL, [])
    }
  },
}
