import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../user.service';
import { Observable } from 'rxjs';
import { firestore } from 'firebase';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  userData: Observable<any>

  constructor(public afAuth: AngularFireAuth,
              public afStore: AngularFirestore,
              public user: UserService
              ) {

                const data = afStore.doc(`users/${user.getUid()}`)
                this.userData = data.valueChanges()
                
              }

  ngOnInit() {
  }


}
