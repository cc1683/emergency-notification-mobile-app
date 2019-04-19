import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../app/user.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class AuthService {

  constructor(
    private router: Router,
    private user: UserService,
    private afAuth: AngularFireAuth
  ) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    var isLoggedIn = this.afAuth.auth.currentUser
    if (isLoggedIn) {
      this.router.navigate(['/tabs']);
      return true
    } else {
      this.router.navigate(['/register']);
      return false;
    }
  }
}
