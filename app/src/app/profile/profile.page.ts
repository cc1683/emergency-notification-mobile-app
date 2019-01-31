import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  fullname: string
  mremarks: string
  userID: string

  constructor(public afStore: AngularFirestore, public user: UserService, public afAuth: AngularFireAuth) { }

  ngOnInit() {
  }

  updateProfile() {

    this.afStore.doc(`users/${this.user.getUid()}`).update({
      fullname: this.fullname,
      medicalremarks: this.mremarks
    })
  }

}
