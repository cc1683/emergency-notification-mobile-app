import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../user.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx'
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
  msg: any
  requestMsg: string

  userListRef: AngularFirestoreDocument<any>
  userList: Observable<any>
  userListContainer: Array<any> = []

  token: Array<string> = []
  tokenCollection: Array<string> = []


  constructor(public afStore: AngularFirestore, 
              public afAuth: AngularFireAuth,
              public user: UserService, 
              public geolocation: Geolocation,
              public nativegeocoder: NativeGeocoder,
              private firebase: Firebase,
              public toastCtrl: ToastController,
              private platform: Platform
              ) { }

  ngOnInit() {
    
    var options = {
      maximumAge: 3000,
      timeout: 2700,
      enableHighAccuracy: true
    }
    this.geolocation.getCurrentPosition().then((postion) => {
      this.lat = postion.coords.latitude
      this.lng = postion.coords.longitude
      this.saveCoor(this.lat, this.lng)
      this.getToken()
    }).catch((error) => {
      console.log('Error getting location', error)
    })
  }

  saveCoor(lat: number, lng: number) {
    this.afStore.doc(`users/${this.user.getUid()}`).update({
      latitude: lat,
      longitude: lng
    })
    this.updateLocation(lat, lng)
  }
  
  // {"countryCode":"MY","countryName":"Malaysia","postalCode":"94300","administrativeArea":"Sarawak","subAdministrativeArea":"","locality":"Kota Samarahan","subLocality":"","thoroughfare":"Lorong Uni Garden 2C","subThoroughfare":"5073"}

  updateLocation(lat: number, lng: number) {

    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 1
    }

    this.nativegeocoder.reverseGeocode(lat, lng, options)
      .then((result: NativeGeocoderReverseResult[]) => 
        this.msg = (result[0]['subThoroughfare']+', '+result[0]['thoroughfare'])+', '+result[0]['postalCode']+', '+result[0]['locality']+', '+result[0]['administrativeArea']
      )
  }

  // generateAddress(addressObj) {
  //   let obj = []
  //   let address = ""
  //   for(let key in addressObj) {
  //     obj.push(addressObj[key])
  //   }
  //   obj.reverse()

  //   for(let val in obj) {
  //     if(obj[val].length)
  //     address += obj[val]+', '
  //   }

  //   return address.slice(0, -2)
  // }

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
              message: 'Help! I locate at '+this.msg,
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
