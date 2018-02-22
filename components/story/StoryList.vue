<template>
  <div>
    <el-dialog
      title='バックログの追加'
      :visible='showAddDialog'
      custom-class='backlog-cmp-dialog'
      :show-close='false'
      :append-to-body='true'
      >
      <story-edit-cmp
        :project='project'
        :onOk='onAddBacklogOk'
        :onCancel='onAddBacklogCancel'
      />
    </el-dialog>
    <el-button
      type='primary'
      size='small'
      icon='el-icon-circle-plus'
      @click='onAddBacklogStart'
      :disabled='(!project)'
      round>
      バックログの追加
    </el-button>
    <draggable
      v-model='dispStories'
      :id='(iteration) ? "iteration-" + iteration.id : "backlogs"'
      :options='{animation:200, group:"stories"}'
      @change='onChanged'
      :move='canMove'>
      <div
        v-for='story in dispStories'
        :key='story.id'>
        <story-card
          :project='project'
          :iteration='iteration'
          :story='story'
          :onUpdate='onUpdate'
          :onDelete='onDelete'
        />
      </div>
    </draggable>
  </div>
</template>

<script>
import Vue from 'vue'
import VueDraggable from 'vuedraggable'
import Story, {StoryUpdateRequest} from '~/libs/models/Story'
import StoryController from '~/libs/controllers/StoryController'
import StoryCard from '~/components/story/StoryCard'

Vue.component('draggable', VueDraggable)
Vue.component('story-card', StoryCard)

export default {
  props: [
    'project',
    'iteration',
    'stories',
    'onAddStory'
  ],
  data() {
    return ({
      dispStories: this.stories,
      showAddDialog: false,
      error:'',
    })
  },
  mounted() {

  },
  methods: {
    onAddBacklogStart() {
      this.showAddDialog = true
    },
    onAddBacklogOk(request) {
      this.$store.commit('backlogState/createStory', {
          request: request,
      })
      this.dispStories.push(StoryController.findById(request.id))
      for(let i=this.dispStories.length; i>0 ; i--) {
        if(this.dispStories[i-1].id === Story.NO_STORY_FOUND_ID) {
          this.dispStories.splice(i-1, 1)
        }
      }
      this.showAddDialog = false
    },
    onAddBacklogCancel() {
      this.showAddDialog = false
    },
    onUpdate(request) {
      this.$store.commit('backlogState/editStory', {
        request: request,
      })
      const index = this.storyIndex(request.id)
      if(index !== -1) {
        const story = StoryController.findById(request.id)
        this.dispStories.splice(index, 1, story)
      }
    },
    onDelete(story) {
      if(!confirm('本当に削除しますか？')) return
      this.$store.commit('backlogState/deleteStory', {
        story: story,
      })
      const index = this.storyIndex(story.id)
      if(index !== -1) {
        this.dispStories.splice(index, 1)
        if(this.dispStories.length === 0) {
          this.dispStories.push(Story.NoStoryFound)
        }
      }
    },
    storyIndex(targetId) {
      let index= -1
      for(let i=0; i<this.dispStories.length; i++) {
        if(this.dispStories[i].id === targetId) {
          index = i
          break
        }
      }
      return index
    },
    onChanged(event){
      const added = event.added
      const removed = event.removed
      if(!added && !removed) return
      if(added) {
        const story = added.element
        //const newIndex = added.newIndex
        const request = new StoryUpdateRequest(story)
        request.iterationId = (this.iteration) ? this.iteration.id : undefined
        StoryController.updateStory(request)
        for(let i=this.dispStories.length; i>0; i--) {
          const placeholder = this.dispStories[i-1]
          if(placeholder.id === Story.NO_STORY_FOUND_ID) {
            this.dispStories.splice(i-1,1)
          }
        }
      } else if(removed) {
        if(this.dispStories.length === 0) {
          this.dispStories.push(Story.NoStoryFound)
        }
      }
    },
    canMove(event, originalEvent) {
      return (event.draggedContext.element.id !== Story.NO_STORY_FOUND_ID)
    },
  }
}
</script>

<style scoped>
.story-point {
  float:right;
}
.float {
  float:right;
}
</style>
