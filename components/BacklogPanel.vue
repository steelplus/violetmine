<template>
  <div id='backlog-list'>
      <el-container>
        <el-header>
            <h3><font color='royalblue'>バックログ</font></h3>
              <el-select v-model='currentProjectId'>
                <el-option
                  v-for="project in userProjects"
                  :key="project.id"
                  :label="project.name"
                  :value="project.id">
                </el-option>
              </el-select>
              <el-dialog
                title='イテレーションの追加'
                :visible.sync='showAddIterationDialog'
                custom-class='iteration-cmp-dialog'
                :show-close='false'
                :append-to-body='true'
                >
                <iteration-cmp
                    :projectId='currentProjectId'
                    :onOk='onAddIterationOk'
                    :onCancel='onAddIterationCancel'
                />
            </el-dialog>            
            <el-button
                type='primary'
                icon='el-icon-circle-plus'
                @click='onAddBacklogStart'
                round>
                バックログの追加
            </el-button>
            <el-dialog
                title='バックログの追加'
                :visible.sync='showAddBacklogDialog'
                custom-class='backlog-cmp-dialog'
                :show-close='false'
                :append-to-body='true'
                >
                <story-cmp
                    :projectId='currentProjectId'
                    :onOk='onAddBacklogOk'
                    :onCancel='onAddBacklogCancel'
                />
            </el-dialog>
            <font color='red'>{{error}}</font>
        </el-header>
        <el-main>
          <table width='100vw'>
            <tr>
              <td><iteration-list :iteration='iterations'/></td>
              <td><story-list :stories='backlogs'/></td>
            </tr>
          </table>
        </el-main>
      </el-container>
  </div>
</template>

<script>
import Vue from 'vue'
import IterationList from '~/components/iteration/IterationList'
import IterationCmp from '~/components/iteration/IterationCmp'
import StoryList from '~/components/story/StoryList'
import StoryCmp from '~/components/story/StoryCmp'

Vue.component('iteration-list', IterationList)
Vue.component('iteration-cmp', IterationCmp)
Vue.component('story-list', StoryList)
Vue.component('story-cmp', StoryCmp)

export default {
  name: 'backlog-panel',
  data() {
    return {
      currentProjectId: '',
      userProjects:[],
      iterations: [],
      backlogs: [],
      showAddIterationDialog: false,
      showAddBacklogDialog: false,
      error: '',
    }
  },

  mounted() {
    console.log("---------mounted")
    const loginUser = this.$store.state.loginState.loginUser
    this.$store.commit('backlogState/init',{loginUser: loginUser})
    const currentProject = this.$store.state.backlogState.currentProject
    if(currentProject) {
      this.currentProjectId = currentProject.id
      this.userProjects = this.$store.state.backlogState.userProjects
      this.iterations = this.$store.state.backlogState.iterations
      this.backlogs = this.$store.state.backlogState.backlogs
    } else {
      this.error = this.$store.state.backlogState.error
    }
  },

  // updated() {
  //   console.log("---------updated")
  //   const loginUser = this.$store.state.loginState.loginUser
  //   this.$store.commit('backlogState/init',{loginUser: loginUser})
  //   const currentProject = this.$store.state.backlogState.currentProject
  //   if(currentProject) {
  //     this.currentProjectId = currentProject.id
  //     this.userProjects = this.$store.state.backlogState.userProjects
  //     this.iterations = this.$store.state.backlogState.iterations
  //     this.backlogs = this.$store.state.backlogState.backlogs
  //   } else {
  //     this.error = this.$store.state.backlogState.error
  //   }
  // },

  methods: {
    onAddIterationStart() {
      this.showIterationDialog = true
    },
    onAddIterationOk(request) {
      this.$store.commit('backlogState/createIteration', {
          request: request,
      })
      const iterations = this.$store.state.backlogState.iterations
      this.iterations.push(iterations[iterations.length-1])
      this.error = this.$store.state.backlogState.error
      this.showAddIterationDialog = false
    },
    onAddIterationCancel() {
      this.showAddIterationDialog = false
    },
    onAddBacklogStart() {
      this.showBacklogDialog = true
    },
    onAddBacklogOk(request) {
      this.$store.commit('backlogState/createStory', {
          request: request,
      })
      const backlogs = this.$store.state.backlogState.backlogs
      this.backlogs.push(iterations[backlogs.length-1])
      this.error = this.$store.state.backlogState.error
      this.showBacklogDialog = false
    },
    onAddBacklogCancel() {
      this.showBacklogDialog = false
    }
  }
}
</script>

<style scoped>

</style>
