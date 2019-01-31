import { Injectable } from '@angular/core'

interface user {
  username: string,
  uid: string
}

@Injectable()
export class UserService {
  public user: user

  constructor() {

  }

  setUser(user: user) {
    this.user = user
  }

  getUid() {
    return this.user.uid
  }

}