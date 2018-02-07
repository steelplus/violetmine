import Vue from 'vue';
import { mapGetters } from 'vuex';
import IterationController from '~/libs/controllers/IterationController';
import ProjectController from '~/libs/controllers/ProjectController';
import StoryController from '~/libs/controllers/StoryController';
import Iteration from '~/libs/models/Iteration';
import Project from '~/libs/models/Project';
import Story from '~/libs/models/Story';

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
      const loginUser = payload.loginUser
      if(!loginUser)
        return
      console.log(loginUser.projectIds)
      console.log("-----------")
      state.userProjects = ProjectController.findByIds(loginUser.projectIds);
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
      const currentProject = payload.currentProject
      state.currentProject = currentProject
      state.iterations = IterationController.findByProjectId(currentProject.id)
      state.backlogs = StoryController.findBacklogsByProjectId(currentProject.id)
    },

    createIteration(state, payload) {
      const iteration= IterationController.createIteration(payload.request);
      if (iteration) {
        state.iterations.push(iteration);
      }
    },

    createStory(state, payload) {
      const story= StoryController.createProject(payload.request);
      if (story) {
        state.backlogs.push(story);
      }
    },

    editIteration(state, payload) {
      try {
        IterationController.updateProject(payload.request);
      } catch (err) {
        state.error = err.message;
        console.log('ERROR: backlogState#editIteration ' + state.error);
      }
    },

    editIterationCancel(state, payload) {
      try {
        IterationController.refreshProject(payload.iteration);
      } catch (err) {
        state.error = err.message;
        console.log('ERROR: backlogState#editIterationCancel ' + state.error);
      }
    },

    deleteIteration(state, payload) {
      try {
        const iteration= state.iterations[payload.index];
        IterationController.deleteIteration(iteration);
        state.iterations.splice(payload.index, 1);
      } catch (err) {
        state.error = err.message;
        console.log('ERROR: backlogState#deleteIteration ' + state.error);
      }
    },

    editStory(state, payload) {
      try {
        StoryController.updateProject(payload.request);
      } catch (err) {
        state.error = err.message;
        console.log('ERROR: backlogState#editStory ' + state.error);
      }
    },

    editStoryCancel(state, payload) {
      try {
        StoryController.refreshProject(payload.backlog);
      } catch (err) {
        state.error = err.message;
        console.log('ERROR: backlogState#editStoryCancel ' + state.error);
      }
    },

    deleteBacklog(state, payload) {
      try {
        const story= state.backlogs[payload.index];
        StoryController.deleteStory(story);
        state.backlogs.splice(payload.index, 1);
      } catch (err) {
        state.error = err.message;
        console.log('ERROR: backlogState#deleteBacklog ' + state.error);
      }
    },

    deleteStory(state, payload) {
      try {
        StoryController.deleteProject(payload.story);
      } catch (err) {
        state.error = err.message;
        console.log('ERROR: backlogState#deleteStory ' + state.error);
      }
    },

    updateStoryOrder(state, payload) {
      const story= StoryController.createStory(payload.request);
      if(!story.iterationId) {
        User.sortByOrder(state.backlogs)
      }
    },
  }
};
export default backlogState;
