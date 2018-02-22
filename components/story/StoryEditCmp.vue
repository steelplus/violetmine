<template>
    <div>
      <el-container>
        <el-main>
          <span class='input-label'>名前：</span>
          <el-input class='input-text' type='text'
            placeholder='名前を入力してください'
            v-model='subject'
            clearable
            />
          <br/>
          <span class='input-label'>説明：</span>
          <el-input class='input-text' type='textarea'
            placeholder='説明を入力してください'
            v-model='description' 
            clearable
            />
          <br/>
          <span class='input-label'>ポイント：</span>
          <el-select 
            v-model='point'
            placeholder='ポイント'
          >
            <el-option
              v-for='point in points'
              :key='point.value'
              :label='point.value'
              :value='point.value'
            />
          </el-select>
          <br/>
          <span class='input-label'>ステータス：</span>
          <el-select 
            v-model='status'
            placeholder='ステータス'
          >
            <el-option
              v-for='option in statuses'
              :key='option.value'
              :label='option.label'
              :value='option.value'
            />
          </el-select>
          <br/>
          <font color='red'>{{error}}</font>
        </el-main>
        <el-footer>
          <span >
            <el-button 
              type='danger'
              size='small'
              class='float-buttons'
              icon='el-icon-close'
              @click='onButtonCancel'
              round
            >
              キャンセル
            </el-button>
            <el-button 
              type='success'
              size='small'
              class='float-buttons'
              icon='el-icon-check'
              :disabled='subject === ""'
              @click='onButtonOk'
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
import Story, {StoryUpdateRequest} from '~/libs/models/Story'
import StoryController from '~/libs/controllers/StoryController'

export default {
  name: 'story-cmp',
  props: [
    'story',
    'project',
    'iteration',
    'onOk',
    'onCancel',
  ],
  data() {
    const story = this.story
    const project = this.project
    const iteration = this.iteration
    return ({
      id: (story) ? story.id : StoryUpdateRequest.CREATE_REQUEST,
      subject: (story) ? story.subject : '',
      description: (story) ? story.description : '',
      point: (story) ? story.point : undefined,
      position: (story) ? story.position : 0,
      status: (story) ? story.status : Story.NewStatus,
      projectId: (story) ? story.projectId : (project) ? project.id : undefined,
      iterationId: (story) ? story.iterationId : (iteration) ? iteration.id : undefined,
      error: '',
      points: [
        {value:0.5},
        {value:1},
        {value:2},
        {value:3},
        {value:5},
        {value:8},
        {value:13},
      ],
      statuses: [
        {label: '新規', value: Story.NewStatus},
        {label: '着手', value: Story.DoingStatus},
        {label: '完了', value: Story.DoneStatus},
      ],
    })
  },
  methods: {
    onButtonOk() {
      if(!this.subject) return
      const request = new StoryUpdateRequest({
        id: this.id,
        subject: this.subject,
        description: this.description,
        point: this.point,
        position: this.position,
        status: this.status,
        projectId: this.projectId,
        iterationId: this.iterationId,
      })
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
      //ダイアログは非表示になっているだけなので入力内容をクリアする。
      const story = StoryController.findById(this.id)
      const project = this.project
      const iteration = this.iteration
      this.id = (story) ? story.id : StoryUpdateRequest.CREATE_REQUEST
      this.subject = (story) ? story.subject : ''
      this.description = (story) ? story.description : ''
      this.point = (story) ? story.point : undefined
      this.position = (story) ? story.position : 0
      this.status = (story) ? story.status : Story.NewStatus
      this.projectId = (story) ? story.projectId : (project) ? project.id : undefined
      this.iterationId = (story) ? story.iterationId : (iteration) ? iteration.id : undefined
      this.error = ''
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
