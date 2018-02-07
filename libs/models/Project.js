class Project {
  constructor(request) {
    this.id = request.id
    this.name = request.name
    this.description = request.description
    this.userIds = [].concat(request.userIds)
  }

  //破壊的操作から守るためディープコピーをする。
  getUserIds() {return [].concat(this.userIds)}
  setUserIds(userIds) {this.userIds = [].concat(userIds)}
  addUser(user) {this.userIds.push(user.id)}
  removePUser(user) {
    this.userIds = this.userIds.filter((id) =>(id != user.id))
  }

  copyProperties(target) {
    target.name = this.name
    target.description = this.description
    target.userIds = [].concat(this.userIds)
  }
}

export class ProjectUpdateRequest {
         static get CREATE_REQUEST() {
           return undefined;
         }

         constructor(id, name, description = "", userIds = []) {
           this.id = id;
           this.name = name;
           this.description = description;
           this.userIds = [].concat(userIds);
         }

         isCreateRequest() {
           return this.id === ProjectUpdateRequest.CREATE_REQUEST;
         }
       }

export default Project