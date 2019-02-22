import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Firebase } from '@ionic-native/firebase/ngx'
import { ToastController, Platform } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  lat: number
  lng: number

  constructor(public afStore: AngularFirestore, 
              public user: UserService, 
              public geolocation: Geolocation,
              private firebase: Firebase,
              public toastCtrl: ToastController,
              private platform: Platform
              ) { }

  ngOnInit() {
    // this.getUserLocation()
    this.geolocation.getCurrentPosition().then((postion) => {
      this.lat = postion.coords.latitude
      this.lng = postion.coords.longitude
    })

    this.getToken()
  }

  // getUserLocation() {
  //   let option = {
  //     enableHighAccuracy: true,
  //     timeout: 5000,
  //     maximumAge: 0
  //   }

  //   if(navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(position => {
  //       this.lat = position.coords.latitude
  //       this.lng = position.coords.longitude
  //     })
  //   }
  // }

  updateLocation() {
    this.afStore.doc(`users/${this.user.getUid()}`).update({
      latitude: this.lat,
      longitude: this.lng
    })
  }

  getToken() {
    this.platform.is("android") ? this.initializeFirebaseAndroid() : this.initializeFirebaseIOS()
  }

  initializeFirebaseAndroid() {
    this.firebase.getToken().then(token => {
      this.afStore.doc(`users/${this.user.getUid()}`).update({
        deviceToken: token
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
