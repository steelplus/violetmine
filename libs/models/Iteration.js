class Iteration {
  constructor(request) {
    this.id = request.id
    this.projectId = request.projectId
    this.startOn = request.startOn
    this.endOn = request.endOn
  }

  copyProperties(target) {
    target.projectId = this.projectId
    target.startOn = this.startOn
    target.endOn = this.endOn
  }
}

export class IterationUpdateRequest {
  static get CREATE_REQUEST() {return undefined}

  constructor(id, projectId, startOn, endOn) {
    this.id = id
    this.projectId = projectId
    this.startOn = startOn
    this.endOn = endOn
  }

  isCreateRequest() { return (this.id === IterationUpdateRequest.CREATE_REQUEST)}
}

export default Iteration