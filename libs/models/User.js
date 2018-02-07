import UserController from "../controllers/UserController";

class User {
  constructor(request) {
    this.id = request.id
    this.account = request.account
    this.name = request.name
    this.password = request.password
    this.admin = request.admin
    this.projectIds = [].concat(request.projectIds)
  }

  //破壊的操作から守るためディープコピーをする。
  getProjectIds() {return [].concat(this.projectIds)}
  setProjectIds(projectIds) {this.projectIds = [].concat(projectIds)}
  addProject(project) {this.projectIds.push(project.id)}
  removeProject(project) {
    this.projectIds = this.projectIds.filter((id) =>(id != project.id))
  }

  copyProperties(target) {
    target.account = this.account
    target.name = this.name
    target.password = this.password
    target.admin = this.admin
    target.projectId = [].concat(this.projectIds)
  }
}

export class UserUpdateRequest {
  static get CREATE_REQUEST() {return undefined}

  constructor(id, account, name, password = '', admin = false, projectIds = []) {
    this.id = id
    this.account = account
    this.name = name
    this.password = password
    this.admin = admin
    this.projectIds = [].concat(projectIds)
  }

  isCreateRequest() { return (this.id === UserUpdateRequest.CREATE_REQUEST)}
}

export default User