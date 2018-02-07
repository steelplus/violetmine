<template>
    <div>
      <el-container>
        <el-header>
            <h3><font color='royalblue'>ユーザーの一覧</font></h3>
            <el-button
                type='primary'
                icon='el-icon-circle-plus'
                @click='onAddStart'
                round>
                ユーザーの追加
            </el-button>
            <el-dialog
                title='ユーザーの追加'
                :visible.sync='showAddDialog'
                custom-class='user-cmp-dialog'
                :show-close='false'
                >
                <user-cmp
                    :showAdmin='true'
                    :onOk='onAddOk'
                    :onCancel='onAddCancel'
                />
            </el-dialog>            
        </el-header>
        <el-main>
        <el-table
            :data='users'
            style='width: 100vw; overflow:auto;'
            height='100vh'
            empty-text='ユーザーはいません。'
            stripe
        >
            <el-table-column
                fixed
                label='操作'
                width='80'>
                <template slot-scope='scope'>
                    <el-button
                        type='text'
                        v-if='scope.row.editingFlag === false'
                        @click.native.prevent='onEditStart(scope.$index)'>
                        <i class='el-icon-edit' style='color:royalblue'/>
                    </el-button>
                    <!-- adminは削除させない -->
                    <el-button 
                        type='text'
                        v-if='scope.row.account !== "admin" && 
                              scope.row.editingFlag === false'
                        @click.native.prevent='onDeleteOk(scope.$index)'>
                        <i class='el-icon-delete' style='color:red'/>
                    </el-button>
                    <!-- 編集中は、チェックとバツで確定とキャンセルを行う -->
                    <el-button
                        type='text'
                        v-if='scope.row.editingFlag === true'
                        @click.native.prevent='onEditOk(scope.$index)'>
                        <i class='el-icon-check' style='color:forestgreen'/>
                    </el-button>
                    <el-button
                        type='text'
                        v-if='scope.row.editingFlag === true' 
                        @click.native.prevent='onEditCancel(scope.$index)'>
                        <i class='el-icon-close' style='color:red'/>
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column
                fixed
                prop='account'
                label='アカウント'
                width='150'/>
            <el-table-column
                prop='name'
                label='名前'
                width='150'>
                <template slot-scope='scope'>
                    <el-input
                        v-show='scope.row.editingFlag'
                        v-model='scope.row.name'
                    >
                    </el-input>
                    <span v-show='!scope.row.editingFlag'>
                        {{scope.row.name}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                label='パスワード'
                width='150'>
                <template slot-scope='scope'>
                    <el-input
                        type='password'
                        v-show='scope.row.editingFlag'
                        v-model='scope.row.password'
                    >
                    </el-input>
                    <span v-show='!scope.row.editingFlag'>
                        ********
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                label='管理権限'
                width='150'>
                <template slot-scope='scope'>
                    <el-switch
                        active-color='forestgreen'
                        inactive-color='red'
                        v-model='scope.row.admin'
                        :disabled='!scope.row.editingFlag || scope.row.account === "admin"'
                    />
                </template>
            </el-table-column>
        </el-table>
        </el-main>
      </el-container>
    </div>
</template>

<script>
import Vue from 'vue'
import UserCmp from '~/components/user/UserCmp'
import UserController from '~/libs/controllers/UserController'
import {UserUpdateRequest} from '~/libs/models/User'

Vue.component('user-cmp', UserCmp)

export default {
  name: "user-list",
  data() {
    return {
      users: [],
      showAddDialog: false,
      showDeleteConfirm: false,
    }
  },
  created() {
      this.$store.commit('usersState/init',{})
      this.$store.state.usersState.users.forEach((user) =>{
        const clone = Object.assign({}, user)
        clone.editingFlag = false
        this.users.push(clone)
      })
  },
  methods: {
    onEditStart(index) {
      this.users[index].editingFlag = true
    },
    onEditCancel(index) {
      const user = this.users[index]
      user.editingFlag = false
      this.$store.commit('usersState/editCancel',{
          index: index,
          user: user,
      })
    },
    onEditOk(index) {
      const user = this.users[index]
      const request = new UserUpdateRequest(
          user.id,
          user.account,
          user.name,
          user.password,
          user.admin,
          user.projectIds
      )
      this.$store.commit('usersState/edit', {
          request: request,
      })
      user.editingFlag = false
      this.$set(this.users, index, user)
    },
    onDeleteStart(index) {
      this.showDeleteConfirm = true
    },
    onDeleteOk(index) {
      this.$store.commit('usersState/delete',{
          index: index,
      })
      this.users.splice(index,1)
      this.showDeleteConfirm = false
    },
    onDeleteCancel(index) {
      this.showDeleteConfirm = false
    },
    onAddStart() {
      this.showAddDialog = true
    },
    onAddOk(request) {
      this.$store.commit('usersState/create', {
          request: request,
      })
      const users = this.$store.state.usersState.users
      const clone = Object.assign({}, users[users.length-1])
      clone.editingFlag = false
      this.users.push(clone)
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
.user-cmp-dialog {
  width:600;
  height:450;
}
.icon-edit {
  color:royalblue;
}
.icon-delete {
  color:red;
}
.icon-check {
  color:forestgreen;
}
.icon-close {
  color:red;
}
</style>
