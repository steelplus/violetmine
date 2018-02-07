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
                :visible.sync='showAddDialog'
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
        <el-table
            :data='projects'
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
                    <div :v-if='scope.row.showEditDialog'>
                      <el-dialog
                          title='プロジェクトの編集'
                          :visible=scope.row.showEditDialog
                          custom-class='project-cmp-dialog'
                          :show-close='false'
                          v-model='scope.$index'
                          :append-to-body='true'
                          >
                          <project-cmp
                              :project='scope.row'
                              :onOk.sync='onEditOk'
                              :onCancel.sync='onEditCancel'
                          />
                      </el-dialog>
                    </div>
                    
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
      projects: [],
      showAddDialog: false,
      showDeleteConfirm: false,
    }
  },
  mounted() {
      this.$store.commit('projectsState/init',{})
      this.$store.state.projectsState.projects.forEach((project) =>{
        const clone = Object.assign({}, project)
        clone.users = UserController.findByIds(clone.userIds)
        clone.showEditDialog = false
        this.projects.push(clone)
      })
  },
  methods: {

    onEditStart(index) {
      this.projects[index].showEditDialog = true
    },
    onEditCancel(id) {
      let project
      let index
      for(let i=0; i<this.projects.length; i++) {
        let p = this.projects[i]
        if(p.id === id) {
          project = Object.assign({},p)
          index = i
        }
      }
      if(project) {
        this.$store.commit('projectsState/editCancel',{
            index: index,
            project: project,
        })
        project.showEditDialog = false
        this.$set(this.projects, index, project)
      }
    },
    onEditOk(request) {
      this.$store.commit('projectsState/edit', {
          request: request,
      })
      let index = -1
      for(let i=0; i<this.projects.length; i++){
        const p = this.projects[i]
        if(p.id === request.id)
        {
          p.showEditDialog = false
          index = i
          break
        }
      }
      if(index !== -1) {
        const project = Object.assign({}, request)
        project.showEditDialog = false
        project.users = UserController.findByIds(project.userIds)
        this.$set(this.projects, index, project)
        const loginUser = this.$store.state.loginState.loginUser
        if(project.userIds.indexOf(loginUser.id) !== -1) {
          this.$store.state.loginState.loginUser = UserController.findById(loginUser.id)
          this.$forceUpdate()
          console.log("---------------")
        }
      }

    },
    onDeleteStart(index) {
      this.showDeleteConfirm = true
    },
    onDeleteOk(index) {
      this.$store.commit('projectsState/delete',{
          index: index,
      })
      this.projects.splice(index,1)
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
      const projects = this.$store.state.projectsState.projects
      const clone = Object.assign({}, projects[projects.length-1])
      clone.users = UserController.findByIds(clone.userIds)
      clone.showEditDialog = false
      this.projects.push(clone)
      this.showAddDialog = false
    },
    onAddCancel() {
      this.showAddDialog = false
    }
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
