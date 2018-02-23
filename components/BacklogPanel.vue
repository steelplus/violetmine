<template>
  <div id='backlog-list'>
      <el-container>
        <el-header>
          <h3><font color='royalblue'>バックログ</font></h3>
          <el-select v-model='backlogState.currentProject'>
            <el-option
              v-for="project in backlogState.userProjects"
              :key="project.id"
              :label="project.name"
              :value="project">
            </el-option>
          </el-select>
          <el-button
              type='primary'
              icon='el-icon-circle-plus'
              @click='onAddIterationStart'
              round>
              イテレーションの追加
          </el-button>
          <el-dialog
            title='イテレーションの追加'
            :visible.sync='showAddIterationDialog'
            custom-class='iteration-cmp-dialog'
            :show-close='false'
            :disabled='backlogState.currentProject'
            :append-to-body='true'
            >
              <iteration-cmp
                  :project='backlogState.currentProject'
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
                    :project='backlogState.currentProject'
                    :onOk='onAddBacklogOk'
                    :onCancel='onAddBacklogCancel'
                />
            </el-dialog>
        </el-header>
        <el-main>
          <font color='red'>{{backlogState.error}}</font><br/>
          <table width='100vw'>
            <tr>
              <td><iteration-list :iteration='backlogState.iterations'/></td>
              <td><story-list :stories='backlogState.backlogs'/></td>
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
    const loginState = this.$store.state.loginState
    const backlogState = this.$store.state.backlogState
    return {
      loginState: loginState,
      backlogState: backlogState,
      // currentProjectId: '',
      // userProjects:[],
      // iterations: [],
      // backlogs: [],
      showAddIterationDialog: false,
      showAddBacklogDialog: false,
    }
  },
  mounted() {
    const loginUser = this.loginState.loginUser
    this.$store.commit('backlogState/init',{loginUser: loginUser})
  },

  methods: {
    onAddIterationStart() {
      this.showIterationDialog = true
    },
    onAddIterationOk(request) {
      this.$store.commit('backlogState/createIteration', {
          request: request,
      })
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
