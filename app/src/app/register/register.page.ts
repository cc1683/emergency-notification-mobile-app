import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { AlertController } from '@ionic/angular';

import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  fullname: string;
  mremarks: string;

  constructor(public afAuth: AngularFireAuth,
              public afStore: AngularFirestore,
              public alert: AlertController,
              public router: Router,
              public user: UserService
              ) { }

  ngOnInit() {
  }

  async register() {
    const { username, password, cpassword } = this;
    if(password != cpassword) {
      this.showAlert("Error!", "Password don't match!"); 
      return console.log("Password don't match!");
    }

    try {
      // this.afAuth.auth.createUserWithEmailAndPassword(username, password).then(cred => {
      //   const userId = cred.user.uid;
      //   const email = cred.user.email;
      //   const displayName = cred.user.displayName;

        // const user = {
        //   userid: userId,
        //   useremail: email,
        //   userfullname: fullname,
        //   usermremarks: mremarks
        // }

      //   this.afStore.collection('users').doc(userId).set(user);
      //   this.showAlert("Success!", "Welcome onboard!");
      //   this.router.navigate(['/tabs']);
      // });

      const res = await this.afAuth.auth.createUserWithEmailAndPassword(username, password)

      this.afStore.doc(`users/${res.user.uid}`).set({
        username,
        uid: res.user.uid
      })

      this.showAlert("Success!", "Welcome onboard!");
      this.router.navigate(['/tabs']);

    } catch(err) {
      this.showAlert("Error!", err.message);
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

}
