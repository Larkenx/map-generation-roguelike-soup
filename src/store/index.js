import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const LOAD_MAP = 'LOAD_MAP'
export default new Vuex.Store({
	state: {
		map: null
	},
	mutations: {
		[LOAD_MAP](state, map) {
			state.map = map
		}
	}
})
