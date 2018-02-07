<template>
  <div id='main'>
    <el-tabs type='border-card' style='height: 120vh; width:100vw' >
      <el-tab-pane label='バックログ'>
        <backlog-panel/>
      </el-tab-pane>
      <el-tab-pane label='タスクボード'>
        ここにタスクボードを表示
      </el-tab-pane>
      <el-tab-pane v-if='admin === true' label='ユーザーの管理'>
        <user-panel/>
      </el-tab-pane>
      <el-tab-pane v-if='admin === true' label='プロジェクトの管理'>
        <project-panel/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Vue from 'vue'
import BacklogPanel from '~/components/BacklogPanel'
import UserPanel from '~/components/UserPanel'
import ProjectPanel from '~/components/ProjectPanel'

Vue.component('backlog-panel', BacklogPanel)
Vue.component('user-panel', UserPanel)
Vue.component('project-panel', ProjectPanel)

export default {
  name: 'main-page',
  data() {
    const loginUser = this.$store.state.loginState.loginUser
    return {
      admin: (loginUser) ? loginUser.admin : false,
    }
  },
  created() {
    if(!this.$store.state.loginState.loginUser){
      this.$router.push('/')
    }
  },
  methods: {
  },
}
</script>

<style scoped>
  .tab {
    height: 80%;
  }
</style>