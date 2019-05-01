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
import { AlertController } from '@ionic/angular';
import * as firebase from 'firebase';
import { BehaviorSubject } from 'rxjs';

declare var google: any;

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

  currentMessage = new BehaviorSubject(null)


  constructor(public afStore: AngularFirestore, 
              public afAuth: AngularFireAuth,
              public user: UserService, 
              public geolocation: Geolocation,
              public nativegeocoder: NativeGeocoder,
              private firebaseNative: Firebase,
              public toastCtrl: ToastController,
              private platform: Platform,
              public alert: AlertController
              ) { }

  ngOnInit() {
    
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
    if(this.platform.is("android")) {
      this.nativegeocoder.reverseGeocode(lat, lng, options)
      .then((result: NativeGeocoderReverseResult[]) => 
        this.msg = (result[0]['subThoroughfare']+' '+result[0]['thoroughfare'])+' '+result[0]['postalCode']+' '+result[0]['locality']+' '+result[0]['administrativeArea']
      )
    } else if(this.platform.is("desktop")) {
      var geocoder = new google.maps.Geocoder;
      var latlng = {lat: lat, lng: lng};
      return new Promise(function(resolve, reject) {
        geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === 'OK') {
            if (results[0]) {
              console.log(results[0].formatted_address);
              this.msg = results[0].formatted_address
              resolve(this.msg);
            } else {
              reject(window.alert('No results found'));
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
      }).then(result => {
        this.msg = result
      })
    }
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
          if(typeof this.token == "undefined") {
            this.showAlert('Error', 'Cannot find any link members!')
            return false;
          } else if ((typeof this.token != "undefined" && this.token.length > 0)) {
            for(var i = 0; i<this.token.length; i++) {
              let tokenId = item.payload.data().usersList[i].newToken
              this.tokenCollection.push(tokenId)
            }
          }
        })
        this.storeDB(this.tokenCollection)
      } else {
        throw new Error("User not logged in")
      }
    })
  }

  storeDB(lists: Array<string>) {
    if(typeof lists == "undefined") {  
      this.showAlert('Error', 'Cannot find any linked members!')
      return false;
    } else if ((typeof lists != "undefined" && lists.length > 0)) {
      this.afStore.collection('users/' + this.user.getUid() + '/notifications').add({
        message: 'Help! I locate at '+this.msg,
        sender: this.user.getUsername(),
        receiver: lists
      })
      this.showAlert('Success', 'Message sent successfully!')
      console.log(typeof this.msg)
      this.tokenCollection.length = 0;
      return;
    }
  }

  relocateMe() {
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.lat = data.coords.latitude
      this.lng = data.coords.longitude
    })
    this.saveCoor(this.lat, this.lng)
    this.showToast('Location updated!')
    return;
  }

  getToken() {
    if(this.platform.is("desktop")) {
      const messaging = firebase.messaging();
      messaging.requestPermission().then(() => {
        return messaging.getToken();
      }).then(token => {
        console.log(token);
        this.afStore.doc(`users/${this.user.getUid()}`).update({
          token: token
        })
      })
      messaging.onMessage(payload => {
        console.log('onMessage', payload);
        this.currentMessage.next(payload);
        this.showAlert(payload.notification['title'], payload.notification['body']);
      })

      // messaging.setBackgroundMessageHandler(payload => {
      //   console.log('[firebase-messaging-sw.js] Received background message ', payload);
      //   var notificationTitle = payload.notification['title']
      //   var notificationOptions = {
      //     body: payload.notification['body'],
      //     icon: 'http://icons.iconarchive.com/icons/iconshock/real-vista-medical/256/emergency-icon.png'
      //   }
      // })
    } else {
      this.platform.is("android") ? this.initializeFirebaseAndroid() : this.initializeFirebaseIOS()
    }
  }

  initializeFirebaseAndroid() {
    this.firebaseNative.getToken().then(token => {
      this.afStore.doc(`users/${this.user.getUid()}`).update({
        token: token
      })
    });
    this.firebaseNative.onTokenRefresh().subscribe(token => {})
    this.subscribeToPushNotifications();
  }

  initializeFirebaseIOS() {
    this.firebaseNative.grantPermission()
    .then(() => {
      this.firebaseNative.getToken().then(token => {});
      this.firebaseNative.onTokenRefresh().subscribe(token => {})
      this.subscribeToPushNotifications();
    })
    .catch((error) => {
      this.firebaseNative.logError(error);
    });
  }

  subscribeToPushNotifications() {
    this.firebaseNative.onNotificationOpen().subscribe((response) => {
      if(response.tap){
        //Received while app in background (this should be the callback when a system notification is tapped)
        //This is empty for our app since we just needed the notification to open the app
      }else{
        //received while app in foreground (show a toast)
        this.showAlert(response.title, response.body)
      }
    });
  }

  async showToast(toastmsg: string) {
    let toast = await this.toastCtrl.create({
      message: toastmsg,
      duration: 3000
    });
    await toast.present();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ["OK"]
    })  

    await alert.present();
    return;
  }
}