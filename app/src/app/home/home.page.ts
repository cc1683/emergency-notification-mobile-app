import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  lat: number
  lng: number

  constructor() { }

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
}
