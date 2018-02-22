<template>
    <div>
      <el-container>
        <el-header>
            <h3><font color='royalblue'>ユーザーの一覧</font></h3>
            <el-button
                type='primary'
                size='small'
                icon='el-icon-circle-plus'
                @click='onAddStart'
                round>
                ユーザーの追加
            </el-button>
            <el-dialog
                title='ユーザーの追加'
                :visible='showAddDialog'
                custom-class='user-cmp-dialog'
                :show-close='false'
                >
                <user-edit-cmp
                    :showAdmin='true'
                    :onOk='onAddOk'
                    :onCancel='onAddCancel'
                />
            </el-dialog>
        </el-header>
        <el-main>
        <font color='red'>{{usersState.error}}</font><br/>
        <el-table
            :data='usersState.users'
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
                        @click='onEditStart(scope.$index)'>
                        <i class='el-icon-edit' style='color:royalblue'/>
                    </el-button>
                    <!-- adminは削除させない -->
                    <el-button 
                        type='text'
                        v-if='scope.row.account !== "admin" && 
                              scope.row.editingFlag === false'
                        @click='onDeleteOk(scope.$index)'>
                        <i class='el-icon-delete' style='color:red'/>
                    </el-button>
                    <!-- 編集中は、チェックとバツで確定とキャンセルを行う -->
                    <el-button
                        type='text'
                        v-if='scope.row.editingFlag === true'
                        @click='onEditOk(scope.$index)'>
                        <i class='el-icon-check' style='color:forestgreen'/>
                    </el-button>
                    <el-button
                        type='text'
                        v-if='scope.row.editingFlag === true' 
                        @click='onEditCancel(scope.$index)'>
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
import UserEditCmp from '~/components/user/UserEditCmp'
import UserController from '~/libs/controllers/UserController'
import {UserUpdateRequest} from '~/libs/models/User'

Vue.component('user-edit-cmp', UserEditCmp)

export default {
  name: "user-list",
  data() {
    return {
      usersState: this.$store.state.usersState,
      showAddDialog: false,
      showDeleteConfirm: false,
    }
  },
  mounted() {
      this.$store.commit('usersState/init',{})
      this.usersState.users.forEach((user) =>{
        this.$set(user, 'editingFlag', false)
      })
  },
  methods: {
    onEditStart(index) {
      const user = this.usersState.users[index]
      this.$set(user, 'editingFlag', true)
    },
    onEditCancel(index) {
      const user = this.usersState.users[index]
      this.$set(user, 'editingFlag', false)
      this.$store.commit('usersState/editCancel',{
          index: index,
          user: user,
      })
    },
    onEditOk(index) {
      const user = this.usersState.users[index]
      const request = new UserUpdateRequest({
          id: user.id,
          account: user.account,
          name: user.name,
          password: user.password,
          admin: user.admin,
          projectIds: user.projectIds
      })
      this.$store.commit('usersState/edit', {
          request: request,
      })
      this.$set(user, 'editingFlag', false)
    },
    onDeleteStart(index) {
      this.showDeleteConfirm = true
    },
    onDeleteOk(index) {
      this.$store.commit('usersState/delete',{
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
      this.$store.commit('usersState/create', {
          request: request,
      })
      const user = this.usersState.users[this.usersState.users.length-1]
      this.$set(user, 'editingFlag', false)
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
