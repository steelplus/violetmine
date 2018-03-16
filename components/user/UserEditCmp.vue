<template>
  <div>
    <ru-dialog 
      v-if="visible" 
      :closeCallback="onButtonCancel"
      title="ユーザーの追加">

      <!--名前入力-->
      <div class="field">
        <input v-model='name' class="input" type="text" placeholder="名前を入力して下さい">
      </div>

      <!--アカウント名入力-->
      <div class="field">
        <input v-model='account' :readonly='id !== undefined' class="input" type="text"
                placeholder="アカウント名を入力して下さい">
      </div>

      <!--パスワード入力-->
      <div class="field">
        <input v-model='password' class="input" type="password" placeholder="パスワードを入力して下さい">
      </div>

      <!--管理者権限入力-->
      <div v-if="showAdmin" class="field">
        <input v-model='admin' id="adminSwitch" type="checkbox" class="switch" checked="checked">
        <label for="adminSwitch">管理者権限</label>
      </div>

      <!--エラーメッセージ-->
      <span style="color: red; ">{{error}}</span>

      <!--フッタ-->
      <button slot="footer" @click="onButtonOk" :disabled='account === "" || name === ""' class="button is-success">保存</button>
      <button slot="footer" @click="onButtonCancel" class="button">キャンセル</button>
    </ru-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import UserController from '~/libs/controllers/UserController'
  import { UserUpdateRequest } from '~/libs/models/User'
  import RuDialog from '~/components/common/RuDialog'

  Vue.component('ru-dialog', RuDialog)

  export default {
    name: 'user-cmp',
    props: [
      'user',
      'showAdmin',
      'onOk',
      'onCancel',
      'visible',
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
        if (!this.account) {
          return;
        }
        const request = new UserUpdateRequest({
          id: this.id,
          account: this.account,
          name: this.name,
          password: this.password,
          admin: this.admin,
          projectIds: this.projectIds,
        })
        try {
          this.onOk(request)
          this.reset()
        } catch (err) {
          this.error = err.message
          return
        }
      },

      onButtonCancel() {
        try {
          this.onCancel()
          this.reset()
        } catch (err) {
          this.error = err.message
          return
        }
      },

    reset() {
      this.$emit('update:visible', false)
      //ダイアログは非表示になっているだけなので入力内容をクリアする。
      const user = UserController.findById(this.id)
      this.id = (user) ? user.id : UserUpdateRequest.CREATE_REQUEST
      this.account = (user) ? user.account : ''
      this.name = (user) ? user.name : ''
      this.password = (user) ? user.password : ''
      this.admin = (user) ? user.admin : false
      this.projectIds = (user) ? user.projectIds : []
        this.error = ''
      },
    }
  };
</script>

<style scoped lang="scss">
  .input-label {
    display: inline-block;
    width: 150px;
  }

  .input-text {
    display: inline-block;
    width: 400px;
  }
</style>
