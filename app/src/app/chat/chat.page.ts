import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../user.service';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { firestore } from 'firebase';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  userData: Observable<any>
  message: string
  msg: string

  userListRef: AngularFirestoreDocument<any>
  userList: Observable<any>
  userListContainer: Array<any> = []

  token: Array<string> = []
  tokenCollection: Array<string> = []
  username: string


  constructor(public afAuth: AngularFireAuth,
              public afStore: AngularFirestore,
              public user: UserService,
              public alert: AlertController
              ) {
                const data = afStore.doc(`users/${user.getUid()}`)
                this.userData = data.valueChanges()
              }

  ngOnInit() {
  }

  broadcastMsg(msg: string) {
    this.userListRef = this.afStore.doc(`users/${this.user.getUid()}`)
    this.userListRef.snapshotChanges().forEach(item => {
      this.token = item.payload.data().usersList
      this.username = item.payload.data().fullname
      if(typeof this.token == "undefined") {
        this.showAlert('Error', 'Cannot find any link members!')
        return false;
      } else if ((typeof this.token != "undefined" && this.token.length > 0)) {
        for(var i=0; i<this.token.length; i++) {
          let tokenId = item.payload.data().usersList[i].newToken
          this.tokenCollection.push(tokenId)
        }
      }
    })
    this.storeChatDB(this.tokenCollection, msg)
  }

  storeChatDB(lists: Array<string>, message: string) {
    if(typeof lists == "undefined") {  
      this.showAlert('Error', 'Cannot find any linked members!')
      return false;
    } else {
      this.afStore.collection('users/' + this.user.getUid() + '/chats').add({
        message: message,
        sender: this.user.getUsername(),
        receiver: lists
      })
  
      this.showAlert('Success', 'Message sent successfully!')
      this.tokenCollection = []
      return;
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ["OK"]
    })  

    await alert.present();
    return;
  }
}