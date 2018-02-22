<template>
  <div id='login'>
    <el-container>
      <el-header>
      <br/>
      <h2><font color='royalblue'>ログイン</font></h2>
      </el-header>
      <el-main>
        <font color='red'>{{loginState.error}}</font>
        <div @keyup.enter='onLogin'>
        <span class='input-label'>アカウント：</span>
        <el-input class='input-text' type='text'
          placeholder='アカウントを入力してください'
          v-model='loginState.account'
          clearable>
        </el-input><br/>
        <span class='input-label'>パスワード：</span>
        <el-input class='input-text' type='password'
          placeholder='パスワードを入力してください'
          v-model='loginState.password'
          clearable>
        </el-input><br/>
        </div>
      </el-main>
      <el-footer>
        <el-button
          type='success'
          :disabled='loginState.account === ""'
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
      loginState: this.$store.state.loginState,
    };
  },
  methods: {
    onLogin() {
      if (!this.loginState.account) return
      this.$store.commit('loginState/login', {
        account: this.loginState.account,
        password: this.loginState.password,
      })
      if (this.loginState.loginUser) {
        const query = this.$route.query
        let redirect = false 
        if(query && query.redirect) {
          this.$router.push(query.redirect)  
        } else {
          this.$router.push('/main')
        }
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
