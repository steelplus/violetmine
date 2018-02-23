<template>
    <div>
      <el-container>
        <el-header>
            <h3><font color='royalblue'>プロジェクトの一覧</font></h3>
            <el-button
                type='primary'
                icon='el-icon-circle-plus'
                @click='onAddStart'
                round>
                プロジェクトの追加
            </el-button>
            <el-dialog
                title='プロジェクトの追加'
                :visible='showAddDialog'
                custom-class='project-cmp-dialog'
                :show-close='false'
                :append-to-body='true'
                >
                <project-cmp
                    :onOk='onAddOk'
                    :onCancel='onAddCancel'
                />
            </el-dialog>            
        </el-header>
        <el-main>
        <font color='red'>{{projectsState.error}}</font><br/>
        <el-table
            :data='projectsState.projects'
            style='width: 100vw; overflow:auto;'
            height='100vh'
            empty-text='プロジェクトはありません。'
            stripe
        >
            <el-table-column
                fixed
                label='操作'
                width='80'>
                <template slot-scope='scope'>
                    <el-button
                        type='text'
                        @click.native.prevent='onEditStart(scope.$index)'>
                        <i class='el-icon-edit' style='color:royalblue'/>
                    </el-button>
                    <el-button 
                        type='text'
                        @click.native.prevent='onDeleteOk(scope.$index)'>
                        <i class='el-icon-delete' style='color:red'/>
                    </el-button>
                    <el-dialog
                        title='プロジェクトの編集'
                        :visible=scope.row.showEditDialog
                        custom-class='project-cmp-dialog'
                        :show-close='false'
                        :append-to-body='true'
                        >
                        <project-cmp
                            :project='scope.row'
                            :onOk='onEditOk'
                            :onCancel='onEditCancel'
                        />
                    </el-dialog>
                </template>
            </el-table-column>
            <el-table-column
                fixed
                prop='name'
                label='名前'
                width='150'>
            </el-table-column>                
            <el-table-column
                prop='description'
                label='説明'
                width='150'/>
            <el-table-column
                label='担当者'
                width='300'>
                <template slot-scope='scope'>
                    <div v-for='user in scope.row.users' :key='user.id'>
                      {{user.name}}&nbsp;
                    </div>
                </template>
            </el-table-column>
        </el-table>
        </el-main>
      </el-container>
    </div>
</template>

<script>
import Vue from 'vue'
import ProjectCmp from '~/components/project/ProjectCmp'
import ProjectController from '~/libs/controllers/ProjectController'
import UserController from '~/libs/controllers/UserController'

Vue.component('project-cmp', ProjectCmp)

export default {
  name: "project-list",
  data() {
    return {
      projectsState: this.$store.state.projectsState,
      showAddDialog: false,
      showDeleteConfirm: false,
    }
  },
  mounted() {
      this.$store.commit('projectsState/init',{})
      this.projectsState.projects.forEach((project) =>{
        project.users = UserController.findByIds(project.userIds)
        this.$set(project, 'showEditDialog', false)
      })
  },
  methods: {

    onEditStart(index) {
      const project = this.projectsState.projects[index]
      this.$set(project, 'showEditDialog', true)
    },
    onEditCancel(id) {
      const projects = this.projectsState.projects
      let project = undefined
      let index = -1
      for(let i=0; i<projects.length; i++) {
        if(projects[i].id === id) {
          project = projects[i]
          index = i
          break
        }
      }
      if(!project) return
      this.$store.commit('projectsState/editCancel',{
          index: index,
          project: project,
      })
      //project = this.projectsState.projects[index]
      this.$set(project, 'showEditDialog', false)
    },
    onEditOk(request) {
      this.$store.commit('projectsState/edit', {
        request: request,
      })
      const projects = this.projectsState.projects
      let project = undefined
      let index = -1
      for(let i=0; i<projects.length; i++) {
        if(projects[i].id === request.id) {
          project = projects[i]
          index = i
          break
        }
      }
      if(project) {
        project.users = UserController.findByIds(project.userIds)
        this.$set(project, 'showEditDialog', false)
        //ログインユーザのプロジェクトが編集されている可能性があるため、リロード
        let loginUser = this.$store.state.loginState.loginUser
        let backlogState = this.$store.state.backlogState
        backlogState.userProjects = ProjectController.findByIds(loginUser.projectIds)
      }
    },
    onDeleteStart(index) {
      this.showDeleteConfirm = true
    },
    onDeleteOk(index) {
      this.$store.commit('projectsState/delete',{
          index: index,
      })
      this.showDeleteConfirm = false
    },
    onDeleteCancel(index) {
      this.showDeleteConfirm = false
    },
    onAddStart() {
      this.showAddDialog = true
    },
    onAddOk(request) {
      this.$store.commit('projectsState/create', {
          request: request,
      })
      const projects = this.projectsState.projects
      const project = projects[projects.length-1]
      this.$set(project, 'users', UserController.findByIds(project.userIds))
      this.$set(project, 'showEditDialog', false)
      this.showAddDialog = false
      //ログインユーザのプロジェクトが編集されている可能性があるため、リロード
      let loginUser = this.$store.state.loginState.loginUser
      let backlogState = this.$store.state.backlogState
      backlogState.userProjects = ProjectController.findByIds(loginUser.projectIds)
    },
    onAddCancel() {
      this.showAddDialog = false
    },
  }
}
</script>

<style scoped>
.el-header,
.el-main {
  text-align: left;
}
.project-cmp-dialog {
  width:600;
  height:450;
}
.icon-edit {
  color:royalblue;
}
.icon-delete {
  color:red;
}
</style>
