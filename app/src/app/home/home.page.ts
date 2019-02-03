import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  lat: number
  lng: number

  constructor(public afStore: AngularFirestore, public user: UserService) { }

  ngOnInit() {
    this.getUserLocation()
  }

  getUserLocation() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude
        this.lng = position.coords.longitude
      })
    }
  }

  updateLocation() {
    this.afStore.doc(`users/${this.user.getUid()}`).update({
      latitude: this.lat,
      longitude: this.lng
    })
  }
}
