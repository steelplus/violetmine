import Vue from 'vue'
import { mapGetters } from 'vuex'
import UserController from '~/libs/controllers/UserController'

const loginState = {
  // ネームスペースを利用する
  namespaced: true,
  name: 'loginState',
  state: {
    account: '',
    password: '',
    error: '',
    loginUser: undefined,
  },
  computed: {
    ...mapGetters([
      'account',
      'password',
      'error',
      'loginUser',
    ])
  },
  mutations: {
    login(state, payload) {
      const result = UserController.login(payload.account, payload.password)
      if(result) {
        state.loginUser = UserController.findByAccount(payload.account)
        state.error = ''
      } else {
        state.loginUser = undefined
        state.error = 'アカウント名またはパスワードが違います。'
        state.password = ''
      }
    },
  },
}
export default loginState