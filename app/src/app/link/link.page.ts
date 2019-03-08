import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../user.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-link',
  templateUrl: './link.page.html',
  styleUrls: ['./link.page.scss'],
})
export class LinkPage implements OnInit {

  emailsCollection: AngularFirestoreCollection<any>
  details: Array<any> = []
  linkUserEmail: string

  userData: Observable<any>


  constructor(public afAuth: AngularFireAuth, 
              public afStore: AngularFirestore, 
              public user: UserService,
              public alert: AlertController
              ) { 
    const data = afStore.doc(`users/${user.getUid()}`)
    this.userData = data.valueChanges()

    this.emailsCollection = this.afStore.collection('users')
    this.emailsCollection.snapshotChanges().forEach(a => {
      a.forEach(item => {
        const useremail = item.payload.doc.data().username
        const useruid = item.payload.doc.data().uid
        const usertoken = item.payload.doc.data().token
        const userlatitude = item.payload.doc.data().latitude
        const userlongitude = item.payload.doc.data().longitude
        const userdata = {
          useremail: useremail,
          useruid: useruid,
          usertoken: usertoken,
          userlatitude: userlatitude,
          userlongitude: userlongitude
        }
        this.details.push(userdata)
      })
    })
  }

  ngOnInit() {
  }

  linkUser(newInputEmail: string) {
    for(let detail of this.details) {
      if(newInputEmail === detail.useremail) {
        let newInputId = detail.useruid
        let newToken = detail.usertoken
        let newLatitude = detail.userlatitude
        let newLongitude = detail.userlongitude
        this.afStore.doc(`users/${this.user.getUid()}`).update({
          usersList: firestore.FieldValue.arrayUnion({
            newInputId,
            newToken,
            newInputEmail,
            newLatitude,
            newLongitude
          })
        })

        this.showAlert('Success', `${detail.useremail} is now your linked members`)
      } 
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
