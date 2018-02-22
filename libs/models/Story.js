class Story {
  static get NewStatus() {return 'New'}
  static get DoingStatus() {return 'Doing'}
  static get DoneStatus() {return 'Done'}

  constructor(request) {
    this.id = request.id
    this.subject = request.subject
    this.description = request.description
    this.point = request.point
    this.position = request.position
    this.status = request.status
    this.projectId = request.projectId
    this.iterationId = request.iterationId
  }

  copyProperties(target) {
    target.subject = this.subject
    target.description = this.description
    target.point = this.point
    target.position = this.position
    target.status = this.status
    target.projectId = this.projectId
    target.iterationId = this.iterationId
  }
  static sortByPosition(stories) {
    stories.sort((a,b)=>{
      if(a.position > b.position) return 1
      if(a.position < b.position) return -1
      return 0
    })
  }

  static get NoStoryFound() {
    const story = new Story(new StoryUpdateRequest({
      id: Story.NO_STORY_FOUND_ID,
      subject: 'ここにストーリーをドロップします'
    }))
    return story
  }

  static get NO_STORY_FOUND_ID() {
    return -1
  }
}

export class StoryUpdateRequest {
  static get CREATE_REQUEST() {return undefined}

  constructor(payload) {
    this.id = payload.id
    this.subject = payload.subject
    this.description = payload.description
    this.point = payload.point
    this.position = payload.position
    this.status = payload.status
    this.iterationId = payload.iterationId
    this.projectId = payload.projectId
  }

  isCreateRequest() { return (this.id === StoryUpdateRequest.CREATE_REQUEST)}
}

export default Story