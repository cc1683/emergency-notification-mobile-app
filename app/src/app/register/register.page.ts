import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  username: string;
  password: string;
  cpassword: string;

  constructor(public afAuth: AngularFireAuth) { }

  ngOnInit() {
  }

  register() {
    const { username, password, cpassword } = this;
    try {
      this.afAuth.auth.createUserWithEmailAndPassword(username, password).then(cred => {
        console.log(cred);
      });
      console.log('success');

    } catch(err) {
      console.dir(err);
    }
  }

}
