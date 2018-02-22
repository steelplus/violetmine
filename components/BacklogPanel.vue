<template>
  <div id='backlog-list'>
      <el-container>
        <el-header>
          <h3><font color='royalblue'>バックログ</font></h3>
          <span>対象プロジェクト：</span>
          <el-select v-model='currentProjectId' @change='switchCurrentProject'>
            <el-option
              v-for='project in backlogState.userProjects'
              :key='project.id'
              :label='project.name'
              :value='project.id'>
            </el-option>
          </el-select>
        </el-header>
        <el-main>
          <font color='red'>{{backlogState.error}}</font><br/>
          <table width='1200'>
            <tbody>
              <tr>
                <td width='600'>
                  <font color='royalblue'>イテレーション</font>&nbsp;&nbsp;
                </td>
                <td width='600'>
                  <font color='royalblue'>バックログ</font>&nbsp;&nbsp;
                </td>
              </tr>
              <tr>
                <td width='600' valign='top'>
                  <iteration-list 
                    :project='backlogState.currentProject'
                    :iterations='backlogState.iterations'/>
                </td>
                <td width='600' valign='top'>
                  <story-list
                    :project='backlogState.currentProject'
                    :stories='dispBacklogs'/>
                </td>
              </tr>
            </tbody>
          </table>
        </el-main>
      </el-container>
  </div>
</template>

<script>
import Vue from 'vue'
import IterationList from '~/components/iteration/IterationList'
import IterationEditCmp from '~/components/iteration/IterationEditCmp'
import StoryList from '~/components/story/StoryList'
import StoryEditCmp from '~/components/story/StoryEditCmp'
import IterationController from '~/libs/controllers/IterationController'
import StoryController from '~/libs/controllers/StoryController'
import Story from '~/libs/models/Story'

Vue.component('iteration-list', IterationList)
Vue.component('iteration-edit-cmp', IterationEditCmp)
Vue.component('story-list', StoryList)
Vue.component('story-edit-cmp', StoryEditCmp)

export default {
  name: 'backlog-panel',
  data() {
    const loginState = this.$store.state.loginState
    const backlogState = this.$store.state.backlogState
    const dispBacklogs = [].concat(backlogState.backlogs)
    if(dispBacklogs.length===0){
      dispBacklogs.push(Story.NoStoryFound)
    }
    return {
      loginState: loginState,
      backlogState: backlogState,
      dispBacklogs: dispBacklogs,
      currentProjectId: undefined,
    }
  },
  created() {
    const loginUser = this.loginState.loginUser
    this.$store.commit('backlogState/init',{loginUser: loginUser})
    if(this.backlogState.currentProject) {
      this.currentProjectId = this.backlogState.currentProject.id
    }
    this.dispBacklogs.splice(0, this.dispBacklogs.length)
    this.backlogState.backlogs.forEach((story) => (
      this.dispBacklogs.push(story)
    ))
    if(this.dispBacklogs.length===0){
      this.dispBacklogs.push(Story.NoStoryFound)
    }
  },

  methods: {
    switchCurrentProject() {
      this.$store.commit('backlogState/switchCurrentProject', {
        currentProjectId: this.currentProjectId
      })
      this.dispBacklogs.splice(0, this.dispBacklogs.length)
      this.backlogState.backlogs.forEach((story)=>(
        this.dispBacklogs.push(story)
      ))
      if(this.dispBacklogs.length===0){
        this.dispBacklogs.push(Story.NoStoryFound)
      }
    }
  }
}
</script>

<style scoped>

</style>
