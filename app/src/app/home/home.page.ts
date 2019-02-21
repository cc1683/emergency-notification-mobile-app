import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { Geolocation } from '@ionic-native/geolocation/ngx'

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  lat: number
  lng: number

  constructor(public afStore: AngularFirestore, public user: UserService, public geolocation: Geolocation) { }

  ngOnInit() {
    // this.getUserLocation()
    this.geolocation.getCurrentPosition().then((postion) => {
      this.lat = postion.coords.latitude
      this.lng = postion.coords.longitude
    })
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
}
