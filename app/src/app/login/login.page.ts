import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string;
  password: string;

  constructor(public afAuth: AngularFireAuth) { }

  ngOnInit() {
  }

  //! Login function
  async login() {
    const { username, password } = this;
    try {
      this.afAuth.auth.signInWithEmailAndPassword(username, password).then(cred => {
        console.log('login successfully')
      })
    } catch(err) {
      console.dir(err);
    }
  }

}
