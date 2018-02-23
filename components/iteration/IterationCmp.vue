<template>
    <div>
      <el-container>
        <el-main>
          <span class='input-label'>開始日：</span>
          <el-date-picker type='date'
            placeholder='開始日を選んでください'
            v-model='startOn'
            />
          <br/>
          <span class='input-label'>終了日：</span>
          <el-date-picker type='date'
            placeholder='終了日を選んでください'
            v-model='endOn'
            />
          <br/>
          <font color='red'>{{error}}</font>
        </el-main>
        <el-footer>
          <span >
            <el-button 
              type='danger'
              class='float-buttons'
              icon='el-icon-close'
              @click.native.prevent='onButtonCancel'
              round
            >
              キャンセル
            </el-button>
            <el-button 
              type='success'
              class='float-buttons'
              icon='el-icon-check'
              :disabled='!startOn||!endOn'
              @click.native.prevent='onButtonOk'
              round
            >
              保存
            </el-button>
          </span>
        </el-footer>
      </el-container>
    </div>
</template>

<script>
import {IterationUpdateRequest} from '~/libs/models/Iteration'

export default {
  name: 'iteration-cmp',
  props: [
    'projectId',
    'onOk',
    'onCancel',
  ],
  data() {
    return ({
      startOn: {},
      endOn: {},
      error: '',
    })
  },
  methods: {
    onButtonOk() {
      if(!this.startOn||!this.endOn) return
      if(this.startOn > this.endOn) {
        this.error = '終了日は、開始日より先の日付を選んでください'
        return
      }
      const request = new IterationUpdateRequest(
        this.projectId,
        this.startOn, 
        this.endOn,
      )
      try{
        this.onOk(request)
        this.clear()
      } catch(err) {
        this.error = err.message
        return
      }
    },

    onButtonCancel() 
    {
      try{
        this.onCancel()
        this.clear()
      } catch(err) {
        this.error = err.message
        return
      }
    },

    clear() {
      this.projectId = ''
      this.startOn = {}
      this.endOn = {}
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
  text-align: left;
}
.el-footer {
  text-align: center;
}
.float-buttons {
  float: right;
}
</style>
