import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  username: string;
  password: string;
  cpassword: string;

  constructor(public afAuth: AngularFireAuth,
              public afStore: AngularFirestore,
              public alert: AlertController,
              public router: Router,
              public user: UserService
              ) 
              { }

  ngOnInit() 
  { }

  async register() {
    const { username, password, cpassword } = this;
    if(password != cpassword) {
      this.showAlert("Error!", "Password don't match!"); 
      return console.log("Password don't match!");
    }

    try {
      const res = await this.afAuth.auth.createUserWithEmailAndPassword(username, password)

      this.afStore.doc(`users/${res.user.uid}`).set({
        username,
        uid: res.user.uid
      })

      if(res.user) {
        this.user.setUser({
          username,
          uid: res.user.uid
        })
        
        this.showAlert("Success!", "Welcome onboard!");
        this.router.navigate(['/tabs']);
      }

    } catch(err) {
      this.showAlert("Error!", err.message);
      return console.log(err.message)
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ["OK"]
    })  

    await alert.present();
  }

  goLogin() {
    this.router.navigate(['/login']);
  }

  quickLogin() {
    let user = this.afAuth.auth.currentUser
    if(user) {
      user.providerData.forEach(profile => {
        console.log("  Provider-specific UID: " + profile.uid);
      })
      this.router.navigate(['/tabs']);
    } else {
      this.showAlert("Error!", "You must create an account first!");
    }
  }

}