import Vuex from 'vuex'
import Vue from 'vue'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: null,
        token: null,
        temp_pass: null,
        isUserLoggedIn: false,
        order_id: 0,
        order_ID: 0,
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload
        },
        setToken(state, payload){
            state.token = payload
            if(payload){
                state.isUserLoggedIn = true
            } else {
                state.isUserLoggedIn = false
            }
        },
        setTempPass(state, payload){
            state.temp_pass = payload
        },
        setOderId(state, payload){
            state.order_id = payload
        },
        setOderID(state, payload){
            state.order_ID = payload
        }
    },
    plugins: [createPersistedState()]
})