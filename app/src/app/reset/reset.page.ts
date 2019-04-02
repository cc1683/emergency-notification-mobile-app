import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements OnInit {

  constructor(public router: Router,
              public alert: AlertController
              ) { }

  ngOnInit() {
  }

  async resetPassword(email: string) {
    var auth = firebase.auth()
    return auth.sendPasswordResetEmail(email)
      .then(() => this.showAlert("Success", "Check your mailbox"))
      .catch((error) => this.showAlert("Error", error))
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