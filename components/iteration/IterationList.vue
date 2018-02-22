<template>
  <div>
    <el-button
      type='primary'
      size='small'
      icon='el-icon-circle-plus'
      @click='onAddStart'
      :disabled='(!project)'
      round>
      イテレーションの追加
    </el-button>
    <el-dialog
      title='イテレーションの追加'
      :visible='showAddDialog'
      custom-class='iteration-card-dialog'
      :show-close='false'
      :append-to-body='true'
      >
      <iteration-edit-cmp
          :project='project'
          :onOk='onAddOk'
          :onCancel='onAddCancel'
      />
    </el-dialog>
    
    <div
      v-for='iteration in dispIterations'
      :key='iteration.id'>
      <iteration-card 
        :project='project'
        :iteration='iteration'
        :onUpdate='onUpdate'
        :onDelete='onDelete'/>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import IterationController from '~/libs/controllers/IterationController'
import IterationCard from '~/components/iteration/IterationCard'

Vue.component('iteration-card', IterationCard)

export default {
  props: [
    'project',
    'iterations',
  ],
  data() {
    return ({
      dispIterations: this.iterations,
      showAddDialog: false,
      error:'',
    })
  },
  methods: {
    onAddStart() {
      this.showAddDialog = true
    },
    onAddOk(request) {
      this.$store.commit('backlogState/createIteration', {
          request: request,
      })
      this.showAddDialog = false
    },
    onAddCancel() {
      this.showAddDialog = false
    },
    onUpdate(request) {
      this.$store.commit('backlogState/editIteration', {
          request: request,
      })
      console.log(request.id)
      for(let i=0; i<this.dispIterations.length; i++) {
        if(this.dispIterations[i].id === request.id) {
          const iteration = IterationController.findById(request.id)
          this.dispIterations.splice(i, 1, iteration)
          break
        }
      }
    },
    onDelete(iteration) {
      if(!confirm('本当に削除しますか？')) return
      this.$store.commit('backlogState/deleteIteration', {
        iteration: iteration,
      })
      for(let i=0; i<this.dispIterations.length; i++) {
        if(this.dispIterations[i].id === iteration.id) {
          this.dispIterations.splice(i, 1)
          break
        }
      }
    },
  }
}
</script>

<style scoped>

</style>
