import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string;
  password: string;

  constructor(public afAuth: AngularFireAuth, 
              public user: UserService, 
              public router: Router,
              public alert: AlertController
              ) { }

  ngOnInit() {
  }

  //* Login function
  async login() {
    const { username, password } = this;
    try {
      const res = await this.afAuth.auth.signInWithEmailAndPassword(username, password)

      if(res.user) {
        this.user.setUser({
          username,
          uid: res.user.uid
        })
        this.clearField()
        await this.showAlert("Welcome", "Login successfully!");
        this.router.navigate(['/tabs']);
      }
    } catch(err) {
      this.showAlert("Error", err.message)
      return console.log(err.message)
    }
  }

  clearField() {
    this.username = ''
    this.password = ''
    return console.log('')
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ["OK"]
    })  

    await alert.present();
  }

  goReset() {
    this.router.navigate(['/reset']);
  }
}