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
  emails: Array<any> = []
  linkUserEmail: string

  constructor(public afAuth: AngularFireAuth, public afStore: AngularFirestore, public user: UserService) { 
    this.emailsCollection = this.afStore.collection('users')
    this.emailsCollection.snapshotChanges().forEach(a => {
      a.forEach(item => {
        const useremail = item.payload.doc.data().username
        this.emails.push(useremail)
      })
    })
  }

  ngOnInit() {
  }

  linkUser(newInputEmail: string) {
    for(let email of this.emails) {
      if(newInputEmail === email) {
        this.afStore.doc(`users/${this.user.getUid()}`).update({
          usersList: firestore.FieldValue.arrayUnion({
            newInputEmail
          })
        })
      } 
    }
  }
}
