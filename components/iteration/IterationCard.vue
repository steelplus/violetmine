<template>
  <div>
    <el-card>
      <span v-show='showStories === false'>
        <i class='el-icon-arrow-down' @click='toggleShowStories'/>
      </span>
      <span v-show='showStories === true'>
        <i class='el-icon-arrow-right' @click='toggleShowStories'/>
      </span>
      &nbsp;
      <span :style='subjectStyle(status)'>{{subject}}</span>
      <span class='float-right'>
        <el-tag size='mini' :type='statusType(status)'>
          {{statusString(status)}}
        </el-tag>
        &nbsp;
        <el-button
          type='text'
          @click='onEditIterationStart'>
          <i class='el-icon-edit' style='color:royalblue'/>
          <el-dialog
            title='イテレーションの編集'
            :visible='showEditDialog'
            custom-class='iteration-edit-dialog'
            :show-close='false'
            :append-to-body='true'
            >
            <iteration-edit-cmp
              :project='project'
              :iteration='iteration'
              :onOk='onEditIterationOk'
              :onCancel='onEditIterationCancel'
            />
          </el-dialog>
        </el-button>
        <el-button
          type='text'
          @click='onDeleteIteration'>
          <i class='el-icon-delete' style='color:red'/>
        </el-button>
      </span>
      <span class='float-right'>{{points}}&nbsp;&nbsp;</span>
      <br>
      <span>{{startOn}} - {{endOn}}</span>
      <div v-show='showStories === true'>
        <draggable
          v-model='dispStories'
          :id='"iteration-" + iteration.id'
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
              :onUpdate='onUpdateStory'
              :onDelete='onDeleteStory'
            />
          </div>
        </draggable>
      </div>
    </el-card>
  </div>
</template>

<script>
import Vue from 'vue'
import VueDraggable from 'vuedraggable'
import IterationEditCmp from '~/components/iteration/IterationEditCmp'
import Iteration from '~/libs/models/Iteration'
import Story, {StoryUpdateRequest} from '~/libs/models/Story'
import IterationController from '~/libs/controllers/IterationController'
import StoryController from '~/libs/controllers/StoryController'
import StoryCard from '~/components/story/StoryCard'

Vue.component('draggable', VueDraggable)
Vue.component('story-card', StoryCard)
Vue.component('iteration-edit-cmp', IterationEditCmp)

export default {
  props:[
    'project',
    'iteration',
    'onUpdate',
    'onDelete',  
  ],
  data() {
    const options = {year:'numeric', month:'2-digit', day:'2-digit'}
    const startDate = new Date(this.iteration.startOn)
    const endDate = new Date(this.iteration.endOn)
    const dispStories = StoryController.findByIterationId(this.iteration.id)
    if(dispStories.length===0){
      dispStories.push(Story.NoStoryFound)
    }
    const now = new Date()
    const showStories = (startDate <= now && now <= endDate)
    return {
      subject: this.iteration.subject,
      status: this.iteration.status,
      startOn: startDate.toLocaleDateString('ja-JP', options),
      endOn: endDate.toLocaleDateString('ja-JP', options),
      points: 0,
      showStories: showStories,
      dispStories: dispStories,
      showEditDialog: false,
      statuses: [
        {label: '新規', value: Iteration.NewStatus},
        {label: '着手', value: Iteration.DoingStatus},
        {label: '完了',   value: Iteration.DoneStatus},
      ],
    }
  },
  created() {
    this.points = this.computePoints()
  },
  methods: {
    onEditIterationStart() {
      this.showEditDialog = true
    },
    onEditIterationOk(request) {
      this.onUpdate(request)
      const iteration = IterationController.findById(request.id)
      const startDate = new Date(iteration.startOn)
      const endDate = new Date(iteration.endOn)
      this.subject = iteration.subject
      this.description = iteration.description
      this.status = iteration.status
      const options = {year:'numeric', month:'2-digit', day:'2-digit'}
      this.startOn = startDate.toLocaleDateString('ja-JP', options)
      this.endOn = endDate.toLocaleDateString('ja-JP', options)
      this.showEditDialog = false
    },
    onEditIterationCancel() {
      this.showEditDialog = false
    },
    onDeleteIteration() {
      console.log("here1")
      console.log(this.iteration)
      this.onDelete(this.iteration)
    },
    onUpdateStory(request) {
      this.$store.commit('backlogState/editStory', {
        request: request,
      })
      const index = this.storyIndex(request.id)
      if(index !== -1) {
        const story = StoryController.findById(request.id)
        this.dispStories.splice(index, 1, story)
      }
      this.points = this.computePoints()
    },
    onDeleteStory(story) {
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
      this.points = this.computePoints()
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
    statusString(status) {
      switch(status) {
        case Iteration.NewStatus:
          return '新規'
        case Iteration.DoingStatus:
          return '着手'
        case Iteration.DoneStatus:
          return '完了'
        default:
          return ''
      }
    },
    statusType(status) {
      switch(status) {
        case Iteration.NewStatus:
          return 'success'
        case Iteration.DoingStatus:
          return 'danger'
        case Iteration.DoneStatus:
          return ''
        default:
          return ''
      }
    },
    subjectStyle(status) {
      switch(status) {
        case Iteration.DoneStatus:
          return {'text-decoration': 'line-through'}
        default:
          return {'text-decoration': 'none'}  
        }
    },
    computePoints() {
      let points = 0
      this.dispStories.forEach((story) => {
        points += ((story.point) ? story.point : 0)
      })
      return points
    },
    toggleShowStories() {
      this.showStories = !this.showStories
    },
    onChanged(event) {
      const added = event.added
      const removed = event.removed
      if(!added && !removed) return
      if(added) {
        const story = added.element
        const request = new StoryUpdateRequest(story)
        request.iterationId = this.iteration.id
        StoryController.updateStory(request)
        for(let i=this.dispStories.length; i>0; i--) {
          const placeholder = this.dispStories[i-1]
          if(placeholder.id === Story.NO_STORY_FOUND_ID) {
            this.dispStories.splice(i-1,1)
          }
        }
      }
      if(removed) {
        if(this.dispStories.length === 0) {
          this.dispStories.push(Story.NoStoryFound)
        }
      }
      this.points = this.computePoints()
    },
    canMove(event, originalEvent) {
      return (event.draggedContext.element.id !== Story.NO_STORY_FOUND_ID)
    },
  },
}
</script>

<style scoped>
.float-right {
  float:right;
}
</style>
