import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import AuthService from '@/services/AuthService'
let api_endpoint = process.env.VUE_APP_CHAKAIMOOK_ENDPOINT || "http://localhost:1337"
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data: [],
  },
  getters: {
    rewards: (state) => state.data
  },
  mutations: {
    fetch(state, {res}){
        state.data = res.data
    },
    add(state, payload){
      state.data.push(payload)
    },
    edit(state, index, data){
      state.data[index] = data
    },
    delete(state, index, data){
      state.data[index] = data
    },
    get(state, index, data){
      state.data[index] = data
    }

  },
  actions: {
    async fetchData({ commit }){
        let res = await Axios.get(api_endpoint + "/rewards")
      
        commit('fetch', {res})
    },
    async editReward({commit}, payload){
      console.log('payload', payload)

      let url = api_endpoint + "/rewards/" + payload.id
      let body = {
          name: payload.name,
          quantity: payload.quantity,
          points_use: payload.points_use

      }
      try{
        let headers = AuthService.getApiHeader()
        let res = await Axios.put(url, body, headers)
        if(res.status === 200){
          commit("edit",payload.index,res.data)
        return{
            success: true,
            data: res.data
        }
        }
        else{
          console.error(res)
          return{
              success: false,
              message: "Unknown status code: " + res.status
          }
            }
        } catch(e){
            if(e.response.status === 403){
                console.error(e.response.data.message)
                return{
                    success: false,
                    message: e.response.data.message,
                }
            }else{
                return{
                    success: false,
                    message: "Unknown error: " + e.response.data
                }
            }
        }
    },
    
    async addReward({ commit }, payload){
      
      let url = api_endpoint + "/rewards"

      let body = {
          name: payload.name,
          quantity: payload.quantity,
          points_use: payload.points_use,
          
      }
      try{
        let headers = AuthService.getApiHeader()
        let res = await Axios.post(url, body, headers)
        if(res.status === 200){
        commit("add", res.data)
        return{
            success: true,
            data: res.data
        }
        }
        else{
          console.error(res)
          return{
              success: false,
              message: "Unknown status code: " + res.status
          }
            }
        } catch(e){
            if(e.response.status === 403){
                console.error(e.response.data.message)
                return{
                    success: false,
                    message: e.response.data.message,
                }
            }else{
                return{
                    success: false,
                    message: "Unknown error: " + e.response.data
                }
            }
        }
    },
    async deleteReward({commit}, payload){
      console.log('payload', payload)

      let url = api_endpoint + "/rewards/" + payload.id

      try{
        let headers = AuthService.getApiHeader()
        let res = await Axios.delete(url, headers)
        if(res.status === 200){
          commit("delete",payload.index,res.data)
        return{
            success: true,
            data: res.data
        }
        }
        else{
          console.error(res)
          return{
              success: false,
              message: "Unknown status code: " + res.status
          }
            }
        } catch(e){
            if(e.response.status === 403){
                console.error(e.response.data.message)
                return{
                    success: false,
                    message: e.response.data.message,
                }
            }else{
                return{
                    success: false,
                    message: "Unknown error: " + e.response.data
                }
            }
        }
    },
    async getReward({commit}, payload){
      console.log('payload', payload)

      let urlReward = api_endpoint + "/rewards/" + payload.id
      let bodyReward = {
          quantity: payload.quantity,
      }
      let urlUser = api_endpoint + "/users/" + payload.user_id
      let bodyUser = {
          total_points: payload.total_points,
          points_use: payload.points_use 
      }
      let urlHistory = api_endpoint + "/histories"
      let bodyHistory = {
          name: payload.name,
          reward_name: payload.reward_name,
          points_use: payload.points_use_history
      }
      
      try{
        let headers = AuthService.getApiHeader()
        let res = await Axios.put(urlReward, bodyReward, headers)
        await Axios.put(urlUser, bodyUser, headers)
        await Axios.post(urlHistory, bodyHistory, headers)
        if(res.status === 200){
          commit("get",payload.index,res.data)
        return{
            success: true,
            data: res.data
        }
        }
        else{
          console.error(res)
          return{
              success: false,
              message: "Unknown status code: " + res.status
          }
            }
        } catch(e){
            if(e.response.status === 403){
                console.error(e.response.data.message)
                return{
                    success: false,
                    message: e.response.data.message,
                }
            }else{
                return{
                    success: false,
                    message: "Unknown error: " + e.response.data
                }
            }
        }
    },
  },
  modules: {
  }
})