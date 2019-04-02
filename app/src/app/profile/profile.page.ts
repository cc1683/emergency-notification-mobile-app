import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { ToastController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';


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
              public alert: AlertController,
              public router: Router,
              public toastCtrl: ToastController
              ) {
    const data = afStore.doc(`users/${user.getUid()}`)
    this.userData = data.valueChanges()
  }

  ngOnInit() {
  }

  updateProfile() {
    if((this.fullname.length > 0) && (this.mremarks.length) > 0) {
      this.afStore.doc(`users/${this.user.getUid()}`).update({
        fullname: this.fullname,
        medicalremarks: this.mremarks
      })
      this.showToast('Profile updated successfully!')
      this.fullname = '',
      this.mremarks = ''
      return true;
    } else {
      this.showAlert('Error', 'Something wrong!')
      return false;
    }
  }

  signOut() {
    this.afAuth.auth.signOut()
      .then(() => {
        this.showAlert('Success', 'Sign out successfully')
        this.router.navigate(['/login'])
      })
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

  async showToast(msg: string) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    await toast.present();
  }

}