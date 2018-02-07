class Story {
  constructor(request) {
    this.id = request.id
    this.name = request.name
    this.description = request.description
    this.iterationId = request.iterationId
    this.projectId = request.projectId
    this.order = request.order
  }

  copyProperties(target) {
    target.name = this.name
    target.description = this.description
    target.iterationId = this.iterationId
    target.projectId = this.projectId
    target.order = this.order
  }
  static sortByOrder(stories) {
    stories.sort((a,b)=>{
      if(a.order > b.order) return 1
      if(a.order < b.order) return -1
      return 0
    })
  }
}

export class StoryUpdateRequest {
  static get CREATE_REQUEST() {return undefined}

  constructor(id, name, description = '', projectId = '', order = 0) {
    this.id = id
    this.name = name
    this.description = description
    this.iterationId = iterationId
    this.projectId = projectId
    this.order = order
  }

  isCreateRequest() { return (this.id === StoryUpdateRequest.CREATE_REQUEST)}
}

export default Story