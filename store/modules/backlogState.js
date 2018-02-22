import Vue from 'vue'
import { mapGetters } from 'vuex'
import IterationController from '~/libs/controllers/IterationController'
import ProjectController from '~/libs/controllers/ProjectController'
import StoryController from '~/libs/controllers/StoryController'
import Iteration from '~/libs/models/Iteration'
import Project from '~/libs/models/Project'
import Story from '~/libs/models/Story'

const backlogState = {
  namespaced: true, // ネームスペースを利用する
  name: 'backlogState',
  state: {
    currentProject: {},
    userProjects: [],
    iterations: [],
    backlogs: [],
    error: '',
  },
  computed: {
    ...mapGetters([
      'currentProject',
      'userProjects',
      'iterations',
      'backlogs',
      'error',
    ])
  },
  mutations: {
    init(state, payload) {
      state.error = ''
      const loginUser = payload.loginUser
      if(!loginUser)
        return
      state.userProjects = ProjectController.findByIds(loginUser.projectIds)
      if(state.userProjects.length > 0) {
        const currentProject = state.userProjects[0]
        state.currentProject = currentProject
        state.iterations = IterationController.findByProjectId(currentProject.id)
        state.backlogs = StoryController.findBacklogsByProjectId(currentProject.id)
      } else {
        state.error = 'アサインされているプロジェクトがありません。'
      }
    },

    switchCurrentProject(state, payload) {
      state.error = ''
      const currentProject = ProjectController.findById(payload.currentProjectId)
      state.currentProject = currentProject
      state.iterations = IterationController.findByProjectId(currentProject.id)
      state.backlogs = StoryController.findBacklogsByProjectId(currentProject.id)
    },

    createIteration(state, payload) {
      state.error = ''
      const iteration= IterationController.createIteration(payload.request)
      if (iteration) {
        state.iterations.push(iteration)
      }
    },

    createStory(state, payload) {
      state.error = ''
      const story= StoryController.createStory(payload.request)
      if (story) {
        state.backlogs.push(story)
      }
    },

    editIteration(state, payload) {
      state.error = ''
      try {
        IterationController.updateIteration(payload.request)
      } catch (err) {
        state.error = err.message
        console.log('ERROR: backlogState#editIteration ' + state.error)
      }
    },

    editIterationCancel(state, payload) {
      state.error = ''
      try {
        IterationController.refreshIteration(payload.iteration)
      } catch (err) {
        state.error = err.message
        console.log('ERROR: backlogState#editIterationCancel ' + state.error)
      }
    },

    deleteIteration(state, payload) {
      state.error = ''
      try {
        const iteration= payload.iteration
        IterationController.deleteIteration(iteration)
        for(let i=0; i<state.iterations.length; i++){
          if(iteration.id === state.iterations[i].id) {
            state.iterations.splice(i, 1)
            break
          }
        }
      } catch (err) {
        state.error = err.message
        console.log('ERROR: backlogState#deleteIteration ' + state.error)
      }
    },

    editStory(state, payload) {
      state.error = ''
      try {
        StoryController.updateStory(payload.request)
      } catch (err) {
        state.error = err.message
        console.log('ERROR: backlogState#editStory ' + state.error)
      }
    },

    editStoryCancel(state, payload) {
      state.error = ''
      try {
        StoryController.refreshStory(payload.story)
      } catch (err) {
        state.error = err.message
        console.log('ERROR: backlogState#editStoryCancel ' + state.error)
      }
    },

    deleteBacklog(state, payload) {
      state.error = ''
      try {
        const story= state.backlogs[payload.index]
        StoryController.deleteStory(story)
        state.backlogs.splice(payload.index, 1)
      } catch (err) {
        state.error = err.message
        console.log('ERROR: backlogState#deleteBacklog ' + state.error)
      }
    },

    deleteStory(state, payload) {
      state.error = ''
      try {
        StoryController.deleteStory(payload.story)
      } catch (err) {
        state.error = err.message
        console.log('ERROR: backlogState#deleteStory ' + state.error)
      }
    },

    updateStoryPosition(state, payload) {
      state.error = ''
      const story= StoryController.createStory(payload.request)
      if(!story.iterationId) {
        User.sortByPosition(state.backlogs)
      }
    },
  }
}
export default backlogState
