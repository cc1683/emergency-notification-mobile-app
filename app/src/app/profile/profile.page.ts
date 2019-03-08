import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  fullname: string
  mremarks: string
  userID: string
  userData: Observable<any>

  constructor(public afStore: AngularFirestore, 
              public user: UserService, 
              public afAuth: AngularFireAuth,
              public alert: AlertController
              ) {
    const data = afStore.doc(`users/${user.getUid()}`)
    this.userData = data.valueChanges()
  }

  ngOnInit() {
  }

  updateProfile() {
    this.afStore.doc(`users/${this.user.getUid()}`).update({
      fullname: this.fullname,
      medicalremarks: this.mremarks
    })

    this.showAlert('Success', 'Profile updated successfully!')
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ["OK"]
    })  

    await alert.present();
  }

}
