import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../user.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Firebase } from '@ionic-native/firebase/ngx'
import { ToastController, Platform } from '@ionic/angular';
import { firestore } from 'firebase';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  lat: number
  lng: number

  requestUserUid: string

  userListRef: AngularFirestoreDocument<any>
  userList: Observable<any>
  userListContainer: Array<any> = []

  token: Array<string> = []
  tokenCollection: Array<string> = []


  constructor(public afStore: AngularFirestore, 
              public afAuth: AngularFireAuth,
              public user: UserService, 
              public geolocation: Geolocation,
              private firebase: Firebase,
              public toastCtrl: ToastController,
              private platform: Platform
              ) { }

  ngOnInit() {
    this.getToken()
    this.geolocation.getCurrentPosition().then((postion) => {
      this.lat = postion.coords.latitude
      this.lng = postion.coords.longitude
    })

    this.updateLocation()
  }

  updateLocation() {
    this.afStore.doc(`users/${this.user.getUid()}`).update({
      latitude: this.lat,
      longitude: this.lng
    })
  }

  inDanger() {
    this.afAuth.authState.subscribe(res => {
      if(res && res.uid) {
        this.requestUserUid = res.uid 

        this.userListRef = this.afStore.doc(`users/${this.user.getUid()}`)
        this.userListRef.snapshotChanges().forEach(item => {
          this.token = item.payload.data().usersList
          if(this.token.length > 0) {
            for(var i = 0; i<this.token.length; i++) {
              let tokenId = item.payload.data().usersList[i].newToken
              this.tokenCollection.push(tokenId)
            }
            this.afStore.collection('users/' + this.user.getUid() + '/notifications').add({
              message: 'Help! I located at '+this.lat+' & '+this.lng,
              sender: this.user.getUsername(),
              receiver: this.tokenCollection
            })

            this.tokenCollection = []
          }
        })
      } else {
        throw new Error("User not logged in")
      }
    })
  }

  getToken() {
    this.platform.is("android") ? this.initializeFirebaseAndroid() : this.initializeFirebaseIOS()
  }

  initializeFirebaseAndroid() {
    this.firebase.getToken().then(token => {
      this.afStore.doc(`users/${this.user.getUid()}`).update({
        token: token
      })
    });
    this.firebase.onTokenRefresh().subscribe(token => {})
    this.subscribeToPushNotifications();
  }

  initializeFirebaseIOS() {
    this.firebase.grantPermission()
    .then(() => {
      this.firebase.getToken().then(token => {});
      this.firebase.onTokenRefresh().subscribe(token => {})
      this.subscribeToPushNotifications();
    })
    .catch((error) => {
      this.firebase.logError(error);
    });
  }

  subscribeToPushNotifications() {
    this.firebase.onNotificationOpen().subscribe((response) => {
      if(response.tap){
        //Received while app in background (this should be the callback when a system notification is tapped)
        //This is empty for our app since we just needed the notification to open the app
      }else{
        //received while app in foreground (show a toast)
        this.showToast(response.body)
      }
    });
  }

  async showToast(msg: string) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    await toast.present();
  }
}
