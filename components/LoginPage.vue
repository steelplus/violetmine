<template>
  <div id='login'>
    <el-container>
      <el-header>
      <br/>
      <h2><font color='royalblue'>ログイン</font></h2>
      </el-header>
      <el-main>
        <div @keyup.enter='onLogin'>
        <span class='input-label'>アカウント：</span>
        <el-input class='input-text' type='text'
          placeholder='アカウントを入力してください'
          v-model='account'
          clearable>
        </el-input><br/>
        <span class='input-label'>パスワード：</span>
        <el-input class='input-text' type='password'
          placeholder='パスワードを入力してください'
          v-model='password'
          clearable>
        </el-input><br/>
        </div>
        <font color='red' v-model='loginState'>{{loginState.error}}</font>
      </el-main>
      <el-footer>
        <el-button
          type='success'
          :disabled='account === ""'
          class='login-button'
          @click='onLogin'
          round>
          ログイン
        </el-button>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'login-page',
  data() {
    return {
      account: '',
      password: '',
      error: this.$store.state.loginState.error,
      loginState: this.$store.state.loginState,
    };
  },
  methods: {
    onLogin() {
      if (!this.account) return
      this.$store.commit('loginState/login', {
        account: this.account,
        password: this.password,
      })
      //this.error =
      if (this.$store.state.loginState.loginUser) {
        this.$router.push('/main')
      }
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
  text-align: center;
}
.el-footer {
  text-align: center;
}
.login-button {
  float: center;
}
</style>
