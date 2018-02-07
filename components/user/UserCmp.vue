<template>
    <div>
      <el-container>
        <el-main>
          <span class='input-label'>名前：</span>
          <el-input class='input-text' type='text'
            placeholder='名前を入力してください'
            v-model='name'
            clearable>
          </el-input><br/>
          <span class='input-label'>アカウント：</span>
          <el-input class='input-text' type='text'
            placeholder='アカウントを入力してください'
            v-model='account' 
            clearable
            :readonly='id !== undefined'>
          </el-input><br/>
          <span class='input-label'>パスワード：</span>
          <el-input class='input-text' type='password'
            placeholder='パスワードを入力してください'
            v-model='password'
            clearable>
          </el-input><br/>
          <span v-if='showAdmin' class='input-label'>管理権限：</span>
          <el-switch
            v-show='showAdmin'
            active-color='forestgreen'
            inactive-color='red'
            v-model='admin'
          /><br/>
          <font color='red'>{{error}}</font>
        </el-main>
        <el-footer>
          <span >
            <el-button 
              type='danger'
              class='float-buttons'
              icon='el-icon-close'
              @click.native.prevent='onButtonCancel'
              round
            >
              キャンセル
            </el-button>
            <el-button 
              type='success'
              class='float-buttons'
              icon='el-icon-check'
              :disabled='account === "" || name === ""'
              @click.native.prevent='onButtonOk'
              round
            >
              保存
            </el-button>
          </span>
        </el-footer>
      </el-container>
    </div>
</template>

<script>
import UserController from '~/libs/controllers/UserController'
import {UserUpdateRequest} from '~/libs/models/User'

export default {
  name: 'user-cmp',
  props: [
    'user',
    'showAdmin',
    'onOk',
    'onCancel',
  ],
  data() {
    let user = this.user
    return ({
      id: (user) ? user.id : UserUpdateRequest.CREATE_REQUEST,
      account: (user) ? user.account : '',
      name: (user) ? user.name : '',
      password: (user) ? user.password : '',
      admin: (user) ? user.admin : false,
      projectIds: (user) ? user.projectIds : [],
      error: '',
    })
  },
  methods: {
    onButtonOk() {
      if(!this.account) return
      const request = new UserUpdateRequest(
        this.id,
        this.account, 
        this.name,
        this.password, 
        this.admin,
        this.projectIds,
      )
      try{
        this.onOk(request)
        this.clear()
      } catch(err) {
        this.error = err.message
        return
      }
    },

    onButtonCancel() 
    {
      try{
        this.onCancel()
        this.clear()
      } catch(err) {
        this.error = err.message
        return
      }
    },

    clear() {
      //ダイアログは非表示になっているだけなので入力内容をクリアする。
      this.account = ''
      this.name = ''
      this.password = ''
      this.admin = false
      this.updateId = undefined
      this.error = ''
    }
  }
};
</script>

<style scoped>
.input-label {
  display: inline-block;
  width: 150px;
}
.input-text {
  display: inline-block;
  width: 400px;
}
.el-header,
.el-main {
  text-align: left;
}
.el-footer {
  text-align: center;
}
.float-buttons {
  float: right;
}
</style>
