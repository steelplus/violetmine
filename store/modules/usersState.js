import Vue from 'vue'
import { mapGetters } from 'vuex'
import UserController from '~/libs/controllers/UserController'
import User from '~/libs/models/User'

const usersState = {
  namespaced: true, // ネームスペースを利用する
  name: 'usersState',
  state: {
    users: [],
    error: '',
  },
  computed: {
    ...mapGetters([
      'users',
      'error',
    ])
  },
  mutations: {
    init(state, payload) {
      state.users = UserController.findAll()
    },

    create(state, payload) {
      const user = UserController.createUser(payload.request)
      if(user){
        state.users.push(user)
      }
    },

    edit(state, payload) {
      try{
        UserController.updateUser(payload.request)
      } catch(err) {
        state.error = err.message
        console.log('ERROR: usersState#edit ' + state.error)
      }
    },

    editCancel(state, payload) {
      try{
        //const user = state.users[payload.index]
        UserController.refreshUser(payload.user)
      } catch(err) {
        state.error = err.message
        console.log('ERROR: usersState#editCancel ' + state.error)
      }
    },

    delete(state, payload) {
      try{
        const user = state.users[payload.index]
        UserController.deleteUser(user)
        state.users.splice(payload.index, 1)
      } catch(err) {
        state.error = err.message
        console.log('ERROR: usersState#delete ' + state.error)
      }
    },
  },
}
export default usersState