import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../user.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { firestore } from 'firebase';

@Component({
  selector: 'app-link',
  templateUrl: './link.page.html',
  styleUrls: ['./link.page.scss'],
})
export class LinkPage implements OnInit {

  emailsCollection: AngularFirestoreCollection<any>
  details: Array<any> = []
  linkUserEmail: string

  constructor(public afAuth: AngularFireAuth, public afStore: AngularFirestore, public user: UserService) { 
    this.emailsCollection = this.afStore.collection('users')
    this.emailsCollection.snapshotChanges().forEach(a => {
      a.forEach(item => {
        const useremail = item.payload.doc.data().username
        const useruid = item.payload.doc.data().uid
        const usertoken = item.payload.doc.data().token
        const userdata = {
          useremail: useremail,
          useruid: useruid,
          usertoken: usertoken
        }
        this.details.push(userdata)
      })
    })
  }

  ngOnInit() {
  }

  linkUser(newInputEmail: string) {
    for(let detail of this.details) {
      if(newInputEmail === detail.useremail) {
        let newInputId = detail.useruid
        let newToken = detail.usertoken
        this.afStore.doc(`users/${this.user.getUid()}`).update({
          usersList: firestore.FieldValue.arrayUnion({
            newInputEmail,
            newInputId,
            newToken
          })
        })
      } 
    }
  }
}
