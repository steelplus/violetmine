<template>
    <div>
      <el-container>
        <el-main>
          <span class='input-label'>名前：</span>
          <el-input class='input-text' type='text'
            placeholder='名前を入力してください'
            v-model='name'
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
              :disabled='account === "" || name === ""'
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

export default {
  name: 'user-cmp',
  props: [
    'story',
    'project',
    'iteration',
    'onOk',
    'onCancel',
  ],
  data() {
    const story = this.story
    return ({
      id: (story) ? story.id : StoryUpdateRequest.CREATE_REQUEST,
      name: (story) ? story.name : '',
      description: (story) ? story.description : '',
      projectId: (story) ? story.projectId : this.project.id,
      iterationId: (story) ? story.iterationId : this.iteration.id,
      error: '',
    })
  },
  methods: {
    onButtonOk() {
      if(!this.account) return
      const request = new UserUpdateRequest(
        this.id,
        this.name,
        this.description,
        this.projectId,
        this.iterationId,
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
      //ダイアログは非表示になっているだけなので入力内容をクリアする。
      this.name = ''
      this.description = ''
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
